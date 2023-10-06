<?php

$enable = true;
if($enable) {
    if (empty($_SERVER['HTTP_REFERER'])) {
        header('Location: controller.php?to=connexion&message=Connect before beginning experiment !');
    }

    $allowed_hosts = array("localhost"); // list of approved hostnames
    $allowed_ports = array(80, 81); // list of approved ports
    $url_parts = parse_url($_SERVER['HTTP_REFERER']); // extract hostname and port from the referring URL

    if (!isset($url_parts['host']) || !in_array($url_parts['host'], $allowed_hosts, true)) {
        // deny access to the page if the hostname is not approved
        header('Location: controller.php?to=connexion&message=Connect before beginning experiment !');
    }

    if (isset($url_parts['port']) && !in_array($url_parts['port'], $allowed_ports, true)) {
        // deny access to the page if the port is not approved
        header('Location: controller.php?to=connexion&message=Connect before beginning experiment !');
    }

    $allowed_ips = array("::1"); // list of approved IP addresses
    $ip = $_SERVER['REMOTE_ADDR']; // get the IP address of the requesting computer

    if (!in_array($ip, $allowed_ips, true)) {
        // deny access to the page
        header('Location: controller.php?to=connexion&message=Connect before beginning experiment !');
    }
}

