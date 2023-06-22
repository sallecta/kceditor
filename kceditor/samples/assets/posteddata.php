<!DOCTYPE html>
<?php
/*
Copyright (c) 2003-2023, CKSource.
For licensing, see LICENSE or https://github.com/sallecta/kceditor/blob/main/LICENSE
*/
?>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Sample &mdash; CKEditor</title>
	<link rel="stylesheet" href="sample.css">
	<meta name="description" content="Try the latest sample of KCEditor and learn more about customizing your WYSIWYG editor with endless possibilities.">
</head>
<body>
	<h1 class="samples">
		 KCEditor &mdash; Posted Data
	</h1>
	<table border="1" cellspacing="0" id="outputSample">
		<colgroup><col width="120"></colgroup>
		<thead>
			<tr>
				<th>Field&nbsp;Name</th>
				<th>Value</th>
			</tr>
		</thead>
<?php

if (!empty($_POST))
{
	foreach ( $_POST as $key => $value )
	{
		if ( ( !is_string($value) && !is_numeric($value) ) || !is_string($key) )
			continue;

		if ( get_magic_quotes_gpc() )
			$value = htmlspecialchars( stripslashes((string)$value) );
		else
			$value = htmlspecialchars( (string)$value );
?>
		<tr>
			<th style="vertical-align: top"><?php echo htmlspecialchars( (string)$key ); ?></th>
			<td><pre class="samples"><?php echo $value; ?></pre></td>
		</tr>
	<?php
	}
}
?>
	</table>
	<div id="footer">
		<hr>
		<p>
			 KCEditor - The next editor for the Internet - <a class="samples" href="https://github.com/sallecta/kceditor/">https://github.com/sallecta/kceditor</a>
		</p>
		<p id="copy">
			Copyright &copy; 2003-2023, <a class="samples" href="https://github.com/sallecta/kceditor/">KCEditor</a>.
		</p>
	</div>
</body>
</html>
