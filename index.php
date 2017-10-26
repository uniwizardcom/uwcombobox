<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><?php
$t = time();
?>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>UWCombobox - Uniwizard</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<script src="js/default.js?t=<?= $t ?>"></script>
		<script src="uwajax.js?t=<?= $t ?>"></script>
		<script src="uwcss.js?t=<?= $t ?>"></script>
		<script src="uwcombobox.js?t=<?= $t ?>"></script>
		<link href="uwcombobox.css?t=<?= $t ?>" rel="stylesheet" />
		<link href="css/default.css?t=<?= $t ?>" rel="stylesheet" />
	</head>
	<body>
		<div id="ajax_status"></div>
		<div id="abcdef">
			<table border="0">
				<tr>
					<td>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</td>
					<td>bbbbbb</td>
				</tr>
				<tr>
					<td>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</td>
					<td>bbbbbb</td>
				</tr>
				<tr>
					<td>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</td>
					<td>bbbbbb</td>
				</tr>
				<tr>
					<td>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</td>
					<td>bbbbbb</td>
				</tr>
				<tr>
					<td>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</td>
					<td>bbbbbb</td>
				</tr>
				<tr>
					<td>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</td>
					<td>
						<input id="first_select" value="key 7" />
					</td>
				</tr>
			</table>
		</body>
	</div>
	
	<script>
	var selectObj = UWCombobox({
		input: document.getElementById('first_select'),
		keyName: 'key',
		keyValue: 'value',
		buttons: {
			'add': {
				'title': '<span class="my_button">Add</span>',
				'click': function(combobox, button) {
					window.alert([combobox, button]);
				}
			}
		},
		onchange: function(){
			window.alert(this.value);
		}
	});
	//selectObj.load();
	</script>
</html>
