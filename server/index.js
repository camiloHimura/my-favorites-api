const cors = require("cors");
const express = require("express");
const { json, urlencoded } = require("body-parser");

const db = require("./utils/db");
const tagRouter = require("./routes/tag");
const linkRouter = require("./routes/link");
const errorHandler = require("./utils/errorHandler");
const port = process.env.PORT || 8082;

const App = express();
App.use(cors());
App.use(json());

App.use ((error, req, res, next) => {
    if(error){ errorHandler(error, res) }
});

App.use(urlencoded());

App.use("/api/tag", tagRouter);
App.use("/api/link", linkRouter);

module.exports = {
  async start(){
    try{
        await db.connect();
        App.listen(port, () => console.log(`App Running port ${port}`));
    }catch(error){
        console.log("Milo index error", error)
    }
  }
}