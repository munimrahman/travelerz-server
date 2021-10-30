const express = require('express');
const cors = require('cors');
const { MongoClient } = require("mongodb");
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();

app.use(cors());
app.use(express.json())

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.luqwr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('travelerz');
        const productsCollection = database.collection('products');
        const usersCollection = database.collection('users');

        // Get All PRODUCTS Data
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const count = await cursor.count()
            const page = req.query.page;
            const size = parseInt(req.query.size);
            console.log(page, size);
            let users;
            if (page) {
                users = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                users = await cursor.toArray();
            }
            res.send({
                count,
                users
            })
        })

        // Find a PRODUCT By _id
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.findOne(query)
            res.json(result)
        })
        // Add a New PRODUCT
        app.post('/products', async (req, res) => {
            const newUser = req.body;
            const result = await productsCollection.insertOne(newUser)
            res.json(result)
        })

        // Get All USERS Data
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const count = await cursor.count()
            const page = req.query.page;
            const size = parseInt(req.query.size);
            console.log(page, size);
            let users;
            if (page) {
                users = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                users = await cursor.toArray();
            }
            res.send({
                count,
                users
            })
        })

        // POST API || Create a Document to Insert
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await productsCollection.insertOne(newUser)
            res.json(result)
        })

        // DELETE API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(query);
            res.json(result);
        })

        // UPDATE API || PUT Method
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updateInfo = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateInfo.name,
                    email: updateInfo.email,
                    mobile: updateInfo.mobile
                },
            };
            const result = await productsCollection.updateOne(filter, updateDoc, options)
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello From Travelerz Server')
})

app.listen(port, () => {
    console.log('Server is Running on Port', port);
})