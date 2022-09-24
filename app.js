require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { response } = require("express");
const app = express();
app.use(express.static("public"));

const uri =
  "mongodb+srv://" +
  process.env.DB_USERNAME +
  ":" +
  process.env.DB_PASSWORD +
  "@cluster0.q9xcxma.mongodb.net/" +
  process.env.DB_NAME;

const connect = async function () {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

const usersSchema = mongoose.Schema({
  userToken: { name: String, token: String }
});

const User = mongoose.model("User", usersSchema);

app.get("/", async (req, res) => {
  res.json({
    "are you sure?": "you wish",
  });
});
app.get("/clickuplogin", async (req, res) => {
  res.redirect(
    `https://app.clickup.com/api?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}`
  );
  app.get("/slack/clickup/oauth", async (req, res) => {
    res.redirect("/clickup/result");
  });
  app.get("/clickup/result", async (req, res) => {
    res.json({
      message: "Success authorized",
    });
  });
});



let port = process.env.PORT;
if (port == null || port == "") {
  port = 80;
}

app.listen(port, () => {
  console.log("listening on port " + port);
});
