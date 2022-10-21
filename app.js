require("dotenv").config();
const fetch = require('node-fetch');
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
  clickup_name: String,
  slackList_id: String
});

const User = mongoose.model("User", usersSchema);

app.get("/", async (req, res) => {
  res.json({
    "are you sure?": "you wish",
  });
});

var user_slack = "";
var code = "";
var token = "";
var username = "";
var addedListId = "";

app.get("/clickuplogin/:name", async (req, res) => {
  user_slack = req.params.name;
  res.redirect(
    `https://app.clickup.com/api?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}`
  )
  app.get("/slack/clickup/oauth", async (request, result) => {
    code = request.query.code;
    const bigObject = await axios
      .post(
        `https://api.clickup.com/api/v2/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}`
      )
      .catch(Error);
    token = bigObject.data.access_token;
    const header_token = {
      headers:{
        'Authorization': token 
      }
    }
    const bigObject2 = await axios
      .get(
        `https://api.clickup.com/api/v2/user`, header_token
      )
      .catch(Error);
    username = bigObject2.data.user.id
    
    const getTeam = await axios
    .get(`https://api.clickup.com/api/v2/team`, header_token)
    .catch(Error);
    var teamId = getTeam.data.teams[0].id ;

    const getSpace = await axios
    .get(`https://api.clickup.com/api/v2/team/${teamId}/space`, header_token)
    .catch(Error);
    var spaceId = getSpace.data.spaces[0].id ;

    
    var body_add = {
      name: 'Tasks added from SlackUp',
      status: 'red'
    }
    var headers =  {
      'Content-Type': 'application/json',
      Authorization: token
    }
    var addList = await axios
    .post(`https://api.clickup.com/api/v2/space/${spaceId}/list`,
    body_add,
    {headers})
      .catch(error => {
        console.error('There was an error!', error);
      });
    
    const addedList_id = addList.data.id;


  
    let newUSer = new User({
      name: user_slack,
      token: token,
      clickup_name: username,
      slackList_id: addedList_id

    });
    newUSer.save().then((item) => {
      result.json({
        message: "success, you can use the bot now"
      
      });

    });
  }); 
});


app.get('/inactive', async (req, res) => {
  await fetch('https://slackintegratedclickup.onrender.com/inactive')
  .then(res => res.json())
  .catch(err => console.log(err));
})

setInterval(function() {
  // do something here
  console.log('interval',new Date().toLocaleString());
}, 5000);


let port = process.env.PORT;
if (port == null || port == "") {
  port = 80;
}

app.listen(port, () => {
  console.log("listening on port " + port);
});


