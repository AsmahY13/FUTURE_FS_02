const mongoose = require("mongoose");
require("dotenv").config();

console.log("Testing MongoDB connection...");

// Get the connection string from .env
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.log("❌ ERROR: MONGODB_URI is not set in .env file");
  process.exit(1);
}

console.log("✅ MONGODB_URI exists, length:", uri.length);

// Show first part (safe)
const safeUri = uri.replace(/\/\/[^@]+@/, '//***:***@');
console.log("Connection string:", safeUri.substring(0, 100) + "...");

// Try to connect
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log("✅ SUCCESS: Connected to MongoDB!");
  console.log("Database:", mongoose.connection.db.databaseName);
  console.log("Host:", mongoose.connection.host);
  process.exit(0);
})
.catch(err => {
  console.log("❌ FAILED to connect:");
  console.log("Error message:", err.message);
  console.log("Error code:", err.code);
  console.log("Error name:", err.name);
  process.exit(1);
});
