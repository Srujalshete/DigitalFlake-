-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 22, 2024 at 02:07 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Digital`
--

-- --------------------------------------------------------

--
-- Table structure for table `Admin`
--

CREATE TABLE `Admin` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiration` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Admin`
--

INSERT INTO `Admin` (`id`, `email`, `password`, `createdAt`, `updatedAt`, `reset_token`, `reset_token_expiration`) VALUES
(2, 'admin@example.com', '$2a$10$ymC2OhA5fXDR.Q4rKRSuWuvMNfNWKqpg6mOdaSMcHGQcLCHVlK/gi', '2024-12-22 08:10:51', '2024-12-22 08:10:51', NULL, NULL),
(3, 'testuser@gmail.com', '$2a$10$ZtSB2XXCDxD39UIWNoS8Lu5tWZqyzOJB0YHVb6TVYs7tvvqya4qte', '2024-12-22 08:24:52', '2024-12-22 08:24:52', NULL, NULL),
(4, 'test@gmail.com', '$2a$10$OXKvc1W6twWAbYvLD1jASOkmf3Bn66JBwkaQc48wrb97DBdZJfKoW', '2024-12-22 09:12:34', '2024-12-22 10:32:37', '9473d1d9825663944b9a4044b69bd712c0b87af4c51533d4d9e962b6f5a95751', '2024-12-22 17:02:37'),
(7, 'sujalshete13@gmail.com', '$2a$10$wpzrm6LHGWGQ/XPO53PH7.uUfgOJRrLIK4IZtCw3v0TxrmQ.aVrPm', '2024-12-22 10:35:58', '2024-12-22 12:36:41', NULL, NULL),
(8, 'srujalshete@gmail.com', '$2a$10$u1mRTMvgRN0hcPoKmT7T3O3zN3mHc9PAqXpc98c7B64RGILVXnG1u', '2024-12-22 10:47:30', '2024-12-22 11:04:49', '9e55b738ba40c05bfe9a522cec8dfab51dbbcf5c60901210b9c39afe4499bac1', '2024-12-22 17:34:49');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `role_name` varchar(255) NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `status`, `created_at`, `updated_at`) VALUES
(7, 'Admin', 'Active', '2024-12-21 21:41:49', '2024-12-21 21:41:49'),
(8, 'cashier', 'Active', '2024-12-21 21:41:57', '2024-12-21 21:41:57'),
(9, 'software developer', 'Inactive', '2024-12-21 21:42:08', '2024-12-21 21:42:36'),
(10, 'accountant', 'Active', '2024-12-21 21:42:16', '2024-12-21 21:42:16'),
(11, 'Worker', 'Active', '2024-12-21 21:42:24', '2024-12-21 21:42:24'),
(12, 'MD', 'Active', '2024-12-22 09:04:18', '2024-12-22 09:04:43');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `profile_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `mobile`, `email`, `role_id`, `status`, `profile_image`, `created_at`, `updated_at`) VALUES
(3, 'old User', '9999988888', 'olduser@gmail.com', 10, 'Active', 'default-profile.jpg', '2024-12-21 11:41:08', '2024-12-22 09:02:25'),
(4, 'testuser3', '8787878787', 'testu@gmail.com', 10, 'Active', 'default-profile.jpg', '2024-12-21 11:45:52', '2024-12-22 12:36:07'),
(6, 'testuser5', '7676868668', 'testuser5@gmail.com', 10, 'Active', 'default-profile.jpg', '2024-12-21 18:11:39', '2024-12-22 09:01:25'),
(7, 'testuser6', '7676768989', 'testuser6@gmail.com', 8, 'Active', '1734858132128.png', '2024-12-22 09:02:12', '2024-12-22 09:02:12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Admin`
--
ALTER TABLE `Admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Admin`
--
ALTER TABLE `Admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
