<?php

class TimeSlot extends FetchView{

    private static $_instance = null;

    public function __construct(){
        parent::__construct();
        $this->_tableName = Config::get('database/table_name/view/time_slot');
        $this->_columnNames = ['start_time','end_time','tid','vid','name','lesson_time','start_timestamp','end_timestamp'];
    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }
}