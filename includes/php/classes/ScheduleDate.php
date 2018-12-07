<?php

class ScheduleDate extends FetchBase {

    private static $_instance = null;

    public function __construct(){
        parent::__construct();
        $this->_tableName = Config::get('database/table_name/schedule_date');
        $this->_columnNames = ['id','date','schedule_id','is_generated','weekday','is_event_logged','is_valid'];
    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    public function add($inputs = []){
        $datetime = [];

        if(isset($inputs['date'])){
            $datetime = new DateTime($inputs['date']);
            $inputs['date'] = $datetime->format('Y-m-d');
            if(!isset($inputs['weekday'])) $inputs['weekday'] = $datetime->format('w');
        }

        return parent::add($inputs);
    }

    public function bulkAdd($inputs = []){
        $insert = db_insert($this->_tableName, ['return'=> Database::RETURN_AFFECTED])
        ->fields($this->_columnNames);

        $values = [];
        foreach($inputs as $input){
            $values = [];
            $datetime = [];
            if(isset($input['date'])){
                $datetime = new DateTime($input['date']);
                $input['date'] = $datetime->format('Y-m-d');
                if(!isset($input['weekday'])) $input['weekday'] = $datetime->format('w');
            }
            foreach($this->_columnNames as $column){
                $values[$column] = isset($input[$column]) ? $input[$column] : null ;
                // if(isset($input[$column])) $values[$column] = $input[$column];
            }
            $insert->values($values);
        }

        return $insert->execute();
    }

    public function update($fields, $conditions= [],$unused= []){
        //$unused parameter were only used in the parent::update
        $datetime = [];
        if(isset($conditions['date'])){
            $datetime = new DateTime($conditions['date']);
            $conditions['date'] = $datetime->format('Y-m-d');
            if(!isset($conditions['weekday'])) $conditions['weekday'] = $datetime->format('w');            
        }

        return parent::update($fields, $conditions);
    }

    public function delete($id){

        $id = is_array($id) ? $id : [$id] ;

        return $this->update(['is_valid'=>0],['id', $id, 'IN']);

    }
}