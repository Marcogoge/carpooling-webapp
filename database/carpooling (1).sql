-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Feb 19, 2026 alle 11:43
-- Versione del server: 10.4.32-MariaDB
-- Versione PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `carpooling`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `autista`
--

CREATE TABLE `autista` (
  `id_autista` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `cognome` varchar(50) NOT NULL,
  `num_patente` varchar(20) NOT NULL,
  `scadenza_patente` date NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `foto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `autista`
--

INSERT INTO `autista` (`id_autista`, `nome`, `cognome`, `num_patente`, `scadenza_patente`, `telefono`, `email`, `foto`) VALUES
(1, 'Marco', 'Rossi', 'PAT12345A', '2028-05-12', '3331111111', 'marco.rossi@email.it', 'marco.jpg'),
(2, 'Luca', 'Bianchi', 'PAT67890B', '2027-11-20', '3332222222', 'luca.bianchi@email.it', 'luca.jpg'),
(3, 'Giulia', 'Verdi', 'PAT54321C', '2029-03-15', '3333333333', 'giulia.verdi@email.it', 'giulia.jpg'),
(4, 'Sara', 'Neri', 'PAT98765D', '2026-07-01', '3334444444', 'sara.neri@email.it', 'sara.jpg');

-- --------------------------------------------------------

--
-- Struttura della tabella `feedback`
--

CREATE TABLE `feedback` (
  `id_feedback` int(11) NOT NULL,
  `voto` int(11) NOT NULL CHECK (`voto` between 1 and 5),
  `giudizio` text DEFAULT NULL,
  `id_viaggio` int(11) NOT NULL,
  `id_autore_passeggero` int(11) NOT NULL,
  `id_destinatario_autista` int(11) DEFAULT NULL,
  `id_destinatario_passeggero` int(11) DEFAULT NULL,
  `tipo_feedback` enum('per_autista','per_passeggero') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `feedback`
--

INSERT INTO `feedback` (`id_feedback`, `voto`, `giudizio`, `id_viaggio`, `id_autore_passeggero`, `id_destinatario_autista`, `id_destinatario_passeggero`, `tipo_feedback`) VALUES
(1, 5, 'Viaggio perfetto, puntuale e simpatico.', 1, 1, 1, NULL, 'per_autista'),
(2, 4, 'Guida sicura.', 1, 2, 1, NULL, 'per_autista'),
(3, 5, 'Auto pulita e comoda.', 2, 4, 2, NULL, 'per_autista');

-- --------------------------------------------------------

--
-- Struttura della tabella `passeggero`
--

CREATE TABLE `passeggero` (
  `id_passeggero` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `cognome` varchar(50) NOT NULL,
  `documento_identita` varchar(30) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `passeggero`
--

INSERT INTO `passeggero` (`id_passeggero`, `nome`, `cognome`, `documento_identita`, `telefono`, `email`) VALUES
(1, 'Alessandro', 'Conti', 'DOC001', '3401111111', 'alessandro@email.it'),
(2, 'Francesca', 'Romano', 'DOC002', '3402222222', 'francesca@email.it'),
(3, 'Matteo', 'Galli', 'DOC003', '3403333333', 'matteo@email.it'),
(4, 'Chiara', 'Ferrari', 'DOC004', '3404444444', 'chiara@email.it'),
(5, 'Davide', 'Greco', 'DOC005', '3405555555', 'davide@email.it'),
(6, 'Elena', 'Martini', 'DOC006', '3406666666', 'elena@email.it');

-- --------------------------------------------------------

--
-- Struttura della tabella `prenotazione`
--

CREATE TABLE `prenotazione` (
  `id_prenotazione` int(11) NOT NULL,
  `data_prenotazione` datetime DEFAULT current_timestamp(),
  `stato` enum('attesa','accettata','rifiutata') NOT NULL DEFAULT 'attesa',
  `id_viaggio` int(11) NOT NULL,
  `id_passeggero` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `prenotazione`
--

INSERT INTO `prenotazione` (`id_prenotazione`, `data_prenotazione`, `stato`, `id_viaggio`, `id_passeggero`) VALUES
(1, '2026-02-12 11:20:59', 'accettata', 1, 1),
(2, '2026-02-12 11:20:59', 'accettata', 1, 2),
(3, '2026-02-12 11:20:59', 'attesa', 1, 3),
(4, '2026-02-12 11:20:59', 'accettata', 2, 4),
(5, '2026-02-12 11:20:59', 'rifiutata', 2, 5),
(6, '2026-02-12 11:20:59', 'accettata', 3, 6),
(7, '2026-02-12 11:20:59', 'accettata', 4, 1),
(8, '2026-02-12 11:20:59', 'attesa', 4, 2),
(9, '2026-02-12 11:20:59', 'accettata', 5, 3),
(10, '2026-02-12 11:20:59', 'accettata', 5, 4);

-- --------------------------------------------------------

--
-- Struttura della tabella `viaggio`
--

CREATE TABLE `viaggio` (
  `id_viaggio` int(11) NOT NULL,
  `citta_partenza` varchar(100) NOT NULL,
  `citta_arrivo` varchar(100) NOT NULL,
  `data_ora_partenza` datetime NOT NULL,
  `tempo_stimato` int(11) NOT NULL,
  `contributo` decimal(6,2) NOT NULL,
  `soste` text DEFAULT NULL,
  `bagaglio` tinyint(1) DEFAULT 1,
  `animali` tinyint(1) DEFAULT 0,
  `posti_max` int(11) NOT NULL,
  `marca_auto` varchar(50) NOT NULL,
  `modello_auto` varchar(50) NOT NULL,
  `targa_auto` varchar(20) NOT NULL,
  `id_autista` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `viaggio`
--

INSERT INTO `viaggio` (`id_viaggio`, `citta_partenza`, `citta_arrivo`, `data_ora_partenza`, `tempo_stimato`, `contributo`, `soste`, `bagaglio`, `animali`, `posti_max`, `marca_auto`, `modello_auto`, `targa_auto`, `id_autista`) VALUES
(1, 'Milano', 'Roma', '2026-03-10 08:00:00', 180, 35.00, 'Bologna, Firenze', 1, 0, 4, 'Fiat', 'Tipo', 'AB123CD', 1),
(2, 'Torino', 'Genova', '2026-03-12 14:30:00', 120, 20.00, NULL, 1, 1, 3, 'Volkswagen', 'Golf', 'EF456GH', 2),
(3, 'Bologna', 'Venezia', '2026-03-15 09:00:00', 90, 18.00, 'Padova', 1, 0, 2, 'Toyota', 'Yaris', 'IJ789KL', 3),
(4, 'Roma', 'Napoli', '2026-03-18 16:00:00', 120, 22.00, 'Cassino', 1, 1, 4, 'Ford', 'Focus', 'MN321OP', 4),
(5, 'Milano', 'Firenze', '2026-03-20 07:30:00', 120, 25.00, 'Parma', 1, 0, 3, 'Audi', 'A3', 'QR654ST', 1);

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `autista`
--
ALTER TABLE `autista`
  ADD PRIMARY KEY (`id_autista`),
  ADD UNIQUE KEY `num_patente` (`num_patente`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indici per le tabelle `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id_feedback`),
  ADD KEY `id_viaggio` (`id_viaggio`),
  ADD KEY `id_autore_passeggero` (`id_autore_passeggero`),
  ADD KEY `id_destinatario_autista` (`id_destinatario_autista`),
  ADD KEY `id_destinatario_passeggero` (`id_destinatario_passeggero`);

--
-- Indici per le tabelle `passeggero`
--
ALTER TABLE `passeggero`
  ADD PRIMARY KEY (`id_passeggero`),
  ADD UNIQUE KEY `documento_identita` (`documento_identita`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indici per le tabelle `prenotazione`
--
ALTER TABLE `prenotazione`
  ADD PRIMARY KEY (`id_prenotazione`),
  ADD UNIQUE KEY `id_viaggio` (`id_viaggio`,`id_passeggero`),
  ADD KEY `idx_prenotazione_viaggio` (`id_viaggio`,`stato`),
  ADD KEY `id_passeggero` (`id_passeggero`);

--
-- Indici per le tabelle `viaggio`
--
ALTER TABLE `viaggio`
  ADD PRIMARY KEY (`id_viaggio`),
  ADD KEY `idx_ricerca_viaggi` (`citta_partenza`,`citta_arrivo`,`data_ora_partenza`),
  ADD KEY `id_autista` (`id_autista`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `autista`
--
ALTER TABLE `autista`
  MODIFY `id_autista` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la tabella `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id_feedback` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT per la tabella `passeggero`
--
ALTER TABLE `passeggero`
  MODIFY `id_passeggero` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT per la tabella `prenotazione`
--
ALTER TABLE `prenotazione`
  MODIFY `id_prenotazione` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT per la tabella `viaggio`
--
ALTER TABLE `viaggio`
  MODIFY `id_viaggio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`id_viaggio`) REFERENCES `viaggio` (`id_viaggio`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`id_autore_passeggero`) REFERENCES `passeggero` (`id_passeggero`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedback_ibfk_3` FOREIGN KEY (`id_destinatario_autista`) REFERENCES `autista` (`id_autista`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedback_ibfk_4` FOREIGN KEY (`id_destinatario_passeggero`) REFERENCES `passeggero` (`id_passeggero`) ON DELETE CASCADE;

--
-- Limiti per la tabella `prenotazione`
--
ALTER TABLE `prenotazione`
  ADD CONSTRAINT `prenotazione_ibfk_1` FOREIGN KEY (`id_viaggio`) REFERENCES `viaggio` (`id_viaggio`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prenotazione_ibfk_2` FOREIGN KEY (`id_passeggero`) REFERENCES `passeggero` (`id_passeggero`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `viaggio`
--
ALTER TABLE `viaggio`
  ADD CONSTRAINT `viaggio_ibfk_1` FOREIGN KEY (`id_autista`) REFERENCES `autista` (`id_autista`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
