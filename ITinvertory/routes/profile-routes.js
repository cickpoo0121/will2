const router = require("express").Router();

const authCheck =(req,res,next) =>{
    //if not yet login
     if(!req.user){
        res.redirect("/auth/login");
     }
     else{
        next();
     }
}

// router.use(authCheck);

// Show profile page
// router.get("/gg",authCheck, (req, res) => {
//     console.log(req.user)
//     res.send(req.user)
//    //  res.render("profile",{user:req.user})
// })

router.get("/userinfor", (req, res) => {
   console.log(req.user)
   res.send(req.user)
   // res.render("profile",{user:req.user})
})

module.exports = router;