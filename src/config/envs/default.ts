export default {
  typeorm: {
    type: 'postgres',
    port: 5432,
    host: 'localhost',
    database: 'database',
    username: 'username',
    password: 'password',
    entities: [],
    synchronize: true,
  },
  port: 3000,
  mode: 'development',
};
