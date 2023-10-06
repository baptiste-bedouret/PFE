<?php
// Start the session
session_start();

//Used to indicate the position (at which stage) of the user while working with the application
//$_SESSION["pos"]

//Used to indicate the page to be moved to
//$_GET['to']

//Used to determine the end of a session
//$_SESSION['end']

if (isset($_GET['to'])) {
    if($_GET['to'] === 'createAccount'){
        require 'back/account/logout.php';
        if(isset($_GET['error'])) {
            $err = $_GET['error'];
            header('front/html/create-account.html?error=' . $err);
        }
        else if(isset($_GET['message'])) {
            $msg = $_GET['message'];
            header('front/html/create-account.html?message=' . $msg);
        }
        include 'front/html/create-account.html';
    }
    else if($_GET['to'] === 'evaluationNotice'){
        include 'back/data/EVALUATION_notice-d_info-v4.0_07022023.html';
    }
    else if($_GET['to'] === 'connexion'){
        require 'back/account/logout.php';
        if(isset($_GET['error'])) {
            $err = $_GET['error'];
            header('connexion.html?error=' . $err);
        }
        else if(isset($_GET['message'])) {
            $msg = $_GET['message'];
            header('connexion.html?message=' . $msg);
        }
        include('connexion.html');
    }
    else if($_GET['to'] === 'start' && ($_SESSION["pos"] == "ln" ||  $_SESSION["pos"] == "end")){
        require 'back/utils/check-login.php';
        require 'back/utils/check-session.php';
        if(isset($_SESSION['end']) && $_SESSION['end'] == true) {
            $_SESSION["pos"] = "end";
            include 'front/html/end.html';
        }
        else{
            $_SESSION["pos"] = "start";
            include 'front/html/start.html';
        }

    }
    else if($_GET['to'] === 'experiment' && $_SESSION["pos"] == "start"){
        require 'back/utils/check-login.php';
        require 'back/utils/check-session.php';
        if(isset($_SESSION['end']) && $_SESSION['end'] == true) {
            $_SESSION["pos"] = "end";
            include 'front/html/end.html';
        }
        else{
            $_SESSION["pos"] = "experiment";
            include 'front/html/experiment.html';
        }
    }
    else if($_GET['to'] === 'deconnexion'){
        require 'back/utils/check-login.php';
        header('Location: controller.php?to=connexion&message=Vous avez été déconnecté');
    }
    else if($_GET['to'] === 'end'){
        require 'back/utils/check-login.php';
        $_SESSION["pos"] = "end";
        include 'front/html/end.html';
    }

    else if($_GET['to'] === 'admin' && $_SESSION["pos"] == "ln"){
        require 'back/admin/admin-connexion.php';
    }
    else {
        require 'back/account/logout.php';
        header('Location: controller.php?to=connexion&message=Connexion avant de commencer l\'expérience !');
    }
}
//To call utils functions
else if (isset($_GET['f'])){
    if($_GET['f'] === 'ln'){
        $_SESSION["pos"] = "ln";
        require "back/account/login.php";
    }
    else if($_GET['f'] === 'acn') {
        require "back/account/account-creation.php";
    }
    else if($_GET['f'] === 'gsid'){
        require "back/utils/get-session-id.php";
    }
    else if($_GET['f'] === 'csn'){
        require "back/utils/check-session.php";
        echo $_SESSION['end'];
    }
}
//To call file paths
else if (isset($_GET['p'])){
    header('Content-Type: text/plain');
    if($_GET['p'] === 'bdus'){
        $path = 'back/data/users/session_users/';
    }
    else if($_GET['p'] === 'bdum') {
        $path = 'back/data/users/mix_data/';
    }
    else if($_GET['p'] === 'bdu') {
        $path = 'back/data/users/';
    }
    else if($_GET['p'] === 'bc') {
        $path = 'back/csv/';
    }
    else if($_GET['p'] === 'bdi') {
        $path = 'back/data/images/';
    }
    else if($_GET['p'] === 'bd') {
        $path = 'back/data/';
    }
    echo $path;
}
else {
    require 'back/account/logout.php';
    include('connexion.html');
}

