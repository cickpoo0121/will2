//<=========== Import packages ==========>
const express = require("express");
const path = require("path");
const body_parser = require("body-parser");
const mysql = require("mysql");
const config = require("./dbConfig.js");
const multer = require("multer");
const passportSetup = require("./config/passport-setup");
const passport = require("passport");
const cookieSession= require("cookie-session");
const key = require("./config/key")
const readXlsxFile = require('read-excel-file/node');


// const passportSetup = require("./config/passport-setup");
// var fs = require('fs');
// var cm = require('csv-mysql');
// var xlsxtojson = require("xlsx-to-json");
// var xlstojson = require("xls-to-json");
// let upload = require("express-fileupload");
// const upload = require("express-fileupload");

//import auth
const authRoutes = require("./routes/auth-routes");
const profile= require("./routes/profile-routes");

const product = require("./routes/productroute");
const datealert = require("./routes/datealertroute");

// const qr = require("./config/")



const app = express();
const con = mysql.createConnection(config);
// app.set("view engine", "ejs");


//uploadfile
const storageOption = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    }
});

const upload = multer({ storage: storageOption }).single("fileUpload");


//Middleware
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use("/img", express.static(path.join(__dirname, 'img')));
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
app.use("/style.css", express.static(path.join(__dirname, 'style.css')));
app.use("/qrcode.min.js", express.static(path.join(__dirname, 'qrcode.min.js')));
app.use("/barcode.min.js", express.static(path.join(__dirname, 'barcode.min.js')));
app.use(express.static(path.join(__dirname, "public")));
// app.use("/static", express.static('./static/'));


app.use(cookieSession({
    maxAge: 60*60*1000,
    keys: [key.cookie.cookiekey]
}))

app.use(passport.initialize());
//session
app.use(passport.session());



app.use("/product", product);//about product
app.use("/datealert", datealert);//date start and date end
app.use("/auth", authRoutes);// authen
app.use("/profile", profile);//profile



//===========================User================================//

// upload file
app.post('/uploadfile', function (req, res) {

    upload(req, res, function (err, result) {
        if (err) {
            res.status(500).send("Upload failed");
            console.log(err)
            return;
        }
        else {

            importExcelData2MySQL(res,__dirname + '/uploads/' + req.file.filename)
            // res.send('/guest')
            console.log(req.file.filename);

        }
    })

});


// -> Import Excel Data to MySQL database
function importExcelData2MySQL(res,filePath) {
    // File path.
    readXlsxFile(filePath).then((rows) => {
        // `rows` is an array of rows
        // each row being an array of cells.   
        console.log(rows);

        // Remove Header ROW
        rows.shift();

        let sql = "INSERT INTO `product` (`asset`, `subnumber`, `inventorynumber`, `description`, `model`, `serialnumber`, `location`, `room`, `receive_date`, `originalvalue`, `costcenter`, `department`, `vendername`) VALUES ?";

        //delete column 0,0 (ลำดับที่)
        var idxToDelete = [0, 0];
        for (var i = 0; i < rows.length; i++) {
            var temp = rows[i];
            rows[i] = [];
            for (var j = 0; j < temp.length; j++) {
                if (idxToDelete.indexOf(j) == -1) // dont delete
                {
                    rows[i].push(temp[j]);
                }
            }
        }
        console.log(rows);

        //add excel to DB
        con.query(sql, [rows], function (err, result, fields) {
            if (err) {
                // console.log(err)
                console.log(err)
            }
            else {
                date = new Date()
                const year = date.getFullYear();

                const sql = "UPDATE `product` SET `product_year` = ?,product_status=0 where product_year=0"
                con.query(sql, [year], function (err, result, fields) {
                    if (err) {
                        // console.log(err)
                        console.log(err)
                    }
                    else {
                        // res.json(result);
                        console.log(result)
                        res.send("/productstatusadmin");
                    }
                });
                console.log(result)
            }
        });

    })
}




//convert excel to json
// app.post('/convertexcel', function (req, res) {
//     // const filename ="1585505272264_soccer_players.xlsx"
//     var abc="Inventory number"
//     let filename =req.body.filename
//     xlsxtojson({
//         input: "./uploads/"+filename+"",  // input xls
//         output: "output.json", // output json
//         lowerCaseHeaders: true
//     }, function (err, result) {
//         if (err) {
//             res.json(err);
//         } else {
//             res.json(result);
//             console.log(result[0].Room)
//         }
//     });
// });


//get years
app.get("/years", function (req, res) {
    const sql = "SELECT DISTINCT working_year FROM `workingyear`";
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
    const sql = "SELECT * FROM `workingyear` WHERE role=0 and working_year=?";
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

//must be take photo ติดส่งค่าไม่ไป
app.put("/takephoto/:year", function (req, res) {
    const year = req.params.year;
    const records = req.body.records;
    console.log(records)

    // const invenNum = req.body.invenNum;
    const sql = "UPDATE `product` SET `image_status` = 1 WHERE product_year=? AND asset IN (?)"

    // for (i = 0; i <= records.length; i++) {
        con.query(sql, [year,records], function (err, result, fields) {
            if (err) {
                res.status(500).send("Server error");
                // console.log(err);
                console.log("[mysql error]",err);
            }
            else {
                res.json(result);
                console.log(result);
            }

        });
    // }
});

//assign work to committee //working history page
app.post("/assign/committee", function (req, res) {
    // date = new Date();
    let year = req.body.year
    const email = req.body.email;
    const sql = "INSERT INTO workingyear (working_year,email) VALUES (?,?)"
    con.query(sql, [year, email], function (err, result, fields) {
        if (err) {
            res.status(500).send("Server error");
            console.log(err)
        }
        else {
            res.json(result);
        }
    });
});

//Update committee 
app.put("/update/committee", function (req, res) {
    // date = new Date();
    const year     = req.body.year
    const emailOld = req.body.emailOld;
    const emailNew = req.body.emailNew;
    const sql = "UPDATE `workingyear` SET `email` = ? WHERE `workingyear`.`working_year` = ? AND `workingyear`.`email` = ?;"
    con.query(sql, [emailNew,year,emailOld], function (err, result, fields) {
        if (err) {
            res.status(500).send("Server error");
            console.log(err)
        }
        else {
            res.json(result);
            console.log(result)
        }
    });
});

//user or admin check
app.get("/CheckRole/:email", function (req, res){
    const email = req.params.email;
    const sql = "SELECT * FROM `workingyear` WHERE email = ?";
    con.query(sql, [email], function(err, result, fields){
        if(err){
            res.status(500).send("Server error");
            console.log(err)
        }else{
            res.json(result);
        }
    })
})

//

//root
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/login.html"))
    // res.render("login.ejs",{user:req.user});
});

app.get("/path", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/waitpath.html"))
    // res.render("login.ejs",{user:req.user});
});

//QeCode
app.get("/qrcode", function (req, res) {
    // console.log(req.user+"asdadasda")
    res.sendFile(path.join(__dirname, "/view/qrcode.html"))
    // res.render("หน้าแรกผู้ใช้ทั่วไป.ejs",{user:req.user});
});

//QeCode
app.get("/barcode", function (req, res) {
    // console.log(req.user+"asdadasda")
    res.sendFile(path.join(__dirname, "/view/barcode.html"))
    // res.render("หน้าแรกผู้ใช้ทั่วไป.ejs",{user:req.user});
});

//========= User ========//
//ผู้ใช้ทั้วไป
app.get("/guest", function (req, res) {
    // console.log(req.user+"asdadasda")
    res.sendFile(path.join(__dirname, "/view/generalUser.html"))
    // res.render("หน้าแรกผู้ใช้ทั่วไป.ejs",{user:req.user});
});

//หน้าแรกcommittee
app.get("/committeefirstpage", function (req, res) {
    // console.log(req.user+"asdadasda")
    // res.end();
    res.sendFile(path.join(__dirname, "/view/committeeFirstPage.html"))
    
});

//สถานะครุภัณฑ์
app.get("/committee_AssetStatus", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/committee_AssetStatus.html"))
});

//คณะกรรมการประจำปี
app.get("/committeeBiodata", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/committeeBiodata.html"))
});

//เช็ควันที่
app.get("/periodOfCheckingAsset", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/periodOfCheckingAsset.html"))
});


app.get("/barcodepage", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/barcodepage.html"))
});

//========= Admin ========//
//ข้อมูลครุภัณฑ์
app.get("/productstatusadmin", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/admin_AssetStatus.html"))
});

//คณะกรรมการ
app.get("/committee", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/assignCommittee.html"))
});

//หน้าแรกของแิดมิน
app.get("/adminfirstpage", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/adminFirstPage.html"))
});

//คณะกรรมการประจำปี
app.get("/assignCommittee", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/assignCommittee.html"))
});

//เช็คเวลาแอดมิน 
app.get("/assignCheckingDate", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/assignCheckingDate.html"))
});


//<=========== Starting sever ==========>
const PORT = 8080
app.listen(PORT, function () {
    console.log("Sever is running at " + PORT);
});