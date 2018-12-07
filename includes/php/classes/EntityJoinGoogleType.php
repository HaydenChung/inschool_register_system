<?php

class EntityJoinGoogleType extends FetchBase{

    private static $_instance = null;

    public function __construct(){
        parent::__construct();
        
        $this->_tableName = Config::get('datebase/table_name/join/google_type');
        $this->_columnNames = ['name', 'entity_table_name', 'ref_1', 'ref_2', 'ref_3'];
    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }

}