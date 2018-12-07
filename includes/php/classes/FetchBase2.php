<?php

class FetchBase {

    protected $_tableName = '',
    $_columnNames = [];
    private static $_instance = null;

    public function __construct($tableName=null){
        $this->_operators = Config::get('database/operators');
        if(isset($tableName)) $this->_tableName = $tableName;
        //Provide table and column names here
    }

    // The getInstance method need to be provide by the child,
    // or else the self() it getting is the parent's self,looking for a work around.
    // public static function getInstance(){
    //     if(!isset(self::$_instance)){
    //         self::$_instance = new self();
    //     }
    //     return self::$_instance;
    // }

    public function add($input = []){
        $fields = [];
        foreach($this->_columnNames as $column){
            $fields[$column] = isset($input[$column]) ? $input[$column] : null ;
        }

        return $insert = db_insert($this->_tableName)
        ->fields($fields)
        ->execute();
    }

    public function bulkAdd($inputs = []){
        $insert = db_insert($this->_tableName, ['return'=> Database::RETURN_AFFECTED])
        ->fields($this->_columnNames);

        $values = [];
        foreach($inputs as $input){
            $values = [];
            foreach($this->_columnNames as $column){
                $values[$column] = isset($input[$column]) ? $input[$column] : null ;
            }

            $insert->values($values);
        }
        return $insert->execute();
    }

    function conditionLoop($conditions, $conjunctions, $indexCount){
        if(gettype($conditions[0])==='array') conditionLoop($conditions[0], $conjunctions, $indexCount+1);
    }

    // $abc->get(['fieldA'],[$a,[$b,$c],[$d,$e]],['and','or','and','or']);

    private function _conditionLoop($leadObj, $conditions, &$conjunctions, $indexCount = 0){

        // if(gettype($conditions[0]) !== 'array') $indexCount++;
        if(is_array($conditions[0])){
            foreach($conditions as $condition){
                if(is_array($condition[0]))$indexCount++;
                // $currObj = array_shift($conjunctions) === 'OR' ? db_or() : db_and() ;
                $this->_conditionLoop($currObj, $condition, $conjunctions, $indexCount);                
            }
        }else{

            if(!empty($conjunctions)) $tempObj = array_shift($conjunctions) === 'OR' ? db_or() : db_and() ;

                // $tempObj->condition($conditions);
                $tempObj->condition($conditions);
                $leadObj->condition($tempObj);

            // print_r($conditions);
            // echo array_shift($conjunctions);
        }

    }

    public function get($fields, $conditions = null, $conjunction = ['AND']){
        if(empty($fields)){
            throw new Exception('Fields cannot be empty.');
            return false;
        }
        if(!$this->_checkCols($fields)) return false;
        

        $select = db_select($this->_tableName,'t')
        ->fields('t',$fields);

        //Execute query and end the function if second parameter is empty
        if(!isset($conditions)) return $select->execute();


        // $abc->get(['fieldA'],[$a,[$b,$c],[$d,$e]],['and','or','and','or']);


        


        // if(gettype($conditions[0]) == 'array'){
        //     $lenI = count($conditions);
        //     $leadObj = $select;
        //     $tempObj = null;
        //     for($i=0;$i<$lenI;$i++){

        //         if(isset($conjunction[$i])){
        //             $tempObj = strtoupper($conjunction[$i]) === 'OR' ? db_or() : db_and() ;
        //             //$tempObj will be mutate later.
        //             $leadObj->condition($tempObj);
        //         }

        //         $tempObj->condition($conditions[$i][0],$conditions[$i][1],$conditions[$i][2]);







        //         if(gettype($conditions[$i][0]) == 'array'){
        //             $lenJ = count($conditions[$i]);
        //             $closureObj = strtoupper($conjunction[$i]) === 'OR' ? db_or() : db_and() ;
        //         }
        //     }
        // }


        if(gettype($conditions[0]) == 'array'){
            $lenI = count($conditions);
            $leadObj = $select;
            for($i=0;$i<$lenI;$i++){

                if(!$this->_checkCol($conditions[$i][0])) return false;
                if(!$this->_checkOperator($conditions[$i][2])) return false;

                //drupal use the db_or() function to create a object that take a condition as argument,
                //and chain it with the statement's object by passing the 'or' object as a argument of condition method.
                //What is being done here is to trun the statement object to a 'or' object, so it could take current condition as a or condition
                //By changing the or object(object is mutable even it is passed as a argument, it will effect the statement before it execute())
                //such a bad behavier.....

                if(isset($conjunction[$i]) && strtoupper($conjunction[$i]) == 'OR'){
                    $tempObj =  db_or();
                    $leadObj->condition( $tempObj );
                    $leadObj = $tempObj;
                }
                $leadObj->condition(
                    $conditions[$i][0],
                    $conditions[$i][1],
                    $conditions[$i][2]
                );
            }
        }else{
            if(!$this->_checkCol($conditions[0])) return false;
            if(!$this->_checkOperator($conditions[2])) return false;

            $select->condition($conditions[0],$conditions[1],$conditions[2]);
        }

        return $select->execute();
    }

    // public function getActTypeGroup($activityTypeId = null, $fields = []){

    //     $operator = gettype($activityTypeId) == 'array' ? 'IN' : '=';
    //     if(empty($fields)) throw new Exception('Fields cannot be empty.');

    //     $select = db_select($this->_tableName,'t');
    //     $select->fields('t',$fields);
    //     if(!empty($activityTypeId)) $select->condition('act_type_id',$activityTypeId,$operator);
    //     return $select->execute()->fetchAll();

    // }

    public function update($fields, $conditions, $conjunction = ['AND']){

        $update = db_update($this->_tableName);
        $update->fields($fields);

        if(!$this->_checkCols(array_keys($fields))) return false;

        if(empty($conditions)) throw new Exception('Dose not accept datebase\'s update method without condition.');

        if(gettype($conditions[0]) == 'array'){
            $lenI = count($conditions);
            $leadObj = $update;
            for($i=0;$i<$lenI;$i++){

                if(!$this->_checkCol($conditions[$i][0])) return false;
                if(!$this->_checkOperator($conditions[$i][2])) return false;

                if(isset($conjunction[$i]) && strtoupper($conjunction[$i]) == 'OR'){
                    $tempObj =  db_or();
                    $leadObj->condition( $tempObj );
                    $leadObj = $tempObj;
                }
                $leadObj->condition(
                    $conditions[$i][0],
                    $conditions[$i][1],
                    $conditions[$i][2]
                );
            }

        }else{
            if(!$this->_checkCol($conditions[0])) return false;
            if(!$this->_checkOperator($conditions[2])) return false;

            $update->condition($conditions[0],$conditions[1],$conditions[2]);
        }
        return $update->execute();
    }

    public function updateOnDup($fields,$conditions){

        if(!$this->_checkCols(array_keys($fields))) return false;
        if(!$this->_checkCols(array_keys($conditions))) return false;

        $update = db_merge($this->_tableName);
        return $update->key($conditions)
        ->fields($fields)
        ->execute();

    }

    public function delete($conditions, $conjunction){

        $delete = db_delete($this->_tableName);

        if(empty($conditions)) throw new Exception('Dose not accept datebase\'s delete method without condition.');

        if(gettype($conditions[0]) == 'array'){
            $lenI = count($conditions);
            $leadObj = $delete;
            for($i=0;$i<$lenI;$i++){

                if(!$this->_checkCol($conditions[$i][0])) return false;
                if(!$this->_checkOperator($conditions[$i][2])) return false;

                if(isset($conjunction[$i]) && strtoupper($conjunction[$i]) == 'OR'){
                    $tempObj =  db_or();
                    $leadObj->condition( $tempObj );
                    $leadObj = $tempObj;
                }
                $leadObj->condition(
                    $conditions[$i][0],
                    $conditions[$i][1],
                    $conditions[$i][2]
                );
            }

        }else{
            if(!$this->_checkCol($conditions[$i][0])) return false;
            if(!$this->_checkOperator($conditions[$i][2])) return false;
            
            $delete->condition($conditions[$i][0], $conditions[$i][1], $conditions[$i][2]);

        }

        return $delete->execute();
    }

    private function _checkOperator($operator){
        if(!in_array(strtoupper($operator), $this->_operators)){
            throw new Exception('Unknown operator:'.$operator);
            return false;
        }
        return true;
    }

    private function _checkCol($input){
        if(!in_array($input, $this->_columnNames)){
            throw new Exception('Unknown Column name:'.$input);
            return false;
        }
        return true;
    }

    private function _checkCols($inputs){
        foreach($inputs as $key=>$input){
            if(!in_array($input, $this->_columnNames)){
                throw new Exception('Unknown Column name:'.$input);
                return false;
            }
        }
        return true;
    }

    public function addColumnName($columnNames){
        $this->_columnNames = array_merge($this->_columnNames, $columnNames);
    }

    public function getTableName(){
        return $this->_tableName;
    }

    public function getColName(){
        return $this->_columnNames;
    }
}