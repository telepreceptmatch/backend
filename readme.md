#### Requirements
- Node JS
- Docker
## Installation
1. Clone this github repo
2. Create a `.env` file in the root of the project (ask me for the information of `.env` file)
3. run `npm install` on the termina
4. run the docker container with `docker-compose up -d`
	1. This command would initilialize the database in a docker container, it would also let you access it via pgadmin in `http://localhost:5050`
	2. the username and password for the database needs to be set up in the `.env` file
5. To create the tables on the database that you just created run
`npm run migrations:run`
5. Run the program with `npm run dev`
---
### Dependencies
- [boom](https://hapi.dev/module/boom "boom"): Dynamically send it http responses 
- [cors](https://www.npmjs.com/package/cors "cors"): solves cross origin problem 
- dotenv: allows for reading of the `.env` files
- [express](https://expressjs.com/http:// "express"): used to create the server and routes ([express](https://expressjs.com/http:// "express"))
- [Joi](https://joi.dev/api/ "Joi"): Handles data validation an verification.
- pg and pghstore: allows for connection to the database
- [sequlize](https://sequelize.org/v7/ "sequlize"): ORM to abstract the connection to the database
- sequelize-cli: Allows for data migrations to be handle manually.

---
### Explanations of the folders
- **config**: This folder contains the js file which takes all of the environment variables from the `.env` file
- **db**: this folder contains all of the information related with database
	- migrations: files that are used to create and modify tables.
	- models: defines the tables from the database, each model represents a table in the db
	- seeders: (would be use to add some information to the database once we advance a liitle more)
- ** libs**: Sets up the connection to the database via sequelize
- **middlewares**: middleware for error handling and validation of data (we would add a authentication middleware here)
- **routes:** We would define each router for each route and the business logic here.
- **schemas**: Joi Schemas for the verification and validation of data
- **services**: Services for the business logic (e.g retrieve data from the data base from the "users" table)


