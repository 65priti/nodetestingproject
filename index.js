require('dotenv').config();

const express = require('express');
const path = require('path');
const connectDb = require('./config/db');
const session = require("express-session");
const adminRoutes = require('./routes/adminRoutes');
const uiRouters = require('./routes/uiRoutes');


const app = express();

// calling database for connection 
connectDb();

// Middlewares for parsing data
app.use(express.json());
app.use(express.urlencoded({extended:true}));


// middlewares have to add in every route for checking the next navigation move 
app.use(
  session({
    secret: "MySuperLongAndComplexSecretKeyForEduVerse123", 
    resave: false, 
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } 
  })
);


// Static files and view engine initial configurations
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

// use admin routes using /admin-api
app.use('/admin-api', adminRoutes);
app.use('/',uiRouters);

app.get('/',(req,res)=>{
  res.send('EduVerse Server is running smoothly');
})






const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log('server is running');
})

