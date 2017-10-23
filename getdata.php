<?php

$data = [
		['key 1' => 'Value 1'],
		['key 2' => 'Value 2'],
		['key 3' => 'Value 3'],
		['key 4' => 'Value 4'],
		['key 5' => 'Value 5'],
		['key 6' => 'Value 6'],
		['key 7' => 'Value 7'],
		['key 8' => 'Value 8'],
		['key 9' => 'Value 9'],
		['key 0' => 'Value 0']
];

sleep(3);

if(!empty($_SERVER['CONTENT_TYPE'])) {
	header('Content-Type: '. $_SERVER['CONTENT_TYPE']);
	if($_SERVER['CONTENT_TYPE'] == 'application/json') {
		$data = json_encode($data);
	}
}

echo $data;
