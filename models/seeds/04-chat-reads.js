exports.seed = function(knex, Promise) {
    return knex('chat_reads')
    .del()
    .then(function() {
        return knex('chat_reads').insert([
            {
                user_id: 1,
                book_id: 1,
                review: 'This was a great read!',
                
            }
        ])
    })
}