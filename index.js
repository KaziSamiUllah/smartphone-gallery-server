const express = require("express");
const app = express();

app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://samiullahsagor:uRweySvSHkJ3MNxj@cluster0.tancx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const phoneCollection = client.db("phonesDB").collection("phones");

   
    app.get("/phones", async (req, res) => {
        const data = phoneCollection.find();
        const result = await data.toArray();
        res.send(result);
      });










    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
