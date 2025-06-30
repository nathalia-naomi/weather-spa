const db = require('../config/database');

const Weather = {
  async logSearch(entry) {
    return db('weather').insert(entry);
  },

  async getAllLogsByUser(user_id) {
    return db('weather').where({ user_id }).orderBy('created_at', 'desc');
  },
};

module.exports = Weather;
