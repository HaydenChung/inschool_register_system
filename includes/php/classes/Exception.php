<?php

class Exception extends FetchView {

    private static $_instance = null;

    public function __construct(){
        parent::__construct();
        $this->_tableName = Config::get('database/table_name/exception/adhoc');
        $this->_columnNames = ['id','uid','approval_by_uid','location_id','remark','record_time','valid_from','valid_to','is_valid'];

    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }
}