const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 4000;

//Use Middleware
app.use(cors());
app.use(express.json());

//Mongodb Connection

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ca4fw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   serverApi: ServerApiVersion.v1,
});
async function run() {
   try {
      await client.connect();
      const todoCollection = client.db("things-todo").collection("todoList");

      // Post api to insert one data
      app.post("/list", async (req, res) => {
         const data = req.body;
         const result = await todoCollection.insertOne(data);
         res.send(result);
      });

      // Get api to read data
      app.get("/list", async (req, res) => {
         const query = req.query;
         const cursor = todoCollection.find(query);
         const list = await cursor.toArray();
         res.send(list);
      });

      // Put api to update one data
      app.patch("/list/:id", async (req, res) => {
         const id = req.params.id;
         const data = req.body;
         console.log(id, data);
         const filter = { _id: ObjectId(id) };
         const options = { upsert: true };
         const updateDoc = {
            $set: {
               ...data,
            },
         };
         const result = await todoCollection.updateOne(
            filter,
            updateDoc,
            options
         );
         res.send(result);
      });

      // Delete api to delete one data
      app.delete("/list/:id", async (req, res) => {
         const id = req.params.id;
         console.log(id);
         const filter = { _id: ObjectId(id) };
         const result = await todoCollection.deleteOne(filter);
         res.send(result);
      });
   } finally {
   }
}
run().catch(console.dir);

app.get("/", (req, res) => {
   res.send("ToDo app server is running!");
});

app.listen(port, () => {
   console.log(`Server is running on ${port}`);
});
