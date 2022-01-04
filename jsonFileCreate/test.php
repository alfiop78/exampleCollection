<?php
	$fp = fopen("file.json", "w");
	var_dump($fp);
	$somecontent = "[\n\t{\n\t\t\"test\" : \"prova\"\n\t}\n]";

	$t = <<<'EOD'
[
	{
		"test" : "test new doc"
	}
]
EOD;

	if (fwrite($fp, $t) === FALSE) {
        echo "Cannot write to file ($filename)";
        exit;
    }

    // echo json_encode($somecontent);
    echo $t;

    fclose($fp);