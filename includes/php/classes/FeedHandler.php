<?php

class FeedHandler {

    //feed importer's id(machine name)
    const IMPORTERID = [
        'activity'=> 'activity_feed',
        'schedule'=> 'school_schedule_feed',
    ];

    private $_allLocation = null;

    public function __construct() {

    }

    public static function importToFeed($path, $importer) {

        $file = file_save((object) [
            'filename'=> basename($path),
            'uri'=> pathToDrupalPublic($path),
            'status'=> FILE_STATUS_PERMANENT,
            'filemime'=> file_get_mimetype($path),
        ]);

        if(!$file) throw new Exception('Unable to save file to drupal, source path:'.$path);
        $source = feeds_source(self::IMPORTERID[$importer]);
        $fetcher_config = $source->getConfigFor($source->importer->fetcher);
        $fetcher_config['source'] = $file->uri;
        $fetcher_config['file'] = $file;

        $source->setConfigFor($source->importer->fetcher, $fetcher_config);
        $source->save();

        while (FEEDS_BATCH_COMPLETE != $source->import());
        
        return true;
    }

    public function activityFeed($path) {
        return self::importToFeed($path, 'activity');
    }

    public function scheduleFeed($path, $deleteSchedule = null) {

        //Drupal feeds mod will update the old schedule if they have the same name, and we cannot define if a schedule should update(adding new timeslot or location) or replace by the format of the excel.
        //For these reasons any schedule with duplicate name will be remove and recreate with newly imported excel's data.
        if($deleteSchedule !== null) node_delete_multiple($deleteSchedule);

        return self::importToFeed($path, 'schedule');
    }

    //This's not a function to import data with feeds module, it just happen to be grouped with this class
    public function userJoinFeed($path) {
        // $inputArr = json_decode(file_get_contents($path), true);
        $inputArr = self::csvToArray($path);
        $joinAct = UserJoinActivity::getInstance();
        
        $userQuery =  "SELECT `uid`,`name` as `username` FROM `users`";

        $vocab = taxonomy_vocabulary_machine_name_load('activity');
        
        $activityQuery = "SELECT `tid` as `activity_id`,`name` as `activity_name` FROM `taxonomy_term_data` WHERE `vid` = ?";

        $userResult = db_query($userQuery)->fetchAll();
        $activityResult = db_query($activityQuery, [$vocab->vid])->fetchAll();
        
        $userArray = [];
        $actArray = [];
        
        foreach($userResult as $userValue){
            $userArray[$userValue->username] = $userValue->uid;
        }
        
        foreach($activityResult as $actValue){
            $actArray[$actValue->activity_name] = $actValue->activity_id;
        }
        
        $oldActivityId = [];
        $insertObject = [];
        $tree = [];
        $duplicate = [];

        foreach($inputArr as $input){
            if(!isset($userArray[$input['user']])){
                $unknownUser[$input['user']] = 1;
                continue;
            }
            if(!isset($actArray[$input['activity']])){
                $unknownAct[$input['activity']] = 1;
                continue;
            }

            if(!isset($tree[$actArray[$input['activity']]])) $tree[$actArray[$input['activity']]] = [];
            if(in_array($input['user'], $tree[$actArray[$input['activity']]])) {
                array_push($duplicate, ['%activity'=> $input['activity'], '%user'=> $input['user']]);
                continue;
            }

            array_push($tree[$actArray[$input['activity']]], $input['user']);

            $oldActivityId[] = $actArray[$input['activity']];
            $insertObject[] = ['uid'=> $userArray[$input['user']], 'activity_id'=> $actArray[$input['activity']], 'is_valid'=> 1];
            
        }

        if(!empty($unknownUser)) watchdog('activity_import', 'Failed to insert user join activity record: Unknown username: %username .', ['%username'=>implode(', ', array_keys($unknownUser))]);
        if(!empty($unknownAct)) watchdog('activity_import', 'Failed to insert user join activity record: Unknown activity: %activity', ['%activity'=> implode(', ', array_keys($unknownAct))]);

        self::restrictedWatchdog('activity_import', 'Duplicate user found. User: "%user" found in activity: "%activity" again within current import. Ignored duplicate record.', $duplicate, 10);

        $joinAct->delete($oldActivityId);

        return $joinAct->bulkAdd($insertObject);
    }

    public static function restrictedWatchdog($type, $message, $params, $maxIndex=10) {
        $dogCount = count($params);
        $maxIndex = $maxIndex< $dogCount ? $maxIndex : $dogCount ;
        for($i=0; $i< $maxIndex; $i++) call_user_func_array('watchdog', [$type, $message, $params[$i]]);
        if($dogCount > $maxIndex) watchdog($type, '%count messages have been hidden.', ['%count'=> ($dogCount - $maxIndex)]);
    }

    //This method is case-insensitive
    public function verifyLocation($location) {
        if($this->_allLocation === null){
            $query = 'SELECT `name` FROM `school_location`';
            $this->_allLocation = array_map('strtolower', db_query($query)->fetchCol());
        }
        if(!in_array(strtolower($location), $this->_allLocation)) throw new Exception('Unknown location: '.$location);

        return true;
    }

    public function verifyScheduleFeed($path) {
        
        $schedules = self::csvToArray($path);

        $scheduleQuery = new Schedule;

        $allScheduleAct = [];

        foreach($schedules as $schedule) {
            if($schedule['time_slot_id'] == null) throw new Exception('Unrecognized time slot in schedule: '.$schedule['title']);
            try{ 
                $this->verifyLocation($schedule['location']);
            }catch(Exception $e) {
                throw new Exception($e->getMessage().', when verifying data from '.$schedule['activity']);
            };

            $allScheduleAct[$schedule['activity']] = true;
            // $allScheduleName[$schedule['schedule_name']] = true;
        }

        // $existingSchedule = $scheduleQuery->get(['nid', 'activity', 'schedule_name'],[['activity', array_keys($allScheduleAct), 'IN'], ['schedule_name', array_keys($allScheduleName), 'IN']])->fetchAll();
        if(!empty($allScheduleAct)) $existingSchedule = $scheduleQuery->get(['nid', 'activity', 'schedule_name'], ['activity', array_keys($allScheduleAct), 'IN'])->fetchAll();

        if(!empty($existingSchedule)) return ['existing'=> $existingSchedule];
        return true;
    }

    public function verifyActivityFeed($path) {
        
        $activitys = self::csvToArray($path);

        foreach($activitys as $activity) $allActivityName[$activity['name']] = true;

        $activityQuery = new Activity;

        $existingAct = $activityQuery->get(['tid','name'],['name', array_keys($allActivityName),'IN'])->fetchAll();

        if(!empty($existingAct)) return ['existing'=> $existingAct];
        return true;
    }
    
    public function verifyUserJoinFeed($path) {
        
        $users = self::csvToArray($path);

        $query =  "SELECT `name` as `username` FROM `users`";
        $allUser = db_query($query)->fetchCol();

        foreach($users as $userRow) {
            if(!in_array($userRow['user'], $allUser)) throw new Exception('Unknown username: '.$userRow['user']);
        }
    }

    public static function csvToArray($csvPath, $header = null, $delimiter = ',') {
        
        $csvData = file($csvPath);

        $enclosure = $csvData[0][0] == '\'' ? '\'' : '"' ;
        if($header === null) $header = str_getcsv(array_shift($csvData), $delimiter, $enclosure);

        $array = array_map(
            function($row) use ($header, $delimiter, $enclosure) {
                return array_combine($header ,str_getcsv($row, $delimiter, $enclosure));
            },
        $csvData);

        return $array;
    }
    
}