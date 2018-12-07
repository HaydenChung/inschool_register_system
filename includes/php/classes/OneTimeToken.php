<?php

require_once(__DIR__.'/StandAloneDB.php');

class OneTimeToken {

    private static $_instance = null;

    private $_db,
    $_tokenTable,
    $_defualtExpiry;

    private function __construct() {
        $this->_db = StandAloneDB::getInstance();
    }

    public static function getInstance() {
        if(!isset(self::$_instance)){
            self::$_instance = new OneTimeToken();
        }
        return self::$_instance;
    }

    public function generate($secart, $expiry = null) {

        $expiry = isset($expiry) ? $expiry : $this->_defualtExpiry;
        $token = bin2hex(random_bytes(32));
        $now = time();

        $stmt = $this->_db->pdo->prepare("INSERT INTO `{$this->_tokenTable}` (`token`,`expiry`) VALUES(:token,:expiry)");
        $stmt->execute([':token'=> $token,':expiry'=> $now + $expiry]);
        // $id = $this->_db->pdo->lastInsertId();

        return $token;
    }

    public function check($inputToken) {

            $stmt = $this->_db->pdo->prepare("SELECT `id`,`token`,`expiry`,`is_valid` FROM `{$this->_tokenTable}` WHERE `token` = :token");
            $stmt->execute([':token'=> $inputToken]);
            $result = $stmt->fetch();
    
            if(empty($result)) return false;
            if($result['is_valid'] != true) return false;
            if($result['expiry'] < time()) return false;
            if(!hash_equals($inputToken, $result['token'])) return false;

        try{
    
            $closeStmt = $this->_db->pdo->prepare("Update `{$this->_tokenTable}` SET `is_valid`=0 WHERE `id` = :id");
            $closeStmt->execute([':id'=> $result['id']]);
            return true;
            
        }catch(Exception $e) {
            echo $e->getMessage();
            die();
        }

    }

}