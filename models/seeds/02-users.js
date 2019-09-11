exports.seed = function(knex) {
	// delete all existing entries
	return knex('users').insert([
		{
			facebook_id: 111468236903301
		}
	]);
};
