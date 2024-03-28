const express = require('express');
const router = express.Router();


let users = [
    {
        firstName: "John",
        lastName: "wick",
        email:"johnwick@gmail.com",
        DOB:"22-01-1990",
    },
    {
        firstName: "John",
        lastName: "smith",
        email:"johnsmith@gmail.com",
        DOB:"21-07-1983",
    },
    {
        firstName: "Joyal",
        lastName: "white",
        email:"joyalwhite@gmail.com",
        DOB:"21-03-1989",
    },
];

// GET request: Retrieve all users
router.get("/",(req,res)=>{
    res.send(JSON.stringify({users},null,4)); //res.send(users); To make the output more readable, you can use the JSON stringify method
}); // You will first add an API endpoint, using the get method for getting the details of all users.

// GET by specific ID request: Retrieve a single user with email ID
router.get("/:email",(req,res)=>{
    const email = req.params.email;
    let filtered_users = users.filter((user) => user.email === email);
    res.send(filtered_users); //Implement a get method for getting the details of a specific user based on their email ID by using the filter method on the user collection.
    // 'localhost:5000/user/johnsmith@gamil.com' to retrieve a specific user w their email.
});

// Endpoint for getting a particular user by their lastName;
// Filter `lastName` from the `users` array.
router.get("/lastName/:lastName", (req,res)=>{
    const lastName = req.params.lastName;
    let filtered_lastName = users.filter((user) => user.lastName === lastName);
    res.send(filtered_lastname);
})

// Endpoint for getting a particular user by their DOB;
// Split the DOB and convert it to yyyy/mm/dd format & then sort it.
function getDateFromString(strDate) {
    let [dd,mm,yyyy] = strDate.split('-')
    return new Date(yyyy+"/"+mm+"/"+dd);
}
    
// console.log(sorted_users);
router.get("/sort",(req,res)=>{
    let sorted_users=users.sort(function(a, b) {
        let d1 = getDateFromString(a.DOB);
        let d2 = getDateFromString(b.DOB);
            return d1-d2;
          });
    res.send(sorted_users);
});

// POST request: Create a new user
router.post("/",(req,res)=>{
    users.push({"firstName":req.query.firstName,"lastName":req.query.lastName,"email":req.query.email,"DOB":req.query.DOB});
    res.send("The user" + (' ')+ (req.query.firstName) + " Has been added!")
}); // We've implemented the /user endpoint with the POST method to create a user and add the user to the list. We created the user object as a dictionary.


// PUT request: Update the details of a user by email ID
router.put("/:email", (req, res) => { // To make updates in the data, you will use the PUT method.
  const email = req.params.email; //You should first look at the user with the specified email id and then modify it.
  let filtered_users = users.filter((user) => user.email === email);
  if (filtered_users.length > 0) {
    let filtered_user = filtered_users[0];
    let DOB = req.query.DOB;
    let firstName = req.query.firstName;
    let lastName = req.query.lastName;
    //if the DOB has changed
    if(DOB) {
        filtered_user.DOB = DOB
    }
    if(firstName) {
        filtered_user.firstName = firstName
    }
    if(lastName) {
        filtered_user.lastName = lastName
    }
    users = users.filter((user) => user.email != email);
    users.push(filtered_user);
    res.send(`User with the email  ${email} updated.`);
  }
  else{
    res.send("Unable to find user!");
  }
}); /* Run [curl --request PUT 'localhost:5000/user/johnsmith@gamil.com?DOB=1/1/1971'] in another terminal to implement Put request.
        Then [localhost:5000/user/johnsmith@gamil.com] in the browser to view updates*/


// DELETE request: Delete a user by email ID
router.delete("/:email", (req, res) => {
    const email = req.params.email;
    users = users.filter((user) => user.email != email);
    res.send(`User with the email  ${email} deleted.`);
});

module.exports=router;
