-- phpMyAdmin SQL Dump
-- version 4.0.4.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 08, 2013 at 11:56 PM
-- Server version: 5.5.25
-- PHP Version: 5.4.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `zetamaze.com`
--
CREATE DATABASE IF NOT EXISTS `zetamaze.com` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `zetamaze.com`;

-- --------------------------------------------------------

--
-- Table structure for table `mazes`
--

CREATE TABLE IF NOT EXISTS `mazes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` char(24) NOT NULL,
  `maze` text NOT NULL,
  `textureData` text NOT NULL,
  `beginX` int(11) NOT NULL COMMENT 'Canvas coordinates',
  `beginY` int(11) NOT NULL,
  `beginMazeX` int(11) NOT NULL COMMENT 'Maze coordinates',
  `beginMazeY` int(11) NOT NULL,
  `endX` int(11) NOT NULL,
  `endY` int(11) NOT NULL,
  `endMazeX` int(11) NOT NULL,
  `endMazeY` int(11) NOT NULL,
  `file1X` int(11) NOT NULL,
  `file1Y` int(11) NOT NULL,
  `file1MazeX` int(11) NOT NULL,
  `file1MazeY` int(11) NOT NULL,
  `file2X` int(11) NOT NULL,
  `file2Y` int(11) NOT NULL,
  `file2MazeX` int(11) NOT NULL,
  `file2MazeY` int(11) NOT NULL,
  `file3X` int(11) NOT NULL,
  `file3Y` int(11) NOT NULL,
  `file3MazeX` int(11) NOT NULL,
  `file3MazeY` int(11) NOT NULL,
  `file4X` int(11) NOT NULL,
  `file4Y` int(11) NOT NULL,
  `file4MazeX` int(11) NOT NULL,
  `file4MazeY` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

