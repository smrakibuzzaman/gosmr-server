const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const cors = require('cors')
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wl2z9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
      await client.connect();
      console.log('connected to database');
      const database = client.db("goSMR");
      const tourCollection = database.collection("tourPackages");
      const confirmedCollection = database.collection("confirmedTours");

    //   get API

    app.get('/tourPackages', async (req, res) => {
        const cursor= tourCollection.find({});
        const tours = await cursor.toArray();
        res.send(tours);
    });

    // get individual tour

    app.get("/tourOrder/:id", async (req, res) => {
        const result = await tourCollection.findOne({_id: ObjectId(req.params.id)}); 
        res.send(result);
    });

    // post confirmed tours

    app.post("/confirmedTour", async (req, res) => {
        const result = await confirmedCollection.insertOne(req.body)
        res.send(result);
    })

    // get my orders

    app.get("/userOrders/:email", async (req, res) => {
        const result = await confirmedCollection.find({email: (req.params.email)}).toArray();
        res.send(result);
    })

    // remove from my orders

    app.delete("/removeOrder/:id", async (req, res)=>{
        const result = await confirmedCollection.deleteOne({_id: ObjectId(req.params.id)})
        res.send(result);
        
    })

    // add services 
    app.post("/addPackages", async (req, res)=>{
        const result = await tourCollection.insertOne(req.body)
        res.json(result);
            })
   
            console.log("all route is working");
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get("/", (req, res) =>{
    console.log("running GoSMR Server");
});

app.listen(port, ()=>{
    console.log('running GoSMR Server on port', port);
});