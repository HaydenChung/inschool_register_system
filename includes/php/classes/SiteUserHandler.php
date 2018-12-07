<?php

class SiteUserHandler{

    protected $_teacherRoleNid = null,
    $_adminRoleNid = null,
    $_guardRoleNid = null,
    $_staffRoleNid = null,
    $__studentRoleNid = null;
    private static $_instance = null;

    public function __construct(){

        $this->_teacherRoleNid = Config::get('user_role/teacher');
        $this->_adminRoleNid = Config::get('user_role/admin');
        $this->_guardRoleNid = Config::get('user_role/guard');
        $this->_staffRoleNid = Config::get('user_role/staff');
        $this->_studentRoleNid = Config::get('user_role/student');
        $this->_HoYRoleNid = Config::get('user_role/HoY');
        $this->_coachRoleNid = Config::get('user_role/coach');

    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    public function isTeacher(){
       return user_has_role($this->_teacherRoleNid);
    }

    public function isRole($roleName){
        return user_has_role($this->{"_{$roleName}RoleNid"});
    }

    public function userTimeout($second){

        return;
        
        //Bypass,mostly for standalone page that don't care if a user has login.
        if(in_array(basename($_SERVER['PHP_SELF'],'.php'),Config::get('user_timeout_exception'))) return;

        $now = new DateTime();
        $now = $now->getTimestamp();

        if(!isset($_SESSION['last_active']) && isset($GLOBALS['user']->login)) {
            $_SESSION['session_created'] = $now;
            $_SESSION['last_active'] = $now;
            
        }

        if(($now - $_SESSION['session_created']) > $second) {
            session_regenerate_id(true);
            $_SESSION['session_created'] = $now;
        }

        if(isset($_SESSION['last_active']) && ($now - $_SESSION['last_active']) > $second){
            $this->logout();
        }
        if(isset($GLOBALS['user']->login)) $_SESSION['last_active'] = $now;

    }

    //A costly drupal logout function.
    public function logout($redirect = null){

        module_load_include('pages.inc', 'user');
        user_logout_current_user();

        $path = isset($redirect) ? strpos($redirect,'http') == 0 ? $redirect : Config::get('http_root')."/{$redirect}" : Config::get('http_root') ;

        try{
            // header('Location:'.$path);
            drupal_goto($path);
        }catch(Exception $e){
            echo "<script>window.location.href = {$path}</script>";
        }
        die();
    }

    public static function logoutPath($redirect = null){
        $urlParam = isset($redirect) ? "?redirect={$redirect}" : '' ;
        return Config::get('site_map/logout').$urlParam;
    }

    public static function logoutBtn($redirect = null, $cssClass = true){
        // $path = $this->logoutPath($redirect);
        $path = self::logoutPath($redirect);
        $cssClass = $cssClass == false ? "" : "class='btn btn-info '" ;
        $htmlBtn = <<<EOD
        <button {$cssClass} onclick="window.location.href = '{$path}'">
           Sign out
        </button>
EOD;
        return $htmlBtn;
    }

    public static function fallbackName($name, $username = null, $uid = null) {

        if($name !== null) return $name;
        if($username !== null) return $username;
        if($uid !== null) return user_load($uid)->name;
        
        return 'Unknown Username';

    }
}