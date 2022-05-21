import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';

// app config
const app = express();
const port = process.env.PORT || 9000;

// middleware
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});

//DB config
const connection_url = 'mongodb+srv://sandraISOC:admin@cluster0.czwet.mongodb.net/whatsappdb?retryWrites=true&w=majority';
mongoose.connect(connection_url);

const db = mongoose.connection;
db.once("open", () => {
    console.log("DB connected");

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on('change', (change) => {
        console.log('A change occured', change);

        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted', {
                name: messageDetails.name,
                message: messageDetails.message
            })
        } else {
            console.log('Error triggering Pusher');
        }
    })
})

const pusher = new Pusher({
    appId: "1412106",
    key: "ce9f230e16f7181327b2",
    secret: "45286dc3e5ac56dc295c",
    cluster: "eu",
    useTLS: true
});

// ????

// api routes
app.get('/', (req, res) => res.status(200).send('hello world'));

app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body;

    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})


//listen
app.listen(port, () => console.log(`Listening on localhost:${port}`));