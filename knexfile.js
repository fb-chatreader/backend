const localPgConnection = {
    host: 'localhost',
    database: 'lambda',
    user: 'vance',
    password: 'pass'
};

const dbConnection = process.env.DATABASE_URL || localPgConnection;

module.exports = {
    development: {
        client: 'postgresql',
        connection: {
            database: process.env.dbConnection
        },
        useNullAsDefault: true,
        migrations: {
            directory: './routes/data/migrations'
        },
        seeds: {
            directory: './routes/data/seeds'
        },
    },
    production: {
        client: 'pg',
        connection: dbConnection,
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './routes/data/migrations'
        },
        seeds: {
            directory: './routes/data/seeds'
        },
        useNullAsDefault: true
    }
};