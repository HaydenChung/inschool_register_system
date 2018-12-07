<?php

namespace KanHan\cymca;

class ScheduleModule {
    private $_schedule,
    $_scheduleDate,
    $_scheduleName,
    $_timeSlot;
    private $_tableName = [];

    public function __construct(){
        $this->_schedule = Schedule::getInstance();
        
        $this->_scheduleDate = ScheduleDate::getInstance();

        $this->_scheduleName = ScheduleName::getInstance();

        $this->_timeSlot = TimeSlot::getInstance();

        $this->_tableName = Config::get('database/table_name/schedule');
    }

    public function genEvents($date){


        $query =    "SELECT `d`.`date`,`t`.`start_time`,`t`.`end_time`,`act`.`name`,`loc`.`name` FROM {{$this->_tableName['date']}} AS `d`
                    LEFT JOIN {{$this->_tableName['main']}} AS `s` ON `d`.`schedule_id` = `s`.`id` 
                    JOIN {{$this->_tableName['time']}} AS `t` ON `s`.`schedule_time_slot_id` = `t`.`id` 
                    JOIN `school_activity` AS `act` ON `s`.`activity_id` = `act`.`id` 
                    JOIN `school_location` AS `loc` ON `s`.`location_id` = `loc`.`id`
                    WHERE `s`.`active` = 1";
        $result = db_query($query)->fetchAll();

        // $values = $this->_schedule->get(['id','schedule_name_id','schedule_time_slot_id','location_id','activity_id'],['active',1,'=']);

        // foreach($values as $value){
        //     $schedule_name_ids[] = $value['schedule_name_id'];
        //     $schedule_time_slot_ids[] = $value['schedule_time_slot_id'];
        //     $location_ids[] = $value['location_id'];
        //     $activity_ids[] = $value['activity_id'];
        // }

        // foreach($data as $bit){
        //     $temp[] = $bit->schedule_name_id;
        // }
        
        // $result[] = $this->_scheduleName->get(['id','name'],['id',$schedule_name_ids,'IN']);


        return $result;

    }
    
}