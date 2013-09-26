<?php

	 //include the API Builder mini lib
	 require_once("classes/api_builder_includes/class.API.inc.php");

	 //set page to output JSON
	 header("Content-Type: application/json; charset=utf-8");
	 
	  //If API parameters were included in the http request via $_GET...
	  if(isset($_GET) && !empty($_GET)){

	  	//specify the columns that will be output by the api as a comma-delimited list
	  	$columns = "id,
	  				timestamp,
	  				maze,
	  				begin_x,
	  				begin_y,
	  				begin_maze_x,
	  				begin_maze_y,
	  				end_x,
	  				end_y,
	  				end_maze_x,
	  				end_maze_y,
	  				file_1_x,
	  				file_1_y,
	  				file_1_maze_x,
	  				file_1_maze_y,
	  				file_2_x,
	  				file_2_y,
	  				file_2_maze_x,
	  				file_2_maze_y,
	  				file_3_x,
	  				file_3_y,
	  				file_3_maze_x,
	  				file_3_maze_y,
	  				file_4_x,
	  				file_4_y,
	  				file_4_maze_x,
	  				file_4_maze_y";

	  	//setup the API
	  	$api = new API("localhost", 
	  				   "zeta", 
	  				   "mazes", 
	  				   "root", 
	  				   "root");

	  	$api->setup($columns);
	  	$api->set_default_order("id");
	  	$api->set_pretty_print(true);

	  	//sanitize the contents of $_GET to insure that 
	  	//malicious strings cannot disrupt your database
	 	$get_array = Database::clean($_GET);

	 	//output the results of the http request
	 	echo $api->get_json_from_assoc($get_array);
	}
?>