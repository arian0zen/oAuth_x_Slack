require("dotenv").config();
const fetch = require('node-fetch');
const cron = require("node-cron");
const express = require("express");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
const axios = require("axios");
const { response, application } = require("express");
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

router.get('/privacy',function(req,res){
  res.sendFile(path.join(__dirname+'/privacy.html'));
});
router.get('/support',function(req,res){
  res.sendFile(path.join(__dirname+'/support.html'));
});
app.get('/directinstall', async (req, res)=>{
  res.redirect('https://anotherworksp-zns9860.slack.com/oauth?client_id=4119091293010.4118077627734&scope=app_mentions%3Aread%2Cim%3Ahistory%2Cchannels%3Ahistory%2Cchannels%3Aread%2Cgroups%3Ahistory%2Cim%3Ahistory%2Cincoming-webhook%2Cmpim%3Ahistory%2Cchat%3Awrite&user_scope=&redirect_uri=&state=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0YWxsT3B0aW9ucyI6eyJzY29wZXMiOlsiYXBwX21lbnRpb25zOnJlYWQiLCJpbTpoaXN0b3J5IiwiY2hhbm5lbHM6aGlzdG9yeSIsImNoYW5uZWxzOnJlYWQiLCJncm91cHM6aGlzdG9yeSIsImltOmhpc3RvcnkiLCJpbmNvbWluZy13ZWJob29rIiwibXBpbTpoaXN0b3J5IiwiY2hhdDp3cml0ZSJdfSwibm93IjoiMjAyMi0xMi0wMVQyMDozMDowNi4wNTJaIiwicmFuZG9tIjo5NjgwMDcsImlhdCI6MTY2OTkyNjYwNn0.WQMKBRcsNye7VzUR8Dy8EJpQ3vjsFmwyA55mqUG7oF0&granular_bot_scope=1&single_channel=0&install_redirect=&tracked=1&team=');
})

app.get("/souvik/extension", async (req, res) =>{
  res.header("Access-Control-Allow-Origin", "*")
	res.header(
	  "Access-Control-Allow-Headers",
	  "Origin, X-Requested, Content-Type, Accept Authorization"
	)
  var options = {
    method: 'GET',
    url: 'https://microsoft-translator-text.p.rapidapi.com/languages',
    params: {'api-version': '3.0'},
    headers: {
      'X-RapidAPI-Key': process.env.MICROSOFT_TRANSLATION_API,
      'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com',
      'Accept-Encoding': 'null'
    }
  };
  
  axios.request(options).then(function (response) {
    res.json(response.data)
  }).catch(function (error) {
    console.error(error);
  });
})








let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.use('/', router)
app.listen(port, () => {
  console.log("app started... listening to the port " + port);
});


