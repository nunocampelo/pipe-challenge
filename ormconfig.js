require('dotenv/config')

const dbConfigByEnv = {
   production: {
      type: 'postgres',
      host: '192.168.99.100',
      port: 5432,
      username: 'postgres',
      password: 'changeme',
      database: 'pipe_challenge',
      dropSchema: false,
      synchronize: false,
      logging: false,
      entities: [
         'dist/domain/*/entity/*.js'
      ],
      migrations: [
         'dist/migration/**/*.js'
      ],
      subscribers: [
         'dist/subscriber/**/*.js'
      ],
      cli: {
         entitiesDir: 'dist/domain',
         migrationsDir: 'dist/migration',
         subscribersDir: 'dist/subscriber'
      }
   },
   test: {
      type: 'sqlite',
      host: 'localhost',
      port: 5432,
      database: ':memory:',
      dropSchema: true,
      synchronize: true,
      logging: false,
      entities: [
         'src/domain/*/entity/*.ts'
      ],
      migrations: [
         'src/migration/**/*.ts'
      ],
      subscribers: [
         'src/subscriber/**/*.ts'
      ],
      cli: {
         entitiesDir: 'src/domain',
         migrationsDir: 'src/migration',
         subscribersDir: 'src/subscriber'
      }
   },
   development: {
      type: 'postgres',
      host: '192.168.99.100',
      port: 5432,
      username: 'postgres',
      password: 'changeme',
      database: 'pipe_challenge',
      dropSchema: false,
      synchronize: true,
      logging: true,
      entities: [
         'src/domain/*/entity/*.ts'
      ],
      migrations: [
         'src/migration/**/*.ts'
      ],
      subscribers: [
         'src/subscriber/**/*.ts'
      ],
      cli: {
         entitiesDir: 'src/domain',
         migrationsDir: 'src/migration',
         subscribersDir: 'src/subscriber'
      }
   },
   install: {
      type: 'postgres',
      host: '192.168.99.100',
      username: 'postgres',
      password: 'changeme',
      port: 5432,
      dropSchema: false,
      synchronize: true,
      logging: true,
   },
}

module.exports = dbConfigByEnv[process.env.NODE_ENV || 'production']