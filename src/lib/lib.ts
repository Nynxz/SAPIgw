import { compare, genSalt, hash } from "bcrypt";

const getRandomApiKey = () => {
  return crypto.randomUUID().toString();
};
const hashPassword = async (plaintextPassword: string) => {
  try {
    const saltrounds = 10;
    const salt = await genSalt(saltrounds);
    const hashedPassword = await hash(plaintextPassword, salt);
    return hashedPassword;
  } catch {
    console.log("Failed to hash password");
    return "";
  }
};
const comparePassword = async (
  plaintextPassword: string,
  hashedPassword: string
) => {
  return compare(plaintextPassword, hashedPassword);
};

export { getRandomApiKey, hashPassword, comparePassword };
