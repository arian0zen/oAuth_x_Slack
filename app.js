
const express = require("express");
const { response } = require('express');
const app = express();

app.use(express.static("public"));

  app.get("/", async (req, res) => {
    // res.header("Access-Control-Allow-Origin", "*")
	// res.header(
	//   "Access-Control-Allow-Headers",
	//   "Origin, X-Requested-With, Content-Type, Accept, Accept Authorization"
	// )
    // const accessToken = req.params.token;
    // const answer = async () => {
      
    //     const init = {
    //       method: "GET",
    //       headers: { "Content-Type": "application/json" , "Authorization": accessToken}
    //     };
      
    //     const response = await fetch("https://api.clickup.com/api/v2/user", init);
        
    //     return response.json();
    //   };
    // const ok = await answer();
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
  