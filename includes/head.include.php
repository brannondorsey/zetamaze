<?php 
require_once 'includes/config.include.php';
$description = "A collaborative web game that allows users to edit, draw on, and explore a virtual maze"; 
?>

<title>Zetamaze</title>
<meta name="description" content="<?php echo $description?>"></meta>
<link rel="author" href="https://plus.google.com/109443080153324018190"/>
<meta name="copyright" content="Brannon Dorsey - 2014" />

<!-- OpenGraph -->
<meta property="og:title" content="Zetamaze"/>
<meta property="og:type" content="website"/>
<meta property="og:image" content="<?php echo $HOSTNAME ?>/images/social-thumbnail.jpg"/>
<meta property="og:url" content="<?php echo $HOSTNAME ?>"/>
<meta property="fb:admins" content="100004043979787"/>
<meta property="og:description" content="<?php echo $description ?>"/>

<!-- Twitter Card -->
<meta name="twitter:card" content="summary">
<meta name="twitter:url" content="<?php echo $HOSTNAME ?>">
<meta name="twitter:title" content="Zetamaze">
<meta name="twitter:creator" content="@brannondorsey">
<meta name="twitter:description" content="<?php echo $description ?>"/>
<meta name="twitter:image" content="<?php echo $HOSTNAME ?>/images/social-thumbnail.jpg"/>

<link href='http://fonts.googleapis.com/css?family=Lobster' rel='stylesheet' type='text/css'>
<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
<link rel="icon" href="favicon.ico" type="image/x-icon">

<!-- analytics -->
<script>
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-46480710-1', 'zetamaze.com');
	ga('send', 'pageview');
</script>