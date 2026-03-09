  <?php
  header("Access-Control-Allow-Origin: http://localhost:4200");
  header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type");
  header("Content-Type: application/json; charset=UTF-8");
 
  // Risponde subito alle richieste OPTIONS (preflight di Angular)
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
      http_response_code(200);
      exit();
  }