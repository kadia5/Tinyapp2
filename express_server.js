const express = require ('express');
const {getUserByEmail, generateRandomString} = require ('./helpers');
const bodyParser = require ('body-parser');
const cookieSession = require ('cookie-session');
const bcryptjs = require ('bcryptjs');
const app = express ();
const PORT = 8080; // default port 8080
const password = '1'; // found in the req.params object
const hashedPassword = bcryptjs.hashSync (password, 10);

app.use (bodyParser.urlencoded ({extended: true}));
app.use (cookieSession ({name: 'session', keys: ['key']}));
app.set ('view engine', 'ejs');

//_________USERS OBJECT________________________________________________

//"Stores and accesses users
const users = {
  userRandomID: {
    id: 'userRandomID',
    email: 'user@example.com',
    password: bcryptjs.hashSync ('1', 10),
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: bcryptjs.hashSync ('2', 10),
  },
};

// ________URL Database________________________________________________

const urlDatabase = {
  b6UTxQ: {
    longURL: 'https://www.tsn.ca',
    userID: 'aJ48lW',
  },
  i3BoGr: {
    longURL: 'https://www.google.ca',
    userID: 'aJ48lW',
  },
};


// ________ALL * GET * REQUESTS START HERE_____________________________


//redirects to urls page or login page when not logged in
app.get ('/', (req, res) => {
  const user_id = req.session.user_id;
  if (!user) {
    res.redirect ('/login');
  } else {
    res.redirect ('/urls');
  }
});

//adds a new endpoint ex. localhost8080/urls.json that displays a json string
app.get ('/urls.json', (req, res) => {
  res.json (urlDatabase);
});

//adds html code to a new enpoint to display string Hello World
app.get ('/hello', (req, res) => {
  res.send ('<html><body>Hello <b>World</b></body></html>\n');
});

//keep track of all the URLs and their shortened forms, corresp to all urls in urls_index.ejs
app.get ('/urls', (req, res) => {
  const user_id = req.session.user_id;

  if (!user_id) {
    res.redirect ('/login');
  } else {
    let filteredUrls = {};

    for (const url in urlDatabase) {
      if (urlDatabase[url].userID === user_id) {
        filteredUrls[url] = urlDatabase[url];
      }
    }
    const templateVars = {urls: filteredUrls, user: users[user_id]};
    //passes url data to template
    res.render ('urls_index', templateVars);
  }
});

//Used to submit URLs to be shortened or make new urls
app.get ('/urls/new', (req, res) => {
  const longURL = req.params.longURL;
  const user_id = req.session.user_id;
  const templateVars = {user: users[user_id]};
  res.render ('urls_new', templateVars);
});

//Displays users urls when logged in
app.get ('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const user_id = req.session.user_id;
  if (urlDatabase[shortURL].userID !== user_id) {
    res.send ('These Do Not Belong To You');
  }
  const templateVars = {
    shortURL: shortURL,
    longURL: urlDatabase[shortURL].longURL,
    user: users[user_id],
  };

  res.render ('urls_show', templateVars);
});

//generate a link that redirects to the appropriate longURL
app.get ('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  if (!longURL.includes ('http://')) {
    longURL = 'http://' + longURL;
  }
  res.redirect (longURL);
});

app.get ('/login', (req, res) => {
  const user_id = req.session.user_id;
  const templateVars = {urls: urlDatabase, user: req.session.user};
  res.render ('urls_login', templateVars);
});

app.get ('/register', (req, res) => {
  const user_id = req.session.user_id;
  const templateVars = {urls: urlDatabase, user: req.session.user};
  res.render ('urls_register', templateVars);
});


// __________ALL * POST * REQUESTS START HERE__________________________


//generates a random string when redirectd to urls/shorturls
app.post ('/urls', (req, res) => {
  const shortURL = generateRandomString ();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id,
  };

  res.redirect (`/urls/${shortURL}`); // Respond with 'Ok' (we will replace this)
});

//lets you EDIT a posted link when logged in
app.post ('/urls/:shortURL', (req, res) => {
  const user_id = req.session.user_id;
  if (!user_id) {
    res.redirect ('/login');
  }
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL].longURL = req.body.url;
  res.redirect ('/urls/');
});

//lets you delete a posted url
app.post ('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  const user_id = req.session.user_id;
  if (user_id) {
    delete urlDatabase[shortURL];
  }
  res.redirect ('/urls');
});

//templateVar will set and define user in all other areas.
app.post ('/login', (req, res) => {
  if (req.body.user_id === '' || req.body.password === '') {
    return res.status (403).send ('Enter email or password!');
  }
  if (getUserByEmail (req.body.email, users)) {
    let user = getUserByEmail (req.body.email, users);
    let checkPassword = bcryptjs.compareSync (req.body.password, user.password);

    if (!checkPassword) {
      return res.status (403).send ("Password doesn't match");
    }
    req.session.user_id = user.id;
    res.redirect (`/urls/`);
  } else {
    return res.status (403).send ("Email or password doesn't match");
  }
});

app.post ('/logout', (req, res) => {
  req.session.user_id = '';
  res.redirect ('/urls/');
});

//Stores user info and passes it into the global users object/checks if user exists before registration
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
  req.session.user_id = user_id;
  res.redirect ('/urls');
});


//_____________________________________________________________________

//listens to port
app.listen (PORT, () => {
  console.log (`Example app listening on port ${PORT}!`);
});
