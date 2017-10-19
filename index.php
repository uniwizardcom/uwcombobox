<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><?php
$t = time();
?>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>UWCombobox - Uniwizard</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<script src="js/default.js?t=<?= $t ?>"></script>
		<script src="uwcombobox.js?t=<?= $t ?>"></script>
		<link href="css/default.css?t=<?= $t ?>" rel="stylesheet">
	</head>
	<body>
		<table border="1">
			<tr>
				<td></td>
				<td>
					<input id="first_select" />
				</td>
			</tr>
		</table>
	</body>
	
	<script>
	var selectObj = UWCombobox({
		input: document.getElementById('first_select'),
		buttons: {
			'add': {
				'title': 'Add',
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
