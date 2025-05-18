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

- Auth Middleware
- We create auth middleware because we want all the apis to be secure
- read the cookies
- find the token
- find the user
- attach the user in the request, which will be transferred by next();

- helper functions in schema
- create userSchema.methods.getJWT


The list of APIs to make
AUthROuter
- POST/signup
- POST/login
- POST/logout

ProfileROuter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password


// us swiping
COnnectionRequestRouter
- POST request/send/interested/:userID we are interested
- POST request/send/ignored/:userID
- POST request/review/accepted/:userID were we accepted
- POST request/review/rejected/:userID


userRouter
- GET connections
- GET requests/recieved
- GET feed -gets you all the fields

status- ignore, interested , accepted, rejected 


Repeat
## authRouter
- POST /signup
- POST /login

## Profile Router
- GET /profile
- POST profile/edit
- POST profile/password

## connectionRequest
- POST connectionRequest/send/ignored/:userID
- POST connectionRequest/send/interested/:userID
or we can do connectionRequest/send/:status/:userID

- POST connectionRequest/receive/accepted/:userID
- POST connectionRequest/receive/rejected/:userID

## user
- GET /connections
- GET requests/recieved
- GET /feed

- creates routes folder
- create auth.js
- const authRouter=express.Router()
- use authROuter same as app.get, app.post etc
- modules.export authRouter

- repeat for everything
- import this in app.js and check on postman.

## Logic for post/logout API
- delete cookie containing jwt

## make patch/profile/edit
- create validation for login, give allowed parameter.
- in the api, loop through keys and assign the new values to the keys.


## make patch/profile/password
- Make sure the new password is strong

# ConnectionRequest
- create a new schema specifically for connection request
- In the connection Schema, we would have  fields: toUserId and fromUserID, string as enum which would have an array of accepted values,
enum:{
    values:[],
    message:""
}
- add timestamps
- Both of them would have type as mongoose.schema.types.ObjectId

- POST connectionRequest/send/interested/:userID
- Here we would be the From user ID and the person we are interested in to user id.
- We would assign fromUserID= req.user._id (auth will attach us)
- toUserID will come from our params
- here the status is interested

use common api
create new instance of new schema, add req fields and save
- check the statuses, firstly, onlu interested and ignored should be allowed
- secondly, avoid duplicate requests and if I sent req to someone, that person should
not be able to send the req back to me.
- make sure toUserID Exist in our database
- a person cannot send req to themselves
- connectionRequest.pre will be called anytime a request is saved in the DB.
- do connectionRequest.fromUserId.equals(connectionRequest.toUserId)

- we create indexes to improve the efficiency.
- Basically, mongoose will seperate the indexes while finding something.


The review API
- We can either accept or reject the connection request
- POST connectionRequest/receive/accepted/:userID
- POST connectionRequest/receive/rejected/:userID

- POST connectionRequest/receive/status/:userID
- Make the call in connectionRequestRouter
- get loggedInUser from req.user.
- Reciever should be the same person as logged in user
- Make sure the status in interested
- validate status and request id

- request id is the id of document in mongoose where one person has sent the request to other.
DRY RUN

- first we check if status is valid - allowed in accepted or rejected.
- Then we check if connection request is valid we can do it in findone
- then we findOne, where _id is connection request id,
- Make sure loggedInuser=req.user
- toUserId= loggedInUserID
- status is interested
- if we successfully find that, we modify the status to accepted and rejected

## userRouterApi
- get/user/connections
- get /user/requests
- get /user/feed

- for post api, sanitisation is very imp because changes will be made in db.
- for get api, we have to make sure, we are only sending the allowed data.

# to do
- create a new userRouter, import it in the main file
- get all the pending connection request from /n- the status should be pending.
- Once we get the data, we only get userid, but we also want to know about whom that userid belongs to.
- to do so, we need to create a "ref" at from user id and attach users to it.
- it creates a bridge between the 2 schemas
- to display infor, in validUser, do populate("fromuserid", [fields])

# Making connections API
- the status should be accepted 
- the logged in user must be either from FromUserId or toUserID

# Making feed API
- Logged in user must see cards whom he has not sent request to. (interested or ignored)
- approach filter array where status != interested/ignored or status does not exist
- or if userID exist in connections, do not show

- user should see everyone except:
- himself
- people he has sent request to.
    - includes people who accepted him
    - people he sent interested to
    - people who rejected him or he rejected

- find one and do fromuserid and touserid to himself . use.select to get only 2 fields.
- use DS set which avoids duplication. add fromuserid and touserid. save id in string format.
- hideprople=foreach((item)=> set.add(item.fromid)). do same for touserid. 
- the result will be array whose cards we dont wanna see 
- now find all people hose id is not in didepeople
- _id: nin and arrayfrom(hidepeople)
- ne: loggedInuserid
- 



- /:id params
- ?id query

- to use pagination, mongodb gives us skip() and limit();

Deployment
- open the server (paste the SSH url from aws connect)
- cd devTinder
- npm install to download dependency
- to make changes display on server, do git pull and git log
- npm run start is used to start server in production
- enable the port 3000 on the aws instance
- install pm2
- do npm start via pm2
-  pm2 start npm -- start
- debug logs = pm2 logs
- pm2 list, pm2 flush <process name>, pm2 stop <process name>, pm2 delete <process name>
- to stop process =  pm2 stop nmp (process name)
- pm2 delete npm (to delete the process)
- to change name = pm2 start npm --name "devTinder-backend" -- start

- frontend = http://3.142.174.157
- backend = http://3.142.174.157:3000/feed

- first we need to map the ip with domain name
- then for backend, we want it to run line namasteDev/api instead of namasteDev:3000/api
- We do this with tthe help of nginx proxy pass
- Make changes to nginx config
- Take config from chat gpt and make changes in nginx
- sudo nano /etc/nginx/sites-available/default
- changes server_name to ip
- add rule from gpt
- restart nginx - sudo systemctl restart nginx
- modify FE base url

# Sending Email via SES
- create IAM user
- Give access to AmazonSESFullAccess
- verify domain name
- verify email address
- install Amazon SDK - v3
- set up

# Payment Integration
- Create a payment route
- 