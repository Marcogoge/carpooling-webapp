 <?php
  require_once '../headers.php';
  require_once '../config/database.php';
 
  $conn   = (new Database())->getConnection();
  $method = $_SERVER['REQUEST_METHOD'];
  $id     = $_GET['id'] ?? null;
 
  switch ($method) {
 
      // GET /passeggeri/?id=X  → profilo con voto medio ricevuto dagli autisti
      case 'GET':
          if (!$id) { http_response_code(400);
              echo json_encode(['errore'=>'ID mancante']); exit(); }
          $stmt = $conn->prepare(
              'SELECT p.*, ROUND(AVG(f.voto),1) AS voto_medio,
                      COUNT(f.id_feedback) AS num_feedback
               FROM passeggero p
               LEFT JOIN feedback f
                     ON f.id_destinatario_passeggero = p.id_passeggero
               WHERE p.id_passeggero = :id GROUP BY p.id_passeggero');
          $stmt->execute([':id'=>$id]);
          $row = $stmt->fetch(PDO::FETCH_ASSOC);
          if (!$row) { http_response_code(404);
              echo json_encode(['errore'=>'Passeggero non trovato']); exit(); }
          echo json_encode(['successo'=>true,'dati'=>$row]);
          break;
 
      // POST /passeggeri/  → registra nuovo passeggero
      // Body JSON: nome, cognome, documento_identita, telefono, email
      case 'POST':
          $b = json_decode(file_get_contents('php://input'), true);
          foreach (['nome','cognome','documento_identita','telefono','email'] as $c)
              if (empty($b[$c])) { http_response_code(400);
                  echo json_encode(['errore'=>"Campo mancante: $c"]); exit(); }
 
          $dup = $conn->prepare(
              'SELECT id_passeggero FROM passeggero
               WHERE email=:e OR documento_identita=:d');
          $dup->execute([':e'=>$b['email'],':d'=>$b['documento_identita']]);
          if ($dup->fetch()) { http_response_code(409);
              echo json_encode(['errore'=>'Email o documento gia registrati']); exit(); }
 
          $stmt = $conn->prepare(
              'INSERT INTO passeggero (nome,cognome,documento_identita,telefono,email)
               VALUES (:n,:c,:d,:t,:e)');
          $stmt->execute([':n'=>$b['nome'],':c'=>$b['cognome'],
              ':d'=>$b['documento_identita'],
              ':t'=>$b['telefono'],':e'=>$b['email']]);
          http_response_code(201);
          echo json_encode(['successo'=>true,'id'=>$conn->lastInsertId()]);
          break;
 
      // PUT /passeggeri/?id=X  → aggiorna telefono o email
      // Body JSON: telefono, email
      case 'PUT':
          $b  = json_decode(file_get_contents('php://input'), true);
          if (!$id) { http_response_code(400);
              echo json_encode(['errore'=>'ID mancante']); exit(); }
          $stmt = $conn->prepare(
              'UPDATE passeggero SET telefono=:t, email=:e
               WHERE id_passeggero=:id');
          $stmt->execute([':t'=>$b['telefono'],':e'=>$b['email'],':id'=>$id]);
          echo json_encode(['successo'=>true]);
          break;
 
      default:
          http_response_code(405);
          echo json_encode(['errore'=>'Metodo non consentito']);
  }