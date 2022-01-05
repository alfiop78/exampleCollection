<?php
	$file = filter_input(INPUT_POST, 'filename');
	$params = json_decode($_POST['params']); // object
	// var_dump($params);
	foreach($params as $key => $value) {
		echo "$key\n";
		$arr[$key] = [];
		foreach ($value as $propKey => $propValue) {
			// propKey : id / type
			// propValue : year-id / select
			$arr[$key][$propKey] = $propValue;
		}
	}
	var_dump($arr);
	exit;

	$params->{''};
	exit;


	// $filterName = filter_input(INPUT_POST, 'filterName');
	
	$fp = fopen($file.".json", "w");
	$json = [
		["filters" => [
			$filterName => ["id" => $filterId, "type" => $filterType],
			"month", "date", "site", "brand", "vehicle_brand", "accettatore"]]
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