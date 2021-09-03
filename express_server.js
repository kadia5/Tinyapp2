const express = require ('express');
const app = express ();
const PORT = 8080; // default port 8080
// body-parser library will convert the request body from a Buffer into string that we can read. It will then add the data to the req(request) object under the key body
const bodyParser = require ('body-parser');
const cookieParser = require ('cookie-parser');
const bcryptjs = require('bcryptjs');
const password = "1"; // found in the req.params object
const hashedPassword = bcryptjs.hashSync(password, 10);
app.use (bodyParser.urlencoded ({extended: true}));
app.use (cookieParser ());
app.set ('view engine', 'ejs');
//________________________________________

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

//_________USERS OBJECT__________________
//"data store" that stores and access users in app
const users = {
  userRandomID: {
    id: 'userRandomID',
    email: 'user@example.com',
    password: bcryptjs.hashSync ('1', 10)
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: bcryptjs.hashSync ('2', 10)
  },
};

//__________________________________________

// const emailAlreadyTaken = function (inputEmail, users) {
//   for (let key in users) {
//     console.log (users[key].email);
//     if (users[key].email == inputEmail) {
//       return true;
//     }
//   }
//   return false;
// };
const getUserByEmail = function (inputEmail, users) {
  for (let key in users) {
    if (users[key].email == inputEmail) {
      return users[key];
    }
  }
  return false;
};

// ________URL Database___________

const urlDatabase = {
  // shortURL: "longURL"
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

// ________ALL GET REQUESTS START HERE___________

//sends hello to client browser
app.get ('/', (req, res) => {
  const user = req.cookie.user_id;
  if (!user) {
    res.redirect ('/login');
  } else {
    res.redirect ('/urls');
  }
  // res.send ('Hello!');
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
    user: req.cookies.user_id,
  };
  const user = users[req.cookies.user_id];
  if (!user) {
    res.redirect ('/login');
  } else {
    let filteredUrls = {};

    for (const url in urlDatabase) {
      if (urlDatabase[url].user === user) {
        filteredUrls[url] = urlDatabase[url];
      }
    }
    const templateVars = {urls: filteredUrls, user: user};
    //passes url data to template
    res.render ('urls_index', templateVars);
  }
});

//requests basic form page that used to submit URLs to be shortened or make "new" urls from urls_new
app.get ('/urls/new', (req, res) => {
  const longURL = req.params.longURL;
  const user = users[req.cookies.user_id];
  const templateVars = {user};
  res.render ('urls_new', templateVars);
});

/*the value in this part of the url will be available in the req.params object
example, if the ID of the long url was b2xVn2, then the url would look like /urls/b2xVn2 in the browser. Further, the value of req.params.shortURL would be b2xVn2.*/
app.get ('/urls/:shortURL', (req, res) => {
  let shortURL = req.params.shortURL;
  const user = req.cookie.user_id;
  if (urlDatabase[shortURL].user !== user) {
    res.send ('These Do Not Belong To You');
  }
  const templateVars = { shortURL: shortURL, longURL: urlDatabase[shortURL].longURL, user: users[user_id] };
  // console.log (req.params);
  // console.log (urlDatabase);
  // let shortURL = req.params.shortURL;
  // const longURL = urlDatabase[shortURL];
  // //longURL takes in obj urlDatabase to gain access one of the long urls
  // const templateVars = {shortURL, longURL, user: req.cookies.user_id};
  res.render ('urls_show', templateVars);
});

//generate a link that will redirect to the appropriate longURL
app.get ('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  // if (!longURL.includes('http://')) {
  //   longURL = 'http://' + longURL;
  // }
  res.redirect (longURL);
});

app.get ('/login', (req, res) => {
  const user = req.body.user_id;
  const templateVars = {user: req.cookies.user_id};

  res.render ('urls_login', templateVars);
});

app.get ('/register', (req, res) => {
  let user = req.body.user_id;
  const templateVars = {user: req.cookies.user_id};

  res.render ('urls_register', templateVars);
});

// __________ALL POST REQUESTS START HERE___________

//generates a random string when redirectd to urls/shorturls
app.post ('/urls', (req, res) => {
  const shortURL = generateRandomString ();
  let user = req.cookie.user_id;
  
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: user
  };
  // console.log(req.body);  // Log the POST request body to the console
  res.redirect (`/urls/${shortURL}`); // Respond with 'Ok' (we will replace this)
});

//lets you EDIT a posted link and redirects to edit page for shorturls
app.post ('/urls/:shortURL', (req, res) => {
  const user = req.cookie.user_id;

  if (!user) {
    res.redirect ('/login');
  }
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.url;
  res.redirect ('/urls/');
});

//lets you delete a posted link/shorturl
app.post ('/urls/:shortURL/delete', (req, res) => {
  const user = req.cookie.user_id;
  const shortURL = req.params.shortURL;
  if (user) {
    
    delete urlDatabase[shortURL];
  }
  res.redirect ('/urls');
});

//templateVar will set and define user in all other areas.
app.post ('/login', (req, res) => {
  const user_id = generateRandomString ();
  const user = {
    id: user_id,
    email: req.body.email,
    password: req.body.password,
  };
  users[user_id] = user;
  if (req.body.user_id === '' || req.body.password === '') {
    return res.status (403).send ('Enter email or password!');
  }
  if (getUserByEmail (req.body.email, users)) {
    let user = getUserByEmail (req.body.email, users);
    let checkPassword = bcryptjs.compareSync (req.body.password, user.password);
    // console.log(user.password)
    console.log (checkPassword);

    if (!checkPassword) {
      return res.status (403).send ("Password doesn't match");
    }
    res.cookie ('user_id', user_id);
    res.redirect (`/urls/`);
  } else {
    return res.status (403).send ("Email or password doesn't match");
  }
});

app.post ('/logout', (req, res) => {
  // let user = req.body.user;
  res.clearCookie ('user_id');
  res.redirect ('/urls/');
});

//user stores user info and passes it into the global users object + checks if user exists before registration
app.post ('/register', (req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    return res.status (400).send ('Enter email or password!');
  }
  if (getUserByEmail (req.body.email, users)) {
    return res.status (400).send ('Email Already Taken');
  }
  const user_id = generateRandomString ();
  const user = {
    id: user_id,
    email: req.body.email,
    password: bcryptjs.hashSync (password, 10),
  };
  users[user_id] = user;
  res.cookie ('user_id', user_id);
  res.redirect ('/urls');
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

/* 
BUGS TO FIX:
ugly login and register layout
ugly logout layout when logged in
returns object object
login bug shows password doesnt match when correct password entered
doesnt show username email when logged in
missing user id email in header
new url creation leads to edit page instead of submitting straight to url list page*idk if right*
*/
