<?php

class GoogleResource{

    private $_googleClient,
    $_service,
    $_customer = 'my_customer';

    public function __construct($googleClient){
        $this->_googleClient = $googleClient;
        $this->_service = new Google_Service_Directory($googleClient);
    }

    public function setSubject($email){
        $this->_googleClient->setSubject($email);
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

    public function add($id, $name, $description= null, $type= null, $location= null){

        $res = new Google_Service_Directory_CalendarResource();
        $res->setResourceId($id);
        $res->setResourceName($name);
        $res->setResourceDescription($description);
        $res->setResourceType($type);
        if($location != null) $res->setLocation($location);

        $response = $this->_service->resources_calendars->insert($this->_customer, $res);

        return $response;
    }

    public function delete($resId, $customer= 'my_customer'){

        $response = $this->_service_resources_calendars->delete($customer, $resId);

        if(empty($response)) return true;
        return false;
    }

    public function getAll($customer= 'my_customer'){

        return $this->_service->resources_calendars->listResourcesCalendars($customer);
    }
    
    // public function getAll($customer= 'my_customer'){

    //     $pageToken = null;
    //     $result = [];
    //     $optParams = ['maxResults'=>500];
    //     do{
    //         if($pageToken){
    //             $optParams = array_merge($optParams, ['pageToken'=>$pageToken]);
    //         }
    //         $calendars = $this->_service->resources_calendars->listResourcesCalendars($customer, $optParams);
    //         $result = array_merge($result, $calendars->getItems());
    //         $pageToken = $calendars->getNextPageToken();
    //     }while($pageToken);

    //     return $result;

    // }
    

    public function get($resId, $customer= 'my_customer'){

        return $this->_service->resources_calendars->get($customer, $resId);

    }
}