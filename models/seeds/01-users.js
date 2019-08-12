exports.seed = function(knex, Promise) {
    // delete all existing entries
    return knex('users')
    .del()
    .then(function() {
        return knex('users').insert([
            {
                user_id:'1',
                
            }
        ])
    })
}