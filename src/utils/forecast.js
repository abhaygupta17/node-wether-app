const request = require("request");

const forecast = (lat, long, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=12ac85f5adae1eeffe3b12731afec728&query=${encodeURIComponent(
    lat,
    long
  )}&units=m`;

  request({ url, json: true }, (error, response) => {
    if (error) {
      console.log("Unable to connect to weather service!");
    } else if (response.body.error) {
      console.log("unable to find location");
    } else {
      callback(
        undefined,
        `${response.body.current.weather_descriptions[0]}. It is ${response.body.current.temperature} degrees out.It feels like ${response.body.current.feelslike} degree out`
      );
    }
  });
};

module.exports = forecast;
