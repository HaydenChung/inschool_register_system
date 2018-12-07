<?php

class SchoolLocation extends FetchView{

    private static $_instance = null;

    public function __construct(){
        parent::__construct();
        $this->_tableName = Config::get('database/table_name/view/location');
        $this->_columnNames = ['name','tid','reader_id','display_name','location_type'];
    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }
}