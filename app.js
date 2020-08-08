const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const helmet = require("helmet");
// const compression = require("compression");
const graphqlHttp = require("express-graphql");
const graphqlSchema = require("./graphql/schema");
const graphqlResolvers = require("./graphql/resolvers");
const isAuth = require("./middleware/auth");

const contactRoutes = require("./routes/contact");

const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const db = process.env.MONGO_DEFAULT_DATABASE;

// const MONGO_DB_URI = "mongodb://localhost:27017/boss";
const MONGO_DB_URI = `mongodb+srv://${user}:${password}@cluster0.rrovp.mongodb.net/${db}?retryWrites=true&w=majority`;
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use("/contact", contactRoutes);

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occured.";
      const status = err.originalError.code || 500;

      return { message: message, data: data, status: status };
    }
  })
);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    app.listen(process.env.PORT || 8080);
  })
  .catch(err => console.log(err));
