<?php

$data = [
		['key' => 'key 1', 'value' => 'Value 1'],
		['key' => 'key 2', 'value' => 'Value 2'],
		['key' => 'key 3', 'value' => 'Value 3'],
		['key' => 'key 4', 'value' => 'Value 4'],
		['key' => 'key 5', 'value' => 'Value 5'],
		['key' => 'key 6', 'value' => 'Value 6'],
		['key' => 'key 7', 'value' => 'Value 7'],
		['key' => 'key 8', 'value' => 'Value 8'],
		['key' => 'key 9', 'value' => 'Value 9'],
		['key' => 'key 0', 'value' => 'Value 0']
];

sleep(3);

if(!empty($_SERVER['CONTENT_TYPE'])) {
	header('Content-Type: '. $_SERVER['CONTENT_TYPE']);
	if($_SERVER['CONTENT_TYPE'] == 'application/json') {
		$data = json_encode($data);
	}
}

echo $data;
