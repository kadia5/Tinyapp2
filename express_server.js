function generateRandomString () {
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

const express = require ('express');
const app = express ();
const PORT = 8080; // default port 8080
// body-parser library will convert the request body from a Buffer into string that we can read. It will then add the data to the req(request) object under the key body
const bodyParser = require ('body-parser');
const cookieParser = require ('cookie-parser');
app.use (bodyParser.urlencoded ({extended: true}));
app.use (cookieParser ());
app.set ('view engine', 'ejs');

const urlDatabase = {
  // shortURL: "longURL"
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};


// ___ALL GET REQUESTS START HERE___


//sends hello to client browser
app.get ('/', (req, res) => {
  res.send ('Hello!');
});

//adds a new endpoint ex localhost8080/urls.json that displays a json string
app.get ('/urls.json', (req, res) => {
  res.json (urlDatabase);
});

//adds html code to a new enpoint to display string Hello World
app.get ('/hello', (req, res) => {
  res.send ('<html><body>Hello <b>World</b></body></html>\n');
});

//contains an object called urlDatabase, which we use to keep track of all the URLs and their shortened forms, corresp to all urls in urls_index.ejs
app.get ('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies['username'],
  };
  //passes url data to template
  res.render ('urls_index', templateVars);
});

//requests basic form page that used to submit URLs to be shortened or make "new" urls from urls_new
app.get ('/urls/new', (req, res) => {
  const templateVars = {username: req.cookies['username']};
  res.render ('urls_new', templateVars);
});

/*the value in this part of the url will be available in the req.params object
example, if the ID of the long url was b2xVn2, then the url would look like /urls/b2xVn2 in the browser. Further, the value of req.params.shortURL would be b2xVn2.*/
app.get ('/urls/:shortURL', (req, res) => {
  console.log (req.params);
  console.log (urlDatabase);
  let shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  //longURL takes in obj urlDatabase to gain access one of the long urls
  const templateVars = {shortURL, longURL, username: req.cookies['username']};
  res.render ('urls_show', templateVars);
});

//generate a link that will redirect to the appropriate longURL
app.get ('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  // if (!longURL.includes('http://')) {
  //   longURL = 'http://' + longURL;
  // }
  res.redirect(longURL);
});

app.get ('/login', (req, res) => {
  let username = req.body.username;
  const templateVars = { username: req.cookies['username']};

  res.render('urls_login', templateVars);
});


// ____ALL POST REQUESTS START HERE____


//generates a random string when redirectd to urls/shorturls
app.post ('/urls', (req, res) => {
  const shortURL = generateRandomString ();
  console.log (req.body);
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
  };
  // console.log(req.body);  // Log the POST request body to the console
  res.redirect (`/urls/${shortURL}`); // Respond with 'Ok' (we will replace this)
});

//lets you edit a posted link and redirects to edit page for shorturls
app.post ('/urls/:shortURL/edit', (req, res) => {
  const shortURL = req.params.shortURL;
  res.redirect (`/urls/${shortURL}`);
});

//lets you delete a posted link/shorturl
app.post ('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect ('/urls');
});

//templateVar will set and define username in all other areas.
app.post ('/login', (req, res) => {
  let username = req.body.username;
  res.cookie ('username', username);
  res.redirect ('/urls');
});

app.post ('/logout', (req, res) => {
  // let username = req.body.username;
  res.clearCookie("username");
  res.redirect('/urls/');
});
//below code displays username
// const templateVars = {
//   username: req.cookies["username"],
// };
// res.render("urls_index", templateVars);









//listens to port
app.listen (PORT, () => {
  console.log (`Example app listening on port ${PORT}!`);
});