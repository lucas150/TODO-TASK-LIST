const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

dotenv.config({ path: "./config.env" });
require("./db/conn");

app.use(express.json());
//linked router files to make routes easy

app.use(require('./routes/auth'));

// simple route


app.get("/contact", (req, res) => {
  res.json({ message: "Welcome to todo application." });
});

  app.get("/signup", (req, res) => {
    res.json({ message: "Welcome to application." });
  });

  // set port, listen for requests
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });