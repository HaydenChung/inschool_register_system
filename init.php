<?php

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

require_once(__DIR__.'/configData.php');

spl_autoload_register(function($class) {

	$filePath = __DIR__.'/includes/php/classes/'.$class.'.php';
	
	if(file_exists($filePath))	require_once($filePath);
});