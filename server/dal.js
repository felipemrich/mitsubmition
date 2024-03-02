import { MongoClient } from "mongodb";

const url = process.env.MONGODB_URI || "mongodb://localhost:27017";
let db = null;

// Function to establish a database connection
const connectDB = async () => {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    console.log("Connected successfully to db server");
    db = client.db("myproject2");
  } catch (err) {
    console.error("Error connecting to the database:", err);
    throw err; // Rethrow the error to handle it in the calling code
  }
};

// Connect to the database before exporting functions
connectDB();

// create user account
function create(name, email, password) {
  return new Promise((resolve, reject) => {
    const collection = db.collection("users");
    const doc = { name, email, password, balance: 0 };
    collection
      .insertOne(doc, { w: 1 })
      .then((result) => resolve(doc))
      .catch((err) => reject(err));
  });
}

// find user account
function find(email) {
  return db.collection("users").find({ email: email }).toArray();
}

// find one user account
function findOne(email) {
  return db.collection("users").findOne({ email: email });
}

// update - deposit/withdraw amount
function update(email, amount) {
  const numericAmount = parseFloat(amount); // Ensure amount is a number
  return db
    .collection("users")
    .findOneAndUpdate(
      { email: email },
      { $inc: { balance: numericAmount } },
      { returnDocument: "after" }
    );
}

// get all users
function all() {
  return db.collection("users").find({}).toArray();
}

// Get user balance
function getBalance(email) {
  return db
    .collection("users")
    .findOne({ email: email })
    .then((user) => {
      if (user) {
        return { success: true, balance: user.balance };
      } else {
        return { success: false, message: "User not found" };
      }
    })
    .catch((err) => {
      console.error("Error getting balance:", err);
      throw err;
    });
}

function transfer(senderEmail, recipientEmail, amount) {
  const numericAmount = parseFloat(amount);

  // Update sender's balance (subtract)
  return db
    .collection("users")
    .updateOne({ email: senderEmail }, { $inc: { balance: -numericAmount } })
    .then(() => {
      // Update recipient's balance (add)
      return db
        .collection("users")
        .updateOne(
          { email: recipientEmail },
          { $inc: { balance: numericAmount } }
        );
    })
    .then(() => {
      return { success: true, message: "Transaction successful." };
    })
    .catch((error) => {
      console.error("Error during transfer:", error);
      return { success: false, message: "Transaction failed: Internal error." };
    });
}

export { create, findOne, find, update, all, getBalance, transfer };
