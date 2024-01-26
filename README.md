# Backend Engineer Work Sample (original problem)

This project skeleton contains a basic Express setup one endpoint to create a user and one endpoint to fetch all users, as well as a basic empty unit test.

## Goal (original problem)
1. Adjust POST /users that it accepts a user and stores it in a database.
   * The user should have a unique id, a name, a unique email address and a creation date
2. Adjust GET /users that it returns (all) users from the database.
   * This endpoint should be able to receive a query parameter `created` which sorts users by creation date ascending or descending.

## Scripts 
`npm start` starts the server

`npm test` executes the tests

`npm run migrate:create/list/up/down` creates/lists migrations or applies/unapplies them

## Result
1. POST /users accepts a user as the request body. If additional properties are sent or the properties have values that are not allowed, the request will fail.
   * The user properties are unique "id", "name", unique "email", and "created_at" is allowed but will be ignored.
   * If the "id" or "email" values already exist in the database, the route returns 409 with an error message.
2. GET /users returns all users from the database in an unknown order
   * The "created" query parameter may be passed with value 'asc' or 'desc'. If passed, the results are sorted by creation date.

## Usage
`npm install` to install npm packages
create .env by copying from .example.env and change the MONGODB_URI to your mongo uri
make sure mongo is running if local or available otherwise
`npm run migrate:up` to run all migrations
`npm start` to run server
it will log where it's running
Enjoy!

## Comments
1. I opted to sort by an explicit created_at Date timestamp instead of using the built-in _id which would preserve creation order. This is because this property could be useful in the future, and it is easier to understand.
   * I didn't implement pagination when fetching all users for simplicity. It will become neccesary as the number of users grows.
2. The tests that connect with MongoDB use a library that runs an instance of MongoDB in memory for testing with. The main issue is that it downloads(once) a 500Mb copy of MongoDB to run locally. This could be moved to a separate repo or module so that it doesn't need to be downloaded and run by every developer unless they change that code.
   * Despite this issue, it is still the best option for testing Mongo. Better than any mock
3. Test coverage is not 100%. Almost all of the missing coverage is simple error handling in routes for unknown errors.
   * This is partly for simplicity, and also because I think it would go too far with test coverage, and make the test more difficult to understand for new engineers.
   * It would also be great to have some end-to-end tests that run the whole server and add some users and then request all users. I would add them given more time, but idealy they would be run by an external service because that would be more extensible.
4. Two similarly named migration folders "migrate" and "migrations" is confusing in my opinion. I have not been able to think of a clearer way to organize it, and I would happily change it if a good idea appears.

## Running MongoDB
`path\to\executable\mongod --port 27017 --dbpath path\to\store\data` for example can start a local instance of Mongo

