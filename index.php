<?php

    include_once('./init.php');


?>

<!DOCTYPE html>
<html>
<head>
<?php include(Config::get('root_document').'/includes/common/includeHeader.php'); ?>
<?php include(Config::get('root_document').'/includes/common/includeCSS.php'); ?>

<link rel="stylesheet" type="text/css" href="<?php echo Config::get('http_root'); ?>/includes/css/menubar.css"> 

<style>



</style>
</head>
<body>

<?php echo HtmlBuilder::menuBar(); ?>

<div id='container' class='col-md-10'>

</div>

<?php include(Config::get('root_document').'/includes/common/includeJS.php'); ?>

<!-- <script src="http://localhost:8080/inschool_register/assets/main.js"></script> -->
<script src="/inschool_register/dist/main.js"></script>

<script>

    document.querySelector('.login-info-wrapper').style.display = 'none';
    var logo  = document.querySelector('.logo-wrapper');
    logo.style.borderBottom = '#393d98 5px solid';
    logo.querySelector('a').href = window.location.href;

</script>

</body>
</html>