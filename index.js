const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8yiviav.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const spotCollection = client.db("postDB").collection('posts')

        app.get('/allSpots', async (req, res) => {
            const cursor = spotCollection.find()

            const result = await cursor.toArray()

            res.send(result);

        })

        app.get('/allSpots/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await spotCollection.findOne(query);
            res.send(result);

        })

        app.get('/allSpots/email/:email', async (req, res) => {
            const email = req.params.email;
            const cursor = { email: email };
            const options = { upsert: true };
            const result = await spotCollection.find(cursor, options).toArray();
            res.send(result);
        })
        

        app.post('/allSpots', async (req, res) => {
            const newSpot = req.body;
            const result = await spotCollection.insertOne(newSpot);

            res.send(result);
        })


        app.put('/allSpots/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedSpot = req.body;

            const spot = {
                $set: {
                    spot_name: updatedSpot.spot_name,
                    country_name: updatedSpot.country_name,
                    location: updatedSpot.location,
                    average_cost: updatedSpot.average_cost,
                    seasonality: updatedSpot.seasonality,
                    travel_time: updatedSpot.travel_time,
                    description: updatedSpot.description,
                    total_visitor: updatedSpot.total_visitor,
                    photo: updatedSpot.photo,
                    email: updatedSpot.email,
                    name: updatedSpot.name,

                }
            }

            const result = await spotCollection.updateOne(filter, spot, options);
            res.send(result);

        })


        app.delete('/allSpots/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await spotCollection.deleteOne(query);
            res.send(result);
        })



        // Loading data of all countries

        const countryCollection = client.db("postDB").collection('country_name')

        app.get('/allCountries', async (req, res) => {
            const cursor = countryCollection.find()

            const result = await cursor.toArray()

            res.send(result);

        })


        app.get('/allCountries/name/:name', async (req, res) => {
            const name = req.params.name;
            const cursor = { country_name : name };
            const options = { upsert: true };
            const result = await spotCollection.find(cursor, options).toArray();
            res.send(result);
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send("Tourist Spot Server is running")
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})