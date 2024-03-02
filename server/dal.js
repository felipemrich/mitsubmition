import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const url = process.env.MONGODB_URI;
let db = null;
let client = null;

// Function to establish a database connection
const connectDB = async () => {
  try {
    client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
    await client.connect();
    console.log("Connected successfully to db server");
    // Specify the name of your database
    db = client.db("myproject2");
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
};

// Immediately invoke the connectDB function to ensure the database connection is established
connectDB().catch(console.dir);

// Database operation functions
const create = async (name, email, password) => {
  try {
    const collection = db.collection("users");
    const doc = { name, email, password, balance: 0 };
    await collection.insertOne(doc);
    return { success: true, user: doc };
  } catch (err) {
    console.error("Error creating user:", err);
    return { success: false, message: "Failed to create user" };
  }
};

const find = async (email) => {
  return await db.collection("users").find({ email }).toArray();
};

const findOne = async (email) => {
  return await db.collection("users").findOne({ email });
};

const update = async (email, amount) => {
  const numericAmount = parseFloat(amount);
  return await db
    .collection("users")
    .findOneAndUpdate(
      { email },
      { $inc: { balance: numericAmount } },
      { returnDocument: "after" }
    );
};

const all = async () => {
  return await db.collection("users").find({}).toArray();
};

const getBalance = async (email) => {
  try {
    const user = await findOne(email);
    if (user) {
      return { success: true, balance: user.balance };
    } else {
      return { success: false, message: "User not found" };
    }
  } catch (err) {
    console.error("Error getting balance:", err);
    return { success: false, message: "Failed to get balance" };
  }
};

const transfer = async (senderEmail, recipientEmail, amount) => {
  const numericAmount = parseFloat(amount);
  const session = client.startSession();
  try {
    session.startTransaction();
    await db
      .collection("users")
      .updateOne(
        { email: senderEmail },
        { $inc: { balance: -numericAmount } },
        { session }
      );
    await db
      .collection("users")
      .updateOne(
        { email: recipientEmail },
        { $inc: { balance: numericAmount } },
        { session }
      );
    await session.commitTransaction();
    return { success: true, message: "Transaction successful." };
  } catch (error) {
    await session.abortTransaction();
    console.error("Error during transfer:", error);
    return { success: false, message: "Transaction failed: Internal error." };
  } finally {
    session.endSession();
  }
};

export { create, findOne, find, update, all, getBalance, transfer };
