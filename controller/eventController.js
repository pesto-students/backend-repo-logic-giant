const mongoose =require("mongoose");
const Eventdb =require("../models/eventSchema")


const eventDetails= async (req, res, next)=>{


    try {

        new Eventdb ({
            // userId: req.user,
            EventName : req.body.EventName, 
            start :req.body.start,
            end : req.body.end, 
            eventIdentifier:req.body.EventName,

           
        })
        .save()

        .then(result => {

            res.status(200).json({
                message: "event saved",
                useris: result,
            })
        })

        .catch(error => {
            console.log("could not save the event in DB", error)
        })
        
    }

    catch(err){

        console.log("could not save event ",err)

    }

     
}

module.exports ={eventDetails}


