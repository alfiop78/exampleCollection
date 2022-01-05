<?php
	$fp = fopen("file.json", "w");
	$json = [
		["testjson" => "provajson2"]
	];

	if (fwrite($fp, json_encode($json)) === FALSE) {
        echo "Cannot write to file ($filename)";
        exit;
    }

    // echo json_encode($somecontent);
    // echo $somecontent;
    echo json_encode($json, JSON_FORCE_OBJECT);
    // echo $t;

    fclose($fp);