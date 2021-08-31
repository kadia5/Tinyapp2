const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// body-parser library will convert the request body from a Buffer into string that we can read. It will then add the data to the req(request) object under the key body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

function generateRandomString() {

}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//listens to port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//sends hello to client browser
app.get("/", (req, res) => {
  res.send("Hello!");
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

//requests basic form page that used to submit URLs to be shortened or make "new" urls from urls_new
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

/*the value in this part of the url will be available in the req.params object
example, if the ID of the long url was b2xVn2, then the url would look like /urls/b2xVn2 in the browser. Further, the value of req.params.shortURL would be b2xVn2.*/
app.get("/urls/:shortURL", (req, res) => {

  //longURL takes in obj urlDatabase to gain access one of the ong urls
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});
