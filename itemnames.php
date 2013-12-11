<?php
	#api endpoint that returns a json array of 
	#the names of the files in the upload_dir
	
	header('Content-type: application/json');
	
	$upload_directory = "uploads";

	$file_names = scandir($upload_directory);
	$item_names = array();

	for($j = 0; $j < count($file_names); $j++){
	  if(strstr($file_names[$j], "file") != false){
	  	$item_names[] = $file_names[$j];
	  }
	}
	
	echo json_encode($item_names);
?>