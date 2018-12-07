<?php

class FetchBase {

    protected $_tableName = '',
    $_columnNames = [];
    // private static $_instance = null;

    public function __construct($tableName=null){
        $this->_operators = Config::get('database/operators');
        if(isset($tableName)) $this->_tableName = $tableName;
        //Provide table and column names here
    }

    // The getInstance method need to be provide by the child,
    // or else the self() it getting is the parent's self, and every inheriting childern will override the very same instance object.
    // public static function getInstance(){
    //     if(!isset(self::$_instance)){
    //         self::$_instance = new self();
    //     }
    //     return self::$_instance;
    // }

    public function add($input = []){
        $fields = [];
        foreach($this->_columnNames as $column){

            // $fields[$column] = isset($input[$column]) ? $input[$column] : null ;
            if(isset($input[$column])) $fields[$column] = $input[$column];
        }

        return $insert = db_insert($this->_tableName)
        ->fields($fields)
        ->execute();
    }

    
    public function bulkAdd($inputs = []){
        $columnNames = [];
        $insert = db_insert($this->_tableName, ['return'=> Database::RETURN_AFFECTED]);

        // $insert->fields($this->_columnNames);
        $insertArr = [];

        $values = [];
        foreach($inputs as $input){
            $values = [];
            foreach($this->_columnNames as $column){
                // $values[$column] = isset($input[$column]) ? $input[$column] : null ;
                if(isset($input[$column])) {
                    $values[$column] = $input[$column];
                    if(!in_array($column, $columnNames)) $columnNames[] = $column;
                }
            }

            $insertArr[] = $values;

            // $insert->values($values);
        }
        $insert->fields($columnNames);
        
        foreach($insertArr as $values) $insert->values($values);

        return $insert->execute();
    }

    public function get($fields, $conditions = null, $conjunction = ['AND'], $range= null){
        if(empty($fields)){
            throw new Exception('Fields cannot be empty.');
            return false;
        }
        if(!$this->_checkCols($fields)) return false;
        
        $select = db_select($this->_tableName,'t');
        
        //Use addField to create alisas name, fields without alisas will just use the original name(field name)
        foreach($fields as $field) {
            if(!is_array($field)) $field = [$field, $field];
            $select->addField('t', $field[0], $field[1]);
        }

        if(isset($range)) $select->orderBy($range[0], $range[1])->range(0, $range[2]);

        //Execute query and end the function if second parameter is empty
        if(!isset($conditions)) return $select->execute();

        // if(is_array($conditions[0])) {
        //     $lenI = count($conditions);
        //     $leadObj = $select;
        //     for($i=0;$i<$lenI;$i++){

        //         if(!$this->_checkCol($conditions[$i][0])) return false;
        //         if(!$this->_checkOperator($conditions[$i][2])) return false;

        //         if(isset($conjunction[$i]) && strtoupper($conjunction[$i]) == 'OR'){
        //             $tempObj =  db_or();
        //             $leadObj->condition( $tempObj );
        //             $leadObj = $tempObj;
        //         }
        //         if($conditions[$i][2] == 'NULL') {
        //             $leadObj->isNull($conditions[$i][0]);
        //             continue;
        //         }
        //         if($conditions[$i][2] == 'NOT NULL') {
        //             $leadObj->isNotNull($conditions[$i][0]);
        //             continue;
        //         }

        //         $leadObj->condition(
        //             $conditions[$i][0],
        //             $conditions[$i][1],
        //             $conditions[$i][2]
        //         );
        //     }
        // }else {
        //     if(!$this->_checkCol($conditions[0])) return false;
        //     if(!$this->_checkOperator($conditions[2])) return false;

        //     if($conditions[$i][2] == 'NULL') {
        //         $leadObj->isNull($conditions[$i][0]);
        //         break;
        //     }
        //     if($conditions[$i][2] == 'NOT NULL') {
        //         $leadObj->isNotNull($conditions[$i][0]);
        //         break;
        //     }

        //     $select->condition($conditions[0],$conditions[1],$conditions[2]);
        // }

        $this->_condition($select,  $conditions);

        return $select->execute();
    }

    public function update($fields, $conditions, $conjunction = ['AND']){

        $update = db_update($this->_tableName);
        $update->fields($fields);

        if(!$this->_checkCols(array_keys($fields))) return false;

        // if(is_array($conditions[0])){
        //     $lenI = count($conditions);
        //     $leadObj = $update;
        //     for($i=0;$i<$lenI;$i++){

        //         if(!$this->_checkCol($conditions[$i][0])) return false;
        //         if(!$this->_checkOperator($conditions[$i][2])) return false;

        //         if(isset($conjunction[$i]) && strtoupper($conjunction[$i]) == 'OR'){
        //             $tempObj =  db_or();
        //             $leadObj->condition( $tempObj );
        //             $leadObj = $tempObj;
        //         }
        //         if($conditions[$i][2] == 'NULL') {
        //             $leadObj->isNull($conditions[$i][0]);
        //             continue;
        //         }
        //         if($conditions[$i][2] == 'NOT NULL') {
        //             $leadObj->isNotNull($conditions[$i][0]);
        //             continue;
        //         }
        //         $leadObj->condition(
        //             $conditions[$i][0],
        //             $conditions[$i][1],
        //             $conditions[$i][2]
        //         );
        //     }

        // }else{
        //     if(!$this->_checkCol($conditions[0])) return false;
        //     if(!$this->_checkOperator($conditions[2])) return false;

        //     if($conditions[$i][2] == 'NULL') {
        //         $leadObj->isNull($conditions[$i][0]);
        //         break;
        //     }
        //     if($conditions[$i][2] == 'NOT NULL') {
        //         $leadObj->isNotNull($conditions[$i][0]);
        //         break;
        //     }

        //     $update->condition($conditions[0],$conditions[1],$conditions[2]);
        // }

        $this->_condition($update,  $conditions);

        return $update->execute();
    }

    public function count($fields, $conditions = null, $conjunction = ['AND']) {
        $query = $this->get($fields, $conditions, $conjunction);
        return $query->rowCount();
    }

    private function _condition(&$queryObject, $conditions) {
        if(is_array($conditions[0])){
            $lenI = count($conditions);
            $leadObj = $queryObject;
            for($i=0;$i<$lenI;$i++){

                if(!$this->_checkCol($conditions[$i][0])) return false;
                if(!$this->_checkOperator($conditions[$i][2])) return false;

                if(isset($conjunction[$i]) && strtoupper($conjunction[$i]) == 'OR'){
                    $tempObj =  db_or();
                    $leadObj->condition( $tempObj );
                    $leadObj = $tempObj;
                }
                if($conditions[$i][2] == 'NULL') {
                    $leadObj->isNull($conditions[$i][0]);
                    continue;
                }
                if($conditions[$i][2] == 'NOT NULL') {
                    $leadObj->isNotNull($conditions[$i][0]);
                    continue;
                }
                if($conditions[$i][2] == 'LIKE') {
                    $conditions[$i][1] = '%'.$conditions[$i][1].'%';
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

            if($conditions[2] == 'NULL') {
                $queryObject->isNull($conditions[0]);
                return;
            }
            if($conditions[2] == 'NOT NULL') {
                $queryObject->isNotNull($conditions[0]);
                return;
            }

            $queryObject->condition($conditions[0],$conditions[1],$conditions[2]);
        }

    }

    public function updateOnDup($fields, $conditions, $onUpdateFields = null){

        if(!$this->_checkCols(array_keys($fields))) return false;
        if(!$this->_checkCols(array_keys($conditions))) return false;

        $update = db_merge($this->_tableName)
        ->key($conditions);

        if($onUpdateFields != null) {
            return $update->insertFields($fields)
            ->updateFields($onUpdateFields)
            ->execute();
        }

        return $update->fields($fields)
        ->execute();

    }

    private function _checkOperator($operator){
        if(!in_array(strtoupper($operator), $this->_operators)){
            throw new Exception('Unknown operator:'.$operator);
            return false;
        }
        return true;
    }

    private function _checkCol($input) {
        if(!in_array($input, $this->_columnNames)) {
            throw new Exception('Unknown Column name:'.$input);
            return false;
        }
        return true;
    }

    private function _checkCols($inputs) {
        foreach($inputs as $key=>$input) {
            if(is_array($input)) $input = $input[0];
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