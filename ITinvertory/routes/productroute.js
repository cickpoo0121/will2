// const productroute = require("express").Router();
const router = require("express").Router();
const mysql = require("mysql");
const config = require("../dbConfig");
const fs = require("fs");
const fastcsv = require("fast-csv");
const con = mysql.createConnection(config);


//import excel
router.post("/import", function (req, res) {
    date = new Date();
    const year = date.getFullYear();
    const sql = "INSERT INTO `product` (`product_year`, `inventorynumber`, `asset`, `subnumber`, `description`, `model`, `serialnumber`, `location`, `room`, `receive_date`, `originalvalue`, `costcenter`, `department`, `vendername`, `product_status`, `image`, `image_status`, `scan_date`, `committee`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 0, ?, ?);";
    const { product_year, inventorynumber, asset, subnumber, description, model, serialnumber, location, room, receive_date, originalvalue, costcenter, department, vendername, product_status, image, image_status, scan_date, committee } = req.body;

    con.query(sql, [year, inventorynumber, asset, subnumber, description, model, serialnumber, location, room, receive_date, originalvalue, costcenter, department, vendername, 0, image, 0, scan_date, committee], function (err, result, fields) {
        if (err) {
            res.status(500).send("Server error");
            console.log(err)
        }
        else {
            res.json(result);
        }
    })

})

//show product of guset page
router.get("/guest", function (req, res) {
    const sql = "SELECT description,model,location,room,product_status,image FROM `product` WHERE product_status=1";
    con.query(sql, function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
            console.log(err)
        }
        else {
            res.json(result);
            // console.log(err)
        }
    });
});

//show product of guset page
router.get("/guest/:year", function (req, res) {
    // date = new Date();
    // const year = date.getFullYear();
    const year = req.params.year;
    const sql = 'SELECT description,model,location,room,product_status,image FROM `product` WHERE product_status=1 and product_year =? ORDER BY asset ASC';
    con.query(sql, [year], function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
            console.log(err)
        }
        else {
            res.json(result);
            // console.log(err)
        }
    });
});

//productstatus
router.get("/countstatus/:year", function (req, res) {
    const year = req.params.year;
    const sql = "SELECT (select COUNT(*) from product where product_status = 0 and product_year = ?) as missing,(select COUNT(*) from product where product_status = 1 and product_year = ?) as normal,(select COUNT(*) from product where product_status = 2 and product_year = ?) as repair,(select COUNT(*) from product where product_status = 3 and product_year = ?) as other";
    con.query(sql, [year,year,year,year], function (err, result, fields) {
        if (err) {
            res.status(500).send("Server error");
            console.log(err);
        }
        else {
            res.json(result);
            // console.log(result[0].normal)
        }
    });
});

// show product of user home page
router.get("/user", function (req, res) {
    const sql = "SELECT inventorynumber,description,model,location,room,product_status,image FROM `product` ";
    con.query(sql, function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
            console.log(err)
        }
        else {
            res.json(result);
            console.log(err)
        }
    });
});

//delete database
router.delete("/delete/:years", function (req, res) {
    const years = req.params.years;
    const sql = "DELETE FROM `product` WHERE product_year=?";
    con.query(sql, [years], function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
            console.log(err)
        }
        else {
            res.json(result);
            console.log(err)
        }
    });
});

//check scan or not
router.get("/checkscan/:years", function (req, res) {
    const years = req.params.years;
    const sql = "SELECT product_status,product_year FROM `product` WHERE product_year=?";
    con.query(sql, [years], function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
            console.log(err)
        }
        else {
            res.json(result);
            console.log(err)
        }
    });
});

//show all status of product and who scan 
router.get("/status/:years", function (req, res) {
    const years = req.params.years;
    const sql = "SELECT product_year,image,image_status,inventorynumber,asset,description,model,location,room,committee,product_status FROM `product` WHERE product_year=?";
    con.query(sql, [years], function (err, result, fields) {
        if (err) {
            // console.log(err)
            res.status(500).send("Server error");
            console.log(err)
        }
        else {
            res.json(result);
            console.log(err)
        }
    });
});

// router.get("/testgoogle", function (req, res) {
//     console.log(req.user)
//     res.end()
// });
module.exports = router;
