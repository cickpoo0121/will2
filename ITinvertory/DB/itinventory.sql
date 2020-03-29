-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 28, 2020 at 11:26 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `itinventory`
--

-- --------------------------------------------------------

--
-- Table structure for table `datealert`
--

CREATE TABLE `datealert` (
  `year_alert` int(4) NOT NULL,
  `date_start` date NOT NULL,
  `date_end` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `datealert`
--

INSERT INTO `datealert` (`year_alert`, `date_start`, `date_end`) VALUES
(2019, '2019-03-06', '2019-05-06'),
(2020, '2020-08-13', '2020-09-13');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `product_year` int(4) NOT NULL,
  `inventorynumber` int(20) NOT NULL,
  `asset` int(10) DEFAULT NULL,
  `subnumber` int(1) DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `model` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serialnumber` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `room` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receive_date` date DEFAULT NULL,
  `originalvalue` int(10) DEFAULT NULL,
  `costcenter` int(8) DEFAULT NULL,
  `department` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vendername` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_status` int(1) DEFAULT NULL,
  `image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_status` int(1) DEFAULT NULL,
  `scan_date` date DEFAULT NULL,
  `committee` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`product_year`, `inventorynumber`, `asset`, `subnumber`, `description`, `model`, `serialnumber`, `location`, `room`, `receive_date`, `originalvalue`, `costcenter`, `department`, `vendername`, `product_status`, `image`, `image_status`, `scan_date`, `committee`) VALUES
(2019, 1, 2, 2, 'กล้อง', 'Fuji XA-2', 'KSHD321D54D', 'S7', '413', '2019-08-11', 300, 1112, 'IT', 'นายจุมพล เอกวโรดม', 1, 'test.jpg', 4, '2020-03-06', NULL),
(2019, 2, 1, 1, 'โต๊ะ', '-', 'KSHD321D54D', 'S7', '413', '2019-08-11', 300, 1112, 'IT', 'นายจุมพล เอกวโรดม', 1, 'test.jpg', 4, '2020-03-06', NULL),
(2020, 101010, 10, 10, 'คอมพิวเติร์', 'acer', 'ASHD321D54D', 'S7', '304', '2017-08-11', 20000, 11300, 'IT', 'นายจุมพล เอกวโรดม', 1, 'gg.jpg', 0, '2020-03-28', 'somchai@mfu.ac.th'),
(2020, 111111, 11, 11, 'คอมพิวเติร์', 'acer', 'ASHD321D54D', 'S7', '304', '2017-08-11', 20000, 11300, 'IT', 'นายจุมพล เอกวโรดม', 1, 'gg.jpg', 0, '2020-03-28', 'somchai@mfu.ac.th'),
(2020, 743102, 7, 7, 'คอมพิวเติร์', 'acer', 'ASHD321D54D', 'S7', '304', '2017-08-11', 20000, 11300, 'IT', 'นายจุมพล เอกวโรดม', 1, 'gg.jpg', 0, '2020-03-28', 'somchai@mfu.ac.th'),
(2020, 4310267, 5, 5, 'คอมพิวเติร์', 'acer', 'ASHD321D54D', 'S7', '304', '2017-08-11', 20000, 11300, 'IT', 'นายจุมพล เอกวโรดม', 1, 'gg.jpg', 0, '2020-03-28', 'somchai@mfu.ac.th'),
(2020, 6102347, 6, 6, 'คอมพิวเติร์', 'acer', 'ASHD321D54D', 'S7', '304', '2017-08-11', 20000, 11300, 'IT', 'นายจุมพล เอกวโรดม', 1, 'gg.jpg', 0, '2020-03-28', 'somchai@mfu.ac.th'),
(2020, 8201356, 8, 8, 'คอมพิวเติร์', 'acer', 'ASHD321D54D', 'S7', '304', '2017-08-11', 20000, 11300, 'IT', 'นายจุมพล เอกวโรดม', 1, 'gg.jpg', 0, '2020-03-28', 'somchai@mfu.ac.th'),
(2020, 9401325, 9, 9, 'คอมพิวเติร์', 'acer', 'ASHD321D54D', 'S7', '304', '2017-08-11', 20000, 11300, 'IT', 'นายจุมพล เอกวโรดม', 1, 'gg.jpg', 0, '2020-03-28', 'somchai@mfu.ac.th'),
(2020, 10231642, 4, 4, 'คอมพิวเติร์', 'acer', 'ASHD321D54D', 'S7', '304', '2017-08-11', 20000, 11300, 'IT', 'นายจุมพล เอกวโรดม', 1, 'gg.jpg', 0, '2020-03-28', 'somchai@mfu.ac.th'),
(2020, 362103412, 3, 3, 'คอมพิวเติร์', 'acer', 'ASHD321D54D', 'S7', '304', '2017-08-11', 20000, 11300, 'IT', 'นายจุมพล เอกวโรดม', 1, 'gg.jpg', 0, '2020-03-28', 'somchai@mfu.ac.th');

-- --------------------------------------------------------

--
-- Table structure for table `workingyear`
--

CREATE TABLE `workingyear` (
  `working_year` int(4) NOT NULL,
  `email` varchar(30) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `workingyear`
--

INSERT INTO `workingyear` (`working_year`, `email`) VALUES
(2020, 'somchai@mfu.ac.th');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `datealert`
--
ALTER TABLE `datealert`
  ADD PRIMARY KEY (`year_alert`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product_year`,`inventorynumber`);

--
-- Indexes for table `workingyear`
--
ALTER TABLE `workingyear`
  ADD PRIMARY KEY (`working_year`,`email`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
