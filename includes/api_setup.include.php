<?php
	  	//setup the API
	  	$api = new API("localhost", 
	  				   "zeta", 
	  				   "mazes", 
	  				   "root", 
	  				   "root");

	  	$api->setup($columns);
	  	$api->set_default_order("id");
	  	$api->set_pretty_print(true);
?>