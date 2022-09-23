
const express = require("express");
const { response } = require('express');
const app = express();

app.use(express.static("public"));

  app.get("/", async (req, res) => {
    res.json({
        "answer": "i am here",
        "response": "and here"
    });
  });


  let port = process.env.PORT;
  if (port == null || port == ""){
	port = 80;
  }
  
  app.listen(port, () => {
	console.log("listening on port " + port);
  });
  