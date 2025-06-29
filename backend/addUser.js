const db = require('./src/config/database');
const bcrypt = require('bcrypt');

(async () => {
  const username = 'user';
  const password = 'fullstack';

  const existing = await db('users').where({ username }).first();
  if (existing) {
    console.log('Usuário já existe.');
    process.exit();
  }

  const hashed = await bcrypt.hash(password, 10);

  await db('users').insert({ username, password: hashed });

  console.log('Usuário inserido com sucesso.');
  process.exit();
})();
