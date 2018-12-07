<?php

class SchoolLocation extends FetchBase{

    private static $_instance = null;

    public function __construct(){
        parent::__construct();
        $this->_tableName = Config::get('database/table_name/join/google');
        $this->_columnNames = ['entity_id','type','google_ref_1','google_ref_2','google_ref_3'];
    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }
}