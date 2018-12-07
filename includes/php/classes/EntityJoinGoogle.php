<?php

//Current class import another class "EntityJoinGoogleType"
include_once('./EntityJoinGoogleType.php');

class EntityJoinGoogle extends FetchBase{

    private static $_instance = null;
    private $_typeTableName = '',
            $_typeTableColumn = [],
            $_typeTable = null;

    public function __construct(){
        parent::__construct();
        $this->_tableName = Config::get('database/table_name/join/google');
        $this->_columnNames = ['entity_id','type','google_ref_1','google_ref_2','google_ref_3'];
        
        $this->_typeTable = new EntityJoinGoogleType();
        
    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    public function getType($typeName){
        return $this->_typeTable->get(['entity_table_name','ref_1','ref_2','ref_3'],['name',$typeName,'='])->fetch();
    }

}