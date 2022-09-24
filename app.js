require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
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
  token: String,
});

const User = mongoose.model("User", usersSchema);

app.get("/", async (req, res) => {
  res.json({
    "are you sure?": "you wish",
  });
});
app.get("/clickuplogin/:name", async (req, res) => {
  const userName = req.params.name;
  // console.log(userName);
  res.redirect(
    `https://app.clickup.com/api?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}`
  );
  app.get("/slack/clickup/oauth", async (request, result) => {
    const code = request.query.code;
  //a post request here
  const bigObject = await axios .post(
    `https://api.clickup.com/api/v2/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=ULA6UEL2WFKAVPVGJ2R8Q49DXVFHSYYS`
  ).catch(Error)
  var token = bigObject.data.access_token;


    result.json({
      code: code,
      name: userName,
      token: token
    })
  });

});

app.get("/api/token", async (req, res) => {
  const vari = await axios .post(
      `https://api.clickup.com/api/v2/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=10UT8TO9Z9KDA2L4KI9W3R8PQEQ2O280`
    ).catch(Error)
    // console.log(vari.data.access_token)
});

// resultt.json({
//   name: userName,
//   code: requestt.query.code,
//   message: "Success authorized",
// });
// await axios.post(
//   `https://api.clickup.com/api/v2/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}`
// )
let port = process.env.PORT;
if (port == null || port == "") {
  port = 80;
}

app.listen(port, () => {
  console.log("listening on port " + port);
});
