<?php

class Lang{

    const pool = [
        ['guard','保安員','Guard'],['staff','職員','Staff'],['student','學生','Student'],['teacher','老師','Teacher'],
        ['record_time','紀錄時間','Record Time'],['valid_to','失效時間','Expired at'],['remark','備註','Remark'],['username','用戶名','Name'],['classname','班名','Class'],
    ];
    private $dict = [];
    
    public function __construct($lang){
        $this->createDict($lang);
    }

    public function tran($string){
        return str_replace($this->dict[0],$this->dict[1],$string);
    }

    public function createDict($lang){
        $pool = self::pool;
        usort($pool,array('self','sort'));
        $this->dict[0] = array_map('self::splitOrigin',$pool);
        $this->dict[1] = array_map('self::split'.ucfirst($lang),$pool);        
    }

    private static function splitOrigin($arr){
        return $arr[0];
    }

    private static function splitChinese($arr){
        return $arr[1];
    }

    private static function splitEnglish($arr){
        return $arr[2];
    }

    private static function sort($a,$b){
        return strlen($b[0])-strlen($a[0]);
    }

}