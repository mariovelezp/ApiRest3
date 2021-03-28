
const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('../validation')

router.post('/register', async (req, res) => {
    //LETS VALIDATE THE DATA BEFORE WE A USER
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)    

    //Checkig if the user is alredy in the database
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send('Email alredy exists')

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password : hashPassword 
      //password : req.body.password
    });

    try{
       const savedUser = await user.save();
       //res.send(savedUser);
       res.send({ user: user._id });
    }catch(err){
       res.status(400).send(err);
    }
})

router.post('/login', async (req, res) => {
    //LETS VALIDATE THE DATA BEFORE WE A USER
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)    

    //Checkig if the email exists
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Email is not found')
    //Password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid password');

    //Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
    //res.send('¡Logged in!');
 })


module.exports = router;
