<?php

class SchoolDay{

    public static function getHKHoliday($simplify = false){
        $govCalendar = 'http://www.1823.gov.hk/common/ical/gc/en.ics';
        
        $holidayContent = file_get_contents($govCalendar);
        $holidayContent = htmlspecialchars($holidayContent, ENT_NOQUOTES, 'UTF-8');
        
        // Check the first line
        if(preg_match("/^BEGIN:VCALENDAR/",$holidayContent,$matches) != 1) return false;
        
        // Break content to event.
        $contentBreak = preg_split('/(END:VEVENT\s+)?(BEGIN:VEVENT\s+)|(END:VCALENDAR$)/', $holidayContent);
    
        // Paser event to php array.
        $currLine = [];
        $events = [];
        $currItem = [];
        $currLineResult = [];
        $matches = [];
    
        for($i=1,$lenI=count($contentBreak);$i<$lenI;$i++){
            $currLine = $contentBreak[$i];
            $currLine = explode(PHP_EOL, $currLine);
    
            foreach($currLine as $singleItem){
                if($singleItem == '') continue;
                if($simplify === true){
                    if(preg_match('/DTSTART;VALUE=DATE:(\d*)/', $singleItem, $matches)) $currLineResult = $matches[1];
                    continue;
                }
                $currItem = explode(':', $singleItem);
                $currLineResult[$currItem[0]] = $currItem[1];
            }
            $events[] = $currLineResult;
        }
    
        return $events;
    }

    public function isHoliday($date) {

        $dateInQuestion = isset($date) ? new DateTime : new DateTime($date);

        $weekday = $dateInQuestion->format('w');
        //if today is sat or sunday
        if($weekday == 6 || $weekday == 7) return ['title'=> 'Weekend', 'Description'=> 'Weekend'];

        $holidaysInstance = SchoolHoliday::getInstance();
        $isHoliday = $holidaysInstance->get(['title','description'], [['start', $dateInQuestion->format('Y-m-d'), '<='],['end', $dateInQuestion->format('Y-m-d'), '>=']])->fetch();

        return empty($isHoliday) ? false : $isHoliday;

    }
    
    
    /**
        * This function return an array of Datetime containning dates between $begin and $end which suppose to be school days,
        * it would also invoke a function with every datetime passed as the first parameter if the callback function is given.
        *
        * @param string    $begin          Start date of the period.
        * @param string    $end            End date of the period.
        * @param array     $skipWeekDay    [Optional] Weekday to be skip in the period,default to be [6,0](saturday and sunday)
        * @param callback  $cycleCall      [Optional] Callback function to be invoke on every datetime in the period.
        * @param array     $cycleCallParam [Optional] Callback function's parameters.
        * 
        * @return  array
        *
        */
    
    public static function getDayRange($begin, $end, $weekday = [0,1,2,3,4,5,6], $exceptionDate = null, $cycleCall = null, $cycleCallParam = null){
    
        // $hkHolidays = self::getHKHoliday(true);
    
        $begin = new DateTime($begin);
        $end = new DateTime($end);
        $end->modify('+1 day');
    
        $exceptionArr = [];
        if($exceptionDate !== null) foreach($exceptionDate as $dateStr){ $currExcDate = new DateTime($dateStr); $exceptionArr[] = $currExcDate->format('Y-m-d'); }

        $interval = DateInterval::createFromDateString('1 day');
        $period = new DatePeriod($begin, $interval, $end);
    
        $result = [];
    
        foreach( $period as $day){
            // if(in_array($day->format("w"),$skipWeekDay) || in_array($day->format("Ymd"),$hkHolidays)) continue;
            if(!in_array($day->format("w"),$weekday)) continue;
            if(!empty($exceptionArr) && in_array($day->format("Y-m-d"), $exceptionArr)) continue;
            //Do something with this $day
            if($cycleCall != null) call_user_func($cycleCall, array_merge($day, $cycleCallParam));
            //Or just return the day range;
            $result[] = $day;
        }
        return $result;
    }

}
