//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Mongoose connection 
mongoose.connect("mongodb://0.0.0.0:27017/userdb");

// Mongoose schema

const userSchema = new mongoose.Schema({
    email:String,
    password:String
})

const secret = (process.env.SECRET)
userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});

// Mongoose Model

const User = mongoose.model("users",userSchema);

// Server code

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.get("/secrets",(req,res)=>{
    res.render("secrets");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.post("/register",async (req,res)=>{
    const userName = req.body.username;
    const userPassword = req.body.password;

    const newUser = new User({
        email:userName,
        password:userPassword
    });

    await newUser.save();
    res.redirect("/secrets");    
});
app.post("/login",async (req,res)=>{
    const userName = req.body.username;
    const userPassword = req.body.password;

        const checkEmail = await User.findOne({email:userName});

    if (checkEmail !== null) {
        if (userPassword === checkEmail.password) {
            res.redirect("secrets");
        }else{
            res.redirect("login")
        }
    }else{
        res.render("login");
    }



})

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});