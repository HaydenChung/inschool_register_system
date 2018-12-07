<?php

class OrderProcessing extends FetchBase {

    private static $_instance = null;
    
    public function __construct(){
        parent::__construct();

        $this->_tableName = Config::get('database/table_name/order_processing');
        $this->_columnNames = ['id', 'record_time', 'order_json', 'is_processing', 'is_completed', 'type'];
    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }

}