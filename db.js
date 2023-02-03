const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

mongoose.set("strictQuery", false);
let connectToMongo = async () => {
  let databaseUrl = process.env.DATABASE_URL;
  let connect = await mongoose.connect(databaseUrl);

  if (connect) {
    console.log("database succesully connected");
  } else {
    console.log(`error occurse : ${connect}`);
    process.exit(1);
  }
};

module.exports = connectToMongo;
