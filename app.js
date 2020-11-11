require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const MOVIEDEX = require("./moviedex.json");

const app = express();
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_Token;
  const authToken = req.get("Authorization");

  console.log(process.env.API_TOKEN);

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  }
  // move to the next middleware
  next();
});

function handleGetTitle(req, res) {
  //set default response
  let response = MOVIEDEX;

  //check genre query param
  if (req.query.genre) {
    response = response.filter((title) =>
      title.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    );
  }
  //check country query param
  if (req.query.country) {
    response = response.filter((title) =>
      title.country.toLowerCase().includes(req.query.country.toLowerCase())
    );
  }

  //check avg_vote query param, return titles greater than/equal to query number
  if (req.query.avg_vote) {
    response = response.filter(
      (title) => title.avg_vote >= req.query.avg_vote
    );
  }

  //return response
  res.json(response);
}

app.get("/movie", handleGetTitle);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
