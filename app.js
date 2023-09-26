const express = require("express");
const https = require("https");

const app = express();
const port = process.env.PORT||3000;
const ejs = require('ejs');
app.set('view engine','ejs');

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  console.log(req.body.cityName);
  const query = req.body.cityName;
  const apiKey = "d519cc88dfed0c8b785ebad46abafffd";
  const unit = "metric";

  const url = ("https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit);
  https.get(url, function(response) {
    console.log(response.statusCode);

    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "https://openweather.org/img/wn/" + icon + "@2x.png";
      // res.write("<p>The weather is currently " + weatherDescription + "<p>");
      // res.write("<h1>The temperature in " + query + " is " + temp + "degrees Celcius.</h1>")
      // res.write("<img scr=" + imageURL + ">");
      const templateData = {
        query,
        weatherDescription,
        temp,
      };
      res.render('next',templateData);
    });
  });
});

app.listen(port, function() {
  console.log("server is runing at port 3000.");
});
