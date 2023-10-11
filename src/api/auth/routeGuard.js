import jsonwebtoken from "jsonwebtoken";

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const privateKey = fs
  .readFileSync(path.join(__dirname, "../../util/private_key.key"))
  .toString();

const Permissions = {
  User: "user",
  Admin: "admin",
};

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyUGVybWlzc2lvbnMiOlsidXNlciJdLCJsYWJzIjpbeyJfaWQiOiI2NTIzMjc2N2Q4ZWY4NzQxZWUwYWI2ZjkifV0sImNsaW5pY3MiOltdLCJpYXQiOjE2OTY5NzY4NjMsImV4cCI6MTY5Njk5MTI2M30.SG-FcgBG1-o6rPoaVCzBRjU6uJUcHkGj5yxP4rFrvGE";

async function UserGuard(req, res, next) {
  const jwt = jsonwebtoken;
  let user;

  try {
    user = jwt.verify(token, privateKey);
  } catch (err) {
    return res.status(401).json(err);
  }

  if (Date.now() >= user.exp * 1000) {
    return res.status(401).json({ error: "Unauthorized - No token Invalid" });
  }

  if (!token)
    return res.status(401).json({ error: "Unauthorized - No token provided" });

  const userPermission = user.userPermissions.find((permission) => permission === Permissions.User);

  if (!userPermission)
    return res.status(401).json({ error: "Unauthorized - Not allowed" });

  next();
}

async function AdminGuard(req, res, next) {
  const jwt = jsonwebtoken;
  let user;

  try {
    user = jwt.verify(token, privateKey);
  } catch (err) {
    return res.status(401).json(err);
  }
  console.log(user);

  if (!token)
    return res.status(401).json({ error: "Unauthorized - No token provided" });

  const userPermission = user.userPermissions.find(
    (permission) => permission === Permissions.Admin
  );

  if (!userPermission)
    return res.status(401).json({ error: "Unauthorized - Not allowed" });

  next();
}

export { UserGuard, AdminGuard };
