const connection = require("./db");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
// for connect to mongodb
connection();
const Port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(Port, () => {
  console.log(`iNotes app listing at https://localhost:${Port}`);
});
