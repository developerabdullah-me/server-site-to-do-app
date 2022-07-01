const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;
// middellware
app.use(cors());
app.use(express.json());

verifyJWT;
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "UnAuthorized access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://toDoApp:1FrAXVMUQg0lg4b3@cluster0.wjm36.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {

    await client.connect();
    const ServiceCollection = client.db("ToDoApp").collection("todoService");

    app.get("/myAddedItems", verifyJWT, async (req, res) => {
        const decodedEmail = req.decoded.email;
        const email = req.query.email;
        if (email === decodedEmail) {
          console.log(email);
          const query = { email: email };
          console.log(query);
          const cursor = ServiceCollection.find(query);
          const productItems = await cursor.toArray();
          console.log(productItems);
          res.send(productItems);
        } else {
          res.status(403).send({ message: "Access denied! Forbidden access" });
        }
      });

      app.post("/login", async (req, res) => {
        const user = req.body;
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "10d",
        });
        res.send({ accessToken });
      });
      // post
      app.post("/todoService", async (req, res) => {
        const newService = req.body;
        const service = await ServiceCollection.insertOne(newService);
        res.send(service);
      });
// delete
app.get("/toDoDelete/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: id };
  const result = await ServiceCollection.deleteOne(query);
  res.send(result);
});
app.delete("/toDoDelete/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await ServiceCollection.deleteOne(query);
  res.send(result);
});

app.post('/completed-to-do', async (req, res) => {
  const postToDo = await ServiceCollection.insertOne(req.body)
  res.send(postToDo)
})

      app.put('/update/:id', async (req, res) => {
        const id = req.params.id
        const updatedQuantity = req.body.updatedData
        const filter = { _id: ObjectId(id )}
        const options = { upsert: true }
        const updatedDoc = {
            $set: {
                description: updatedQuantity
            }
        }
        const result = await ServiceCollection.updateOne(filter, updatedDoc, options)
        res.send(result)
    })

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