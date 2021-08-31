const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//sends hello to client browser
app.get("/", (req, res) => {
  res.send("Hello!");
});

//listens to port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//adds a new endpoint ex localhost8080/urls.json that displays a json string
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//adds html code to a new enpoint to display string Hello World
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//contains an object called urlDatabase, which we use to keep track of all the URLs and their shortened forms, corresp to all urls in urls_index.ejs
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };

  //passes url data to template
  res.render("urls_index", templateVars);
});