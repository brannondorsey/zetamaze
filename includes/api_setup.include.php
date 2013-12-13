<?php
		require_once 'config.include.php';

	  	//setup the API
	  	$api = new API("localhost", 
	  				   $DATABASE, 
	  				   $TABLE, 
	  				   $USERNAME, 
	  				   $PASSWORD);

	  	$api->setup($columns);
	  	$api->set_default_order("id");
	  	$api->set_pretty_print(true);
?>