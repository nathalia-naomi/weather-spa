const db = require('../config/database');

const User = {
  async findByUsername(username) {
    return db('users').where({ username }).first();
  },
};

module.exports = User;
