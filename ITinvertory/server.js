//<=========== Import packages ==========>
const express = require("express");
const path = require("path");
const body_parser = require("body-parser");
const mysql = require("mysql");
const config = require("./dbConfig.js");
var fs = require('fs');
var cm = require('csv-mysql');
var xlsxtojson = require("xlsx-to-json");
var xlstojson = require("xls-to-json");
const multer = require("multer");
const passport = require("passport");
// let upload = require("express-fileupload");
// const upload = require("express-fileupload");
// const cookieSession = require("cookie-session");

//import auth
const authRoutes = require("./routes/auth-routes");

const product = require("./routes/productroute");
const datealert = require("./routes/datealertroute");



const app = express();
const con = mysql.createConnection(config);
// global.__basedir = __dirname;


const storageOption = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    }
});


// const upload = multer({ storage: storageOption }).single("fileUpload");
const upload = multer({ storage: storageOption }).single("fileUpload");
// const upload1 = multer({ storage: storageOption }).array("addfileUpload");


//Middleware
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use("/img", express.static(path.join(__dirname, 'img')));
app.use("/style.css", express.static(path.join(__dirname, 'style.css')));
app.use(express.static(path.join(__dirname, "public")));
// app.use(upload());

app.use("/product", product);
app.use("/datealert", datealert);

// authen
app.use("/auth", authRoutes);

//===========================User================================//

// var filename
app.post('/uploadfile', function (req, res) {

    upload(req, res, function (err, result) {
        if (err) {
            res.status(500).send("Upload failed");
            console.log(err)
            return;
        }
        else {
            // res.send("successed")
            res.json(req.file)
            // filename = req.file.filename;
            console.log(req.file.filename)

            // xlsxtojson({
            //     // input: "./uploads/"+req.file.filename+"",
            //     input: "./uploads/1585503413369_soccer_players.xlsx",  // input xls
            //     output: "output.json", // output json
            //     lowerCaseHeaders: true
            // }, function (err, result) {
            //     if (err) {
            //         res.json(err);
            //     } else {
            //         res.json(result);
            //         console.log(result)
            //     }
            // });

        }
    })

});

app.post('/convertexcel', function (req, res) {
    // const filename ="1585505272264_soccer_players.xlsx"
    var filename =req.body.filename
    xlsxtojson({
        input: "./uploads/"+filename+"",  // input xls
        output: "output.json", // output json
        lowerCaseHeaders: true
    }, function (err, result) {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
            console.log(result[0].CITY)
        }
    });
});


//get years
app.get("/years", function (req, res) {
    const sql = "SELECT working_year FROM `workingyear`";
    con.query(sql, function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
            console.log(err)
        }
        else {
            res.json(result);
            console.log(result)
        }
    });
});

//show committee in current year
app.get("/committee/:years", function (req, res) {
    const years = req.params.years
    const sql = "SELECT email FROM `workingyear` WHERE working_year=?";
    con.query(sql, [years], function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
            console.log(err)
        }
        else {
            res.json(result);
            console.log(years)
        }
    });
});


///////////////////////////////////////////////////////////////////


//===========================Admin================================

//must be take photo แก้ติ๊กหลสยๆอัน 
app.put("/takephoto/:year", function (req, res) {
    const year = req.params.year;
    const records = req.body.records;

    // const invenNum = req.body.invenNum;
    const sql = "UPDATE `product` SET `image_status` = 4 WHERE product_year=? AND inventorynumber IN (?)"

    // connection.query('update UserRequests set RequestStatus = ?, ReqCompletedDateTime = ? where idRequest IN (?)', ['Completed', new Date(), idsArray.join()], function(err, rows){
    //     connection.release();
    //   });
    for (i = 0; i <= records.length; i++) {
        con.query(sql, [year, records[i].invenNum], function (err, result, fields) {
            if (err) {
                res.status(500).send("Server error");
                console.log(err);
            }
            else {
                res.json(result);
                console.log(records.length)
            }

        });
    }
});

//assign work to committee //working history page
app.post("/assign/committee", function (req, res) {
    date = new Date();
    const year = date.getFullYear();
    const email = req.body.email;
    const sql = "INSERT INTO workingyear (year,email) VALUES (?,?)"
    con.query(sql, [year, email], function (err, result, fields) {
        if (err) {
            res.status(500).send("Server error");
        }
        else {
            res.json(result);
        }
    });
});

//

//root
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/login.html"))
});

//signup
app.get("/guest", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/หน้าแรกผู้ใช้ทั่วไป.html"))
});

//login
app.get("/productadmin", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/ข้อมูลครุภัณฑ์แอดมิน.html"))
});

//afterlogin
app.get("/Home2", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/Home2.html"))
});

//adminlogin
app.get("/admin", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/HomeAdmin.html"))
});

//printsheet
app.get("/print", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/printuser.html"))
});

//sheet
app.get("/sheet", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/usersheet.html"))
});

//history
app.get("/history", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/History.html"))
});

//sheet require
app.get("/require", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/printAdmin.html"))
});

//addsheet
app.get("/addsheet", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/addsheet.html"))
});


//<=========== Starting sever ==========>
const PORT = 8080
app.listen(PORT, function () {
    console.log("Sever is running at " + PORT);
});