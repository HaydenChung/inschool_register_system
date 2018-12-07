<?php

include_once('../../../configData.php');
include_once('./Config.php');

class StandAloneDB {
    private static $_instance = null;
    public $pdo;

    private function __construct() {

        $dbname = Config::get('database/info/dbname');
        $port = Config::get('database/info/port');
        $host = Config::get('database/info/host');
        $user = Config::get('database/info/user');
        $password = Config::get('database/info/password');
        $defaultSchoolYear = Config::get('database/info/default_school_year');

        try{
            $this->pdo = new PDO("mysql:host={$host};port={$port};dbname={$defaultSchoolYear}{$dbname};charset=utf8", $user, $password);
            // $this->pdo->setAttribute( PDO::ATTR_EMULATE_PREPARES, false );
        }catch(Exception $e) {
            die ($e->getMessage());
        }
    }

    public static function getInstance() {
        if(!isset(self::$_instance)){
            self::$_instance = new StandAloneDB();
        }
        return self::$_instance;
    }

}