const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { authenticated, users, isValid } = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
});

app.post("/register",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    if(username && password) {
        if(!isValid(username)){
            users.push({"username":username,"password":password});
            return res.status(200).json({message:"User successfully registered"});
        }
        else{
            return res.status(404).json({message : "User already exist"})
        }
    }
    return res.status(404).json({message: "Unable to register user"})
})


const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
