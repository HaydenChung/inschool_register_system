<?php

class Config {
    public static function get($pathString = null){
        if($pathString){
            $config = $GLOBALS['config'];
            $path = explode('/', $pathString);

            foreach($path as $bit){
                if(isset($config[$bit])){
                    $config = $config[$bit];
                }else{
                    throw new RuntimeException('Invalid config path:'.$pathString);
                }
            }
            return $config;
        }else{
            throw new RuntimeException('Parameter is empty.');
        }
    }

    public static function update($path = null, $value = null){
        if($path){
            $config = $GLOBALS['config'];
            $path = explode('/', $path);

            foreach($path as $bit){
                if(isset($config[$bit])){
                    $config = $config[$bit];
                }else{
                    throw new RuntimeException('Invalid config path');
                }
            }
            return $config = $value;
        }else{
            throw new RuntimeException('Parameter is empty.');
        }
    }
}