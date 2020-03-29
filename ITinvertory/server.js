//<=========== Import packages ==========>
const express = require("express");
const path = require("path");
const body_parser = require("body-parser");
const mysql = require("mysql");
const config = require("./dbConfig.js");
var fs = require('fs');
var cm = require('csv-mysql');
const XLSXtoMYSQL = require('xlsx-mysql');
const readXlsxFile  = require("read-excel-file/node");
const multer = require("multer");
const passport = require("passport");
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


const upload = multer({ storage: storageOption }).single("fileUpload");
// const upload = multer({ storage: storageOption }).single("fileUpload");
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

app.post("/test", function (req, res) {
    upload(req, res, function (err, result) {
        if (err) {
            res.status(500).send("Upload failed");
            return;
        }
        else {
            res.json(req.file.filename)
            console.log(req.file.filename)
        }
    })


    // importExcelData2MySQL(__basedir + '/uploads/' + req.file.filename);
    // res.json({
    //       'msg': 'File uploaded/import successfully!', 'file': req.file
    //     });
  });

  function importExcelData2MySQL(filePath){
    // File path.
    readXlsxFile(filePath).then((rows) => {
      // `rows` is an array of rows
      // each row being an array of cells.   
      console.log(rows);
     
      /**
      [ [ 'Id', 'Name', 'Address', 'Age' ],
      [ 1, 'Jack Smith', 'Massachusetts', 23 ],
      [ 2, 'Adam Johnson', 'New York', 27 ],
      [ 3, 'Katherin Carter', 'Washington DC', 26 ],
      [ 4, 'Jack London', 'Nevada', 33 ],
      [ 5, 'Jason Bourne', 'California', 36 ] ] 
      */
     
      // Remove Header ROW
      rows.shift();
     
      // Create a connection to the database
    //   const connection = mysql.createConnection({
    //     host: 'localhost',
    //     user: 'root',
    //     password: '12345',
    //     database: 'testdb'
    //   });
     
      // Open the MySQL connection
      con.connect((error) => {
        if (error) {
          console.error(error);
        } else {
          let query = "INSERT INTO `product` (`product_year`, `inventorynumber`, `asset`, `subnumber`, `description`, `model`, `serialnumber`, `location`, `room`, `receive_date`, `originalvalue`, `costcenter`, `department`, `vendername`, `product_status`, `image`, `image_status`, `scan_date`, `committee`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 0, ?, ?);";
          con.query(query, [rows], (error, response) => {
          console.log(error || response);
   
          /**
          OkPacket {
          fieldCount: 0,
          affectedRows: 5,
          insertId: 0,
          serverStatus: 2,
          warningCount: 0,
          message: '&amp;Records: 5  Duplicates: 0  Warnings: 0',
          protocol41: true,
          changedRows: 0 } 
          */
          });
        }
      });
    })
  }



// app.post("/test", function (req, res) {
//     date = new Date();
//     const year = date.getFullYear();


//     app.post('/csvfileupload', urlencodedParser, function (req, res) {

//         if (req.url == '/csvfileupload') {
//             var form = new formidable.IncomingForm();
//             form.parse(req, function (err, fields, files) 
//             {
//                 var oldpath = files.filetoupload.path;
//                 var newpath = 'C:/xampp/htdocs/nodejs/mvc/csvupload/uploads/' + files.filetoupload.name;
//                 fs.rename(oldpath, newpath, function (err) {
//                     if (err) throw err;
//                     res.write('File uploaded and moved!');
//                     res.end();
//                 });
//                 fs.readFile(oldpath, { encoding: 'utf-8' }, function(err, csvData) {
    
//                     if (err) 
//                     {
//                         console.log(err);
//                     }
    
    
//                     csvParser(csvData, { delimiter: ',' }, function(err, data) {
//                         if (err)
//                         {
//                             console.log(err);
//                         } 
//                         else 
//                         {      
//                         console.log(data);    
//                             var sql = "INSERT INTO `product` (`product_year`, `inventorynumber`, `asset`, `subnumber`, `description`, `model`, `serialnumber`, `location`, `room`, `receive_date`, `originalvalue`, `costcenter`, `department`, `vendername`, `product_status`, `image`, `image_status`, `scan_date`, `committee`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 0, ?, ?);";
//                             con.query(sql, [data], function(err) {
//                             if (err) throw err;
//                             conn.end();
//                             });   
    
//                         }
//                     });
//                 });
//             });
    
//         } 
    
    
//     })


    // var optionsZ = {
    //     mysql: {
    //         host: 'localhost',
    //         user: 'root',
    //         database: 'itinventory',
    //         table:'product',
    //         password: '',
    //         port: '3306'
    //     },
    //     csv: {
    //         delimiter: '+'
    //     }
    // }
    // var locationZ = __dirname + './it.xlsx';
    // var waitT = 1000;
    
    
    // XLSXtoMYSQL(locationZ,optionsZ,waitT);

    // let file = req.files.filename;
    // let filename = file.name;
    // file.mv('./excel/' + filename, function (err) {
    //     if (err) {
    //         res.send('upload fail')
    //         console.log(err)
    //     }
    //     else {
    //         let result = importExcel({
    //             sourceFile: './excel/' + filename
    //         })
    //         res.send(filename)
    //     }
    // })
// })

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