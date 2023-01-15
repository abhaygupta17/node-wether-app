const path = require("path");
const express = require("express");
const { get } = require("http");
const hbs = require("hbs");
const geoCode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

// Define path for Express config
const publicPathDirectory = path.join(__dirname, "../public");
const viewPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// setup handlebar engine and views location
app.set("view engine", "hbs");
app.set("views", viewPath);
hbs.registerPartials(partialsPath);

// setup static directory to server
app.use(express.static(publicPathDirectory)); // root page

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Bruce",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "about me",
    name: "Bruce wayne",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    message: "Get help!!",
    title: "Help",
    name: "Bruce",
  });
});

app.get("/weather", (req, res) => {
  // console.log(req.query.address);

  const address = req.query.address;

  if (!address) {
    return res.send({
      error: "You must provide an address",
    });
  }

  geoCode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return console.log(error);
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return console.log(error);
      }

      res.send({
        address: location,
        forecast: forecastData,
      });
    });

    // console.log(location);
    // console.log(forecastData);
  });
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }

  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Bruce",
    errorMessage: "Help Article not found",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Bruce",
    errorMessage: "Page not found",
  });
});

app.listen(3000, () => {
  console.log("Server is up");
});
