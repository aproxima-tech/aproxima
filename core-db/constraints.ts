export const maxLengths = {
  displayName: 320,
  email: 320,
  password: 100,
  uuid: 36,
  accessToken: 36 + 5,
  deviceModelId: 60,
  text: 1000,
} as const;

export const minLengths = {
  password: 8,
} as const;
