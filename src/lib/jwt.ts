import * as jwt from "jsonwebtoken";
import * as schema from "../schema/schema";

//TODO: create verify etc functions?
function generateJWT(user: schema.User) {
  const payload = { id: user.id, username: user.username };
  console.log(`[server]: JWT: Generating for ${user.username}`);
  const secretKey = "thisisasecret";
  const options: jwt.SignOptions = { expiresIn: "1h" };

  return jwt.sign(payload, secretKey, options);
}

export { generateJWT };
