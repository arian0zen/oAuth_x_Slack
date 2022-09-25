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
app.get("/clickuplogin/:name", async (req, res) => {
  const userName = req.params.name;
  // console.log(userName);
  res.redirect(
    `https://app.clickup.com/api?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}`
  );
  app.get("/slack/clickup/oauth", async (request, result) => {
    const code = request.query.code;
    //a post request here
    const bigObject = await axios
      .post(
        `https://api.clickup.com/api/v2/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}`
      )
      .catch(Error);
    var token = bigObject.data.access_token;
    const header_token = {
      'Content-Type': 'application/json',
                      "Authorization": token 

    }
    const bigObject2 = await axios
      .get(
        `https://api.clickup.com/api/v2/user`, header_token
      )
      .catch(Error);
    var username = bigObject2.user.id
    const newUSer = new User({
      name: userName,
      token: token,
      clickup_name: username
    });
    newUSer.save().then((item) => {
      result.json({
        message: "success",
      });
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

// app.get("/api/token", async (req, res) => {
//   const newUSer = new User({
//     name: "arian",
//     token: "arian",
//   });
//   newUSer.save().then((item) => {
//     res.json({
//       message: "success"
//     });
//   });
// });
