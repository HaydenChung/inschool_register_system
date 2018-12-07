<?php

class ManageCard {

    public static function editTempCard($uid,$card_id){

        if(empty($uid)) return 'ManageCard: $uid is empty.';
        if(empty($card_id)) return 'ManageCard: $card_id is empty.';
        if(self::isCardDup($card_id)) return 'ManageCard: Card number is already in use.';

        $uAccount = user_load($uid);
        $options = [
            'field_temporary_card_number'=>['und'=>[0=>["value"=>$card_id]]],
            'field_temp_card_expire'=>['und'=>[0=>['value'=>date("Y-m-d H:i",strtotime("tomorrow midnight -1 minute"))]]]
        ];
        if(user_save($uAccount, $options)) return true;
        return false;
    }

    public static function isCardDup($card_id){

        $query = "SELECT `uid`,`card_id` 
            FROM `school_all_existing_card` 
            WHERE `card_id` = ?";

        $result = db_query($query,[$card_id])->fetchObject();
        if(empty($result)) return false;
        return $result;
    }
}