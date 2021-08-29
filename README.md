# Pipe challenge

This repo is a nodejs api that solves pipedrive's organisation relationships challenge.

## Usage

### Step 1 - Install & Build

Run `npm install` to install dependencies.

Run `npm run build` to build the application.

### Step 2 - Run the dependencies

This webserver connects to a postgres database an a redis server.

For your convenience I've created a docker-compose file to start these dependencies. Here is how you can use it.

Start the docker machine with:
`docker-machine start`

Run `npm run start:dep`

Create the db with `npm run pg:createdb`

Notes:
* It is assumed that docker is using the `192.168.99.100` IP;
* If for some reason the dependencies fail to start try killing the docker containers with 
`docker rm -f $(docker ps -a -q)` and starting them again afterwards.

### Step 3 - Run the server

Run `npm run start:prod` to start the application in production (uses pm).

Run `npm run start` to start the server locally.

Run `npm run dev` for local development (includes live reload).

### Step 4 - Explore the existing api

Visit ${server_host}/api/v1/docs to explore existing api endpoints

### Step 4 - Run the tests

Use `npm run test` to run the tests. 

Open [this file](coverage/lcov-report/index.html) in browser to explore the test coverage report.

## Known Issues

Test dependency sqlite3@5.0.2 has the following security vulnerabilities:
* [Arbitrary File Creation/Overwrite due to insufficient absolute path sanitization](https://npmjs.com/advisories/1770)
* [Arbitrary File Creation/Overwrite via insufficient symlink protection due to directory cache poisoning](https://npmjs.com/advisories/1771)

## References

