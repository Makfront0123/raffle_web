
import jwt from "jsonwebtoken";
function generateJWT(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
}

export default generateJWT;