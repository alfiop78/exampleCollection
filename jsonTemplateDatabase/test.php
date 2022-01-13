<?php
    $host = '127.0.0.1';
    $user = 'root';
    $password = 'harley-davidson2018';
    $link = new mysqli($host, $user, $password, 'test_local') or die("Errore nella connessione al DB {$link->error}");
    // var_dump($link);
    // exit;

    $name = filter_input(INPUT_POST, 'name');
    // codifico il json per poter essere inserito nel DB
    $json = json_encode($_POST['params']);
    // exit;

    $affectedRow = 0;
    $stmt = $link->stmt_init(); // se non si usa questo e la query è errata non posso ottenere l'errore perchè l'oggetto stmt non viene istanziato

    $sql = "INSERT INTO json_template (json_key, json_value) VALUES('$name', $json);";
    // var_dump($sql);
    // exit;
    try {
        if ($stmt->prepare($sql)){
            // echo "prepare statement";
            if (!$stmt->execute()) {
              //throw new Exception("Errore nell'esecuzione della query");
              throw new Exception("Err.",$link->errno);
            }
            $affectedRow = $stmt->affected_rows;
            $stmt->close();
            $link->close();
            echo $affectedRow;
        } else {
            throw new Exception("Errore : ",$link->errno);
            //return FALSE;
        }
    } catch (Exception $e) {
        echo $e->getMessage();
    }
