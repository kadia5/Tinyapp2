const {assert} = require ('chai');

const {getUserByEmail} = require ('../helpers.js');

const testUsers = {
  userRandomID: {
    id: 'userRandomID',
    email: 'user@example.com',
    password: '1',
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: '2',
  },
};

describe ('getUserByEmail', function () {
  it ('should return a user with valid email', function () {
    const user = getUserByEmail ('user@example.com', testUsers);
    const expectedOutput = 'userRandomID';
    assert(user, 'expectedOutput', 'Yay! this user exists!');
  });
  it ('should return a user with non-existent email with undefined', function () {
    const user = getUserByEmail ('use@example.com', testUsers);
    const expectedOutput = 'undefined'; 
    assert.notEqual(user, expectedOutput, 'Uh-oh! this user doesn\'t exist!');

  });
});
