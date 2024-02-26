export async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function comparePasswords(inputPassword: string, hash: string) {
  const newHash = await hashPassword(inputPassword);
  return newHash === hash;
}

export function generateUUID() {
  return crypto.randomUUID();
}
