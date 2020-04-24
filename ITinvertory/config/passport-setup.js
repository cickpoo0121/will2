const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const key = require("./key")
const mysql = require("mysql");
const config = require("../dbConfig");
const con = mysql.createConnection(config);
// const checkDB="";

passport.serializeUser((user,done)=>{
    // console.log(user)
    done (null,user);
})

passport.deserializeUser((id,done)=>{
    //TODO: generally, you must query for id in DB
    // done(null,id);
    con.query('SELECT * FROM workingyear WHERE email="'+id.email+'"',function(err,rows){
        
        if(err){
            
            // return redirect("/auth/login");
            return done(err)
        }
        else{
            if(rows.length==1){
                done(null, id);
            }
            else{
                return done(null,false)
            }
        }	
        
    });
       
})


passport.use(
    new GoogleStrategy(
        {
            clientID: key.google.clientID,
            clientSecret: key.google.clientSecret,
            callbackURL: "/auth/google/redirect"
        },
        (accessToken, refreshToken, profile, done) => {
            // console.log(profile)
            // console.log(profile.displayName)
            // console.log(profile.emails[0].value);
            // console.log(profile.photos[0].value);

            const user = { name: profile.displayName, email: profile.emails[0].value, photo: profile.photos[0].value };

            done(null,user)

        })
);