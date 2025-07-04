-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 03 juil. 2025 à 11:01
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `admin_app`
--

-- --------------------------------------------------------

--
-- Structure de la table `article`
--

DROP TABLE IF EXISTS `article`;
CREATE TABLE IF NOT EXISTS `article` (
  `code` varchar(20) NOT NULL,
  `libelle` varchar(100) DEFAULT NULL,
  `famille` varchar(10) NOT NULL,
  `libellefam` varchar(50) DEFAULT NULL,
  `unite` varchar(10) DEFAULT NULL,
  `nbunite` double DEFAULT '1',
  `tva` double DEFAULT '0',
  `type` varchar(20) DEFAULT NULL,
  `prixbrut` double DEFAULT '0',
  `remise` double DEFAULT '0',
  `prixnet` double DEFAULT '0',
  `marge` double DEFAULT '0',
  `prixht` double DEFAULT '0',
  `prixttc` double DEFAULT '0',
  `prixht1` double DEFAULT '0',
  `prixttc1` double DEFAULT '0',
  `defalcation` varchar(1) DEFAULT '0',
  `gconf` varchar(1) DEFAULT '0',
  `conf` text,
  `dc` double DEFAULT '0',
  `fodec` double DEFAULT '0',
  `affcaisse` varchar(1) DEFAULT '0',
  `serie` varchar(1) DEFAULT '0',
  `libellear` varchar(50) DEFAULT NULL,
  `codecat` varchar(5) DEFAULT NULL,
  `libcat` varchar(50) DEFAULT NULL,
  `codefourn` varchar(20) DEFAULT NULL,
  `libfourn` varchar(200) DEFAULT NULL,
  `nature` varchar(20) DEFAULT NULL,
  `cheminimg` varchar(250) DEFAULT NULL,
  `prixmin` double DEFAULT '0',
  `prixmax` double DEFAULT '0',
  `usera` varchar(5) DEFAULT NULL,
  `libusera` varchar(50) DEFAULT NULL,
  `userm` varchar(5) DEFAULT NULL,
  `libuserm` varchar(50) DEFAULT NULL,
  `users` varchar(5) DEFAULT NULL,
  `libusers` varchar(50) DEFAULT NULL,
  `datem` date DEFAULT NULL,
  `timem` varchar(10) DEFAULT NULL,
  `prixachinit` double DEFAULT '0',
  `tvaach` double DEFAULT '0',
  `artdim` varchar(1) DEFAULT '0',
  `cemp` varchar(5) DEFAULT NULL,
  `libemp` varchar(50) DEFAULT NULL,
  `balance` varchar(1) DEFAULT '0',
  `inactif` varchar(1) DEFAULT '0',
  `datecreation` date DEFAULT NULL,
  `prixbrut1` double DEFAULT '0',
  `remise1` double DEFAULT '0',
  `enstock` varchar(1) DEFAULT '0',
  `codebarre` varchar(20) DEFAULT NULL,
  `image2` blob,
  `longueur` double DEFAULT '0',
  `largeur` double DEFAULT '0',
  `hauteur` double DEFAULT '0',
  `mvtart` varchar(5) DEFAULT 'PF',
  `codenuance` varchar(5) DEFAULT NULL,
  `libnuance` varchar(50) DEFAULT NULL,
  `nbjour` double DEFAULT '0',
  `codemar` varchar(5) DEFAULT NULL,
  `libmar` varchar(50) DEFAULT NULL,
  `codech` varchar(5) DEFAULT NULL,
  `libch` varchar(50) DEFAULT NULL,
  `codecli` varchar(20) DEFAULT NULL,
  `libcli` varchar(150) DEFAULT NULL,
  `coderef` varchar(20) DEFAULT NULL,
  `libref` varchar(150) DEFAULT NULL,
  `poids` double DEFAULT '0',
  `dechet` double DEFAULT '0',
  `codedomaine` varchar(5) DEFAULT NULL,
  `libdomaine` varchar(50) DEFAULT NULL,
  `movre` double DEFAULT '0',
  `formeart` varchar(50) DEFAULT NULL,
  `codefinit` varchar(5) DEFAULT NULL,
  `libfinit` varchar(50) DEFAULT NULL,
  `libdet` varchar(50) DEFAULT NULL,
  `qtemin` double DEFAULT '0',
  `qtemax` double DEFAULT '0',
  `nbuniteim` double DEFAULT '1',
  `ttcach` double DEFAULT '0',
  `basetva` double DEFAULT '0',
  `mttva` double DEFAULT '0',
  `autretaxe` double DEFAULT '0',
  `smtva` varchar(2) DEFAULT '0',
  `remisev` double DEFAULT '0',
  `tva2` double DEFAULT '0',
  `fodeca` double DEFAULT '0',
  PRIMARY KEY (`code`,`famille`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

DROP TABLE IF EXISTS `client`;
CREATE TABLE IF NOT EXISTS `client` (
  `code` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `rsoc` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `adresse` varchar(500) DEFAULT NULL,
  `mf` varchar(30) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `ville` varchar(30) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `tel` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `respercon1` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `coderep` varchar(5) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `librep` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `fax` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `percon1` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `telpercon1` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `emailpercon1` varchar(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `percon2` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `respercon2` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `telpercon2` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `emailpercon2` varchar(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `email` varchar(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `percon3` varchar(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `telpercon3` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `emailpercon3` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `respercon3` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `RC` varchar(25) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `CP` varchar(5) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `RIB` varchar(30) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `cville` varchar(5) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `banque` varchar(25) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `timbre` varchar(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '0',
  `exo` varchar(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '0',
  `susp` varchar(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '0',
  `reel` varchar(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '0',
  `datedebut` date DEFAULT NULL,
  `datefin` date DEFAULT NULL,
  `decision` varchar(30) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `export` varchar(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '0',
  `soldeinit` double DEFAULT '0',
  `prix` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `mtreg` double DEFAULT '0',
  `rap` varchar(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT 'N',
  `soldeinitbl` double DEFAULT '0',
  `mtregbl` double DEFAULT '0',
  `rapbl` double DEFAULT '0',
  `rapbc` varchar(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '0',
  `remise` double DEFAULT '0',
  `regime` varchar(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT 'R',
  `soldeinitbc` double DEFAULT '0',
  `mtrapbc` double DEFAULT '0',
  `soldeimp` double DEFAULT '0',
  `scredit` double DEFAULT '0',
  `srisque` double DEFAULT '0',
  `delaireg` double DEFAULT '0',
  `codetarif` varchar(5) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `libtarif` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `codesect` varchar(5) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `libsect` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `codereg` varchar(5) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `libreg` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `codeact` varchar(5) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `libact` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `libpost` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `codetypreg` varchar(5) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `libtypreg` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `codebanq` varchar(5) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `adressefact` varchar(500) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `comptec` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `rsocar` varchar(150) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `datecreation` date DEFAULT NULL,
  `datevalidation` date DEFAULT NULL,
  `validation` varchar(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '0',
  `blocage` varchar(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '0',
  `message` text CHARACTER SET latin1 COLLATE latin1_swedish_ci,
  `tel2` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `numcompte` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `codegr` varchar(5) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `libgr` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `parunite` varchar(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '0',
  `adressear` varchar(500) DEFAULT NULL,
  `tauxret` double DEFAULT '0',
  `codequal` varchar(5) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `libqual` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `descl` text CHARACTER SET latin1 COLLATE latin1_swedish_ci,
  `prod` varchar(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT '0',
  `adressebanque` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`code`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `client`
--

INSERT INTO `client` (`code`, `rsoc`, `adresse`, `mf`, `ville`, `tel`, `respercon1`, `coderep`, `librep`, `fax`, `percon1`, `telpercon1`, `emailpercon1`, `percon2`, `respercon2`, `telpercon2`, `emailpercon2`, `email`, `percon3`, `telpercon3`, `emailpercon3`, `respercon3`, `RC`, `CP`, `RIB`, `cville`, `banque`, `timbre`, `exo`, `susp`, `reel`, `datedebut`, `datefin`, `decision`, `export`, `soldeinit`, `prix`, `mtreg`, `rap`, `soldeinitbl`, `mtregbl`, `rapbl`, `rapbc`, `remise`, `regime`, `soldeinitbc`, `mtrapbc`, `soldeimp`, `scredit`, `srisque`, `delaireg`, `codetarif`, `libtarif`, `codesect`, `libsect`, `codereg`, `libreg`, `codeact`, `libact`, `libpost`, `codetypreg`, `libtypreg`, `codebanq`, `adressefact`, `comptec`, `rsocar`, `datecreation`, `datevalidation`, `validation`, `blocage`, `message`, `tel2`, `numcompte`, `codegr`, `libgr`, `parunite`, `adressear`, `tauxret`, `codequal`, `libqual`, `descl`, `prod`, `adressebanque`) VALUES
('C007', 'raison2', 'ADRESSE2', '4444', 'sfax', '25335753', NULL, 'R002', 'bot3', '74563214', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'client02@gmail.com', NULL, NULL, NULL, NULL, '', '3011', '', NULL, '', '0', '0', '0', '0', NULL, NULL, NULL, '0', 0, NULL, 0, 'N', 0, 0, 0, '0', 20, 'R', 0, 0, 0, 700, 0, 40, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, '0', '0', '', '', NULL, NULL, NULL, '0', NULL, 0, NULL, NULL, NULL, '0', NULL),
('C001', 'raison1', 'Sakiet Eddaier', '123', 'sfax', '25335753', NULL, 'R001', 'bot2', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'client01@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', '0', '0', '0', NULL, NULL, NULL, '0', 0, NULL, 0, 'N', 0, 0, 0, '0', 6, 'R', 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, '0', NULL, 0, NULL, NULL, NULL, '0', NULL),
('C005', 'MARHBA', 'Avenue Hedi chaker N°4 (ben attouch) - Sakiet Eddaier', '4444', 'sfax', '2534848', NULL, 'R001', 'bot2', '74563214', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'marhba@gmail.com', NULL, NULL, NULL, NULL, '', '3011', '446446464', NULL, 'test 367', '0', '0', '0', '0', NULL, NULL, NULL, '0', 0, NULL, 0, 'N', 0, 0, 0, '0', 9, 'R', 0, 0, 0, 50, 0, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'adr de facturisation', NULL, NULL, NULL, NULL, '0', '0', 'commentaires 1', '', NULL, NULL, NULL, '0', NULL, 0, NULL, NULL, NULL, '0', NULL),
('C002', 'MARHBABIK', 'Sakiet Eddaier', '123', 'sfax', '25335753', NULL, 'R002', 'bot3', '74561122', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'marhbabik@gmail.com', NULL, NULL, NULL, NULL, '', '3011', '', NULL, '', '0', '0', '0', '0', NULL, NULL, NULL, '0', 0, NULL, 0, 'N', 0, 0, 0, '0', 0, 'R', 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, '0', '0', '', '', NULL, NULL, NULL, '0', NULL, 0, NULL, NULL, NULL, '0', NULL),
('C010', 'client10', 'Sakiet', '123', 'monestir', '2533115', NULL, 'R001', 'bot2', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'marhba@gmail.com', NULL, NULL, NULL, NULL, '', '3011', '', NULL, '', '0', '0', '0', '0', NULL, NULL, NULL, '0', 0, NULL, 0, 'N', 0, 0, 0, '0', 0, 'R', 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, '0', '0', '', '', NULL, NULL, NULL, '0', NULL, 0, NULL, NULL, NULL, '0', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `ebcw`
--

DROP TABLE IF EXISTS `ebcw`;
CREATE TABLE IF NOT EXISTS `ebcw` (
  `numbc` int NOT NULL AUTO_INCREMENT,
  `datebc` date DEFAULT NULL,
  `numfactf` varchar(25) DEFAULT NULL,
  `facture` varchar(25) DEFAULT NULL,
  `typef` varchar(1) DEFAULT 'N',
  `refbcc` varchar(25) DEFAULT NULL,
  `ccl` int DEFAULT NULL,
  `rsocf` varchar(100) DEFAULT NULL,
  `adresf` varchar(150) DEFAULT NULL,
  `matricule` varchar(20) DEFAULT NULL,
  `commentaire` varchar(100) DEFAULT NULL,
  `tel` varchar(20) DEFAULT NULL,
  `fax` varchar(20) DEFAULT NULL,
  `mht` double DEFAULT '0',
  `mnht` double DEFAULT '0',
  `remise` double DEFAULT '0',
  `mttc` double DEFAULT '0',
  `mpayer` double DEFAULT '0',
  `mfodec` double DEFAULT '0',
  `taxe` double DEFAULT '0',
  `bfodec` double DEFAULT '1',
  `base1` double DEFAULT '0',
  `base2` double DEFAULT '6',
  `base3` double DEFAULT '12',
  `base4` double DEFAULT '18',
  `tva1` double DEFAULT '0',
  `tva2` double DEFAULT '0',
  `tva3` double DEFAULT '0',
  `tva4` double DEFAULT '0',
  `mtva` double DEFAULT '0',
  `mt_lettre` varchar(250) DEFAULT NULL,
  `susp` varchar(1) DEFAULT '0',
  `exo` varchar(1) DEFAULT '0',
  `export` varchar(1) DEFAULT '0',
  `decision` varchar(150) DEFAULT NULL,
  `tvadue` double DEFAULT '0',
  `tvasidue` varchar(50) DEFAULT NULL,
  `mdc` double DEFAULT '0',
  `coderap` varchar(2) DEFAULT '0',
  `mtr` double DEFAULT '0',
  `regime` varchar(5) DEFAULT NULL,
  `baseavance` double DEFAULT '0',
  `mavance` double DEFAULT '0',
  `coderep` varchar(5) DEFAULT NULL,
  `librep` varchar(50) DEFAULT NULL,
  `codechauf` varchar(5) DEFAULT NULL,
  `libchauf` varchar(50) DEFAULT NULL,
  `codeveh` varchar(5) DEFAULT NULL,
  `libveh` varchar(50) DEFAULT NULL,
  `codesect` varchar(5) DEFAULT NULL,
  `libsect` varchar(50) DEFAULT NULL,
  `codereg` varchar(5) DEFAULT NULL,
  `libreg` varchar(50) DEFAULT NULL,
  `codepv` varchar(5) DEFAULT NULL,
  `libpv` varchar(50) DEFAULT NULL,
  `usera` varchar(5) DEFAULT NULL,
  `libusera` varchar(50) DEFAULT NULL,
  `userm` varchar(5) DEFAULT NULL,
  `libuserm` varchar(50) DEFAULT NULL,
  `users` varchar(5) DEFAULT NULL,
  `libusers` varchar(50) DEFAULT NULL,
  `datem` date DEFAULT NULL,
  `timem` varchar(10) DEFAULT NULL,
  `commentaire1` text,
  `generer` varchar(1) DEFAULT '0',
  `cloture` varchar(1) DEFAULT '0',
  `accompte` text,
  `dateblp` date DEFAULT NULL,
  `devise` varchar(20) DEFAULT NULL,
  `description` text,
  `commentaire3` text,
  `modepaiement` text,
  `elaborer` varchar(100) DEFAULT NULL,
  `perdliv` varchar(100) DEFAULT NULL,
  `numdv` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`numbc`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `lbcw`
--

DROP TABLE IF EXISTS `lbcw`;
CREATE TABLE IF NOT EXISTS `lbcw` (
  `numbc` double NOT NULL,
  `datebc` date DEFAULT NULL,
  `nligne` int NOT NULL AUTO_INCREMENT,
  `codeart` varchar(20) NOT NULL,
  `libart` varchar(150) DEFAULT NULL,
  `famille` varchar(20) NOT NULL,
  `puart` double DEFAULT '0',
  `qte` double DEFAULT '0',
  `qteg` double DEFAULT '0',
  `tva` double DEFAULT '0',
  `remise` double DEFAULT '0',
  `fodec` double DEFAULT '0',
  `nbun` varchar(10) DEFAULT NULL,
  `unite` varchar(12) DEFAULT NULL,
  `codedep` varchar(5) DEFAULT NULL,
  `libdep` varchar(50) DEFAULT NULL,
  `typeart` varchar(20) DEFAULT NULL,
  `conf` text,
  `dc` double DEFAULT '0',
  `ccl` varchar(20) DEFAULT NULL,
  `rsocf` varchar(100) DEFAULT NULL,
  `coderep` varchar(5) DEFAULT NULL,
  `librep` varchar(50) DEFAULT NULL,
  `codechauf` varchar(5) DEFAULT NULL,
  `libchauf` varchar(50) DEFAULT NULL,
  `codeveh` varchar(5) DEFAULT NULL,
  `libveh` varchar(50) DEFAULT NULL,
  `codesecT` varchar(5) DEFAULT NULL,
  `libsect` varchar(50) DEFAULT NULL,
  `codereg` varchar(5) DEFAULT NULL,
  `libreg` varchar(50) DEFAULT NULL,
  `codepv` varchar(5) DEFAULT NULL,
  `libpv` varchar(50) DEFAULT NULL,
  `serie` varchar(1) DEFAULT '0',
  PRIMARY KEY (`nligne`)
) ENGINE=MyISAM AUTO_INCREMENT=47 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `logs`
--

DROP TABLE IF EXISTS `logs`;
CREATE TABLE IF NOT EXISTS `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `representant_code` varchar(10) NOT NULL COMMENT 'Code représentant (R001, R002, etc.)',
  `action` varchar(50) NOT NULL,
  `entity` varchar(50) NOT NULL,
  `entity_id` varchar(50) DEFAULT NULL,
  `field` varchar(100) DEFAULT NULL,
  `entity_subid` varchar(100) DEFAULT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `details` text,
  `ip_address` varchar(45) DEFAULT NULL COMMENT 'Adresse IP de la requête',
  `user_agent` text COMMENT 'User agent du navigateur',
  PRIMARY KEY (`id`),
  KEY `idx_representant_code` (`representant_code`),
  KEY `idx_action` (`action`),
  KEY `idx_timestamp` (`timestamp`)
) ENGINE=MyISAM AUTO_INCREMENT=172 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `logs`
--

INSERT INTO `logs` (`id`, `representant_code`, `action`, `entity`, `entity_id`, `field`, `entity_subid`, `timestamp`, `details`, `ip_address`, `user_agent`) VALUES
(171, 'R001', 'LOGIN_SUCCESS', 'authentication', 'bot2@gmail.com', NULL, NULL, '2025-07-03 12:01:05', '{\"email\":\"bot2@gmail.com\",\"timestamp\":\"2025-07-03T11:01:05.087Z\",\"ip_display\":\"127.0.0.1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'),
(170, 'R001', 'LOGOUT', 'authentication', 'bot2@gmail.com', NULL, NULL, '2025-07-03 12:01:01', '{\"email\":\"bot2@gmail.com\",\"timestamp\":\"2025-07-03T11:01:01.824Z\",\"ip_display\":\"127.0.0.1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'),
(169, 'R001', 'LOGIN_SUCCESS', 'authentication', 'bot2@gmail.com', NULL, NULL, '2025-07-03 11:24:33', '{\"email\":\"bot2@gmail.com\",\"timestamp\":\"2025-07-03T10:24:33.530Z\",\"ip_display\":\"127.0.0.1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'),
(168, 'R001', 'LOGIN_SUCCESS', 'authentication', 'bot2@gmail.com', NULL, NULL, '2025-07-03 10:54:33', '{\"email\":\"bot2@gmail.com\",\"timestamp\":\"2025-07-03T09:54:33.961Z\",\"ip_display\":\"127.0.0.1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'),
(167, 'R001', 'LOGIN_SUCCESS', 'authentication', 'bot2@gmail.com', NULL, NULL, '2025-07-03 10:54:19', '{\"email\":\"bot2@gmail.com\",\"timestamp\":\"2025-07-03T09:54:19.069Z\",\"ip_display\":\"127.0.0.1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'),
(166, 'R001', 'LOGIN_SUCCESS', 'authentication', 'bot2@gmail.com', NULL, NULL, '2025-07-03 10:54:02', '{\"email\":\"bot2@gmail.com\",\"timestamp\":\"2025-07-03T09:54:02.096Z\",\"ip_display\":\"127.0.0.1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'),
(165, 'R001', 'LOGIN_SUCCESS', 'authentication', 'bot2@gmail.com', NULL, NULL, '2025-07-03 10:51:25', '{\"email\":\"bot2@gmail.com\",\"timestamp\":\"2025-07-03T09:51:25.718Z\",\"ip_display\":\"127.0.0.1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'),
(164, 'R001', 'LOGIN_SUCCESS', 'authentication', 'bot2@gmail.com', NULL, NULL, '2025-07-03 10:50:19', '{\"email\":\"bot2@gmail.com\",\"timestamp\":\"2025-07-03T09:50:19.775Z\",\"ip_display\":\"127.0.0.1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'),
(163, 'R001', 'LOGIN_SUCCESS', 'authentication', 'bot2@gmail.com', NULL, NULL, '2025-07-03 10:50:05', '{\"email\":\"bot2@gmail.com\",\"timestamp\":\"2025-07-03T09:50:05.629Z\",\"ip_display\":\"127.0.0.1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'),
(162, 'R001', 'LOGIN_SUCCESS', 'authentication', 'bot2@gmail.com', NULL, NULL, '2025-07-03 10:23:57', '{\"email\":\"bot2@gmail.com\",\"timestamp\":\"2025-07-03T09:23:57.880Z\",\"ip_display\":\"127.0.0.1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36');

-- --------------------------------------------------------

--
-- Structure de la table `reglementw`
--

DROP TABLE IF EXISTS `reglementw`;
CREATE TABLE IF NOT EXISTS `reglementw` (
  `numreg` int NOT NULL AUTO_INCREMENT,
  `typereg` varchar(20) DEFAULT NULL,
  `datereg` date DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `numfact` varchar(20) DEFAULT NULL,
  `datefact` date DEFAULT NULL,
  `mtfact` double DEFAULT '0',
  `taux` double DEFAULT '0',
  `typepiece` varchar(20) DEFAULT NULL,
  `numcheff` varchar(20) DEFAULT NULL,
  `dateech` date DEFAULT NULL,
  `codebanq` varchar(5) DEFAULT NULL,
  `banque` varchar(20) DEFAULT NULL,
  `ville` varchar(20) DEFAULT NULL,
  `signataire` varchar(50) DEFAULT NULL,
  `dateenc` date DEFAULT NULL,
  `numbord` varchar(20) DEFAULT NULL,
  `codebanqbord` varchar(5) DEFAULT NULL,
  `banquebord` varchar(30) DEFAULT NULL,
  `datevers` date DEFAULT NULL,
  `codecli` varchar(20) DEFAULT NULL,
  `rscli` varchar(150) DEFAULT NULL,
  `rap` varchar(2) DEFAULT '0',
  `imp` varchar(2) NOT NULL DEFAULT '0',
  `vers` varchar(2) DEFAULT '0',
  `enc` varchar(2) DEFAULT '0',
  `mtreg` double DEFAULT '0',
  `mtrestregF` double DEFAULT '0',
  `mtrestregb` double DEFAULT '0',
  `mtrestregbcc` double DEFAULT '0',
  `recu` varchar(20) DEFAULT NULL,
  `codecaisse` varchar(5) DEFAULT NULL,
  `libcaisse` varchar(30) DEFAULT NULL,
  `codepv` varchar(5) DEFAULT NULL,
  `libpv` varchar(30) DEFAULT NULL,
  `typeret` varchar(30) DEFAULT NULL,
  `rapbl` varchar(1) DEFAULT '0',
  `rapbcc` varchar(1) DEFAULT '0',
  `usera` varchar(5) DEFAULT NULL,
  `libusera` varchar(50) DEFAULT NULL,
  `userm` varchar(5) DEFAULT NULL,
  `libuserm` varchar(50) DEFAULT NULL,
  `users` varchar(5) DEFAULT NULL,
  `libusers` varchar(50) DEFAULT NULL,
  `datem` date DEFAULT NULL,
  `coderep` varchar(5) DEFAULT NULL,
  `librep` varchar(50) DEFAULT NULL,
  `libelleimp` text,
  `integ` varchar(1) DEFAULT '0',
  `numinteg` varchar(20) DEFAULT NULL,
  `tmpinteg` varchar(1) DEFAULT '0',
  `versb` varchar(1) DEFAULT '0',
  `import` varchar(1) DEFAULT '0',
  `transfert` varchar(1) DEFAULT '0',
  `numpaiement` varchar(20) DEFAULT NULL,
  `devise` varchar(20) DEFAULT NULL,
  `mtfact2` double DEFAULT '0',
  `taux2` double DEFAULT '0',
  `numregimport` varchar(20) DEFAULT NULL,
  `cloture` varchar(1) DEFAULT '0',
  `numclot` varchar(20) DEFAULT NULL,
  `codereg` varchar(5) DEFAULT NULL,
  `libreg` varchar(50) DEFAULT NULL,
  `fraisb` double DEFAULT '0',
  PRIMARY KEY (`numreg`),
  KEY `fk_reglementw_client` (`codecli`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `reglementw`
--

INSERT INTO `reglementw` (`numreg`, `typereg`, `datereg`, `description`, `numfact`, `datefact`, `mtfact`, `taux`, `typepiece`, `numcheff`, `dateech`, `codebanq`, `banque`, `ville`, `signataire`, `dateenc`, `numbord`, `codebanqbord`, `banquebord`, `datevers`, `codecli`, `rscli`, `rap`, `imp`, `vers`, `enc`, `mtreg`, `mtrestregF`, `mtrestregb`, `mtrestregbcc`, `recu`, `codecaisse`, `libcaisse`, `codepv`, `libpv`, `typeret`, `rapbl`, `rapbcc`, `usera`, `libusera`, `userm`, `libuserm`, `users`, `libusers`, `datem`, `coderep`, `librep`, `libelleimp`, `integ`, `numinteg`, `tmpinteg`, `versb`, `import`, `transfert`, `numpaiement`, `devise`, `mtfact2`, `taux2`, `numregimport`, `cloture`, `numclot`, `codereg`, `libreg`, `fraisb`) VALUES
(1, 'Virement', '2024-05-31', 'Règlement commande 1', 'F001', NULL, 12, 0, NULL, '', '0000-00-00', NULL, 'atb', NULL, '', NULL, '2516556165', NULL, NULL, NULL, 'C002', '', '0', '0', '0', '0', 12, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '0', '0', NULL, NULL, '1', 'bot2', NULL, NULL, '2025-07-01', NULL, NULL, NULL, '0', NULL, '0', '0', '0', '0', '1013135131', NULL, 0, 0, NULL, '0', NULL, NULL, NULL, 0),
(2, 'Chèque', '2024-06-01', 'Règlement commande 2', 'F002', NULL, 21, 0, NULL, '1531313', '0000-00-00', NULL, '', NULL, 'epsilon', NULL, '', NULL, NULL, NULL, 'C005', '', '0', '0', '0', '0', 21, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '0', '0', NULL, NULL, '1', 'bot2', NULL, NULL, '2025-07-01', NULL, NULL, NULL, '0', NULL, '0', '0', '0', '0', '', NULL, 0, 0, NULL, '0', NULL, NULL, NULL, 0),
(3, 'Espèces', '2024-05-31', 'Règlement commande 3', 'F003', NULL, 21, 0, NULL, '', '1899-11-28', NULL, '', NULL, '', NULL, '', NULL, NULL, NULL, 'C007', '', '0', '0', '0', '0', 444, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '0', '0', NULL, NULL, '1', 'bot2', NULL, NULL, '2025-07-01', NULL, NULL, NULL, '0', NULL, '0', '0', '0', '0', '', NULL, 0, 0, NULL, '0', NULL, NULL, NULL, 0),
(4, 'Virement', '2024-06-03', 'Règlement commande 4', 'F004', NULL, 15, 0, NULL, '', '0000-00-00', NULL, '13132132132', NULL, '', NULL, '', NULL, NULL, NULL, 'C006', '', '0', '0', '0', '0', 15, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '0', '0', NULL, NULL, '1', 'bot2', NULL, NULL, '2025-07-01', NULL, NULL, NULL, '0', NULL, '0', '0', '0', '0', '1132131', NULL, 0, 0, NULL, '0', NULL, NULL, NULL, 0),
(5, 'Chèque', '2024-06-04', 'Règlement commande 5', 'F005', NULL, 12.6, 0, NULL, '2123113', '0000-00-00', NULL, '', NULL, '153131', NULL, '', NULL, NULL, NULL, 'C004', '', '0', '0', '0', '0', 12.6, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '0', '0', NULL, NULL, '1', 'bot2', NULL, NULL, '2025-07-01', NULL, NULL, NULL, '0', NULL, '0', '0', '0', '0', '', NULL, 0, 0, NULL, '0', NULL, NULL, NULL, 0),
(6, 'Espèces', '2024-06-05', 'Règlement commande 6', 'F006', NULL, 12.6, 0, NULL, '', '0000-00-00', NULL, '', NULL, '', NULL, '', NULL, NULL, NULL, 'C003', '', '0', '0', '0', '0', 12.6, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '0', '0', NULL, NULL, '1', 'bot2', NULL, NULL, '2025-07-01', NULL, NULL, NULL, '0', NULL, '0', '0', '0', '0', '', NULL, 0, 0, NULL, '0', NULL, NULL, NULL, 0),
(7, 'Espèces', '2025-07-10', 'Règlement commande 7', 'F008', NULL, 0, 1, NULL, '', '1899-11-29', NULL, '', NULL, '', NULL, '', NULL, NULL, NULL, 'C001', '', '0', '0', '0', '0', 123469, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '0', '0', '1', 'bot2', '1', 'bot2', NULL, NULL, '2025-07-01', NULL, NULL, NULL, '0', NULL, '0', '0', '0', '0', '', 'TND', 0, 0, NULL, '0', NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `representant`
--

DROP TABLE IF EXISTS `representant`;
CREATE TABLE IF NOT EXISTS `representant` (
  `code` varchar(10) NOT NULL,
  `libelle` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `typerep` varchar(30) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `codedep` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `libdep` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `codec` varchar(10) DEFAULT NULL,
  `libc` varchar(50) DEFAULT NULL,
  `password` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  PRIMARY KEY (`code`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `representant`
--

INSERT INTO `representant` (`code`, `libelle`, `email`, `typerep`, `codedep`, `libdep`, `codec`, `libc`, `password`) VALUES
('R001', 'bot2', 'bot2@gmail.com', 'Commercial', NULL, NULL, NULL, NULL, '$2b$10$RMqY2473i8KfvvbfKv6zw.YEPB50/lrrMYk0Fj8Y08t3tF4MHmd4i'),
('R002', 'bot3', 'bot3@gmail.com', 'Commercial', NULL, NULL, NULL, NULL, '$2b$10$B9v474.xN7DZkL7A0dp8BeVgK0Yc208ReMvJvVSBtyz1yliOYUdmq');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
