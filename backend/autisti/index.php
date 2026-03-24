<?php
  require_once '../headers.php';
  require_once '../config/database.php';
 
  $conn   = (new Database())->getConnection();
  $method = $_SERVER['REQUEST_METHOD'];
  $id     = $_GET['id'] ?? null;
 
  switch ($method) {
 
      // GET /autisti/          → lista tutti gli autisti con voto medio
      // GET /autisti/?id=3     → profilo singolo autista
      case 'GET':
          if ($id) {
              $sql  = "SELECT a.*, ROUND(AVG(f.voto),1) AS voto_medio,
                              COUNT(f.id_feedback) AS num_feedback
                       FROM autista a
                       LEFT JOIN feedback f ON f.id_destinatario_autista = a.id_autista
                       WHERE a.id_autista = :id GROUP BY a.id_autista";
              $stmt = $conn->prepare($sql);
              $stmt->execute([':id' => $id]);
              $row  = $stmt->fetch(PDO::FETCH_ASSOC);
              if (!$row) { http_response_code(404);
                  echo json_encode(['errore'=>'Autista non trovato']); exit(); }
              echo json_encode(['successo'=>true, 'dati'=>$row]);
          } else {
              $stmt = $conn->query(
                  "SELECT a.*, ROUND(AVG(f.voto),1) AS voto_medio
                   FROM autista a
                   LEFT JOIN feedback f ON f.id_destinatario_autista = a.id_autista
                   GROUP BY a.id_autista");
              echo json_encode(['successo'=>true,
                               'dati'=>$stmt->fetchAll(PDO::FETCH_ASSOC)]);
          }
          break;
 
      // POST /autisti/   → registra nuovo autista
      // Body JSON: nome, cognome, num_patente, scadenza_patente, telefono, email
      case 'POST':
          $b = json_decode(file_get_contents('php://input'), true);
          foreach (['nome','cognome','num_patente','scadenza_patente','telefono','email'] as $c)
              if (empty($b[$c])) { http_response_code(400);
                  echo json_encode(['errore'=>"Campo mancante: $c"]); exit(); }
 
          $dup = $conn->prepare(
              'SELECT id_autista FROM autista WHERE email=:e OR num_patente=:p');
          $dup->execute([':e'=>$b['email'], ':p'=>$b['num_patente']]);
          if ($dup->fetch()) { http_response_code(409);
              echo json_encode(['errore'=>'Email o patente gia registrati']); exit(); }
 
          $stmt = $conn->prepare(
              'INSERT INTO autista (nome,cognome,num_patente,scadenza_patente,telefono,email,foto)
               VALUES (:n,:c,:p,:s,:t,:e,:f)');
          $stmt->execute([':n'=>$b['nome'],':c'=>$b['cognome'],
              ':p'=>$b['num_patente'],':s'=>$b['scadenza_patente'],
              ':t'=>$b['telefono'],':e'=>$b['email'],':f'=>$b['foto']??null]);
          http_response_code(201);
          echo json_encode(['successo'=>true,'id'=>$conn->lastInsertId()]);
          break;
 
      default:
          http_response_code(405);
          echo json_encode(['errore'=>'Metodo non consentito']);
  }