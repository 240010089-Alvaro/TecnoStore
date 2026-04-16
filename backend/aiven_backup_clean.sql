-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: laravel
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2014_10_12_000000_create_users_table',1);
INSERT INTO `migrations` VALUES (2,'2014_10_12_100000_create_password_reset_tokens_table',1);
INSERT INTO `migrations` VALUES (3,'2019_08_19_000000_create_failed_jobs_table',1);
INSERT INTO `migrations` VALUES (4,'2019_12_14_000001_create_personal_access_tokens_table',1);
INSERT INTO `migrations` VALUES (5,'2026_03_20_202937_create_proveedores_table',2);
INSERT INTO `migrations` VALUES (6,'2026_03_20_203720_add_rol_to_users_table',3);
INSERT INTO `migrations` VALUES (7,'2026_03_21_061457_remove_rol_from_users_table',4);
INSERT INTO `migrations` VALUES (8,'2026_03_21_062141_remove_user_id_from_proveedores_table',5);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoria` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `marca` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modelo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `imagen` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `proveedor_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Computadroa','Computadoras','hp','2025',8000.00,1,'kk','1774151360.jpeg',10,'2026-03-22 10:49:20','2026-03-22 10:49:20');
INSERT INTO `productos` VALUES (2,'Audifonos','Audio','Jbl','2026',1400.00,1,'Has explotar tu sentido auditivo!','1774152890.png',10,'2026-03-22 11:14:50','2026-03-22 13:00:34');
INSERT INTO `productos` VALUES (3,'Hola','Visual','Jbl',NULL,1111.00,1,'Hola mundo','1774157950.jpeg',10,'2026-03-22 12:39:10','2026-03-22 12:39:10');
INSERT INTO `productos` VALUES (4,'Alexa Pro','Audio','Pro Ztw',NULL,1300.00,1,'Alexa Pro especial para la sala de tu casa','1774158100.jpg',10,'2026-03-22 12:41:40','2026-03-22 12:41:40');
INSERT INTO `productos` VALUES (5,'OPPO 16 T','Telefonos','T','16',7000.00,1,'OPPO 16 T el mejor telefono','1774160535.gif',11,'2026-03-22 13:22:15','2026-03-22 13:22:15');
INSERT INTO `productos` VALUES (6,'Ottoniel','Sexo','Sin marca',NULL,1500.00,1,'Cariñosoo','1774297416.jpg',10,'2026-03-24 03:23:36','2026-03-24 03:23:36');
INSERT INTO `productos` VALUES (7,'Pestañas','Visual','Sin marca','Sin modelo',1100.00,1,'Pagina de reserva de citas de pestañas.','1776176246.png',10,'2026-04-14 21:17:26','2026-04-14 21:17:26');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `empresa` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
INSERT INTO `proveedores` VALUES (10,'Computer','6971228322','La Reform Angostura','2026-03-22 10:13:47','2026-03-22 10:13:47','Alvaro','hola@gmail.com','$2y$12$eVyvu9TmDWHsTWCXbm21Me3zf0w2nn0fU2ixQsmtsEYsbz0.5/YGK');
INSERT INTO `proveedores` VALUES (11,'Negocio Propio','6971167132','La Reform Angostura','2026-03-22 12:45:37','2026-03-22 12:45:37','Alexander Montoya','montoya@gmail.com','$2y$12$h/3ATfEnIIFVebr7oH6g/.oF6oCWHcZJxoQ/5fQMVLXywAMO7dTXe');
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','admin@test.com',NULL,'$2y$12$bb8qSAbo60cNidoXXvs6lOcN7mGTLubj5SWnBWik3Q2ZR7e5L82Q.',NULL,'2026-03-20 06:30:48','2026-03-20 06:30:48');
INSERT INTO `users` VALUES (2,'Alvaro Montoya','hola@gmail.com',NULL,'$2y$12$/PmfTgEHh2fdr.dpgt7WFORnGV2CDqgxaqwFv4hhhiTQIzuVeYFdy',NULL,'2026-03-21 01:45:39','2026-03-21 01:45:39');
INSERT INTO `users` VALUES (3,'Magdiela Gerardo','magdiela1@gmail.com',NULL,'$2y$12$24ajJEyrFWOGqe7ZvHlrkul/Px7LKtiyScjpPTa4PX1FIaQ.GJ/Yy',NULL,'2026-03-21 01:51:53','2026-03-21 01:51:53');
INSERT INTO `users` VALUES (4,'Alexander Montoya','alex@gmail.com',NULL,'$2y$12$QRoxe44UlDzk9xmQUUvnROiyzeCY1uYsBVMIdS8keq/l9BJV3m.pC',NULL,'2026-03-21 03:52:45','2026-03-21 03:52:45');
INSERT INTO `users` VALUES (5,'Prueba','prueba@gmail.com',NULL,'$2y$12$3EBeatx13uNzBL2QSiWPde9y8fJ3qRqsI.i7BKhuCB8T4w5teDs4O',NULL,'2026-03-21 12:51:04','2026-03-21 12:51:04');
INSERT INTO `users` VALUES (6,'Alexander Montoya','mont@gmail.com',NULL,'$2y$12$Wyv6nF4z/p.7TWJA/S.mku46UUekR2UUC.EUO5TFCcTLnFIkbPfP2',NULL,'2026-03-21 13:00:54','2026-03-21 13:00:54');
INSERT INTO `users` VALUES (7,'Aleee','alexander@gmail.com',NULL,'$2y$12$1n3io7KrVfrhExk.B0YLV.Jx2YdOX3v.ddd7m.Wr.a6OkYZgXTLrS',NULL,'2026-03-21 13:08:21','2026-03-21 13:08:21');
INSERT INTO `users` VALUES (8,'ppp','pp@gmail.com',NULL,'$2y$12$/KzxQmsIPg0gMbQFoV5oXeR2AA6A.M3W5TpKn9bu7XLU6uS1dFw/C',NULL,'2026-03-22 04:32:19','2026-03-22 04:32:19');
INSERT INTO `users` VALUES (9,'Glenn Aldahir Gonzales Bojorquez','glenn@gmail.com',NULL,'$2y$12$DnAztNgbWhxfcYEfhubqP.nSql8eM.7ZTwrZHpBAo7rme.u/kuy4e',NULL,'2026-04-14 21:12:59','2026-04-14 21:12:59');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-15 14:29:40
