require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const { response } = require("express");
const app = express();
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://" +
    process.env.DB_USERNAME +
    ":" +
    process.env.DB_PASSWORD +
    "@cluster0.q9xcxma.mongodb.net/" +
    process.env.DB_NAME
);

const usersSchema = mongoose.Schema({
  name: String,
  token: String,
  clickup_name: String
});

const User = mongoose.model("User", usersSchema);

app.get("/", async (req, res) => {
  res.json({
    "are you sure?": "you wish",
  });
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 80;
}

app.listen(port, () => {
  console.log("listening on port " + port);
});


