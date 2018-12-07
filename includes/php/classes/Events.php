<?php

class Events extends FetchBase{

    private static $_instance = null;

    public function __construct(){
        parent::__construct();
        $this->_tableName = Config::get('database/table_name/event');
        $this->_columnNames = [
            'id',
            'date',
            'nid',
            'schedule_name_id',
            'time_slot_id',
            'location_id',
            'activity_id',
            'schedule_cycle_id',
            'is_sync_google',
            'is_logged',
            'is_deleted',
            'is_valid',
            'logged_time',
            'logged_by_uid'
        ];
    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    public function getEventId($conditions){

        $tableName = Config::get('database/table_name/view/user_event');
        $conjunction = 'WHERE';
        $acceptCols = ['name','location','date','time'];

        $query = "SELECT `event_id` from {$tableName}";
        $params = [];

        if(isset($conditions['time'])){
            $query .= " $conjunction ? BETWEEN `start_time` AND `end_time`";
            $params[] = $conditions['time'];
            $conjunction = 'AND';
            unset($conditions['time']);
        }

        if(isset($conditions['date'])){
            $date = new DateTime($conditions['date']);
            $date = $date->format('Y-m-d');
            $query .= " $conjunction `date` = ?";
            $params[] = $conditions['date'];
            $conjunction = 'AND';
            unset($conditions['date']);
        }

        foreach($acceptCols as $indexName){
            if(isset($conditions[$indexName])){
                $query .= " $conjunction $indexName = ?";
                $params[] = $conditions[$indexName];
                $conjunction = 'AND';
            }
        }

        return db_query($query, $params);
    }

    public function getEvent($conditions){


        $tableName = Config::get('database/table_name/view/user_event');
        $conjunction = 'AND';
        $acceptCols = ['uid','name','location','date','time'];

        $query = "SELECT `event_id`,`date` AS `Date`,`eng_name` AS `Teacher`,`name` AS `name`, CONCAT(`start_time`,' - ',`end_time`) AS `Time`,`location` AS `Location`,`activity_type_id` from {$tableName} WHERE `rid` IN (4,10)";
        $params = [];

        if(isset($conditions['time'])){
            $query .= " $conjunction ? BETWEEN `start_time` AND `end_time`";
            $params[] = $conditions['time'];
            $conjunction = 'AND';
            unset($conditions['time']);
        }

        if(isset($conditions['date'])){
            $date = new DateTime($conditions['date']);
            $date = $date->format('Y-m-d');
            $query .= " $conjunction `date` = ?";
            $params[] = $conditions['date'];
            $conjunction = 'AND';
            unset($conditions['date']);
        }

        foreach($acceptCols as $indexName){
            if(isset($conditions[$indexName])){
                $query .= " $conjunction $indexName = ?";
                $params[] = $conditions[$indexName];
                $conjunction = 'AND';
            }
        }

        $query .= " order by `Date` DESC,`start_time` ASC";

        return db_query($query, $params);
    }

    //Not final

    public static function gen($date){
        $query =    "SELECT `school_schedule_date`.`date`,`school_schedule_view`.* 
                    FROM `school_schedule_date`
                    LEFT JOIN `school_schedule_view`
                    ON `school_schedule_date`.`schedule_id` = `school_schedule_view`.`nid`
                    WHERE `school_schedule_date`.`date` = :wanteddate";

        return db_query($query, [':wanteddate'=> $date]);
    }

    public static function fetchSeatingPlanBase($seatingPlanVerId = null) {

        $roomType = "SELECT `name`,`maxCol`,`maxRow` FROM `school_roomtype` WHERE `id` = ?";
        return db_query($roomType, [$seatingPlanVerId]);

    }

    public static function fetchSeatingPlan($eventId = null, $activityId = null, $seatingPlanVerId = null){

        $cond = '';
        $conj = 'WHERE';

        $params = [':seatingPlanVerId'=> 1];

        if(!empty($eventId)) {
            $cond .= $conj.' `plan`.`id` = :eventId ';
            $conj = 'AND';

            $params[':eventId'] = $eventId;
        } 
        if(!empty($activityId)) {
            //catch the wanted activity group with lastest revision_index
            $cond .= $conj.' `plan`.`activity_id` = :activityId AND `plan`.`revision_index` = (SELECT MAX(`revision_index`) FROM `school_user_join_activity` `sub` where `sub`.`activity_id` = :activityId) ';
            $conj = 'AND';

            $params[':activityId'] = $activityId;
        }
        if(!empty($seatingPlanVerId)) {
            $params[':seatingPlanVerId'] = $seatingPlanVerId;
        }

        $query = 'SELECT DISTINCT 
        `plan`.`id` AS `event_id`,
        `plan`.`location_id`,
        -- `plan`.`activity_id`,
        `plan`.`uid` AS `studId`,
        `plan`.`name`,
        `plan`.`chi_name`,
        `plan`.`imgPath`,
        `plan`.`class`,
        `plan`.`class_number`,
        `seat`.`seating_plan_id`,
        `mon`.`rank` as `monitor`,
        -- `seat`.`version_id`,
        `seat`.`user_seat_position_x` AS `seatRow`,
        `seat`.`user_seat_position_y` AS `seatCol`
        FROM `z_subselect_seating_plan` `plan`
        LEFT JOIN `school_seating_plan_join_user_seat` `seat`
        ON `seat`.`version_id` = :seatingPlanVerId
        AND `plan`.`activity_id` = `seat`.`activity_id`
        AND `plan`.`uid` = `seat`.`uid`
        LEFT JOIN `school_user_activity_monitor` `mon`
        ON `mon`.`activity_id` = `plan`.`activity_id`
        AND `mon`.`uid` = `plan`.`uid`
        '.$cond.'
        Group BY `plan`.`uid`
        Order By `plan`.`class`,`plan`.`class_number`
        ';

        // $query = 
        // "SELECT DISTINCT `id` AS `event_id`,
        // `location_id`,
        // `seating_plan_id`,
        // `uid` AS `studId`,
        // `name`,
        // `chi_name`,
        // `imgPath`,
        // `class`,
        // `class_number`,
        // `user_seat_position_x` AS `seatRow`,
        // `user_seat_position_y` AS `seatCol`
        // FROM `school_seating_plan_static` 
        // ".$cond."
        // Group by `uid`
        // Order by `class`, `class_number`";

        return db_query($query, $params);
    }


    public function delete($id){
        
        $id = is_array($id) ? $id : [$id] ;

        return $this->update(['is_valid'=>0],['id',$id,'IN']);
        
    }
}