
<?php

function includeCSSFiles() {
    $httpRoot = Config::get('http_root');

    $tempHTML = <<<LONG
        <link rel="stylesheet" type="text/css"  href="{$httpRoot}/includes/css/bootstrap.min.css">
        <link rel="stylesheet" href="{$httpRoot}/includes/css/material-icon.css">
        <link rel="stylesheet" type="text/css" href="{$httpRoot}/includes/css/jquery-ui.min.css">
        <link rel="shortcut icon" type="image/png" href="{$httpRoot}/includes/img/cymca-favicon.ico"/>
LONG;
    return $tempHTML;
}



echo includeCSSFiles();
