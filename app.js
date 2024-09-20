const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/plotweaver").then(() => {
    console.log("Connected to the database!");
    app.listen(8000, () => {
        console.log("Server is running on port 8000");
    });
}).catch((err) => {
    console.log(err);
});

app.use("/",routes);

module.exports = app;