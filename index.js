const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
// for connect to mongodb

const Port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());
mongoose.set("strictQuery", false);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

let connectToMongo = async () => {
  let databaseUrl = process.env.DATABASE_URL;
  let connect = await mongoose.connect(databaseUrl);

  if (connect) {
    console.log("database succesully connected");
    app.listen(Port, () => {
      console.log(`iNotes app listing at http://localhost:${Port}`);
    });
  } else {
    console.log(`error occurse : ${connect}`);
    process.exit(1);
  }
};

connectToMongo();
