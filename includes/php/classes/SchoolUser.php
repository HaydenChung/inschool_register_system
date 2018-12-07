<?php

class SchoolUser extends FetchView{

    private static $_instance = null;

    public function __construct(){
        parent::__construct();
        $this->_tableName = Config::get('database/table_name/view/user');
        $this->_columnNames = ['uid','name','chi_name','eng_name','uri','class','class_number','last_location'];
    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }
}