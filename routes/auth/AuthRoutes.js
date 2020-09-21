const express = require("express");
const router = express.Router();

//IMPORT AUTHENTICATION HELPERS
const {
  logIn,
  register,
  checkAuth,
  helpers,
} = require("../../auth/authHelpers");

router.post("/login", async (req, res) => {
  const userCredentials = req.body;

  try {
    const loginStatus = await logIn(userCredentials);
    if (loginStatus.error) throw loginStatus;

    return res

      .cookie("token", loginStatus.token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json(loginStatus);
  } catch (error) {
    res.status(error.status).json(error);
  }
});

router.post("/register", async (req, res) => {
  const userCredentials = req.body;

  try {
    const registerStatus = await register(userCredentials);
    if (registerStatus.error) throw registerStatus;

    res.status(201).json(registerStatus);
  } catch (error) {
    res.status(error.status).json(error);
  }
});

router.get("/logout", (req, res) => {
  console.log("logout hit");
  res
    .clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .json({ logout: true });
});

router.post("/save", async (req, res) => {
  if (!req.cookies["token"]) {
    return res.status(401).json({ error: true, message: "No token" });
  }
  try {
    const auth = checkAuth(req.cookies["token"]);
    if (auth.error) throw auth;
    const points = req.body.points;
    const savedUser = await helpers.saveUser(auth.user, points);
  } catch {
    res.status(401).json(error);
  }
});

router.get("/auth", async (req, res) => {
  if (!req.cookies["token"]) {
    return res.status(401).json({ error: true, message: "No token" });
  }
  try {
    const auth = checkAuth(req.cookies["token"]);
    if (auth.error) throw auth;
    const user = await helpers.checkIfUserExists(auth.user);
    const userResponse = {
      name: user[0].name,
      created_at: user[0].created_at,
      rank: user[0].rank,
    };
    const authResponse = { auth, userResponse };

    res.json(authResponse);
  } catch (error) {
    res.status(401).json(error);
  }
});

module.exports = router;
