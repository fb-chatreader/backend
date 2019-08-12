const localPgConnection = {
    host: 'localhost',
    database: 'lambda',
    user: 'vance',
    password: 'pass'
};

const dbConnection = process.env.DATABASE_URL || localPgConnection;

