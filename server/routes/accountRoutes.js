// accountRoutes.js
import express from "express";
import { find, create, findOne, update, all, transfer } from "../dal.js";

const router = express.Router();
router.use(express.json());

router.get("/create/:name/:email/:password", async (req, res) => {
  try {
    const users = await find(req.params.email);

    if (users.length > 0) {
      console.log("User already exists");
      res.send({ success: false, message: "User already exists" });
    } else {
      const user = await create(
        req.params.name,
        req.params.email,
        req.params.password
      );
      console.log(user);
      res.send({ success: true, user });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

router.get("/login/:email/:password", async (req, res) => {
  try {
    const user = await findOne(req.params.email);

    if (user) {
      if (user.password === req.params.password) {
        res.send({ success: true, user });
      } else {
        res.send({ success: false, message: "Login failed: wrong password" });
      }
    } else {
      res.send({ success: false, message: "Login failed: user not found" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

// Add 'success' property to other routes
router.get("/find/:email", async (req, res) => {
  try {
    const user = await find(req.params.email);
    console.log(user);
    res.send({ success: true, user });
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

router.get("/findOne/:email", async (req, res) => {
  try {
    const user = await findOne(req.params.email);
    console.log(user);
    res.send({ success: true, user });
  } catch (error) {
    console.error("Error finding one user:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

router.get("/update/:email/:amount", async (req, res) => {
  try {
    const amount = Number(req.params.amount);
    const response = await update(req.params.email, amount);
    console.log(response);
    res.send({ success: true, response });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

router.get("/balance/:email", async (req, res) => {
  try {
    const user = await findOne(req.params.email);
    if (user) {
      res.send({ success: true, balance: user.balance });
    } else {
      res.send({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error getting balance:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const docs = await all();
    console.log(docs);
    res.send({ success: true, data: docs });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

router.get(
  "/transfer/:senderEmail/:recipientEmail/:amount",
  async (req, res) => {
    const { senderEmail, recipientEmail, amount } = req.params;

    // Call the transfer function from dal.js
    transfer(senderEmail, recipientEmail, amount)
      .then((result) => {
        // If the transfer was successful
        if (result.success) {
          res.send({ success: true, message: "Transfer successful." });
        } else {
          // If the transfer failed, send the error message
          res.send({ success: false, message: result.message });
        }
      })
      .catch((error) => {
        console.error("Error during transaction:", error);
        res
          .status(500)
          .send({ success: false, message: "Internal Server Error" });
      });
  }
);

export default router;
