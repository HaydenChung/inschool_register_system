<?php

function includeJSFiles() {
    $httpRoot = Config::get('http_root');
    $jsVersion = Config::get('version');
    
    $tempHTML = <<<LONG
        <script src="{$httpRoot}/includes/js/jquery-3.2.1.min.js"></script>
        <script src="{$httpRoot}/includes/js/bootstrap.min.js"></script>
        <script src="{$httpRoot}/includes/js/jquery-ui.min.js"></script>
    
        <script src="{$httpRoot}/includes/js/classes/HtmlBuilder.js?v={$jsVersion}"></script>
        <script src="{$httpRoot}/includes/js/classes/liveStorage.js?v={$jsVersion}"></script>
        <script src="{$httpRoot}/includes/js/classes/confirmHandler.js?v={$jsVersion}"></script>
        <script src="{$httpRoot}/includes/js/init.js?v={$jsVersion}"></script>
LONG;

    return $tempHTML;
}


echo includeJSFiles();