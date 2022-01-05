<?php
	$file = filter_input(INPUT_POST, 'filename');
	$filterName = filter_input(INPUT_POST, 'filterName');
	$fp = fopen($file.".json", "w");
	$json = [
		["filters" => [$filterName, "month", "date", "site", "brand", "vehicle_brand", "accettatore"]]
	];

	if (fwrite($fp, json_encode($json)) === FALSE) {
        echo "Cannot write to file ($file)";
        exit;
    }

    // echo json_encode($somecontent);
    // echo $somecontent;
    echo json_encode($json, JSON_FORCE_OBJECT);
    // echo $t;

    fclose($fp);