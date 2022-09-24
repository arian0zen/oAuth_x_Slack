require('dotenv').config();
const express = require("express");
const { response } = require("express");
const app = express();

app.use(express.static("public"));

app.get("/", async (req, res) => {
  res.json({
    "are you sure?": "you wish",
  });
});
app.get("/clickuplogin", async (req, res) => {
  res.redirect(`https://app.clickup.com/api?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}`);
});
app.get("/slack/clickup/oauth", async (req, res) => {
  console.log(req.params.code)
  res.redirect("clickup.com")
});




let port = process.env.PORT;
if (port == null || port == "") {
  port = 80;
}

app.listen(port, () => {
  console.log("listening on port " + port);
});
