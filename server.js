require("dotenv").config();
const cookieParser =require("cookie-parser")
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session=require("express-session")
const flash= require("express-flash")
const User =require("./models/userModel")
const { googleapis, google } = require('googleapis')
const oauth= require("./passport/passport")

const file= require("./Calenkey.json")
const signup =require("./routes/SignUp")
const slotsRoute=require("./routes/slots")

const cors=require("cors")
// 


const db=require("./db/db")

app.use(bodyParser.json());

app.use(express.urlencoded({extended:true}));
app.use(express.json());
// app.engine("html", require("ejs").renderFile);
// app.use(express.static(__dirname + "/public"));

// app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // This allows cookies to be sent back and forth
}));

app.use('/',signup)

app.use('/',slotsRoute)

app.use(session({

  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use(flash())



//...
const passport = require("passport");
const { calendar } = require("googleapis/build/src/apis/calendar");

require("./passport/passport");
require("./passport/configuration")

//...

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile","email","https://www.googleapis.com/auth/calendar"],
    accessType: 'offline',
     approvalPrompt: 'force' ,
  }),

);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    
    failureRedirect: "/",
    successRedirect: "http://localhost:3000/landing",
    failureFlash: true,
    successFlash: "Successfully logged in!",
    
  }),

  // async (req, res)=>{

  //   const code = req.query.code

  //   const { tokens } = await oauth.getToken(code)
  //   oauth.setCredentials(tokens)
  //   res.redirect('/profile')
  // }
);

// const auth = new google.auth.JWT({
//   keyFile:'./Calenkey.json',
//   scopes: ["https://www.googleapis.com/auth/calendar"],
// });


const oauth2client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "http://localhost:5000/auth/google/callback",
  

)

// oauth2client.setCredentials({

//   access_token: "ya29.a0AfB_byBchN1WEOZdrJ-zI3DI18z_XwVoMu8f7EdInqGWeGGfHQO679AE_XS2l4nwJ8u4n36ZJLYTtkyv6adEnsNjhEJRzqJrWdrU2d1WQyT4Fw9HJqJWCMgANfFteEA-whTj-gWF5ju4mVawSv5fulfZUKxRNY6Os3CQWQaCgYKAXMSARESFQHsvYls8zNj7ehCEd-uVH0KrXtkzA0173",

//   refresh_token:"1//0gesbObhimRVGCgYIARAAGBASNwF-L9Ir5xJm9eopraZqkH02jHZfm7jFUmG0HB6AvT_aiGj5VoS48STMK4-KXpSxfQvY6HA8bzg"
// })

const cal = google.calendar({
  version: "v3",
 

})





app.post("/user/:identifier", async(req,res)=>{


  const userId= req.params.identifier;

  try {
    const user = await User.findOneAndUpdate({

      identifier:userId,})


      if(!user){

        console.log("no user found")
      }

     else{

      console.log(user)
    // res.json({
    //   user:user
    // })}  
    oauth2client.setCredentials({

      
    
      refresh_token:user.refreshT
    })
      
        
      cal.events.insert(
        {
            calendarId: "primary",
             auth:oauth2client,
            conferenceDataVersion: 1,
            sendNotifications:true,
            requestBody: {
                summary: req.body.summary,
                description: req.body.description,
                start: {
                  dateTime: req.body.start,
                  timeZone: 'GMT-03:00',
                },
                end: {
                  dateTime: req.body.end,
                  timeZone: 'GMT-03:00',
                },

                conferenceData: {
                    createRequest: {
                        requestId: "thisisrandomkey",
                    }
                },
        
                attendees:[{
                    email:req.body.attendees[0].email
                }]
            },
               
            
     })

     console.log("event created")

     res.send("event created")
    }
      
    
  } catch (error) {
    console.log("cant get user",error)
  }

})

//get token using refresh token 

app.get("/gettoken/user/:identifier", async (req, res) => {
  const userId= req.params.identifier;

 
  try {

    const user = await User.findOneAndUpdate({

      identifier:userId,})


      const refresh= user.refreshT
    const request = await fetch("https://www.googleapis.com/oauth2/v4/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: refresh,
        grant_type: "refresh_token",
      }),
    });

    const data = await request.json();
    console.log("server 74 | data", data);

    res.json({
      user,
      accessToken: data.access_token,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});







app.listen(5000, function () {
  console.log("SaaSBase Authentication Server listening on port 5000");
});
