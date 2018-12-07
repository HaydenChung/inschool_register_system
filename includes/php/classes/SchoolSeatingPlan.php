<?php

class SchoolUser extends FetchView{

    private static $_instance = null;

    public function __construct(){
        parent::__construct();
        $this->_tableName = Config::get('database/table_name/view/user_seating_plan');
        $this->_columnNames = [
            'id', 
            'location_id', 
            'activity', 
            'activity_id', 
            'uid', 
            'class', 
            'class_number', 
            'name', 
            'imgPath', 
            'user_seat_position_x', 
            'user_seat_position_y', 
            'status', 
            'last_location', 
            'gate_in', 
            'in_class', 
            'missing'
        ];
    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }
}