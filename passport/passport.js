const passport = require("passport");
const userController = require("../controller");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const oauth=passport.use(
  new GoogleStrategy(
    {
      callbackURL: "http://localhost:5000/auth/google/callback",
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      scope:"https://www.googleapis.com/auth/calendar"
    },
    async (accessToken, refreshToken, profile, done) => {
      const id = profile.id;
      const email = profile.emails[0].value;
      const firstName = profile.name.givenName;
      const lastName = profile.name.familyName;
      const profilePhoto = profile.photos[0].value;
      const source = "google";
      const identifier =profile.name.givenName+profile.name.familyName;
      const accessT=accessToken;
      const refreshT=refreshToken;
      
      // refreshToken;

      console.log("refreshtoke",refreshT,+ "acccess toke", accessT )

      const currentUser = await userController.getUserByEmail({
        email,
      });

      if (!currentUser) {
        const newUser = await userController.addGoogleUser({
          id,
          email,
          firstName,
          lastName,
          profilePhoto,
          identifier,
          accessT,
          refreshT,
          
        });
        return done(null, newUser);
      }

      if (currentUser.source != "google") {
        //return error
        return done(null, false, {
          message: `You have previously signed up with a different signin method`,
        });
      }

      currentUser.lastVisited = new Date();
      return done(null, currentUser);
    }
  )
);



module.exports={oauth}
