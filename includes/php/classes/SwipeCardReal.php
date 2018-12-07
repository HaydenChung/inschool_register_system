<?php

class SwipeCardReal extends FetchBase {
    
    private static $_instance = null;

    public function __construct(){
        parent::__construct();

        $this->_tableName = Config::get('database/table_name/real_swipecard');
        $this->_columnNames = ['machine_ip','sn','rec_index','rec_type','rec_valid','rec_door_no','rec_inout','cardid','recordTime','location_id','msg','uid'];
    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }

}