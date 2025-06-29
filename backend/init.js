const db = require('./src/config/database');
const bcrypt = require('bcrypt');

(async () => {
  await db.schema.dropTableIfExists('users');
  await db.schema.dropTableIfExists('weather');

  await db.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.string('username').unique();
    t.string('password');
  });

  await db.schema.createTable('weather', (t) => {
    t.increments('id').primary();
    t.string('city');
    t.float('temperature');
    t.string('condition');
    t.timestamp('created_at');
    t.integer('user_id').references('id').inTable('users');
  });

  const passwordHash = await bcrypt.hash('senha123', 10);
  await db('users').insert({ username: 'admin', password: passwordHash });

  console.log('Banco inicializado.');
  process.exit();
})();
