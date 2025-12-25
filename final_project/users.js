const users = [];

const isValidUser = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(
    user => user.username === username && user.password === password
  );
};

module.exports = { users, isValidUser, authenticatedUser };
