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
  res.redirect("http:google.com");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 80;
}

app.listen(port, () => {
  console.log("listening on port " + port);
});
