import { Router } from "express";
import { Clinic, User, Lab, UserSession } from "../../data/mongooseModels.js";
import jsonwebtoken from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const privateKey = fs
  .readFileSync(path.join(__dirname, "../../util/private_key.key"))
  .toString();

/**
 * @description login user
 * @param {Express<Request>} req the request object
 * @param {Express<Response>} res the response object
 */
router.post("/login", async (req, res) => {
  // #swagger.tags = ['Auth']
  try {
    const { username, password } = req.body;
    const jwt = jsonwebtoken;
    const options = {
      expiresIn: "4h",
    };
    
    const user = await User.findOne({ username });
    
    if (!user || user.password !== password) {
      return res
        .status(404)
        .json({ message: "Incorrect username or password" });
    }

    const userAuth = {
      userPermissions: user.permissions,
    };
    
    const labResults = await Lab.find({ users: user._id }, { _id: 1 });
    userAuth.labs = labResults;

    const clinicResults = await Clinic.find({ patients: user._id }, { _id: 1 });
    userAuth.clinics = clinicResults;

    const token = jwt.sign(userAuth, privateKey, options);

    const userSessionResults = await UserSession.find({ userId: user._id });

    if (!userSessionResults.length) {
      const userSession = new UserSession({
        userId: user._id,
        activeSession: 1,
        sessionToken: token,
        expirationTime: Date.now().toString(),
      });
      await userSession.save();
    }

    if (userSessionResults.length) {
      return res
        .status(401)
        .json({ message: "This user is already logged in" });
    }

    return res.status(200).json({ message: token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @description logout user
 * @param {Express<Request>} req the request object
 * @param {Express<Response>} res the response object
 */
router.post("/logout", async (req, res) => {
  // #swagger.tags = ['Auth']
  try {
    const { token } = req.body;


    await UserSession.deleteOne({ sessionToken: token });

    return res.status(200).json({ message: "logout successfully" });
    
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});


export default router;
