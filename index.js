const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://smartphone-gallery-client.vercel.app",
    ],
    credentials: true,
    optionSuccessStatus: 200,
  })
);

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

    app.get("/category", async (req, res) => {
      const data = phoneCollection.find();
      const result = await data.toArray();
      res.send(result);
    });

    app.get("/phones", async (req, res) => {
      const {
        search = "",
        page = 1,
        limit = 10,
        brand,
        type,
        price,
      } = req.query;
      const skip = (page - 1) * limit;

      // Build query object
      const query = {};

      if (search) {
        query.ProductName = { $regex: search, $options: "i" };
      }

      if (brand) {
        query.Brand = brand;
      }

      if (type) {
        query.Category = type;
      }

      if (price) {
        const [minPrice, maxPrice] = price.split("-").map(Number);
        query.Price = { $gte: minPrice, $lte: maxPrice };
      }

      const data = phoneCollection
        .find(query)
        .skip(skip)
        .limit(parseInt(limit));

      const result = await data.toArray();
      const total = await phoneCollection.countDocuments(query);

      res.send({
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        phones: result,
      });
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
