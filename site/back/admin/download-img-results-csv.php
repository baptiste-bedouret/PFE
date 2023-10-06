<?php

require '../utils/access.php';

$imageName = $_POST['imageName'];
$csvFolder = '../data/users/save_users';
$tableData = array();


// Loop through all CSV files in the folder
foreach (glob($csvFolder . "/*.csv") as $csvFile) {
    // Open the CSV file and loop through its rows
    if (($handle = fopen($csvFile, 'rb')) !== FALSE) {
        while (($row = fgetcsv($handle, 1000)) !== FALSE) {
            // Check if the first column matches the image name
            if ($row[2] === $imageName) {
                // If so, add the value and the CSV file name to the table data array
                $tableData[] = array(basename($csvFile),$row[7],$row[8]);
            }
        }
        fclose($handle);
    }
}

// If there are any matching values, save them to a CSV file and download it
if (!empty($tableData)) {
    $filename = 'results.csv';
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    $fp = fopen('php://output', 'wb');
    fputcsv($fp, array('File Name', 'Choice', 'Time'));
    foreach ($tableData as $row) {
        fputcsv($fp, $row);
    }
    fclose($fp);
} else {
    header('HTTP/1.0 404 Not Found');
    echo "CSV file not found!";
}