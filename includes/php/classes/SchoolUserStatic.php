<?php

class SchoolUserStatic extends FetchView{

    private static $_instance = null;

    public function __construct(){
        parent::__construct();
        $this->_tableName = Config::get('database/table_name/view/static_user');
        $this->_columnNames = ['uid','name','mail','chi_name','eng_name','uri','class','class_number','role_id','student_number','card_id'];
    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }
}