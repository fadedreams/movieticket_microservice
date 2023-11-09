import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 1, max: 20 })
      .withMessage("Password must be between 1 and 20 characters"),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new Error('invalid Email or Password');
    }
    const { email, password } = req.body;

    console.log("Creating a user...");

    res.send({});

    // new User({ email, password })
  }
);

export { router as signupRouter };
