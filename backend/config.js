const config = {
  port: 1337,
  postgre: {
    config: {
      user: "postgres", //env var: PGUSER
      database: "postgres", //env var: PGDATABASE
      password: "123456789", //env var: PGPASSWORD
      host: "localhost", // Server hosting the postgres database
    },
    schema: "astronauts"
  }
}


export default config
