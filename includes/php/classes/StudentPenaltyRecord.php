<?php

class StudentPenaltyRecord extends FetchBase {
    private static $_instance = null;
    
    public function __construct(){
        parent::__construct();
        $this->_tableName = Config::get('database/table_name/student_penalty_record');
        $this->_columnNames = ['id', 'uid', 'penalty_type_id', 'create_timestamp', 'recorder_uid', 'update_timestamp', 'update_by_uid', 'active'];
    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }

}