-- MariaDB dump 10.19  Distrib 10.5.12-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: vcvp-v4
-- ------------------------------------------------------
-- Server version	10.5.12-MariaDB-1:10.5.12+maria~focal

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `requests_info`
--

DROP TABLE IF EXISTS `requests_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `requests_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `request_id` varchar(50) NOT NULL,
  `object_station_name` varchar(50) NOT NULL,
  `image_urls` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`image_urls`)),
  `station_code` varchar(10) NOT NULL,
  `nation_code` varchar(10) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `usercode` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `request_id` (`request_id`),
  KEY `usercode` (`usercode`),
  CONSTRAINT `requests_info_ibfk_1` FOREIGN KEY (`usercode`) REFERENCES `users` (`usercode`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requests_info`
--

LOCK TABLES `requests_info` WRITE;
/*!40000 ALTER TABLE `requests_info` DISABLE KEYS */;
INSERT INTO `requests_info` VALUES (1,'1860aaed-c72e-43f1-9019-5ded62ecb320','mong_co_1_hanh_lang_mong','[\"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_5_ok.jpg\", \"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_4_ok.jpg\"]','station_1','nation_1','2024-09-19 03:43:23',2),(2,'25552d85-14d2-4d4e-a2e3-db13a693560a','mong_co_1_hanh_lang_mong','[\"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_1_ok.jpg\", \"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_2_ok.jpg\"]','station_2','nation_1','2024-09-19 03:43:48',2),(3,'ff56b1ee-882f-46fa-8d31-9c31f2a850b7','mong_co_1_hanh_lang_mong','[\"data_vcvp/test_images/mong_co_hanh_lang_mong/BH_ngap_nuoc_ok.jpg\", \"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_2_ok.jpg\"]','station_3','nation_1','2024-09-19 03:44:44',0),(4,'8b4de613-0d7e-4781-91de-9ae3f3520739','mong_co_1_hanh_lang_mong','[\"data_vcvp/test_images/mong_co_hanh_lang_mong/BH_ngap_nuoc_ok.jpg\", \"data_vcvp/test_images/mong_co_hanh_lang_mong/BH_nut_vo_ok.jpg\"]','station_1','nation_1','2024-09-19 03:45:00',3),(5,'04e4570d-7d53-4d52-8fef-d5a4f91535ff','mong_co_2_khoa_cap','[\"data_vcvp/test_image/mong_cot_day_co_tong_quan/sample_mong_cot_day_co_tong_quan_155358715_103659400_mong-co-119.jpg\", \"data_vcvp/test_image/mong_cot_day_co_tong_quan/sample_mong_cot_day_co_tong_quan_155358715_103659400_mong-co-119.jpg\"]','station_2','nation_1','2024-09-19 03:45:26',0),(6,'491a38bc-7b3d-4461-be90-3c4f28c613d1','nha_xay_mat_cheo_truoc','[\"data_vcvp/test_images/mat_cheo_nha/BD_1_ok.jpg\"]','station_1','nation_1','2024-09-19 03:45:53',2),(7,'ebd13f3d-6358-4adf-8c61-033ed2522b27','nha_xay_mat_cheo_truoc','[\"data_vcvp/test_images/mat_cheo_nha/BD_1_ok.jpg\"]','station_3','nation_1','2024-09-19 03:46:04',0),(8,'f2795452-7e14-4ac1-a92c-697702279a71','nha_xay_mat_cheo_truoc','[\"data_vcvp/test_images/mat_cheo_nha/BD_1_ok.jpg\", \"data_vcvp/test_images/mat_cheo_nha/BD_4_ok.jpg\"]','station_3','nation_1','2024-09-19 03:47:17',3),(9,'ab77d60a-2e15-481e-bf82-c789454c43d5','nha_xay_mat_cheo_truoc','[\"data_vcvp/test_images/mat_cheo_nha/BH_han_gi_1_nok.jpg\", \"data_vcvp/test_images/mat_cheo_nha/BD_4_ok.jpg\"]','station_2','nation_1','2024-09-19 03:48:01',2),(10,'0898a710-76a6-4ca0-9d79-c39fce1504e1','ac_v5_3p_mat_truoc','[\"data_vcvp/img_nbox/ac_v5_3p_mat_truoc/1695259256_ac_v5_3p.jpg\", \"data_vcvp/img_nbox/ac_v5_3p_mat_truoc/1695259256_ac_v5_3p.jpg\"]','station_1','nation_1','2024-09-19 03:48:55',2),(11,'94f33e83-82cd-4876-965a-2b0db2786a75','ac_v5_3p_mat_truoc','[\"data_vcvp/img_nbox/ac_v5_3p_mat_truoc/1695259256_ac_v5_3p.jpg\", \"data_vcvp/img_nbox/ac_v5_3p_mat_truoc/1695259256_ac_v5_3p.jpg\"]','station_2','nation_1','2024-09-19 03:49:02',2),(12,'3b14ed6b-bd02-451c-9c62-6d97ec1e0422','ac_v5_3p_mat_truoc','[\"data_vcvp/img_nbox/ac_v5_3p_mat_truoc/1695259256_ac_v5_3p.jpg\", \"data_vcvp/img_nbox/ac_v5_3p_mat_truoc/1695194917_loc_set_2.jpg\"]','station_2','nation_1','2024-09-19 03:49:39',0),(13,'ce72aac5-471d-47aa-87a0-5c3f2ed94934','ac_v5_3p_mat_truoc','[\"data_vcvp/img_nbox/ac_v5_3p_mat_truoc/1695259256_ac_v5_3p.jpg\", \"data_vcvp/img_nbox/ac_v5_3p_mat_truoc/1695195342_28287_2023_03_08_15_28_50files0.jpg\"]','station_3','nation_1','2024-09-19 03:50:02',3),(14,'d1e2df27-c16c-42e9-929f-8c5e7aead217','mong_cot_coc_tiep_dia','[\"data_vcvp/test_image/mong_cot_day_co_tong_quan/sample_mong_cot_day_co_tong_quan_155358715_103659400_mong-co-119.jpg\", \"data_vcvp/test_image/mong_cot_day_co_tong_quan/sample_mong_cot_day_co_tong_quan_155358715_103659400_mong-co-119.jpg\"]','station_1','nation_1','2024-09-19 03:57:10',3),(15,'abf0c11d-2eca-41ac-9494-bf21774b09fa','mong_cot_coc_tiep_dia','[\"data_vcvp/test_image/mong_cot_day_co_tong_quan/sample_mong_cot_day_co_tong_quan_155358715_103659400_mong-co-119.jpg\", \"data_vcvp/test_image/mong_cot_day_co_tong_quan/sample_mong_cot_day_co_tong_quan_155358867_103659266_mong-co-118.jpg\"]','station_2','nation_1','2024-09-19 03:58:45',2),(16,'28a9fde9-460b-48e8-ba72-9da72949fb7f','ac_v5_1p_mat_truoc','[\"data_vcvp/test_image/ac_v5_1p_mat_truoc/1695259037_ac_v5_1p.jpg\"]','station_2','nation_1','2024-09-19 04:00:03',1),(17,'c58d0707-bae4-49d4-9b0e-a2d7526136a1','ac_v5_1p_mat_truoc','[\"data_vcvp/test_image/ac_v5_1p_mat_truoc/1695259037_ac_v5_1p.jpg\"]','station_3','nation_1','2024-09-19 04:00:08',1),(18,'11683d8e-ab76-46b3-9ff8-6df44de35523','ac_v5_1p_mat_truoc','[\"data_vcvp/test_image/ac_v5_1p_mat_truoc/1695259037_ac_v5_1p.jpg\", \"data_vcvp/test_image/ac_v5_1p_mat_truoc/1695259888_ac_v5_1p.jpg\"]','station_3','nation_1','2024-09-19 04:00:38',3);
/*!40000 ALTER TABLE `requests_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks_result`
--

DROP TABLE IF EXISTS `tasks_result`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks_result` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_code` varchar(10) NOT NULL,
  `task_type` varchar(20) NOT NULL,
  `urls_fail` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`urls_fail`)),
  `urls_success` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`urls_success`)),
  `urls_not_check` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`urls_not_check`)),
  `ai_output` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`ai_output`)),
  `result` int(11) NOT NULL,
  `description` varchar(50) NOT NULL,
  `threshold` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`threshold`)),
  `confidence_score` float NOT NULL,
  `request_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `request_id` (`request_id`),
  CONSTRAINT `tasks_result_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `requests_info` (`request_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks_result`
--

LOCK TABLES `tasks_result` WRITE;
/*!40000 ALTER TABLE `tasks_result` DISABLE KEYS */;
INSERT INTO `tasks_result` VALUES (1,'BD015','classifier','[]','[\"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_5_ok.jpg\", \"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_4_ok.jpg\"]','[]','[{\"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_5_ok.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": [\"mong_co\"], \"label\": [27], \"confidence\": [0.9997172951698303], \"opencv_corrosion\": null}, \"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_4_ok.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": [\"mong_co\"], \"label\": [27], \"confidence\": [0.9993355870246887], \"opencv_corrosion\": null}}]',1,'Phát hiện mong co.','{\"threshold\": 90}',99.9521,'1860aaed-c72e-43f1-9019-5ded62ecb320'),(2,'BH016','classifier','[\"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_5_ok.jpg\", \"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_4_ok.jpg\"]','[]','[]','[{\"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_5_ok.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": [\"mong_co_ok\"], \"label\": [2], \"confidence\": [0.7474457621574402], \"opencv_corrosion\": null}, \"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_4_ok.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": [\"mong_co_ok\"], \"label\": [2], \"confidence\": [0.7981135249137878], \"opencv_corrosion\": null}}]',1,'Khong phat hien nut.','{\"threshold\": 70}',77.2776,'1860aaed-c72e-43f1-9019-5ded62ecb320'),(3,'BH017','classifier','[\"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_5_ok.jpg\", \"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_4_ok.jpg\"]','[]','[]','[{\"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_5_ok.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": [\"mong_co_ok\"], \"label\": [2], \"confidence\": [0.7474457621574402], \"opencv_corrosion\": null}, \"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_4_ok.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": [\"mong_co_ok\"], \"label\": [2], \"confidence\": [0.7981135249137878], \"opencv_corrosion\": null}}]',1,'Khong phat hien vo.','{\"threshold\": 70}',77.2776,'1860aaed-c72e-43f1-9019-5ded62ecb320'),(4,'BH018','classifier','[\"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_5_ok.jpg\", \"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_4_ok.jpg\"]','[]','[]','[{\"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_5_ok.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": [\"sut_lun\"], \"label\": [4], \"confidence\": [0.6108960509300232], \"opencv_corrosion\": null}, \"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_4_ok.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": [\"ngap_nuoc\"], \"label\": [3], \"confidence\": [0.6418043971061707], \"opencv_corrosion\": null}}]',1,'Khong phat hien sut lun.','{\"threshold\": 95}',62.6347,'1860aaed-c72e-43f1-9019-5ded62ecb320'),(5,'BH019','classifier','[\"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_5_ok.jpg\", \"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_4_ok.jpg\"]','[]','[]','[{\"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_5_ok.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": [\"mong_co_ok\"], \"label\": [2], \"confidence\": [0.7474457621574402], \"opencv_corrosion\": null}, \"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_4_ok.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": [\"mong_co_ok\"], \"label\": [2], \"confidence\": [0.7981135249137878], \"opencv_corrosion\": null}}]',1,'Khong phat hien noi canh mong.','{\"threshold\": 70}',77.2776,'1860aaed-c72e-43f1-9019-5ded62ecb320'),(6,'BH020','classifier','[\"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_5_ok.jpg\", \"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_4_ok.jpg\"]','[]','[]','[{\"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_5_ok.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": [\"sut_lun\"], \"label\": [4], \"confidence\": [0.6108960509300232], \"opencv_corrosion\": null}, \"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_4_ok.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": [\"ngap_nuoc\"], \"label\": [3], \"confidence\": [0.6418043971061707], \"opencv_corrosion\": null}}]',1,'Khong phat hien ngap nuoc.','{\"threshold\": 70}',62.6347,'1860aaed-c72e-43f1-9019-5ded62ecb320'),(7,'BH021','dummy','[]','[\"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_5_ok.jpg\", \"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_4_ok.jpg\"]','[]','[{\"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_5_ok.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": [\"dummy\"], \"label\": [0], \"confidence\": [1], \"opencv_corrosion\": null}, \"data_vcvp/test_images/mong_co_hanh_lang_mong/BD_4_ok.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": [\"dummy\"], \"label\": [0], \"confidence\": [1], \"opencv_corrosion\": null}}]',1,'Pass','{\"threshold\": 0}',100,'1860aaed-c72e-43f1-9019-5ded62ecb320'),(8,'BD039','dummy','[]','[\"data_vcvp/test_image/mong_cot_day_co_tong_quan/sample_mong_cot_day_co_tong_quan_155358715_103659400_mong-co-119.jpg\", \"data_vcvp/test_image/mong_cot_day_co_tong_quan/sample_mong_cot_day_co_tong_quan_155358715_103659400_mong-co-119.jpg\"]','[]','[{\"data_vcvp/test_image/mong_cot_day_co_tong_quan/sample_mong_cot_day_co_tong_quan_155358715_103659400_mong-co-119.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": [\"dummy\"], \"label\": [0], \"confidence\": [1], \"opencv_corrosion\": null}}]',1,'','{\"threshold\": 0}',100,'04e4570d-7d53-4d52-8fef-d5a4f91535ff'),(9,'BD286','image_matching','[]','[\"data_vcvp/test_images/mat_cheo_nha/BD_1_ok.jpg\"]','[]','[{\"data_vcvp/test_images/mat_cheo_nha/BD_1_ok.jpg\": {\"xyxy\": [[32.57026672363281, 19.918962478637695, 812.9728393554688, 911.0645751953125]], \"mask\": null, \"class_name\": [\"station\"], \"label\": null, \"confidence\": [0.8895789980888367], \"opencv_corrosion\": null}}, {\"data_vcvp/test_images/mat_cheo_nha/BD_1_ok.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": null, \"label\": null, \"confidence\": [1], \"opencv_corrosion\": null}}]',1,'Giong anh mau.','{\"threshold\": 0}',100,'491a38bc-7b3d-4461-be90-3c4f28c613d1'),(10,'BH287','dummy','[]','[\"data_vcvp/test_images/mat_cheo_nha/BD_1_ok.jpg\"]','[]','[{\"data_vcvp/test_images/mat_cheo_nha/BD_1_ok.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": [\"dummy\"], \"label\": [0], \"confidence\": [1], \"opencv_corrosion\": null}}]',1,'PASS','{\"threshold\": 0}',100,'491a38bc-7b3d-4461-be90-3c4f28c613d1'),(11,'BH288','dummy','[]','[\"data_vcvp/test_images/mat_cheo_nha/BD_1_ok.jpg\"]','[]','[{\"data_vcvp/test_images/mat_cheo_nha/BD_1_ok.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": [\"dummy\"], \"label\": [0], \"confidence\": [1], \"opencv_corrosion\": null}}]',1,'PASS','{\"threshold\": 0}',100,'491a38bc-7b3d-4461-be90-3c4f28c613d1'),(12,'BD006','classifier','[]','[\"data_vcvp/img_nbox/ac_v5_3p_mat_truoc/1695259256_ac_v5_3p.jpg\", \"data_vcvp/img_nbox/ac_v5_3p_mat_truoc/1695259256_ac_v5_3p.jpg\"]','[]','[{\"data_vcvp/img_nbox/ac_v5_3p_mat_truoc/1695259256_ac_v5_3p.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": [\"ac_v5_3_pha_dong\"], \"label\": [19], \"confidence\": [0.9973883032798767], \"opencv_corrosion\": null}}]',1,'Phát hiện đổi tượng.','{\"threshold\": 90}',100,'0898a710-76a6-4ca0-9d79-c39fce1504e1'),(13,'BH007','detector-classifier','[]','[\"data_vcvp/img_nbox/ac_v5_3p_mat_truoc/1695259256_ac_v5_3p.jpg\", \"data_vcvp/img_nbox/ac_v5_3p_mat_truoc/1695259256_ac_v5_3p.jpg\"]','[]','[{\"data_vcvp/img_nbox/ac_v5_3p_mat_truoc/1695259256_ac_v5_3p.jpg\": {\"xyxy\": [[104.0, 322.0, 126.0, 374.0], [188.0, 326.0, 209.0, 377.0], [167.0, 326.0, 188.0, 376.0], [209.0, 326.0, 231.0, 378.0], [126.0, 325.0, 146.0, 376.0], [144.0, 325.0, 167.0, 376.0]], \"mask\": null, \"class_name\": [\"mov\", \"mov\", \"mov\", \"mov\", \"mov\", \"mov\"], \"label\": [0, 0, 0, 0, 0, 0], \"confidence\": [0.8682, 0.8223, 0.7695, 0.751, 0.7319, 0.6987], \"opencv_corrosion\": null}}, {\"data_vcvp/img_nbox/ac_v5_3p_mat_truoc/1695259256_ac_v5_3p.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": [\"MOV 1 tot\", \"MOV 1 tot\", \"MOV 1 tot\", \"MOV 1 tot\", \"MOV 1 tot\", \"MOV 1 tot\"], \"label\": [0, 0, 0, 0, 0, 0], \"confidence\": [0.9611490368843079, 0.9982163310050964, 0.9978492259979248, 0.9950868487358093, 0.9971565008163452, 0.9933648109436035], \"opencv_corrosion\": null}}]',1,'Đủ số lượng mov theo quy định.','{\"threshold\": 60, \"count\": 2}',99.05,'0898a710-76a6-4ca0-9d79-c39fce1504e1'),(14,'BH008','detector','[\"data_vcvp/img_nbox/ac_v5_3p_mat_truoc/1695259256_ac_v5_3p.jpg\", \"data_vcvp/img_nbox/ac_v5_3p_mat_truoc/1695259256_ac_v5_3p.jpg\"]','[]','[]','[{\"data_vcvp/img_nbox/ac_v5_3p_mat_truoc/1695259256_ac_v5_3p.jpg\": {\"xyxy\": [[104.0, 322.0, 126.0, 374.0], [188.0, 326.0, 209.0, 377.0], [167.0, 326.0, 188.0, 376.0], [209.0, 326.0, 231.0, 378.0], [126.0, 325.0, 146.0, 376.0], [144.0, 325.0, 167.0, 376.0]], \"mask\": null, \"class_name\": [\"mov\", \"mov\", \"mov\", \"mov\", \"mov\", \"mov\"], \"label\": [0, 0, 0, 0, 0, 0], \"confidence\": [0.8682, 0.8223, 0.7695, 0.751, 0.7319, 0.6987], \"opencv_corrosion\": null}}]',0,'Thiếu khóa liên động','{\"threshold\": 60}',0,'0898a710-76a6-4ca0-9d79-c39fce1504e1'),(15,'BD165','image_matching','[]','[\"data_vcvp/test_image/mong_cot_day_co_tong_quan/sample_mong_cot_day_co_tong_quan_155358715_103659400_mong-co-119.jpg\", \"data_vcvp/test_image/mong_cot_day_co_tong_quan/sample_mong_cot_day_co_tong_quan_155358715_103659400_mong-co-119.jpg\"]','[]','[{\"data_vcvp/test_image/mong_cot_day_co_tong_quan/sample_mong_cot_day_co_tong_quan_155358715_103659400_mong-co-119.jpg\": {\"xyxy\": [[51.524810791015625, 504.82574462890625, 861.154296875, 1077.408203125]], \"mask\": null, \"class_name\": [\"mong_cot_vuong\"], \"label\": null, \"confidence\": [0.9302746057510376], \"opencv_corrosion\": null}}, {\"data_vcvp/test_image/mong_cot_day_co_tong_quan/sample_mong_cot_day_co_tong_quan_155358715_103659400_mong-co-119.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": null, \"label\": null, \"confidence\": [1], \"opencv_corrosion\": null}}]',1,'Giong anh mau.','{\"threshold\": 0}',100,'d1e2df27-c16c-42e9-929f-8c5e7aead217'),(16,'BD001','classifier','[]','[\"data_vcvp/test_image/ac_v5_1p_mat_truoc/1695259037_ac_v5_1p.jpg\"]','[]','[{\"data_vcvp/test_image/ac_v5_1p_mat_truoc/1695259037_ac_v5_1p.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": [\"ac_v5_1_pha_dong\"], \"label\": [14], \"confidence\": [0.9969809651374817], \"opencv_corrosion\": null}}]',1,'Phát hiện đối tượng.','{\"threshold\": 90}',100,'28a9fde9-460b-48e8-ba72-9da72949fb7f'),(17,'BH002','detector-classifier','[]','[\"data_vcvp/test_image/ac_v5_1p_mat_truoc/1695259037_ac_v5_1p.jpg\"]','[]','[{\"data_vcvp/test_image/ac_v5_1p_mat_truoc/1695259037_ac_v5_1p.jpg\": {\"xyxy\": [[350.0, 214.0, 395.0, 331.0], [247.0, 267.0, 275.0, 334.0], [276.0, 265.0, 303.0, 334.0]], \"mask\": null, \"class_name\": [\"lock\", \"mov\", \"mov\"], \"label\": [1, 0, 0], \"confidence\": [0.8394, 0.8018, 0.8008], \"opencv_corrosion\": null}}, {\"data_vcvp/test_image/ac_v5_1p_mat_truoc/1695259037_ac_v5_1p.jpg\": {\"xyxy\": null, \"mask\": null, \"class_name\": [\"MOV 2 tot\", \"MOV 2 tot\"], \"label\": [3, 3], \"confidence\": [0.9991532564163208, 0.9987877011299133], \"opencv_corrosion\": null}}]',1,'Đủ số lượng mov theo quy định.','{\"threshold\": 60, \"count\": 2}',99.9,'28a9fde9-460b-48e8-ba72-9da72949fb7f'),(18,'BH003','detector','[]','[\"data_vcvp/test_image/ac_v5_1p_mat_truoc/1695259037_ac_v5_1p.jpg\"]','[]','[{\"data_vcvp/test_image/ac_v5_1p_mat_truoc/1695259037_ac_v5_1p.jpg\": {\"xyxy\": [[350.0, 214.0, 395.0, 331.0], [247.0, 267.0, 275.0, 334.0], [276.0, 265.0, 303.0, 334.0]], \"mask\": null, \"class_name\": [\"lock\", \"mov\", \"mov\"], \"label\": [1, 0, 0], \"confidence\": [0.8394, 0.8018, 0.8008], \"opencv_corrosion\": null}}]',1,'Đủ số lượng khóa liên động theo quy định.','{\"threshold\": 60}',83.94,'28a9fde9-460b-48e8-ba72-9da72949fb7f');
/*!40000 ALTER TABLE `tasks_result` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(10) NOT NULL,
  `usercode` int(11) DEFAULT NULL,
  `fullname` varchar(50) NOT NULL,
  `status` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usercode` (`usercode`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Viet',2,'Nguyen Hoang Viet','active'),(2,'Anh',0,'Nguyen Duy Anh','active'),(3,'Tu',3,'Nho Minh Tu','active'),(4,'Hung',1,'Ho Xuan Hung','active');
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

-- Dump completed on 2024-09-19  4:02:52
