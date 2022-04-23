require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const dbConn = mysql.createConnection({
  host: process.env.DB_HOST || "",
  user: process.env.DB_USER_NAME || "",
  password: process.env.DB_USER_PASSWORD || "",
  database: process.env.DB_NAME || "",
  port: process.env.DB_PORT || "",
});

dbConn.connect(function (err) {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log("Database was connected");
  require("./routes")({ app, dbConn });
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});


app.post('/generateQnA', (req, res) => {
     
  const transcript = req.body.transcript;
  console.log(req.body.transcrpt)

  // call ml model
    // pass context (full transcript)
    // [x] pass answer (select random sentence from trancript)
  // return question
  // return answer which is random sentence from transcript selected here [x]
  

})

app.get('/user/library/:id', (req, res) => {
   
  const id = req.params.id;
  
  UserJournals.find({id:id}, (err, data) => {
      if (err) {
          res.status(500).send(err);
      } else {
          console.log(data[0])
          res.status(201).send(data[0].library)
      }
  })

})