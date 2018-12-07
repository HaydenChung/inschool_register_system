<?php

class EventView extends FetchView{

    private static $_instance = null;

    public function __construct(){
        parent::__construct();
        $this->_tableName = Config::get('database/table_name/view/event');
        $this->_columnNames = [
            'id',
            'date',
            'schedule_date_id',
            'schedule_name',
            'start_time',
            'end_time',
            'time_slot_id',
            'location',
            'location_id',
            'reader_id',
            'activity',
            'activity_id',
            'activity_revision_index',
            'schedule_cycle',
            'is_sync_google',
            'is_logged',
            'logged_time',
            'logged_by_uid',
            'logged_user'
        ];
    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }

}