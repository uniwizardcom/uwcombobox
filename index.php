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
	
	<script>
	/*window.addEventListener('zoom', function(event){
		var
			width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
			height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
		;
		var ratio = window.devicePixelRatio || 1;
		var w = screen.width * ratio;
		var h = screen.height * ratio;

		//document.getElementById('aaaaa').innerHTML = '['+width+'|'+screen.width+']';
		//document.getElementById('bbbbb').innerHTML = '['+height+'|'+screen.height+']';
		document.getElementById('aaaaa').innerHTML = '['+w+']';
		document.getElementById('bbbbb').innerHTML = '['+h+']';
	});*/

	
	var selectObj = UWCombobox({
		url: './getdata.php',
		input: document.getElementById('first_select'),
		keyName: 'key',
		keyValue: 'value',
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
	
	</script>
</html>
