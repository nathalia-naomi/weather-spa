const db = require('./src/config/database');
const bcrypt = require('bcrypt');

(async () => {
  await db.schema.dropTableIfExists('favorites');
  await db.schema.dropTableIfExists('weather');
  await db.schema.dropTableIfExists('users');

  await db.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.string('username').unique().notNullable();
    t.string('password').notNullable();
  });

  await db.schema.createTable('weather', (t) => {
    t.increments('id').primary();
    t.string('city');
    t.float('temperature');
    t.string('condition');
    t.timestamp('created_at').defaultTo(db.fn.now());
    t.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
  });

  await db.schema.createTable('favorites', (t) => {
    t.increments('id').primary();
    t.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    t.string('city');
    t.float('temperature');
    t.string('condition');
    t.timestamp('updated_at').defaultTo(db.fn.now());
  });

  const passwordHash = await bcrypt.hash('senha123', 10);
  await db('users').insert({ username: 'admin', password: passwordHash });

  console.log('PostgreSQL pronto!');
  process.exit();
})();
