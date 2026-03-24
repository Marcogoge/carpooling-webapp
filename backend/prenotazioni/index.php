<?php 
  require_once '../headers.php'; 
  require_once '../config/database.php'; 

  $conn   = (new Database())->getConnection(); 
  $method = $_SERVER['REQUEST_METHOD']; 
  $id     = $_GET['id']            ?? null; 
  $id_v   = $_GET['id_viaggio']    ?? null; 
  $id_p   = $_GET['id_passeggero'] ?? null; 

  switch ($method) { 
      // GET /prenotazioni/?id=X          → dati promemoria email (punto 3b) 
      // GET /prenotazioni/?id_viaggio=X  → passeggeri viaggio (punto 3c) 
      //      aggiungere &voto_min=3 per filtrare per voto 
      // GET /prenotazioni/?id_passeggero=X → prenotazioni di un passeggero 

      case 'GET': 
          if ($id) { 
              // Punto 3b — dati completi per email promemoria 
              $stmt = $conn->prepare( 
                  'SELECT pr.*, 
                          pa.nome AS nome_pass, pa.cognome AS cog_pass, 
                          pa.email AS email_pass, 
                          v.citta_partenza, v.citta_arrivo, 
                          v.data_ora_partenza, v.contributo, v.soste, 
                          a.nome AS nome_autista, a.cognome AS cog_autista, 
                          a.telefono AS tel_autista, 
                          v.marca_auto, v.modello_auto, v.targa_auto 
                   FROM prenotazione pr 
                   JOIN passeggero pa ON pr.id_passeggero = pa.id_passeggero 
                   JOIN viaggio v     ON pr.id_viaggio = v.id_viaggio 
                   JOIN autista a     ON v.id_autista = a.id_autista 
                   WHERE pr.id_prenotazione = :id AND pr.stato = :stato'); 
              $stmt->execute([':id'=>$id, ':stato'=>'accettata']); 
              $row = $stmt->fetch(PDO::FETCH_ASSOC); 
              if (!$row) { http_response_code(404); 
                  echo json_encode(['errore'=>'Prenotazione non trovata']); exit(); } 
              echo json_encode(['successo'=>true,'dati'=>$row]); 
              break; 

          } 

          if ($id_v) { 
              // Punto 3c — passeggeri con voto medio, filtro opzionale 
              $voto_min = $_GET['voto_min'] ?? null; 
              $sql = 'SELECT pa.id_passeggero, pa.nome, pa.cognome, pa.email, 
                             pr.id_prenotazione, pr.stato, 
                             ROUND(AVG(f.voto),1) AS voto_medio 
                      FROM prenotazione pr 
                      JOIN passeggero pa ON pr.id_passeggero = pa.id_passeggero 
                      LEFT JOIN feedback f 
                            ON f.id_destinatario_passeggero = pa.id_passeggero 
                      WHERE pr.id_viaggio = :id_v 
                      GROUP BY pa.id_passeggero, pr.id_prenotazione, pr.stato'; 
              $params = [':id_v'=>$id_v]; 
              if ($voto_min) { 
                  $sql .= ' HAVING voto_medio >= :vm OR voto_medio IS NULL'; 
                  $params[':vm'] = $voto_min; 

              } 
              $stmt = $conn->prepare($sql); 
              $stmt->execute($params); 
              echo json_encode(['successo'=>true, 
                               'dati'=>$stmt->fetchAll(PDO::FETCH_ASSOC)]); 
              break; 

          } 
          if ($id_p) { 
              $stmt = $conn->prepare( 
                  'SELECT pr.*, v.citta_partenza, v.citta_arrivo, 
                          v.data_ora_partenza, v.contributo, 
                          a.nome AS nome_autista, a.cognome AS cog_autista 
                   FROM prenotazione pr 
                   JOIN viaggio v ON pr.id_viaggio = v.id_viaggio 
                   JOIN autista a ON v.id_autista = a.id_autista 
                   WHERE pr.id_passeggero = :id_p 
                   ORDER BY pr.data_prenotazione DESC'); 

              $stmt->execute([':id_p'=>$id_p]); 
              echo json_encode(['successo'=>true, 
                               'dati'=>$stmt->fetchAll(PDO::FETCH_ASSOC)]); 
              break; 
          } 
          http_response_code(400); 
          echo json_encode(['errore'=>'Parametro mancante']); 
          break; 

      // POST /prenotazioni/  → crea prenotazione 
      // Body JSON: id_viaggio, id_passeggero 
      case 'POST': 
          $b = json_decode(file_get_contents('php://input'), true); 
          if (empty($b['id_viaggio']) || empty($b['id_passeggero'])) { 
              http_response_code(400); 
              echo json_encode(['errore'=>'Campi obbligatori mancanti']); exit(); } 

          // Verifica posti disponibili 
          $chk = $conn->prepare( 
              'SELECT posti_max, 
                      (SELECT COUNT(*) FROM prenotazione 
                       WHERE id_viaggio=:id AND stato="accettata") AS occupati 
               FROM viaggio WHERE id_viaggio=:id'); 
          $chk->execute([':id'=>$b['id_viaggio']]); 
          $v = $chk->fetch(PDO::FETCH_ASSOC); 
          if (!$v || ($v['posti_max']-$v['occupati']) <= 0) { 
              http_response_code(409); 
              echo json_encode(['errore'=>'Nessun posto disponibile']); exit(); } 
  
          $stmt = $conn->prepare( 
              'INSERT INTO prenotazione (id_viaggio,id_passeggero,stato) 
               VALUES (:iv,:ip,"attesa")'); 
          $stmt->execute([':iv'=>$b['id_viaggio'],':ip'=>$b['id_passeggero']]); 
          http_response_code(201); 
          echo json_encode(['successo'=>true,'id'=>$conn->lastInsertId()]); 
          break; 

      // PUT /prenotazioni/?id=X  → accetta o rifiuta 
      // Body JSON: stato ("accettata" oppure "rifiutata") 
      case 'PUT': 
          $b = json_decode(file_get_contents('php://input'), true); 
          if (!$id || !in_array($b['stato']??'',['accettata','rifiutata'])) { 
              http_response_code(400); 
              echo json_encode(['errore'=>'Parametri non validi']); exit(); } 
          $stmt = $conn->prepare( 
              'UPDATE prenotazione SET stato=:s WHERE id_prenotazione=:id'); 
          $stmt->execute([':s'=>$b['stato'],':id'=>$id]); 
          echo json_encode(['successo'=>true]); 
          break; 

      default: 
          http_response_code(405); 
          echo json_encode(['errore'=>'Metodo non consentito']); 
  } 