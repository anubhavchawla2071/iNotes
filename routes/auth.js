const express = require("express");
const Users = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { body, validationResult } = require("express-validator");
const router = express.Router();
const fetchuser=require("../middleware/fetchuser")

// Route 1: create a user using POST "api/auth/createuser"
router.post(
  "/createuser",
  [
    body("name", "Name should be of minimum 3 characters").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "password should be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    try {
      // check whether user already exists
      let user = await Users.findOne({ email: req.body.email });
      if (user) {
        success=false;
        return res.status(400).json({ error: "Sorry a user with this email already exists" });
      }

      //hashing pasword
      const salt = await bcrypt.genSalt(10);
      const secPass= await bcrypt.hash(req.body.password,salt);

      //adding user to database
      user = await Users.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data ={
        user:{
          id:user.id
        }
      }
      const authToken = jwt.sign(data, 'sweetchildomine');
      console.log(authToken);
      success=true;
      res.json({success,authToken})
      // res.send(user);
      // .then((user) => res.json(user))
      // .catch((err) => {
      //   console.log(err);
      //   res.send("enter a valid email");
      // });
    } catch (error) {
      // If there are errors return bad request
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// Route 2: authenticate a user using POST "api/auth/login"

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password should be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {email,password}=req.body;
      try {
        let user =await Users.findOne({email});
        if(!user){
          success=false;
          return res.status(400).json({success,error:"Sorry, User does not exist"});
        }
         
        const passComp=await bcrypt.compare(password,user.password);
        if(!passComp){
          success=false;
          return res.status(400).json({success,error:"Invalid password!"});
        }

        const data={
          user:{
            id:user.id
          }
        }
        const authToken = jwt.sign(data, 'sweetchildomine');
        success=true;
        return res.json({success,authToken});

      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
      }
  }
);

// Route 3: get a user using POST "api/auth/getuser"

router.post(
  "/getuser",fetchuser,
  async (req, res) => {
    try {
      const userId=req.user.id;
      const user=await Users.findById(userId).select('-password');
      res.send(user);
    } catch (error) {
      console.error(error.message);
        res.status(500).send("Internal server error");
    }

    }
);

module.exports = router;
