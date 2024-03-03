import { redirect } from '@remix-run/cloudflare';
import { eq } from 'drizzle-orm';
import { comparePasswords, generateUUID, hashPassword } from '@aproxima/workers-utils/crypto';
import type { CoreDb } from '@aproxima/core-db';
import { userPasswordsTable, userTokensTable, usersTable } from '@aproxima/core-db';
import { oneDayFromNow } from '@aproxima/workers-utils/time';
import type { UserSession, UserSessionStorage } from './session-cookie.server';

/**
 * Value has to always be two to four characters long.
 */
export const userTokenTypes = {
  userSession: 'urse',
  passwordReset: 'pwre',
} as const;

export type UserTokenType = keyof typeof userTokenTypes;
export function generateUserToken(type: UserTokenType) {
  return `${userTokenTypes[type]}_${generateUUID()}`;
}

type UserRegistrationData = {
  email: string;
  displayName: string;
  password: string;
};

/**
 * Sign up a new user with an email and password.
 * @param email The user's email, must be lowercase, unique, and trimmed.
 * @param displayName The user's display name, must be unique and trimmed.
 * @param password The user's password.
 */
export async function signupWithPassword(
  { email, displayName, password }: UserRegistrationData,
  db: CoreDb,
): Promise<UserSession> {
  const passwordHash = await hashPassword(password);
  const existingUser = await queryUserSessionByEmail(email, db);
  if (existingUser) {
    throw new Error(`A user with the email ${email} already exists.`);
  }

  try {
    const userId = generateUUID();
    const sessionToken = generateUserToken('userSession');
    await db.insert(usersTable).values({
      id: userId,
      email: email,
      displayName: displayName,
    });
    await db.insert(userPasswordsTable).values({
      userId: userId,
      passwordHash,
    });
    await db.insert(userTokensTable).values({
      userId: userId,
      token: sessionToken,
      type: userTokenTypes.userSession,
      expiresAt: oneDayFromNow().toISOString(),
    });
    return { userId, sessionToken, email, displayName };
  } catch (error) {
    console.error(error);
    throw new Error('Unable to create user.');
  }
}

type UserLoginData = {
  email: string;
  password: string;
};

export async function loginUser({ email, password }: UserLoginData, db: CoreDb): Promise<UserSession> {
  const user = await db.query.usersTable.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });
  if (!user) {
    throw new Error(`No user found for email: ${email}.`);
  }

  const userPassword = await db
    .select({ userId: userPasswordsTable.userId, passwordHash: userPasswordsTable.passwordHash })
    .from(userPasswordsTable)
    .where((t) => eq(t.userId, user.id))
    .get();
  if (!userPassword || !comparePasswords(password, userPassword.passwordHash)) {
    throw new Error('Invalid email or password');
  }

  const sessionToken = generateUserToken('userSession');
  await db.insert(userTokensTable).values({
    userId: user.id,
    token: sessionToken,
    type: userTokenTypes.userSession,
    expiresAt: oneDayFromNow().toISOString(),
  });

  return { userId: user.id, sessionToken, email: user.email, displayName: user.displayName };
}

export async function createUserSession(
  sessionData: UserSession,
  userSessionStorage: UserSessionStorage,
  headers = new Headers(),
) {
  const session = await userSessionStorage.getSession();
  session.set('userId', sessionData.userId);
  session.set('email', sessionData.email);
  session.set('displayName', sessionData.displayName);
  session.set('sessionToken', sessionData.sessionToken);
  headers.set('Set-Cookie', await userSessionStorage.commitSession(session));
  return headers;
}

function getUserSession(request: Request, userSessionStorage: UserSessionStorage) {
  return userSessionStorage.getSession(request.headers.get('Cookie'));
}

export async function getUserId(request: Request, userSessionStorage: UserSessionStorage) {
  const session = await getUserSession(request, userSessionStorage);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') return null;
  return userId;
}

export async function requireUserId(request: Request, userSessionStorage: UserSessionStorage) {
  const session = await getUserSession(request, userSessionStorage);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') {
    throw redirect('/login');
  }
  return userId;
}

export async function getUser(request: Request, db: CoreDb, userSessionStorage: UserSessionStorage) {
  const userId = await getUserId(request, userSessionStorage);
  if (typeof userId !== 'string') {
    return null;
  }
  try {
    return queryUserSessionById(userId, db);
  } catch {
    throw logout(request, userSessionStorage);
  }
}

export async function requireUser(request: Request, db: CoreDb, userSessionStorage: UserSessionStorage) {
  const user = await getUser(request, db, userSessionStorage);
  if (!user) {
    throw redirect('/login');
  }
  return user;
}

export async function logout(request: Request, userSessionStorage: UserSessionStorage) {
  const session = await getUserSession(request, userSessionStorage);
  return redirect('/login', {
    headers: {
      'Set-Cookie': await userSessionStorage.destroySession(session),
    },
  });
}

async function queryUserSessionByEmail(email: string, db: CoreDb) {
  const usrs = await db
    .select({ userId: usersTable.id, email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.email, email.trim().toLowerCase()));
  return !usrs.length ? usrs[0] : null;
}

async function queryUserSessionById(userId: string, db: CoreDb) {
  const usrs = await db
    .select({ userId: usersTable.id, email: usersTable.email, displayName: usersTable.displayName })
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  return !usrs.length ? usrs[0] : null;
}
