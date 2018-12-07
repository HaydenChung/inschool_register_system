<?php

class UserJoinActivity extends FetchBase{

    private static $_instance = null;

    private $_activityVisionIndex = null;

    public function __construct(){
        parent::__construct();

        $this->_tableName = Config::get('database/table_name/join/user_activity');
        $this->_columnNames = ['uid','activity_id','is_valid','revision_index'];
    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    public function add($input = []) {

        if(empty($input['is_valid'])) $input['is_valid'] = 1;

        if(!isset($input['revision_index'])) {
            $revisionIndex = $this->_revisionIndex($input['activity_id']);
            $input['revision_index'] = $revisionIndex;
        }

        return parent::add($input);
    }

    public function bulkAdd($inputs = []) {

        foreach($inputs as &$input) {
            if(empty($input['is_valid'])) $input['is_valid'] = 1;
            if(!isset($input['revision_index'])) {
                $revisionIndex = $this->_revisionIndex($input['activity_id']);
                $input['revision_index'] = $revisionIndex;
            }
        }

        return parent::bulkAdd($inputs);
    }

    private function _revisionIndex($activityId) {

        if(isset($this->_activityVisionIndex[$activityId])) {

            return $this->_activityVisionIndex[$activityId];

        }

        $maxQuery = "SELECT MAX(`revision_index`) FROM {$this->_tableName} WHERE `activity_id` = ?";
        
        $maxIndex = db_query($maxQuery, [$activityId])->fetchField();

        if(!$maxIndex) $maxIndex = 0;

        return $this->_activityVisionIndex = ++$maxIndex;;

    }

    public function delete($activity_id){

        // return db_delete($this->_tableName)
        // ->condition('activity_id',$activity_id)
        // ->execute();

        $activity_id = is_array($activity_id) ? $activity_id : [$activity_id] ;
        
        return $this->update(['is_valid'=>0],['activity_id',$activity_id,'IN']);

    }
}