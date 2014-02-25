<?php
	#api endpoint that returns a json array of 
	#the names of the files in directory specified
	#in GET or, if none is specified, the 
	
	header('Content-type: application/json');

	$upload_directory = "uploads";

	//Scan subdirectory of uploads/ specified by GET
	if(isset($_GET['directory']) && !empty($_GET['directory'])){
		
		if (is_dir($upload_directory . "/" . $_GET['directory'])) {
			$file_names = preg_grep('/^([^.])/', scandir($upload_directory . "/" . $_GET['directory'])); //filter .hidden files
			$file_names = array_values($file_names); //preg_grep returns assoc array, convert to indexed array
			echo json_encode($file_names);
		}

	}else{ //use the default directory and only ouput filenames that include the string 'file'

		$file_names = scandir($upload_directory);
		$item_names = array();

		for($j = 0; $j < count($file_names); $j++){
		  if(strstr($file_names[$j], "file") != false){
		  	$item_names[] = $file_names[$j];
		  }
		}

		echo json_encode($item_names);
	}
?>