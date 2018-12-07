<?php

class UserActivity extends FetchBase{
    
    private static $_instance = null;

    public function __construct(){
        parent::__construct();
        $this->_tableName = Config::get('database/table_name/user_activity');
        $this->_columnNames = ['uid','activity_id'];
    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }
}