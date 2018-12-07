<?php

class HtmlBuilder{

    public function __construct(){

    }

    public static function create($type, $inner = null, $attr = null) {
        $elmLeft = "<{$type}>";
        $elmRight = "</{$type}>";

        $attrString = '';

        if(isset($attr)) {
            foreach($attr as $attrName=>$attrVal) {
                $attrString += "{$attrName}='{$attrVal}'";
            }
            $elmLeft = "<{$type} {$attrString}>";
        }

        return $elmLeft.$inner.$elmRight;
    }

    public static function options($source, $value = null, $display = null){
        $display = isset($display) ? $display : $value;
        $result = '';

        if(!isset($value)){
            foreach($source as $bit) $result .= "<option value='{$bit}' >{$bit}</option>";
            return $result;
        }

        foreach($source as $bit) $result .= "<option value='{$bit->$value}' >{$bit->$display}</option>";
        return $result;
    }

    public static function checkbox($source, $name, $value = null, $display = null){
        $display = isset($display) ? $display : $value;
        $result = '';
        $count = 0;

        if(!isset($value)){
            foreach($source as $bit)   $result .= "<div><input type='checkbox' value='{$bit}' id='gen-checkbox-{$count}' name='{$name}'><label for='gen-checkbox-".$count++."'>{$bit}</label></div>";
            return $result;
        }

        foreach($source as $bit) $result .= "<div><input type='checkbox' value='{$bit->$value}' id='gen-checkbox-{$count}' name='{$name}'><label for='gen-checkbox-".$count++."'>{$bit->$display}</label></div>";
        return $result;
    }
    
    public static function eventSelectTable($source){
        $result = "<table class='table table-hover table-striped'>";
        
        $sample = $source[0];
        
        $result .= "<thead></tr>";
        foreach($sample as $indexName=>$sampleVal){
            if($indexName == 'event_id') continue;
            $result .= "<th>{$indexName}</th>";
        }
        $result .= "<th></th></tr></thead><tbody>";

        foreach($source as $outerVal){
            $result .= "<tr name='event_row' data-index='event_{$outerVal->event_id}' data-val='{$outerVal->event_id}'>";

            foreach($outerVal as $key=>$val){
                if($key == 'event_id') continue;
                $result .= "<td>{$val}</td>";
            }
            // $result .= "<td><i class='material-icons'>&#xE616;</i></td></tr>";
            $result .= "<td><i class='material-icons'>&#xE895;</i></td></tr>";
        }
        return $result .= "</tbody></table>";
    }

        public static function bootTable($source){
        $result = "<table class='table table-hover table-striped'>";
        
        $sample = $source[0];
        
        $result .= "<thead></tr>";
        foreach($sample as $indexName=>$sampleVal){
            $result .= "<th>{$indexName}</th>";
        }
        $result .= "</tr></thead><tbody>";

        foreach($source as $outerVal){
            $result .= "<tr>";
            foreach($outerVal as $key=>$val){
                $result .= "<td>{$val}</td>";
            }
            $result .= "</tr>";
        }
        return $result .= "</tbody></table>";
    }

    public static function menuBar($innerHtml = '') {

        $httpRoot = Config::get('http_root');
        // $currUser = user_load($GLOBALS['user']->uid);
        $curUser = (object) [
            'field_english_name'=> [
                'und'=> [
                    [
                        'safe_value' => 'in_dev'
                    ]
                ]
            ]
        ];
        $currUsername = SiteUserHandler::fallbackName(
            isset($currUser->field_english_name['und'][0]['safe_value']) ? $currUser->field_english_name['und'][0]['safe_value'] : null,
            'fallback name',
            1
        );
        $logoutBtnString = SiteUserHandler::logoutBtn(Config::get('site_map/teacher_login', false));

        $htmlResult = <<<EOD
        <div class="col-lg-2 menu">
            <div class="col-inner">
                <div class="logo-wrapper">
                    <a href="{$httpRoot}"><img class="img-responsive school-full-logo" src="{$httpRoot}/includes/img/cymca_full_logo.png"></a>
                </div>
                
                <div class="login-info-wrapper">
                    <div class="menu-user">
                        <div class="login-user">{$currUsername}</div>
                        <div class="logout-btn">{$logoutBtnString}</div>
                    </div>
                    <div class='menu-datetime'>
                        <i class="material-icons">today</i><div id='menu_date'></div>
                    </div>
                    <div class='menu-datetime'>
                        <i class="material-icons">access_time</i><div id='menu_time'></div>
                    </div>
                </div>
                <div>
                    {$innerHtml}
                </div>
            </div>
        </div>
        
        <script src='{$httpRoot}/includes/js/classes/ClockTimer.js'></script>
        
        <script>
        
        updateDateAndClock();
        setInterval(updateDateAndClock,1000);
        
        </script>
EOD;
        return $htmlResult;
    }
}