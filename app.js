const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routes");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/plotweaver").then(() => {
    console.log("Connected to the database!");
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}).catch((err) => {
    console.log(err);
});

app.use("/",routes);
