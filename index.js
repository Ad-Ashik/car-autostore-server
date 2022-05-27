const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// db connet
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bdirjbl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db("autoStore").collection("product");
        const reviewCollection = client.db("autoStore").collection("review");


        // get all data
        app.get('/products', async (req, res) => {
            const query = {};
            const result = await productCollection.find(query).toArray();
            res.send(result);

        });

        // add product id
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result)
        });

        // Add review
        app.post('/review', async (req, res) => {
            const review = req.body;
            const resutl = await reviewCollection.insertOne(review);
            res.send(resutl);
        })
    }
    finally { }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('welcome to AutoStore Home page')
});

app.listen(port, () => {
    console.log('AutoStores Server ready...')
})
