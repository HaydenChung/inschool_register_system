<?php

class EventRecord extends FetchBase {
    private static $_instance = null;
    
    public function __construct(){
        parent::__construct();
        $this->_tableName = Config::get('database/table_name/event_record');
        $this->_columnNames = ['event_id', 'event_initial_json', 'event_state_json', 'revision_index', 'update_time'];
    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    // public function add($input = []) {
    //     if(!isset($input['updated_time'])) $input['update_time'] = time();
        
    //     return parent::add($input);
    // }

    // public function bulkAdd($inputs = []) {
    //     $now = time();
    //     foreach($inputs as $input) if(!isset($input['update_time'])) $input['update_time'] = $now;
    //     return parent::add($inputs);
    // }

    // public function update($input, $conds, $conjs) {
    //     if(!isset($input['update_time'])) $input['update_time'] = time();

    //     return parent::update($input, $conds, $conjs);
    // }

    // public function updateOnDup($input, $conds, $onUpdateFields = []) {
    //     if(!isset($input['update_time'])) $input['update_time'] = time();

    //     return parent::update($input, $conds, $onUpdateFields);
    // }
}