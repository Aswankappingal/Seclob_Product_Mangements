const express = require('express');
const router = require('./router');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use("/artifitia", router);

async function connection() {
    const URL = `${process.env.DB_URL}/${process.env.DB_NAME}`;
    const db = await mongoose.connect(URL);
    console.log("Database connected", "as", process.env.DB_NAME);
    return db;
}

connection().then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Server started at port", process.env.PORT);
    });
}).catch((error) => {
    console.log(error);
});
