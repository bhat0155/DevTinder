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

- Diving Into the APIs
- app.use(()=> this will run on every request)

- Data sanitisation and schema validation.
- We can make changes to schema such as unique, required, default
- the validate function in schema will only be applicable when we create something new and not on already created.
- do make it work on already created, we need to enable it.
- We do so by by using runvalidators in update api
- we know lowercase, trim, min, max, minlength, max length, validate functions, skills array


HW
- Explore schematype options
- add a new types of validations, req, default etc, create custom validate function for gender
- modify each field in schema
- add timestamps

API level validation
- For patch and signup, add allowed updates, put everything except email and user id.
- Take the userid through params
- map through the returned object and check whether it contains email and user id.
 bool ->object.keys(data).every((l)=>allowedUpdates.includes(l))
- if it does, throw an error
- Install npm library validator


- Never trust req.body. Always add validations
- Encrypting the password
- create a new validateSignUpData in utils, write logic and require it in the main app.
- for signup, first do validation of data, then encrypt the password.
- For validation, first check if firstname and lastname exist, then check the length, then check password and email accuracy
- Test validation individually
-  The next step is of encryption
- install bcrypt
- Creating login api
- first check if user with the emailid exist.
- if it does, check if the passwords match 

- Authentication, JWT and cookies
- Whenever a user logs in, a jwt is created, which is stored in a cookie and sent to the user by the server.
- For every subsequent request by the user, the particular cookie is sent to the server, authenticated and request is fulfilled.

// steps
- create a jwt token, attach it in a cookie and send it back in response to the user.
- make cookie with the help of express.
- We read the cookie with the help of a cookie parser. It's a middleware just like express.json();
- To create jwt, npm jsonwebtoken. jwt.sign and jwt.verify. Do in login api
- validate the token in /profile api

JWT tokens
- JWT tokens are divided into 3 parts: header, payload, signature.

HW
- install cookie parser 
- send a dummy cookie to user
- create profile api and check if you get cookie back, res.cookie
- In login API, create jwt token. use jsonwebtoken
- create jwt in /login and send it in cookie
- read cookies in profile api and find logged in user.