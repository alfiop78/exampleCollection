<?php
    $host = '127.0.0.1';
    $user = 'root';
    $password = 'harley-davidson2018';
    $link = new mysqli($host, $user, $password, 'test_local') or die("Errore nella connessione al DB {$link->error}");

    $sql = "SELECT json_key, json_value FROM json_template;";
    // var_dump($sql);
    // exit;
    try {
        if (!$result = $link->query($sql)) {
            //throw new Exception("Errore nella query");
            throw new Exception("Errore : ",$link->errno);
        } elseif ($result->num_rows > 0) {
            while ($row = $result->fetch_row()) {$arr[] = $row;}
            $link->close();
            // echo json_encode($arr);
            echo json_encode($arr, JSON_FORCE_OBJECT);
        } else {
            echo FALSE;
            //throw new Exception("Nessun risultato dalla query");
        }
    } catch (Exception $e) {
        echo $e->getMessage();
    }
