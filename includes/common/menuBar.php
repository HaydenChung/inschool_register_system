<?php 

    $userHanlder = SiteUserHandler::getInstance();

?>

<div class="col-lg-2 menu">
    <div class="col-inner">
        <div class="logo-wrapper">
            <a href="<?php echo Config::get('http_root'); ?>"><img class="img-responsive school-full-logo" src="<?php echo Config::get('http_root'); ?>/includes/img/cymca_full_logo.png"></a>
        </div>
        
        <div class="login-info-wrapper">
            <div class="menu-user">
                <div class="login-user"><?php 
                    $currUser = user_load($GLOBALS['user']->uid);
                    $currUsername = $userHanlder->fallbackName(
                        isset($currUser->field_english_name['und'][0]['safe_value']) ? $currUser->field_english_name['und'][0]['safe_value'] : null,
                        $GLOBALS['user']->name,
                        $GLOBALS['user']->uid
                    ); 
                    echo $currUsername;
                ?></div>
                <div class="logout-btn">

                <?php 
                    echo $userHanlder->logoutBtn(Config::get('site_map/teacher_login',false));
                ?>
                </div>
            </div>
            <div class='menu-datetime'>
                <i class="material-icons">today</i><div id='menu_date'></div>
            </div>
            <div class='menu-datetime'>
                <i class="material-icons">access_time</i><div id='menu_time'></div>
            </div>
        </div>
    </div>
</div>

<script src='<?php echo Config::get('http_root'); ?>/includes/js/classes/ClockTimer.js'></script>

<script>

updateDateAndClock();
setInterval(updateDateAndClock,1000);

</script>
