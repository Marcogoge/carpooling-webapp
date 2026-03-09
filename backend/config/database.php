<?php
  class Database {
      private $host     = "localhost";
      private $db_name  = "carpooling";
      private $username = "carpooling";
      private $password = "carpooling";
 
      public function getConnection() {
          try {
              $conn = new PDO(
                  "mysql:host={$this->host};dbname={$this->db_name};charset=utf8",
                  $this->username, $this->password
              );
              $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
              return $conn;
              } catch (PDOException $e) {
              http_response_code(500);
              echo json_encode(["errore" => $e->getMessage()]);
              exit();
          }
      }
  }