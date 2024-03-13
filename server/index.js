const express = require("express");
const mongoose = require("mongoose");
const auth = require("./routes/auth.js");
const taskRoutes = require("./routes/task.js");
require('dotenv/config');
const app = express();

app.use(express.json());
const PORT = process.env.PORT;
const URL = process.env.MONGO_URL;

mongoose.connect(URL)
    .then(()=>{
        app.listen(PORT,()=>{
            console.log(`connected to database and server running at ${PORT}`);
        });
    })
    .catch(err =>
        console.log("could not connect")
    );

app.use('/auth',auth);

app.use('/tasks',taskRoutes);

