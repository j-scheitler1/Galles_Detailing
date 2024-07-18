require('dotenv').config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 8081;
const uri = process.env.MONGODB_URI;
const dbName = "customerTickets";
const client = new MongoClient(uri);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

connectToMongoDB();

// Add Ticket
app.post("/addTicket", async (req, res) => {
  try {
    const db = client.db(dbName);
    const newDocument = req.body;

    // Example validation (adjust as per your schema requirements)
    if (!newDocument.name || !newDocument.phone || !newDocument.email) {
      throw new Error("Name, phone, and email are required");
    }

    const result = await db.collection("tickets").insertOne(newDocument);
    
    if (result.insertedCount === 1) {
      res.status(200).json(result.ops[0]); // Respond with the inserted document
    } else {
      throw new Error("Failed to insert ticket");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send({ error: "An internal server error occurred" });
  }
});

// Read All Tickets
app.get("/tickets", async (req, res) => {
  try {
    const db = client.db(dbName);
    const tickets = await db.collection("tickets").find().toArray();
    res.status(200).json(tickets);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send({ error: "An internal server error occurred" });
  }
});

// Update Ticket
app.put("/tickets/:id", async (req, res) => {
  try {
    const db = client.db(dbName);
    const { id } = req.params;
    const updatedData = req.body;
    const result = await db.collection("tickets").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );
    
    if (result.matchedCount === 0) {
      res.status(404).send({ error: "Ticket not found" });
    } else {
      res.status(200).send(result);
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send({ error: "An internal server error occurred" });
  }
});

// Delete Ticket
app.delete("/tickets/:id", async (req, res) => {
  try {
    const db = client.db(dbName);
    const { id } = req.params;
    const result = await db.collection("tickets").deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      res.status(404).send({ error: "Ticket not found" });
    } else {
      res.status(200).send({ message: "Ticket deleted" });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send({ error: "An internal server error occurred" });
  }
});

// Ensure graceful shutdown on process termination
process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});
