<?php

$dataList = [
		['key' => 'key 1', 'value' => 'Value 1'],
		['key' => 'key 2', 'value' => 'Value 2'],
		['key' => 'key 3', 'value' => '... is trying to improve accessibility ...'],
		['key' => 'key 4', 'value' => 'Value 4'],
		['key' => 'key 5', 'value' => 'Value 5'],
		['key' => 'key 6', 'value' => 'Value 6'],
		['key' => 'key 7', 'value' => 'Value 7'],
		['key' => 'key 8', 'value' => 'Value 8 Value Value Value Value'],
		['key' => 'key 9', 'value' => 'Value 9'],
		['key' => 'key 0', 'value' => 'Value 0']
];

//sleep(3);

$postData = json_decode(file_get_contents('php://input'));
//$filter = strtolower(trim($_POST['filter']));
$filter = trim($postData->filter);

if(!empty($filter)) {
	foreach($dataList as $record) {
		if(strpos(strtolower($record['value']), $filter) !== false) {
			$data[] = $record;
		}
	}
	
}
else {
	$data = $dataList;
}

if(!empty($_SERVER['CONTENT_TYPE'])) {
	header('Content-Type: '. $_SERVER['CONTENT_TYPE']);
	if($_SERVER['CONTENT_TYPE'] == 'application/json') {
		$data = json_encode($data);
	}
}

echo $data;
