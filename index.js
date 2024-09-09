const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const passport = require("passport")
const session = require("express-session")
const oAuth2Startegy = require("passport-google-oauth2").Strategy;
const User = require("./model/UserSchema")


require("dotenv").config()
app.use(express.json())
app.use(cors({origin:"*"}))

mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("Mongodb is connected successfully");
    
})
.catch((error)=>{
    console.error("Error occured while connecting mongodb", error);
    
})

//  setup session 
app.use(session({
    secret : "4b6u543v4768gre654evbt34btsbyuk",
    resave : false,
    saveUninitialized : true
}))


// setup passport 
app.use(passport.initialize())
app.use(passport.session())


passport.use(
    new  oAuth2Startegy({
        clientID:process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET,
        callbackURL:"/auth/google/callback",
        scope : ["profile" , "email"]
    },
async (accessToken , refreshToken, profile, done) => {
    try {
        let user = await User.findOne({googleId : profile.id})
        if(!user){
            user = new User({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,  // Check if emails exist
                image: profile.photos && profile.photos[0] ? profile.photos[0].value : null   // Check if photos exist
            });
            

            await user.save();
        }

        return done(null , user)
    } catch (error) {
        return done(error , null)
    }
}
)
)


passport.serializeUser((user , done)=>{
    done(null , user)
})

passport.deserializeUser((user , done)=>{
    done(null , user)
})

 
// Define routes for Google OAuth
app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/login",
    })
  );
  
 
const port = process.env.PORT || 5000

app.listen(port ,()=>{
    console.log(`server running on port number : ${port}`);
    

})