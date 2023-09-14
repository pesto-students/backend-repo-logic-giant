require('dotenv').config()
const { googleapis, google } = require('googleapis')
// const dayjs = require("dayjs")
const { uuid } = require('uuidv4')
const mongoose = require("mongoose")
const Event= require("./models/eventSchema")
const db=require("./db/db")
// const signup=require('./routes/SignUp')

const express= require("express")




const oauth2client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL


)

const SCOPE = 'https://www.googleapis.com/auth/calendar'

const calendar = google.calendar({
    version: "v3",
    auth: oauth2client
})

const app = express()

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.get('/', (req, res) => {

    res.send("this is working")
})

// app.use('/',signup)




app.get("/createEvents", (req, res) => {

    const url = oauth2client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPE
    })


    res.redirect(url);

})

app.get('/google/redirect', async (req, res) => {

    const code = req.query.code

    const { tokens } = await oauth2client.getToken(code)
    oauth2client.setCredentials(tokens)

    console.log(tokens)

    res.redirect('/dashboard')
})

app.get("/dashboard", (req, res)=>{

    res.send("this is dashboard page ")
})
      
const userdb= require("./models/userSchema")
const eventdb= require("./models/eventSchema")


app.get('/user/:identifier/events/:eventIdentifier', async (req, res)=>{

    const UserIdentifier = req.params.identifier;
    const Eidentifier= req.params.eventIdentifier;

    const eventData= req.body;

    try {
        const event = await userdb.findOneAndUpdate(
            { identifier: UserIdentifier },
            
          ) && await eventdb.findOneAndUpdate (
            {eventIdentifier:Eidentifier},
            

            res.send(`the identifier located ${UserIdentifier} and event is ${Eidentifier}`),
            res.redirect('http://localhost300:/scheduleEvent')
          )
        
    } catch (error) {
        console.log("error while finding the indentifier")
    }

})
app.post('/scheduleEvent', async (req, res) => {

      calendar.events.insert(
        {
            calendarId: "abhii.raj19@gmail.com",
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
               
            
                   


            }
               

            


            
        
         


)

res.send("the event is created")
})

app.listen(3000, () => {

    console.log("server is running")
})