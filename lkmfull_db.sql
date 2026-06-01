-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 25, 2026 at 07:05 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lkmfull_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `judul` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `teknologi` varchar(255) DEFAULT NULL,
  `url_github` varchar(500) DEFAULT NULL,
  `url_demo` varchar(500) DEFAULT NULL,
  `gambar` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `type`, `judul`, `deskripsi`, `teknologi`, `url_github`, `url_demo`, `gambar`, `createdAt`, `updatedAt`) VALUES
(16, NULL, 'SPA Portfolio Pribadi', 'Website portofolio dengan React + Vite.', 'React, Vite, CSS', 'https://github.com/siswa/portfolio', NULL, NULL, '2026-05-19 01:09:24', '2026-05-19 01:09:24'),
(17, NULL, 'Sistem Absensi Digital', 'Aplikasi absensi online berbasis web untuk sekolah.', 'Laravel, MySQL, Bootstrap 5', 'https://github.com/siswa/absensi', NULL, NULL, '2026-05-19 01:09:24', '2026-05-19 01:09:24'),
(18, NULL, 'Aplikasi Kasir Sederhana', 'Sistem point-of-sale untuk toko kecil.', 'React, Express.js, MySQL', 'https://github.com/siswa/kasir', NULL, NULL, '2026-05-19 01:09:24', '2026-05-19 01:09:24');

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20260511134444-create-project.js'),
('20260511135028-create-skill.js'),
('20260511135303-create-user.js');

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `kategori` varchar(100) DEFAULT NULL,
  `level` enum('Pemula','Menengah','Mahir') DEFAULT 'Pemula',
  `icon` varchar(50) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `skills`
--

INSERT INTO `skills` (`id`, `nama`, `kategori`, `level`, `icon`, `deskripsi`, `createdAt`, `updatedAt`) VALUES
(41, 'HTML & CSS', 'Frontend', 'Mahir', '🌐', NULL, '2026-05-19 01:09:24', '2026-05-19 01:09:24'),
(42, 'JavaScript', 'Frontend', 'Mahir', '📜', NULL, '2026-05-19 01:09:24', '2026-05-19 01:09:24'),
(43, 'React.js', 'Frontend', 'Mahir', '⚛️', NULL, '2026-05-19 01:09:24', '2026-05-19 01:09:24'),
(44, 'Express.js', 'Backend', 'Menengah', '🚀', NULL, '2026-05-19 01:09:24', '2026-05-19 01:09:24'),
(45, 'Sequelize (ORM)', 'Backend', 'Menengah', '🗄️', NULL, '2026-05-19 01:09:24', '2026-05-19 01:09:24'),
(46, 'ORM untuk mengelola database MySQL', 'Backend', 'Menengah', '🔧', NULL, '2026-05-19 01:09:24', '2026-05-19 01:09:24'),
(47, 'MySQL', 'Database', 'Pemula', '🐬', NULL, '2026-05-19 01:09:24', '2026-05-19 01:09:24'),
(48, 'Manajemen database relasional', 'Database', 'Mahir', '💾', NULL, '2026-05-19 01:09:24', '2026-05-19 01:09:24');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(6, 'Admin Portofolio', 'admin@gmail.com', '$2b$10$bRffjbXPaP.yzCY.ny05r.LElzmeUxudkSPU45gLegmxsrgJ5imGW', 'admin', '2026-05-19 02:13:01', '2026-05-19 02:13:01'),
(7, 'User Biasa', 'user@gmail.com', '$2b$10$bRffjbXPaP.yzCY.ny05r.Ojfhje5cQ7l.MKl4J6YWQRmrDwkkmZi', 'user', '2026-05-19 02:13:01', '2026-05-19 02:13:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
