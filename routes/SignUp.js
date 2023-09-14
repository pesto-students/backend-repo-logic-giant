const app = require('express');
const router = app.Router();
const userController= require ("../controller/userController")
const eventController =require("../controller/eventController")


// router.post('/signup', userController.UserData);

router.post('/createEvent', eventController.eventDetails)


module.exports= router