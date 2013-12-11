<?php
	if(isset($_GET["filename"]) &&
	   !empty($_GET["filename"])){

	   	$file_url = "http:/localhost:8888/zeta/uploads/" . $_GET["filename"];
		header("Content-Type: application/octet-stream");
		header("Content-Transfer-Encoding: Binary"); 
		header("Content-disposition: attachment; filename=\"" . basename($file_url) . "\""); 
		readfile($file_url); // do the double-download-dance (dirty but worky)
	}
	
?>