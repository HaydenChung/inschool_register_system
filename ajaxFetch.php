<?php

$output = null;

if(!isset($_GET['action'])) die('No action taken.');

function siteAjaxFetch() {

    $output = null;

    switch ($_GET['action']) {

        case 'fetch_user_static': 

            $allUsers = readData()['user'];

            $result = [];

            $conds = isset($_POST['conditions']) ? json_decode($_POST['conditions'],true) : [] ;

            foreach($allUsers as $singleUser) {

                foreach($conds as $cond) {
                    if($singleUser[$cond['field']] == $cond['params']) {
                        $result[] = $singleUser;
                        break;
                    }
                }

            }

            $output = $result;

        break;

        case 'fetch_user_after_school':

        break;

    }


    return json_encode($output);

}

function readData() {

    return json_deconde(file_get_contents('./staticData.json'), true);

}


echo siteAjaxFetch();