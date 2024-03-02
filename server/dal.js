// Import necessary MongoDB modules
import { MongoClient, ServerApiVersion } from "mongodb";

// MongoDB connection string
const url =
  "mongodb+srv://felipeemrichdearaujo:zIfUitx8pCDXhCxI@cluster0.wdpeh8b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Global variables to store the MongoDB client and database
let db;
let client;

// Async function to connect to MongoDB
export async function connectDB() {
  try {
    client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
    await client.connect();
    console.log("Connected successfully to db server");
    // Assign the database object to 'db'
    db = client.db("myproject2");
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
}

// Check if the database connection is established
function checkDBConnection() {
  if (!db) {
    throw new Error("Database connection not established");
  }
}

// Database operations
async function create(name, email, password) {
  checkDBConnection();
  try {
    const collection = db.collection("users");
    const doc = { name, email, password, balance: 0 };
    await collection.insertOne(doc);
    return { success: true, user: doc };
  } catch (err) {
    console.error("Error creating user:", err);
    return { success: false, message: "Failed to create user" };
  }
}

async function find(email) {
  checkDBConnection();
  return await db.collection("users").find({ email }).toArray();
}

async function findOne(email) {
  checkDBConnection();
  return await db.collection("users").findOne({ email });
}

async function update(email, amount) {
  checkDBConnection();
  const numericAmount = parseFloat(amount);
  return await db
    .collection("users")
    .findOneAndUpdate(
      { email },
      { $inc: { balance: numericAmount } },
      { returnDocument: "after" }
    );
}

async function all() {
  checkDBConnection();
  return await db.collection("users").find({}).toArray();
}

async function getBalance(email) {
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
}

async function transfer(senderEmail, recipientEmail, amount) {
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
}

// Export the database operation functions
export { create, findOne, find, update, all, getBalance, transfer };
