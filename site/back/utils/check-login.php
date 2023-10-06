<?php

    // Check if the user is logged in
    if (!isset($_SESSION['user_id'])) {
        // Redirect to login page
        header('Location: ../../controller.php?to=connexion&message=Connexion avant de commencer l\'expérience !');
        exit();
    }
