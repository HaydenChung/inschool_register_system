<?php

class Exceptional extends FetchBase {

    private static $_instance = null;

    public function __construct(){
        parent::__construct();
        $this->_tableName = Config::get('database/table_name/exception/adhoc');
        $this->_columnNames = ['id','uid','approval_by_uid','reader_id','remark','record_time','valid_from','valid_to','is_valid','closed_by_uid','close_remark','weight','event_id'];

    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    public function add($inputs = []){
        $datetime = [];

        if(!isset($inputs['record_time'])){
            $inputs['record_time'] = date('Y-m-d H:i:s');
        }

        if(isset($inputs['valid_from'])){
            // $validFrom = gettype($inputs['valid_from']) == "string" ? new DateTime($inputs['valid_from']) : new DateTime('@'.$inputs['valid_from']) ;
            // $validFrom = new DateTime('@'.($inputs['valid_from']));
            // $inputs['valid_from'] = $validFrom->format('Y-m-d H:i:s');
            $inputs['valid_from'] = date('Y-m-d H:i:s',intval($inputs['valid_from']));
        }

        if(isset($inputs['valid_to'])){
            // $validTo = gettype($inputs['valid_to']) == "string" ? new DateTime($inputs['valid_to']) : new DateTime('@'.$inputs['valid_to']) ;
            // $validTo = new DateTime('@'.($inputs['valid_to']));
            // $inputs['valid_to'] = $validTo->format('Y-m-d H:i:s');
            $inputs['valid_to'] = date('Y-m-d H:i:s',intval($inputs['valid_to']));
        }

        $inputs['is_valid'] = true;

        return parent::add($inputs);
    }

    public function bulkAdd($inputs = []) {

        $format = 'Y-m-d H:i:s';
        foreach($inputs as &$input) {
            if(!isset($input['record_time'])) $input['record_time'] = date($format);
            if(isset($input['valid_from'])) $input['valid_from'] = date($format, intval($input['valid_from']));
            if(isset($input['valid_to'])) $input['valid_to'] = date($format, intval($input['valid_to']));
            $input['is_valid'] = true;
        }

        return parent::bulkAdd($inputs);
    }

    public function getAdhoc($ids, $uids){

        $conditions = [['is_valid',1,'=']];
        if(isset($ids)) array_push($conditions,['id',is_array($ids) ? $ids : [$ids] ,'IN']);
        if(isset($uids)) array_push($conditions,['uid',is_array($uids) ? $uids : [$uids],'IN']);

        // return $this->get(['uid','valid_to','approval_by_uid','reader_id','remark'],$conditions)->fetchAll();
        return $this->get(['id','uid','record_time','valid_to','is_valid','remark','weight'],$conditions)->fetchAll();
    }

    public function getAlert($ids){
        $ids = is_array($ids) ? $ids : [$ids] ;
        $now = date('Y-m-d H:i:s');
        $conditions = [['valid_to',$now,'<'],['is_valid',1,'=']];
        if(isset($ids)) array_push($conditions,['id',$ids,'IN']);

        return $this->get(['id','uid','record_time','valid_to','is_valid','remark'],$conditions)->fetchAll();
    }

    public function getResponsibleAlert($approvalUid = null, $maxWeight = null, $isToday = false, $remark = null){
        $now = date('Y-m-d H:i:s');
//        $conditions = [['valid_to',$now,'<'],['is_valid',1,'=']];
        $conditions = [['is_valid',1,'=']];
        if(isset($approvalUid)) array_push($conditions, ['approval_by_uid' , $approvalUid, '=']);
        if(isset($maxWeight)) array_push($conditions, ['weight', $maxWeight+1, '<'], ['weight',$maxWeight-9, '>']);
        if(isset($remark)) array_push($conditions, ['remark', $remark, '=']);
        if($isToday == true){
            array_push($conditions, ['valid_to',date('Y-m-d'),'>']);
        }

        return $this->get(['id','uid','record_time','valid_to','is_valid','remark','weight'],$conditions)->fetchAll();
    }

    public function getFetchList($uids){
        $uids = is_array($uids) ? $uids : [$uids];
        $now = date('Y-m-d H:i:s');
        $conditions = [['valid_from',$now,'<'],['is_valid',1,'='],['approval_by_uid',$uids,'IN']];

        return $this->get(['id'],$conditions)->fetchCol();
    }



}