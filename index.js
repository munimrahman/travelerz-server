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
        const packagesCollection = database.collection('packages');
        const ordersCollection = database.collection('orders');

        // Get All PACKAGES Data
        app.get('/packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const count = await cursor.count()
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let packages;
            if (page) {
                packages = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                packages = await cursor.toArray();
            }
            res.send({
                count,
                packages
            })
        })

        // Add a New Package
        app.post('/packages', async (req, res) => {
            const newPackage = req.body;
            const result = await packagesCollection.insertOne(newPackage)
            res.json(result)
        })

        // Find a PACKAGE By _id
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await packagesCollection.findOne(query)
            res.json(result)
        })

        // Find PACKAGES byKeys For Cart
        app.post('/packages/byKeys', async (req, res) => {
            const keys = req.body;
            const query = { key: { $in: keys } }
            const packages = await packagesCollection.find(query).toArray()
            res.json(packages)
        })
        // Get All ORDERS & Get Orders by Email
        app.get('/orders', async (req, res) => {
            let query = {};
            const page = req.query.page;
            const email = req.query.email;
            const size = parseInt(req.query.size);
            if (email) {
                query = { email: email }
            }
            const cursor = ordersCollection.find(query);
            const count = await cursor.count()
            let orders;
            if (page) {
                orders = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                orders = await cursor.toArray();
            }
            res.send({
                count,
                orders
            })
        })

        // Add ORDERS API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            res.json(result)
        })
        // Find a ORDER By _id
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.findOne(query)
            res.json(result)
        })

        // Find  ORDERS By email
        // app.post('/orders', async (req, res) => {
        //     const email = req.query.email;
        //     const query = { email: email }
        //     const result = await ordersCollection.find(query).toArray()
        //     res.json(result)
        // })

        // Update Order by Admin || Confirm Order Status
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updateInfo = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    orderStatus: updateInfo.orderStatus
                },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc, options)
            res.json(result);
        })

        // Delete a ORDER API For Admin
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })

        // Get All PRODUCTS Data
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const count = await cursor.count()
            const page = req.query.page;
            const size = parseInt(req.query.size);
            // console.log(page, size);
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
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct)
            res.json(result)
        })

        // Get Products by Keys for CART
        app.post('/products/byKeys', async (req, res) => {
            const keys = req.body;
            const query = { key: { $in: keys } }
            const products = await productsCollection.find(query).toArray()
            res.json(products)
        })

        // Get All USERS Data
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const count = await cursor.count()
            const page = req.query.page;
            const size = parseInt(req.query.size);
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
        // app.post('/users', async (req, res) => {
        //     const newUser = req.body;
        //     const result = await productsCollection.insertOne(newUser)
        //     res.json(result)
        // })

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