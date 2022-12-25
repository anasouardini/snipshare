export const deepClone = (obj) => (obj ? JSON.parse(JSON.stringify(obj)) : undefined);
