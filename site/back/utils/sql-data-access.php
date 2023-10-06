<?php
function connectToDatabase($table = "utilisateurs") {
    // Define MySQL database credentials
//    $host = "sql7.freesqldatabase.com:3306";
//    $username = "sql7599045";
//    $password = "tKfldlYmmI";
//    $dbname = "sql7599045";

    $host = "127.0.0.1:3306";
    $username = "root";
    $password = "";
    $dbname = "users";

    // Connect to the database
    $conn = mysqli_connect($host , $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    return array("conn" => $conn, "table" => $table);
}