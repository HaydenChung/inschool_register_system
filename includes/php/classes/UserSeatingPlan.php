<?php

class UserSeatingPlan extends FetchView{

    private static $_instance = null;

    public function __construct(){
        parent::__construct();

        $this->_tableName = Config::get('database/table_name/view/user_seating_plan');
        $this->_columnNames = ['id','location_id','activity_id','seating_plan_id','seating_plan_version_id','uid','name','chi_name','class','class_number','imgPath','user_seat_position_x','user_seat_position_y'];
    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }
}