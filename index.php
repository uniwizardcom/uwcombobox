<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><?php
$t = time();
?>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>UWCombobox - Uniwizard</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<script src="./uwajax.js?t=<?= $t ?>"></script>
		<script src="./uwcss.js?t=<?= $t ?>"></script>
		<script src="./uwcombobox.js?t=<?= $t ?>"></script>
		<link href="./uwcombobox.css?t=<?= $t ?>" rel="stylesheet" />
	</head>
	<body>
		<div id="ajax_status"></div>
		<div id="abcdef">
			<table border="0">
				<tr>
					<td><div id="aaaaa"></div></td>
					<td><div id="bbbbb"></div></td>
				</tr>
				<tr>
					<td>aaaaaa</td>
					<td>bbbbbb</td>
				</tr>
				<tr>
					<td>aaaaaa</td>
					<td>bbbbbb</td>
				</tr>
				<tr>
					<td>aaaaaa</td>
					<td>bbbbbb</td>
				</tr>
				<tr>
					<td>aaaaaa</td>
					<td>bbbbbb</td>
				</tr>
				<tr>
					<td>aaaaaa</td>
					<td>
						<input id="first_select" type="text" value="key 7" />
					</td>
				</tr>
			</table>
		</body>
	</div>
	<input id="second_select" type="text" value="key 4" />
	
	<fieldset>
		<legend>Mobile combobox</legend>
		<input id="select_3" type="text" value="key 6" />
	</fieldset>
	
	<fieldset>
		<legend>Mobile native combobox</legend>
		<select name="sadffdg" style="width:120px;">
			<option value="aaaa">hhhhhhh</option>
			<option value="bbbb">oooo</option>
			<option value="cccc">... is trying to improve accessibility ...</option>
			<option value="dddd">hhhh</option>
			<option value="eeeee">kkkk</option>
			<option value="fffff">llll</option>
			<option value="ggggg">xxxx</option>
			<option value="hhhhh">cccc</option>
			<option value="iiiii">vvvv</option>
			<option value="jjjj">nnnn</option>
			<option value="kkkkk">mmm</option>
		</select>
	</fieldset>
	
	<script>
	var selectObj = UWCombobox({
		url: './getdata.php',
		input: document.getElementById('first_select'),
		keyName: 'key',
		keyValue: 'value',
		data: {
			'q_word': [],
			'page_num': 1,
			'per_page': 10,
			'search_field': ['name'],
			'and_or': 'AND',
			'order_by': [['name','ASC']],
			'db_table': 'units',
			'use': '',
			'data_deep_level': 0,
			'use_as_simply': false,
			'extra_params': ''
		},
		buttons: {
			'abc': {
				'title': 'Def'
			}
		},
		onchange: function(){
			window.alert(this.value);
		}
	});

	var selectObj2 = UWCombobox({
		url: './getdata.php',
		input: document.getElementById('second_select'),
		keyName: 'key',
		keyValue: 'value',
		buttons: {
			'add': {
				'title': '<span class="my_button">Add</span>',
				'click': function(e) {
					console.log([
						e,								// Standard click event object
						selectObj2,						// External object
						this.sender,					// This UWButton object
						this.uwcombobox,				// Internal object
						selectObj === this.uwcombobox,	// Compare external with internal objects
						selectObj2 === this.uwcombobox	// Compare external with internal objects
					]);
					
					window.alert([
						this.uwcombobox.value,	// Getting value from internal object
						selectObj.value			// Getting value from external object
					]);
				}
			}
		},
		onchange: function(){
			//window.alert(this.value);
		}
	});
	selectObj2.setRecord(6, 'id');
	
	var selectObj3 = UWCombobox({
		url: './getdata.php',
		input: document.getElementById('select_3'),
		keyName: 'key',
		keyValue: 'value',
		view: 'mobile',
		buttons: {
			'add': {
				'title': '<span class="my_button">Add</span>',
				'click': function(e) {
					console.log([
						e,								// Standard click event object
						selectObj2,						// External object
						this.sender,					// This UWButton object
						this.uwcombobox,				// Internal object
//						selectObj === this.uwcombobox,	// Compare external with internal objects
						selectObj2 === this.uwcombobox	// Compare external with internal objects
					]);
					
					window.alert([
						this.uwcombobox.value,	// Getting value from internal object
						selectObj.value			// Getting value from external object
					]);
				}
			}
		},
		onchange: function(){
			//window.alert(this.value);
		}
	});
	selectObj3.setRecord('key 7');
	</script>
</html>
