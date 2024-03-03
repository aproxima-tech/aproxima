import { index, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { generateUUID } from '@aproxima/workers-utils/crypto';
import { oneDayFromNow } from '@aproxima/workers-utils/time';
import { maxLengths } from './constraints';

/**
 * Guidelines:
 * - Note that .unique() already creates an index. Prefer .unique() over uniqueIndex.
 * - Each index must have a unique name.
 */

/**
 * A user represents an actual person using Aproxima.
 *
 * Passwords and tokens are not stored in the user table
 * to avoid querying/exposing secrets if not explicitly intended.
 */
export const usersTable = sqliteTable('users', {
  id: text('id', { length: maxLengths.uuid })
    .primaryKey()
    .$defaultFn(() => generateUUID()),
  email: text('email', { length: maxLengths.email }).unique().notNull(),
  displayName: text('display_name', { length: maxLengths.displayName }).notNull(),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').$defaultFn(() => new Date().toISOString()),
});

/**
 * If a user signed up using the password flow,
 * the user password is stored here.
 */
export const userPasswordsTable = sqliteTable('user_passwords', {
  id: text('id', { length: maxLengths.uuid })
    .primaryKey()
    .$defaultFn(() => generateUUID()),
  userId: text('user_id')
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  passwordHash: text('password_hash', { length: maxLengths.password }).notNull(),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').$defaultFn(() => new Date().toISOString()),
});

/**
 * All user-bound tokens are stored here.
 */
export const userTokensTable = sqliteTable(
  'user_tokens',
  {
    token: text('id', { length: maxLengths.accessToken }).primaryKey(),
    userId: text('user_id')
      .references(() => usersTable.id, { onDelete: 'cascade' })
      .notNull(),
    type: text('type', { length: 4 }).notNull(),
    expiresAt: text('expires_at').$defaultFn(() => oneDayFromNow().toISOString()),
    createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
    updatedAt: text('updated_at').$defaultFn(() => new Date().toISOString()),
  },
  (table) => {
    return {
      userIdIdx: index('user_tokens_user_id_idx').on(table.userId),
    };
  },
);

/**
 * A user's home is a place where they can add devices and invite other users.
 * It also be interpreted as a household or a device group.
 */
export const homesTable = sqliteTable('homes', {
  id: text('id', { length: maxLengths.uuid })
    .primaryKey()
    .$defaultFn(() => generateUUID()),
  displayName: text('display_name', { length: maxLengths.displayName }).notNull(),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').$defaultFn(() => new Date().toISOString()),
});

/**
 * A home owner is a user that has access to a home.
 * Home is deleted if all owners are removed.
 */
export const homeOwnersTable = sqliteTable(
  'home_owners',
  {
    homeId: text('home_id')
      .references(() => homesTable.id, { onDelete: 'cascade' })
      .notNull(),
    userId: text('user_id')
      .references(() => usersTable.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.homeId, table.userId] }),
    };
  },
);

/**
 * A user's device is a physical device purchased by a user.
 * - Device created on QR code generation.
 * - Device activated on QR code scan, once assigned to a home.
 */
export const userDevicesTable = sqliteTable(
  'user_devices',
  {
    id: text('id', { length: maxLengths.uuid })
      .primaryKey()
      .$defaultFn(() => generateUUID()),
    homeId: text('home_id').references(() => homesTable.id, { onDelete: 'set null' }),
    modelId: text('model_id')
      .references(() => deviceModelsTable.id, { onDelete: 'restrict' })
      .notNull(),
    displayName: text('display_name', { length: maxLengths.displayName }).notNull(),
    createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
    updatedAt: text('updated_at').$defaultFn(() => new Date().toISOString()),
  },
  (table) => {
    return {
      homeIdIdx: index('user_devices_home_id_idx').on(table.homeId),
    };
  },
);

/**
 * A device model references one product model that can be purchased by a user.
 * Primary key is the product model's internal unique identifier.
 */
export const deviceModelsTable = sqliteTable('device_models', {
  id: text('id', { length: maxLengths.deviceModelId }).primaryKey(),
  displayName: text('display_name').notNull(),
  description: text('description'),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').$defaultFn(() => new Date().toISOString()),
});

export const userOrdersTable = sqliteTable(
  'user_orders',
  {
    id: text('id', { length: maxLengths.uuid })
      .primaryKey()
      .$defaultFn(() => generateUUID()),
    userId: text('user_id')
      .references(() => usersTable.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
    updatedAt: text('updated_at').$defaultFn(() => new Date().toISOString()),
  },
  (table) => {
    return {
      userIdIdx: index('user_orders_user_id_idx').on(table.userId),
    };
  },
);

export const orderItemsTable = sqliteTable(
  'order_items',
  {
    id: text('id', { length: maxLengths.uuid })
      .primaryKey()
      .$defaultFn(() => generateUUID()),
    orderId: text('order_id')
      .references(() => userOrdersTable.id, { onDelete: 'cascade' })
      .notNull(),
    modelId: text('model_id')
      .references(() => deviceModelsTable.id, { onDelete: 'restrict' })
      .notNull(),
    createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
  },
  (table) => {
    return {
      orderIdIdx: index('order_items_order_id_idx').on(table.orderId),
      modelIdIdx: index('order_items_model_id_idx').on(table.modelId),
    };
  },
);
