Dev Tinder# DevTinder

- Router and request handlers
- Order of routes matter a lot
- We use postman to test apis
- app.use will match all HTTP methods of API
- app.get will only match GET HTTP method of API
- regex= ?,+,*, .*fly&, 
- req.query is extracting via postman (url?)
- req.params is for dynamic routing, extracts through route.
- : means dynamic route

Route Handlers and middlewares
- If res.send does not exist, it goes to infinite loop
- There can be multiple route handlers in the options
- if we need to send the response to the next request handler, then we need to use next();
- the first res.send() is sent. Request is made, TCP connection is made, server sends response, connection ends. 
- Headers which are already sent to the client cannot be changed.
- if next is called in last route handler, it will throw an error as express is expecting another route handler.
- if next is not present, it will go in infinite loop.

- to do
- create multiple route handlers
- play with the code
- put the routes in an array

-Express checks all the routes with the api and goes downward, if we do app.use at top with matching api(/),
it will match with everything and everyone.
- So the express goes through a middleware chain until it meets the request handler.


- to do
- write a dummy auth middleware for /admin
- write a dummy auth middleware for /user except /user/login

- database
- make a config folder
- create database.js
- import mongoose and connect via async
- Make database connection first and then start listening to the port.

- schema - what all things we can store in collection
- create models folder, inside create user.js, basically create user schem
- Look for syntax in the documentation


- Creating an api to update user
- use post API to sign up the user
- create a new instance of the user model by creating dummy obj
-once you add, do await user.save 