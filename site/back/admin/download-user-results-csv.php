<?php

require '../utils/access.php';

// Set the path to the CSV file for the user index
$folder_path = '../data/users/save_users/';


$file_id = $_POST['id'];

// Set the filename based on the file ID
$filename = "save_user_" . $file_id . ".csv";

// Set the full file path
$file_path = $folder_path . $filename;

if (!file_exists($file_path)) {
    header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found");
    echo "File not found";
}
else {
    // Set the appropriate headers for the download
    header('Content-Type: application/csv');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Length: ' . filesize($file_path));

    // Read the file and output its contents
    readfile($file_path);
}


