<?php

class UserJoinSeatingPlan extends FetchBase{

    private static $_instance = null;

    public function __construct(){
        parent::__construct();

        $this->_tableName = Config::get('database/table_name/join/user_seating');
        $this->_columnNames = ['id','school_seating_plan_id','uid','user_seat_position_x','user_seat_position_y'];
    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    public function delete($id) {
        db_delete($this->_tableName)
        ->condition('id', is_array($id) ? $id : [$id], 'IN')
        ->execute();
    }
}