const App = require("./server");
const db = require("./server/utils/db");
const port = process.env.PORT || 8082;

(async function start() {
  try{
    await db.connect();
    App.listen(port, () => console.log(`App Running port ${port}`));
  }catch(error){
    console.log("Milo index error", error)
  }
})()
