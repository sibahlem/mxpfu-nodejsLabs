const express = require('express');
const routes = require('./routes/users.js');
const jwt = require('jsonwebtoken');
const session = require('express-session')

const app = express();
const PORT =5000;

app.use(session({secret:"fingerpint",resave: true, saveUninitialized: true})) //This tells your express app to use the session middleware.
/* secret - a random unique string key used to authenticate a session.
resave - takes a Boolean value. It enables the session to be stored back to the session store, even if the session was never modified during the request.
saveUninitialized - this allows any uninitialized session to be sent to the store. When a session is created but not modified, it is referred to as uninitialized.*/

app.use(express.json());

app.use("/user", (req,res,next)=>{
// Authentication Middleware; tells if the user is authenticated or not.
// All the endpoints starting with /user will go through this middleware.   
   if(req.session.authorization) { //It will retrieve the authorization details from the session and verify it.
       let token = req.session.authorization['accessToken']; // Access Token
       
       jwt.verify(token, "access",(err,user)=>{
           if(!err){
               req.user = user;
               next(); // If the token is validated, the user is authenticated and the control is passed on to the next endpoint handler.
           }
           else{
               return res.status(403).json({message: "User not authenticated"})
           } // If the token is invalid, the user is not authenticated and an error message is returned.
        });
    } else {
        return res.status(403).json({message: "User not logged in"})
    }
}); 

app.use("/user", routes);

app.post("/login", (req,res) => { // Implementation of the login endpoint.
    const user = req.body.user; // A user logs into the system providing a username.
    if (!user) {
        return res.status(404).json({message: "Body Empty"});
    }
    let accessToken = jwt.sign({
        data: user
      }, 'access', { expiresIn: 60 * 60 }); /* An access token that is valid for one hour is generated.
      You may observe this validty length specified by 60 * 60, which signifies the time in seconds.*/

      req.session.authorization = {
        accessToken //This access token is set into the session object to ensure that only authenticated users can access the endpoints for that length of time.
    }
    return res.status(200).send("User successfully logged in");
}); 

app.listen(PORT,()=>console.log("Server is running at port "+PORT));

// localhost:5000/user/johnsmith@gamil.com?DOB=1/1/1971'