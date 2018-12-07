<?php

use Box\Spout\Reader\ReaderFactory;
use Box\Spout\Common\Type;

require_once(dirname(__DIR__).'/libraries/spout-2.7.3/src/Spout/Autoloader/autoload.php');
require_once(__DIR__.'/StandAloneDB.php');

Class ManageImport {


    // const TABLEHEADER = ['class','no','eng_name','chi_name','gender','student_number','subject','groupname','teachers','MO0','MO1','MO2','MO3','MO4','MO5','MO6','MO7','TU0','TU1','TU2','TU3','TU4','TU5','TU6','TU7','WE0','WE1','WE2','WE3','WE4','WE5','WE6','WE7','TH0','TH1','TH2','TH3','TH4','TH5','TH6','TH7','FR0','FR1','FR2','FR3','FR4','FR5','FR6','FR7'],
    // SCHOOLPERIOD = ['MO0','MO1','MO2','MO3','MO4','MO5','MO6','MO7','TU0','TU1','TU2','TU3','TU4','TU5','TU6','TU7','WE0','WE1','WE2','WE3','WE4','WE5','WE6','WE7','TH0','TH1','TH2','TH3','TH4','TH5','TH6','TH7','FR0','FR1','FR2','FR3','FR4','FR5','FR6','FR7'],
    // const SCHOOLWEEKDAY = ['MO'=> 'Day1', 'TU'=> 'Day2', 'WE'=> 'Day3', 'TH'=> 'Day4', 'FR'=> 'Day5', 'SA'=> 'Day6', 'SU'=> 'Day7'];
    const SCHOOLWEEKDAY = ['MO'=> 'Monday', 'TU'=> 'Tuesday', 'WE'=> 'Wednesday', 'TH'=> 'Thursday', 'FR'=> 'Friday', 'SA'=> 'Saturday', 'SU'=> 'Sunday'];

    private $_userJoinedTree = [],
    $_timeSlotTerms = [],
    $_schoolPeriod = [],
    $_tableHeader = ['class'=> 'Class','no'=> 'No.','student_number'=> 'Student Number', 'subject'=> 'Subject', 'groupname'=> 'GroupName', 'teachers'=> 'Teacher(s)'],
    $_db;

    public function __construct() {

        $this->_db = StandAloneDB::getInstance();
        // $this->_db = new PDO('mysql:host=10.104.32.243;port=3306;dbname=cymcass', 'cymca', 'CymCa#123$');
        $timeStmt = $this->_db->pdo->prepare("SELECT `tid`,`vid`,`name`,`start_time`,`end_time`,`lesson_time` FROM ".Config::get('database/table_name/view/time_slot')." WHERE `lesson_time` IS NOT NULL");
        $timeStmt->execute();
        
        $this->_timeSlotTerms = $timeStmt->fetchAll();
        
        $this->_planHeader();

    }

    public function excelToArray($filePath) {

        $reader = ReaderFactory::create(Type::XLSX);
        $reader->open($filePath);
        $i = 0;
        $result = [];
        
        foreach ($reader->getSheetIterator() as $sheet) {
            //reset matching row pre-sheet
            $tableHeader = [];
            $firstRowFirstCell = null;
            $maxIndex = 0;
            foreach ($sheet->getRowIterator() as $rowIndex=>$row) {
                
                //First row create matching array.
                if($rowIndex == 1) {
                    foreach($row as $header) {
                        $match = array_search($header ,$this->_tableHeader);
                        if($firstRowFirstCell == null) $firstRowFirstCell = $header;
                        if(!empty($match)) {
                            $tableHeader[] = $match;
                        }else {
                            $tableHeader[] = null;
                        }
                    }
                    $maxIndex = count($tableHeader);
                    continue;
                }
        
                $result[] = [];
                $isEmptyRow = true;
                // $result[$i] = [];
                foreach($row as $cellIndex=>$cell){
                    $cell = trim($cell);
                    // $result[] = [];
                    $i = count($result)-1;
                    //skip unwanted cells
                    if($cellIndex == 0 && strtolower($cell) == strtolower($firstRowFirstCell)) {
                        array_pop($result);
                        break;
                    }
                    if($cellIndex>$maxIndex) break;

                    if(empty($tableHeader[$cellIndex]) && $tableHandler[$cellIndex] !== 0) continue;
        
                    if($isEmptyRow == true && $cell != '') $isEmptyRow = false;

                    $result[$i][$tableHeader[$cellIndex]] = $cell;
                }

                if($isEmptyRow === true) array_pop($result);
                
            }
        }
        return $result;
    }

    public function _planHeader() {
        foreach(self::SCHOOLWEEKDAY as $code=> $weekday) {
            foreach($this->_timeSlotTerms as $timeSlot) {
                $this->_tableHeader[$code.$timeSlot['lesson_time']] = $code.$timeSlot['lesson_time'];
                $this->_schoolPeriod[] = $code.$timeSlot['lesson_time'];
            }
        }
        return $this->_tableHeader;
    }



    public function storeExcelToJSON($inputFilePath, $outputFilePath, $outputFilename) {
        
        $data = $this->excelToArray($inputFilePath);

        return self::writeNewFile(json_encode($data), $outputFilePath, $outputFilename, 'json');

    }

    public static function arrayToCsvString($array, $header = null, $delimiter = ",") {
        $csvString = '';
        $delimiter = '"'.$delimiter.'"';
        //need to validify the header here.
        $header == null ? $header = array_keys(array_values($array)[0]) : null;
        array_unshift($array, $header);

        $csvString = implode("\n", array_map( function($row) use ($delimiter) { return '"'.implode($delimiter, $row).'"';} , $array));
        
        return $csvString;
    }

    public static function jsonToCsv($json, $outputPath, $outputFilename, $header = null, $delimiter = ",") {

        $array = json_decode($json, true);

        $csvString = self::arrayToCsvString($array, $header, $delimiter);

        return self::writeNewFile($csvString, $outputPath, $outputFilename, 'csv');

    }

    public static function arrayToUtfCsv($array, $outputPath, $outputFilename, $header = null, $delimiter = ",") {

        $csvString = chr(0xEF) . chr(0xBB) . chr(0xBF);

        $csvString .= self::arrayToCsvString($array, $header, $delimiter);

        return self::writeNewFile($csvString, $outputPath, $outputFilename, 'csv');
    }

    public static function arrayToCsv($array, $outputPath, $outputFilename, $header = null, $delimiter = ",") {
        $csvString = self::arrayToCsvString($array, $header, $delimiter);

        return self::writeNewFile($csvString, $outputPath, $outputFilename, 'csv');
    }

    private static function writeNewFile($data, $filePath, $filename, $fileExt) {
        $i = 1;
        $counter = '';
        $fileExt = '.'.$fileExt;
        while(file_exists($filePath.'/'.$filename.$counter.$fileExt)) $counter = '_('.$i++.')';
        $fullPath = $filePath.'/'.$filename.$counter.$fileExt;

        $fp = fopen($fullPath, 'w');
        fwrite($fp, $data);
        fclose($fp);

        return $fullPath;
        
    }

    public function activityFeed($inputFilePath, $outputPath, $outputFilename, $subject = null, $actType = 'Lesson') {

        $data = json_decode(file_get_contents($inputFilePath), true);
        $result = [];
        $currGroup = '';
        $matches = [];
        $currSubject = '';
        
        foreach($data as $row) {
            // if(!is_int($row['no'])) continue;
            if(empty($row)) continue;
            $currGroup = $row['groupname'];
            if(!isset($result[$currGroup])) {

                if($subject == null) {
                    //Draging letters from the activity name, because currunt data didn't provide the lesson's subject. The result is very questionable.
                    // preg_match('/^[^-]*-(?:S[^-]*-)?(?:[^-]-)?([^S][^-]+)/', $currGroup, $matches);
                    // $currSubject = $matches[1];
                    $currSubject = $row['subject'];
                } else {
                    $currSubject = $subject;
                }

                
                $result[$currGroup] = [
                    'name'=> $currGroup,
                    'subject'=> $currSubject,
                    'form'=> $row['class'][0],
                    'type'=> $actType
                ];
            }
            if($result[$currGroup]['form'] != $row['class'][0] && $result[$currGroup]['form'] != 0) $result[$currGroup]['form'] = 0;
        }

        $data = null;

        return self::arrayToCsv($result, $outputPath, $outputFilename);
    }
    
    public function scheduleFeed($inputFilePath, $outputPath, $outputFilename, $prefix, $suffix = null) {
        $data = json_decode(file_get_contents($inputFilePath), true);
        $result = [];
        $matches = [];

        $httpHost = (isset($_SERVER['HTTPS']) ? "https" : "http" )."://{$_SERVER['HTTP_HOST']}";
        
        // $timeSlot = new TimeSlot();
        //$timeSlotTerms = json_decode(file_get_contents($httpHost.'/ajaxFetch.php?action=fetch_time_slot'), true);
		// $timeSlot = new FetchView('school_time_slot');
        // $timeSlot->addColumnName(['tid', 'vid', 'name', 'start_time', 'end_time', 'lesson_time']);
        
        // $timeSlotTerms = $timeSlot->get(['tid','vid','name','start_time','end_time','lesson_time'])->fetchAll();
		
        $timeSlot = [];
        foreach($this->_timeSlotTerms as $timeSlotTerm) if($timeSlotTerm['lesson_time'] != null) $timeSlot[$timeSlotTerm['lesson_time']] = ['tid'=> $timeSlotTerm['tid'], 'name'=> $timeSlotTerm['name']];

        foreach($data as $row) {
            // if(!is_int($row['no'])) continue;
            if(empty($row)) continue;
            foreach($this->_schoolPeriod as $timePeriod){
                if(!isset($row[$timePeriod])) continue;

                $matches = [];
                preg_match('/^([^\d]+)(\d+)$/', $timePeriod, $matches);
                $currSchedule = $row['groupname'].'-'.$row[$timePeriod].'-'.self::SCHOOLWEEKDAY[$matches[1]].'-'.$timeSlot[$matches[2]]['name'];
                
                if(isset($result[$currSchedule])) continue;

                $result[$currSchedule] = [
                    'title'=> $currSchedule,
                    'location'=> $row[$timePeriod],
                    'activity'=> $row['groupname'],
                    'schedule_name'=> empty($suffix) ? $prefix.'-'.self::SCHOOLWEEKDAY[$matches[1]] : $prefix.'-'.self::SCHOOLWEEKDAY[$matches[1]].'-'.$suffix ,
                    'time_slot_id'=> $timeSlot[$matches[2]]['tid']
                ];
            }
        }

        $data = null;

        return self::arrayToCsv($result, $outputPath, $outputFilename);

    }

    //Return true when $user already has record on the $activity
    private function _isUserDuplicate($activity, $user) {
        if(isset($this->_userJoinedTree[$activity])) $this->_userJoinedTree[$activity] = [];
        if(in_array($user, $this->_userJoinedTree[$activity])) {
            return true;
        }

        $this->_userJoinedTree[$activity][] = $user;
        return false;
    }

    public function userJoinFeed($inputFilePath, $outputPath, $outputFilename) {

        $data = json_decode(file_get_contents($inputFilePath), true);
        $result = [];
        $activityCount = [];
        $tree = [];

        foreach($data as $row) {
            // if(!is_int($row['no'])) continue;
            if(empty($row)) continue;
            if(!in_array($row['groupname'], $activityCount)) {
                $activityCount[] = $row['groupname'];
                $delimiter = strpos($row['teachers'], '/') !== false ? '/' : (strpos($row['teachers'], '_') !== false ? '_' : null ) ;
                $teachers = $delimiter === null ? [$row['teachers']] : explode($delimiter, $row['teachers']);
                
                foreach($teachers as $teacher){
                    if($teacher == '') continue;
                    if($this->_isUserDuplicate($row['groupname'], $teacher)) continue;
                    $result[] = ['user'=> 'T-'.$teacher, 'activity'=> $row['groupname']];
                }
            }


            $username = preg_replace('/\D/', '', $row['student_number']);
            if($this->_isUserDuplicate($row['groupname'], $username)) continue;
            $result[] = ['user'=> $username, 'activity'=> $row['groupname']];
        }

        $data = null;

        return self::arrayToCsv($result, $outputPath, $outputFilename);

    }

    public function importToDrupal($activityFeed, $scheduleFeed, $userJoinFeed) {

        $httpHost = (isset($_SERVER['HTTPS']) ? "https" : "http" )."://{$_SERVER['HTTP_HOST']}";
        $options = [
            CURLOPT_URL=> $httpHost.'/ajaxFetch.php?action=feed_to_drupal',
            CURLOPT_POST=> true,
            CURLOPT_RETURNTRANSFER=> true,
            CURLOPT_POSTFIELDS=> http_build_query([
                'activity_feed'=> $activityFeed,
                'schedule_feed'=> $scheduleFeed,
                'user_join_feed'=> $userJoinFeed,
            ])
        ];

        $ch = curl_init();
        curl_setopt_array($ch, $options);
        $result = curl_exec($ch);
        curl_close($ch);

        //do something with result
    }
}