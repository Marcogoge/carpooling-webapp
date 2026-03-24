<?php
  require_once '../headers.php';
  require_once '../config/database.php';
 
  $conn   = (new Database())->getConnection();
  $method = $_SERVER['REQUEST_METHOD'];
 
  switch ($method) {
 
      // GET /feedback/?id_autista=X    → feedback ricevuti dall'autista
      // GET /feedback/?id_passeggero=X → feedback ricevuti dal passeggero
      case 'GET':
          $id_a = $_GET['id_autista']    ?? null;
          $id_p = $_GET['id_passeggero'] ?? null;
 
          if ($id_a) {
              $stmt = $conn->prepare(
                  'SELECT f.voto, f.giudizio,
                          p.nome AS autore_nome, p.cognome AS autore_cognome,
                          v.citta_partenza, v.citta_arrivo, v.data_ora_partenza
                   FROM feedback f
                   JOIN passeggero p ON f.id_autore_passeggero = p.id_passeggero
                   JOIN viaggio v    ON f.id_viaggio = v.id_viaggio
                   WHERE f.id_destinatario_autista = :id
                         AND f.tipo_feedback = "per_autista"
                   ORDER BY v.data_ora_partenza DESC');
              $stmt->execute([':id'=>$id_a]);
              echo json_encode(['successo'=>true,
                               'dati'=>$stmt->fetchAll(PDO::FETCH_ASSOC)]);
              break;
          }
 
          if ($id_p) {
              $stmt = $conn->prepare(
                  'SELECT f.voto, f.giudizio,
                          a.nome AS autore_nome, a.cognome AS autore_cognome,
                          v.citta_partenza, v.citta_arrivo, v.data_ora_partenza
                   FROM feedback f
                   JOIN autista a ON f.id_destinatario_autista = a.id_autista
                   JOIN viaggio v ON f.id_viaggio = v.id_viaggio
                   WHERE f.id_destinatario_passeggero = :id
                         AND f.tipo_feedback = "per_passeggero"
                   ORDER BY v.data_ora_partenza DESC');
              $stmt->execute([':id'=>$id_p]);
              echo json_encode(['successo'=>true,
                               'dati'=>$stmt->fetchAll(PDO::FETCH_ASSOC)]);
              break;
          }
 
          http_response_code(400);
          echo json_encode(['errore'=>'Specifica id_autista o id_passeggero']);
          break;
 
      // POST /feedback/  → inserisce un nuovo feedback
      // Body JSON: voto (1-5), giudizio, id_viaggio, id_autore_passeggero,
      //            tipo_feedback ("per_autista" | "per_passeggero"),
      //            id_destinatario_autista  (se tipo = per_autista)
      //            id_destinatario_passeggero (se tipo = per_passeggero)
      case 'POST':
          $b = json_decode(file_get_contents('php://input'), true);
 
          foreach (['voto','id_viaggio','id_autore_passeggero','tipo_feedback'] as $c)
              if (!isset($b[$c])) { http_response_code(400);
                  echo json_encode(['errore'=>"Campo mancante: $c"]); exit(); }
 
          if ($b['voto'] < 1 || $b['voto'] > 5) {
              http_response_code(400);
              echo json_encode(['errore'=>'Voto deve essere tra 1 e 5']); exit(); }
 
          $stmt = $conn->prepare(
              'INSERT INTO feedback
                   (voto,giudizio,id_viaggio,id_autore_passeggero,
                    id_destinatario_autista,id_destinatario_passeggero,tipo_feedback)
               VALUES (:vo,:gi,:iv,:ia,:ida,:idp,:ti)');
          $stmt->execute([
              ':vo'=>$b['voto'],
              ':gi'=>$b['giudizio']??null,
              ':iv'=>$b['id_viaggio'],
              ':ia'=>$b['id_autore_passeggero'],
              ':ida'=>$b['id_destinatario_autista']??null,
              ':idp'=>$b['id_destinatario_passeggero']??null,
              ':ti'=>$b['tipo_feedback']]);
          http_response_code(201);
          echo json_encode(['successo'=>true,'id'=>$conn->lastInsertId()]);
          break;
 
      default:
          http_response_code(405);
          echo json_encode(['errore'=>'Metodo non consentito']);
  }