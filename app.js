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
  name: Number,
  token: String
});

const User = mongoose.model("User", usersSchema);

app.get("/", async (req, res) => {
  res.json({
    "are you sure?": "you wish",
  });
});
app.get("/clickuplogin/:name", async (req, res) => {
  const userName = req.params.name
  // console.log(userName);
  res.redirect(
    `https://app.clickup.com/api?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}`
  );
  app.get("/slack/clickup/oauth", async (request, result) => {
    result.json({
      url: request.query.code
    });
  });
  app.get("/clickup/result", async (requestt, resultt) => {
    resultt.json({
      name: userName,
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
