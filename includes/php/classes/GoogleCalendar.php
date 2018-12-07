<?php

include_once Config::get('root_document').'/atteadmin/sites/all/libraries/google-api-php-client/vendor/autoload.php';

class GoogleCalendar{

    private $_googleClient = [],
    $_service = [],
    $_timezone = '';

    function __construct($googleClient){
        $this->_googleClient = $googleClient;
        $this->_service = new Google_Service_Calendar($this->_googleClient);
        $this->_timezone = date_default_timezone_get();
    }
    
    public function setSubject($email){
        $this->_googleClient->setSubject($email);
    }

    public function add($summary, $description= null){
        $calendar = new Google_Service_Calendar_Calendar();
        $calendar->setSummary($summary);
        $calendar->setTimeZone($this->_timezone);
        if(isset($description)){
            $calendar->setDescription($description);
        }
        $created = $this->_service->calendars->insert($calendar);
        return $created;
    }

    public function get($id){
        return $this->_service->calendars->get($id);
    }

    public function clear($id){
        return $this->_service->calendars->clear($id);
    }

    public function delete($id){
        return $this->_service->calendars->delete($id);
    }

    public function getAll(){

        $pageToken = null;
        $result = [];
        $optParams = ['maxResults'=>250];
        do{
            if($pageToken){
                $optParams = array_merge($optParams, ['pageToken'=>$pageToken]);
            }
            $calendars = $this->_service->calendarList->listCalendarList($optParams);
            $result = array_merge($result, $calendars->getItems());
            $pageToken = $calendars->getNextPageToken();
        }while($pageToken);

        return $result;
    }

    public function bulk($actions){
        //@param $actions array  [actionNameA=>[params,params],actionNameB=>[params,params]]

        $this->_googleClient->setUseBatch(true);
        $batch = new Google_Http_Batch($this->_googleClient);
        $currReq =[];

        foreach($actions as $actionName=>$action){
            foreach($action as $index=>$params){
                $currReq = call_user_func_array([$this,$actionName],$params);
                $batch->add($currReq,'bulk-'.$actionName.'-'.$index);
            }
        }

        $response = $batch->execute();
        $this->_googleClient->setUseBatch(false);
        return $response;
    }


    public function addEvent($calendarId,$summary,$start,$end,$attendees=[],$colorId=null){

        $options = [
            'summary'=> $summary,
            'start'=> [
                'dateTime'=> date(DateTime::RFC3339,strtotime($start)),
                'timeZone'=> $this->_timezone,
            ],
            'end'=> [
                'dateTime'=> date(DateTime::RFC3339,strtotime($end)),
                'timeZone'=> $this->_timezone,
            ]
        ];

        foreach($attendees as $attendee){
            $options['attendees'][] = [
                'email'=> $attendee,
                //Attendee auto accepted invite
                'responseStatus'=> 'accepted'
            ];
        }

        if(isset($colorId)){
            $options['colorId'] = $colorId;
        }

        $event = new Google_Service_Calendar_Event($options);

        return $this->_service->events->insert($calendarId, $event);
    }

    public function deleteEvent($eventId, $calendarId){
        return $this->_service->events->delete($calendarId, $eventId);
    }

    public function getEvent($calId, $eventId){
        return $this->_service->events->get($calId, $eventId);
    }

}