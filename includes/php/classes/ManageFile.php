<?php

class ManageFile {
    
    public function storeExcelToJSON($inputFilePath, $outputFilePath, $outputFilename) {
        
        $data = self::excelToArray($inputFilePath);

        return self::writeNewFile(json_encode($data), $outputFilePath, $outputFilename, 'json');

    }

    public static function arrayToCsvString($array, $header = null, $delimiter = ",") {
        $csvString = '';
        $delimiter = '"'.$delimiter.'"';
        //need to validify the header here.
        $header == null ? $header = array_keys(array_values($array)[0]) : null;
        array_unshift($array, $header);

        $csvString = implode("\n", array_map( function($row) use ($delimiter) { return '"'.implode($delimiter, $row).'"';} , $array));
        
        return $csvString;
    }

    public static function jsonToCsv($json, $outputPath, $outputFilename, $header = null, $delimiter = ",") {

        $array = json_decode($json, true);

        $csvString = self::arrayToCsvString($array, $header, $delimiter);

        return self::writeNewFile($csvString, $outputPath, $outputFilename, 'csv');

    }

    public static function arrayToCsv($array, $outputPath, $outputFilename, $header = null, $delimiter = ",") {
        $csvString = self::arrayToCsvString($array, $header, $delimiter);

        return self::writeNewFile($csvString, $outputPath, $outputFilename, 'csv');
    }

    private static function writeNewFile($data, $filePath, $filename, $fileExt) {
        $i = 1;
        $counter = '';
        $fileExt = '.'.$fileExt;
        while(file_exists($filePath.'/'.$filename.$counter.$fileExt)) $counter = '_('.$i++.')';
        $fullPath = $filePath.'/'.$filename.$counter.$fileExt;

        $fp = fopen($fullPath, 'w');
        fwrite($fp, $data);
        fclose($fp);

        return $fullPath;
        
    }
}