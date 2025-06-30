const db = require('../config/database');

const Favorite = {
	async add(user_id, city, temperature, condition) {
		const existing = await db('favorites').where({ user_id, city }).first();
		if (existing) {
			return db('favorites').where({ user_id, city }).update({ temperature, condition, updated_at: new Date() });
		}
		return db('favorites').insert({
			user_id,
			city,
			temperature,
			condition,
			updated_at: new Date(),
		});
	},

	async getByUser(user_id) {
		return db('favorites').where({ user_id }).orderBy('updated_at', 'desc');
	},

	async remove(user_id, city) {
		return db('favorites').where({ user_id, city }).del();
	},

	async update(user_id, city, temperature, condition) {
		return db('favorites').where({ user_id, city }).update({
			temperature,
			condition,
			updated_at: new Date(),
		});
	},
};

module.exports = Favorite;
