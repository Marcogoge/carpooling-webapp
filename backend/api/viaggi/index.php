<?php 
  require_once '../headers.php'; 
  require_once '../config/database.php'; 

  $conn   = (new Database())->getConnection(); 
  $method = $_SERVER['REQUEST_METHOD']; 
  $id     = $_GET['id'] ?? null; 

  switch ($method) { 
  
      // GET /viaggi/                                   → tutti i viaggi 
      // GET /viaggi/?partenza=X&arrivo=Y&data=YYYY-MM-DD → filtrati 
      // GET /viaggi/?id=5                              → singolo viaggio 

      case 'GET': 
          if ($id) { 
              $stmt = $conn->prepare( 
                  'SELECT v.*, a.nome, a.cognome, a.telefono, a.email, a.foto, 
                          ROUND(AVG(f.voto),1) AS voto_medio_autista 
                   FROM viaggio v 
                   JOIN autista a ON v.id_autista = a.id_autista 
                   LEFT JOIN feedback f ON f.id_destinatario_autista = a.id_autista 
                   WHERE v.id_viaggio = :id GROUP BY v.id_viaggio'); 
              $stmt->execute([':id'=>$id]); 
              $row = $stmt->fetch(PDO::FETCH_ASSOC); 
              if (!$row) { http_response_code(404); 
                  echo json_encode(['errore'=>'Viaggio non trovato']); exit(); } 
              echo json_encode(['successo'=>true,'dati'=>$row]); 
              break; 
          } 
  
          $partenza = $_GET['partenza'] ?? null; 
          $arrivo   = $_GET['arrivo']   ?? null; 
          $data     = $_GET['data']     ?? null; 

          $sql = "SELECT v.*, a.nome, a.cognome, a.foto, 
                         ROUND(AVG(f.voto),1) AS voto_medio_autista, 
                         (v.posti_max - COUNT(CASE WHEN p.stato='accettata' THEN 1 END)) 
                             AS posti_disponibili, 
                         COUNT(CASE WHEN p.stato='attesa' THEN 1 END) 
                             AS prenotazioni_in_attesa 
                  FROM viaggio v 
                  JOIN autista a ON v.id_autista = a.id_autista 
                  LEFT JOIN prenotazione p ON v.id_viaggio = p.id_viaggio 
                  LEFT JOIN feedback f ON f.id_destinatario_autista = a.id_autista 
                  WHERE 1=1"; 

          $params = []; 
          if ($partenza) { $sql .= ' AND v.citta_partenza = :partenza'; 
                           $params[':partenza'] = $partenza; } 
          if ($arrivo)   { $sql .= ' AND v.citta_arrivo = :arrivo'; 
                           $params[':arrivo'] = $arrivo; } 
          if ($data)     { $sql .= ' AND DATE(v.data_ora_partenza) = :data'; 
                           $params[':data'] = $data; } 
          $sql .= ' GROUP BY v.id_viaggio HAVING posti_disponibili > 0 
                   ORDER BY v.data_ora_partenza ASC'; 

          $stmt = $conn->prepare($sql); 
          $stmt->execute($params); 
          echo json_encode(['successo'=>true, 
                           'dati'=>$stmt->fetchAll(PDO::FETCH_ASSOC)]); 
          break; 

      // POST /viaggi/  → crea nuovo viaggio 
      // Body JSON: citta_partenza, citta_arrivo, data_ora_partenza, 
      //            tempo_stimato, contributo, posti_max, 
      //            marca_auto, modello_auto, targa_auto, id_autista 

      case 'POST': 
          $b = json_decode(file_get_contents('php://input'), true); 
          $obbligatori = ['citta_partenza','citta_arrivo','data_ora_partenza', 
                          'tempo_stimato','contributo','posti_max', 
                          'marca_auto','modello_auto','targa_auto','id_autista']; 
          foreach ($obbligatori as $c) 
              if (empty($b[$c])) { http_response_code(400); 
                  echo json_encode(['errore'=>"Campo mancante: $c"]); exit(); } 

          $stmt = $conn->prepare( 
              'INSERT INTO viaggio (citta_partenza,citta_arrivo,data_ora_partenza, 
               tempo_stimato,contributo,soste,bagaglio,animali,posti_max, 
               marca_auto,modello_auto,targa_auto,id_autista) 
               VALUES (:cp,:ca,:dop,:ts,:co,:so,:ba,:an,:pm,:ma,:mo,:ta,:ia)'); 

          $stmt->execute([ 
              ':cp'=>$b['citta_partenza'], ':ca'=>$b['citta_arrivo'], 
              ':dop'=>$b['data_ora_partenza'], ':ts'=>$b['tempo_stimato'], 
              ':co'=>$b['contributo'], ':so'=>$b['soste']??null, 
              ':ba'=>$b['bagaglio']??1, ':an'=>$b['animali']??0, 
              ':pm'=>$b['posti_max'], ':ma'=>$b['marca_auto'], 
              ':mo'=>$b['modello_auto'], ':ta'=>$b['targa_auto'], 
              ':ia'=>$b['id_autista']]); 
          http_response_code(201); 
          echo json_encode(['successo'=>true,'id_viaggio'=>$conn->lastInsertId()]); 
          break; 

  

      // DELETE /viaggi/?id=X → elimina viaggio 
      case 'DELETE': 
          if (!$id) { http_response_code(400); 
              echo json_encode(['errore'=>'ID mancante']); exit(); } 
          $stmt = $conn->prepare('DELETE FROM viaggio WHERE id_viaggio=:id'); 
          $stmt->execute([':id'=>$id]); 
          echo json_encode(['successo'=>true]); 
          break; 

      default: 
          http_response_code(405); 
          echo json_encode(['errore'=>'Metodo non consentito']); 