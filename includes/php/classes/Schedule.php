<?php

class Schedule extends FetchView {

    private static $_instance = null;

    public function __construct(){
        parent::__construct();
        $this->_tableName = Config::get('database/table_name/view/school_schedule');
        $this->_columnNames = ['nid','schedule_name','start_time','end_time','location','activity','schedule_cycle','form'];

    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }
}