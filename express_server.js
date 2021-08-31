function generateRandomString() {
  let randomString = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt (
      Math.floor (Math.random () * characters.length)
    );
  }
  return randomString;
}

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// body-parser library will convert the request body from a Buffer into string that we can read. It will then add the data to the req(request) object under the key body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  // "shortURL": "longURL"
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
  console.log(req.params)
  console.log(urlDatabase)
  let shortURL = req.params.shortURL
  
  //longURL takes in obj urlDatabase to gain access one of the long urls
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase };
  res.render("urls_show", templateVars);
});

//generate a link that will redirect to the appropriate longURL
app.get("/u/:shortURL", (req, res) => {

  // console.log(req.params)
  // console.log(urlDatabase)
  const longURL = urlDatabase[req.params.shortURL].longURL
  // console.log("longURL", longURL)
  res.redirect(longURL);
});

//generates a random string when redirectd to urls/shorturls
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();

  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    
  };
  // console.log(req.body);  // Log the POST request body to the console
  res.redirect(`/urls/${shortURL}`);// Respond with 'Ok' (we will replace this)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});