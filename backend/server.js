const express = require('express')

const app = express()
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose')


app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());


const connectDB = async () => {
    await mongoose.connect('mongodb://127.0.0.1/Cluster0');

    console.log("Mongodb connected")
};

connectDB()
mongoose.promise = global.Promise

app.use("/api/users", require("./routes/user_routes"));
app.use("/api/admin", require("./routes/admin_routes"));
app.use("/api/verify",require('./routes/email_route'))

app.listen(3001, () => {
    console.log("Server running on 3001")
}) 