<?php

    $path_session = 'back/data/users/session_users/session_user_' . $_SESSION['user_id'] . '.csv';
    $path_mix = 'back/data/users/mix_data/mixed_data_user_' . $_SESSION['user_id'] . '.csv';
    if(!file_exists($path_mix) && !file_exists($path_session)){
        $_SESSION['end'] = true;
    }
    else {
        $_SESSION['end'] = false;
    }

