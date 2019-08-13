exports.seed = function(knex, Promise) {
    // delete all existing entries
    return knex('users')
    .del()
    .then(function() {
        return knex('users').insert([
            {
                facebook_id:'1',
            },
            {
                facebook_id:'1',
            }
        ])
    })
}