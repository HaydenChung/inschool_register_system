<?php

class UserLog extends FetchBase {

    private static $_instance = null;

    public function __construct(){
        parent::__construct();

        $this->_tableName = Config::get('database/table_name/user_log');
        $this->_columnNames = ['id','card_id','uid','event_id','location_id','datetime','update_by','remark','type','reader_id','virtual_card_logged', 'valid_to'];
    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    public function deletePreEvent($eventId) {
        return db_delete($this->_tableName)
        ->condition('event_id',$eventId)
        ->execute();
    }
}