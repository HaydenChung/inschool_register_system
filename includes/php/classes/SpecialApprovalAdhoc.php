<?php

class SpecialApprovalAdhoc extends FetchView{

    private static $_instance = null;

    public function __construct(){
        parent::__construct();
        $this->_tableName = Config::get('database/table_name/view/adhoc');
        $this->_columnNames = ['nid','remark','uid','approval_by','record_time','valid_from','valid_to','is_valid','closed_by','close_remark','weight','chi_name','eng_name','class','record_location'];
    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }

}