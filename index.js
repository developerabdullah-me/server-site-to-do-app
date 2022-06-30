const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5001;
// middellware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://toDoApp:1FrAXVMUQg0lg4b3@cluster0.wjm36.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {

    await client.connect();
    const ServiceCollection = client.db("ToDoApp").collection("todoService");

    // app.get("/myAddedItems", async (req, res) => {
    //     const decodedEmail = req.decoded.email;
    //     const email = req.query.email;
    //     if (email === decodedEmail) {
    //       const query = { email: email };
    //       const cursor = ServiceCollection.find(query);
    //       const InventoryItems = await cursor.toArray();
    //       res.send(InventoryItems);
    //     } else {
    //       res.status(403).send({ message: "Access denied! Forbidden access" });
    //     }
    //   });
      // post
      app.post("/todoService", async (req, res) => {
        const newService = req.body;
        const service = await ServiceCollection.insertOne(newService);
        res.send(service);
      });
  

  } finally {
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("welcome todo-server-site");
});
app.listen(port, () => {
  console.log("listening on", port);
});