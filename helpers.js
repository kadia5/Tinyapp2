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

const getUserByEmail = function (inputEmail, users) {
  for (let key in users) {
    if (users[key].email == inputEmail) {
      return users[key];
    }
  }
  return false;
};

module.exports = {getUserByEmail, generateRandomString};
