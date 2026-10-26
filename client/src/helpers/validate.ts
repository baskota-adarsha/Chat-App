export const isValidNickName = (name: string): boolean => {
  const result = /^[a-zA-Z0-9_]{2,15}$/.test(name);
  return result;
};
