<?php
	require_once 'includes/classes/api_builder_includes/class.API.inc.php';
	require_once 'includes/classes/api_builder_includes/class.Database.inc.php';

	//setup and instantiate the api
	require_once 'includes/api_columns.include.php';
	require_once 'includes/api_setup.include.php';

	//set page to output JSON
    header("Content-Type: application/json; charset=utf-8");

	//if POST...
	if(isset($_GET) &&
	   !empty($_GET)){
		$query_array = Database::clean($_GET);
	}else $query_array = array("limit" => 1);

	if($results = $api->get_json_from_assoc($query_array)){
		echo $results;
	}else die("Database error");
?>