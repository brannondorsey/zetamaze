<?php 
	$allowed_exts = array(
						'txt', //text
						'rtf',
						'doc',
						'docx',
						'pages',
						'jpg', //image
						'jpeg',
						'JPG',
						'png',
						'gif',
						'tiff',
						'bmp',
						'mov', //video
						'wmv',
						'avi',
						'mv4',
						'mp4',
						'mp3', //audio
						'wav',
						'mpa',
						'psd',
						'ai', //design
						'svg',
						'obj', //3D
						'max',
						'fbx',
						'log', //data
						'csv',
						'xml',
						'html', //web
						'css',
						'js',
						'ttf', //font
						'fon',
						'fnt',
						'torrent' //torrent
						);

	$allowed_exts_JSON = json_encode($allowed_exts);
	$max_size = 5242880; //5mb
	$numb_files = 4;
?>