const getUserByEmail = function (inputEmail, users) {
  for (let key in users) {
    if (users[key].email == inputEmail) {
      return users[key];
    }
  }
  return false;
};

module.exports = { getUserByEmail };