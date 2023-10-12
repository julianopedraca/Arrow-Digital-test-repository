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
const jwt = jsonwebtoken;

async function UserGuard(req, res, next) {
  let user;

  const token = req.headers.authorization.split(' ')[1];

  try {
    user = jwt.verify(token, privateKey);
    console.log();
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
  let user;

  const token = req.headers.authorization.split(' ')[1];

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

async function LabGuard (req, res, next) {

  const token = req.headers.authorization.split(' ')[1];

  const labId = req.params.id

  const userLabPermission = jwt.verify(token,privateKey)
  

  const userIsAuthorized = userLabPermission.labs.find((lab) => lab._id === labId)

  if(!userIsAuthorized)
    res.status(401).json({message: 'Access denied'})

  next()
}

export {
  UserGuard,
  AdminGuard,
  LabGuard
};
