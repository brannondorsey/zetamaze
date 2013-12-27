<?php

	require_once 'includes/config.include.php';	
	require_once 'includes/filevalidation.include.php';

	$redirect_page = "make.php";
	$redirect = (isset($_GET['redirect']) && $_GET['redirect'] == "false") ? false : true;

	$targetID = "#file-upload-notification";
	$upload_directory = "uploads";
	$finders_folder_directory = "uploads/findersfolder";
	
	$return_data = array();
	$files_uploaded = files_present($_FILES);

	if($files_uploaded){
		
	   	$numb_files = count($_FILES);
		for($i = 0; $i < $numb_files; $i++){
			
			$filename = (isset($_FILES["end"])) ? "end" : "file" . ($i + 1);
			$file = $_FILES[$filename];
			$temp = explode(".", $file["name"]);
			$extension = end($temp);

			if(isset($file) &&
			   !empty($file) &&
			   $file["error"] != 4){ //no file uploaded

				if(in_array($extension, $allowed_exts)){

					if($file["size"] < $max_size){
						if($file["error"] > 0){
							$return_data[$filename] = urlencode($file["error"]);
						}else{ //the file is good!

							  //delete the old file
							  $current_files = scandir($upload_directory);

							  for($j = 0; $j < count($current_files); $j++){
							  	if(strstr($current_files[$j], $filename) != false){
							  		unlink($upload_directory . "/" . $current_files[$j]);
							  	}
							  }

							  //if this file belongs in the finder's folder .zip
							  if($filename == "end"){
							  	
							  	//increment all current filenames and name the new file "1.ext"
							  	$numb_finders_folder_files = 5;
							  	$current_filenames = file_get_contents($HOSTNAME . "/itemnames.php?directory=uploads/findersfolder");
								$current_filenames = json_decode($current_filenames);
								$current_filenames = array_slice ($current_filenames, 0, $numb_finders_folder_files); //just in case...
								unset($current_filenames[count($current_filenames) - 1]); //delete the last file

								for($i = count($current_filenames); $i > 0; $i--){
									
									$prefix = strstr($current_filenames[$i - 1], ".", true);
									
									if(is_numeric($prefix)){

										$new_prefix = intval($prefix) + 1;
										$old_filename = $current_filenames[$i - 1];
										$new_filename = str_replace($prefix, $new_prefix, $old_filename);
										$current_filenames[$i - 1] = $new_filename; //update the array
										rename( $finders_folder_directory . "/" . $old_filename, $finders_folder_directory . "/" . $new_filename);
									}
								}

								// save the uploaded file
								$uploaded_filename = "1." . $extension;
								move_uploaded_file($file["tmp_name"], $finders_folder_directory . "/" . $uploaded_filename);

								array_unshift($current_filenames , $uploaded_filename);
								foreach($current_filenames as &$files){
									$files = $finders_folder_directory . "/" . $files;
								}

								//re-zip findersfolder.zip
								$result = create_zip($current_filenames, $upload_directory . "/findersfolder.zip", true);

							  }else{ //if this file is an item
							  	move_uploaded_file($file["tmp_name"], $upload_directory . "/" . $filename . "." . $extension);
							  }
						}
					}else $return_data[$filename] = "size_error";
				}else $return_data[$filename] = "type_error";
			}
		}
	}

	if(!$files_uploaded){
		$return_data['no_files'] = "true";
	}
	
	if(count($return_data) == 0){
		$return_data["file_upload_success"] = "true";
	}
	
	//if redirect=false was specified in GET return results as 
	if(!$redirect){
		header('Content-type: application/json');
		echo json_encode($return_data);
	}else{

		$redirect_page .= "?";
		foreach($return_data as $key => $value){
			$redirect_page .= $key . "=" . $value . "&";
		}
		$redirect_page = rtrim($redirect_page, "&");
		header("Location: " . $redirect_page . $targetID);
	} 

	function files_present($files){
		if(isset($files) &&
		   !empty($files)){
			$numb_empty = 0;
			foreach($files as $file){
				if($file['name'] == '') $numb_empty++;
			}
			
			return ($numb_empty == count($files)) ? false : true;
		}else{
			
			return false;
		}
	}

	/* 
	Creates a compressed zip file
	Taken from http://davidwalsh.name/create-zip-php
	*/
	function create_zip($files = array(),$destination = '',$overwrite = false) {
		//if the zip file already exists and overwrite is false, return false
		if(file_exists($destination) && !$overwrite) { return false; }
		//vars
		$valid_files = array();
		//if files were passed in...
		if(is_array($files)) {
			//cycle through each file
			foreach($files as $file) {
				//make sure the file exists
				if(file_exists($file)) {
					$valid_files[] = $file;
				}
			}
		}
		//if we have good files...
		if(count($valid_files)) {
			//create the archive
			$zip = new ZipArchive();
			if($zip->open($destination,$overwrite ? ZIPARCHIVE::OVERWRITE : ZIPARCHIVE::CREATE) !== true) {
				return false;
			}
			//add the files
			foreach($valid_files as $file) {
				$slash_index = strrpos($file, "/");
				$localname = ($slash_index !== false) ? substr($file, $slash_index + 1) : $file;
				$zip->addFile($file,$localname);
			}
			//debug
			//echo 'The zip archive contains ',$zip->numFiles,' files with a status of ',$zip->status;
			
			//close the zip -- done!
			$zip->close();
			
			//check to make sure the file exists
			return file_exists($destination);
		}
		else
		{
			return false;
		}
	}

?>