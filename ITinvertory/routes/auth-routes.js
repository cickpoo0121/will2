const router = require("express").Router();
const passport = require("passport");

//show login page
router.get("/login", (req, res) => {
    res.render("Login.ejs", { user: req.user });
});

//login using Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

//if login success, redirect here
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    // res.send("Login OK, show profile");
    // res.send(req.user);
    // res.redirect("/committeefirstpage");
    res.redirect("/path");
    // res.redirect("/product/testgoogle");

});

//log out
router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
})

module.exports = router;