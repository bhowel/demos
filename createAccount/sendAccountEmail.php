<?php
require("sendGrid/sendgrid-php/sendgrid-php.php"); 

if ( isset( $_GET["fullname"] ) && 
     isset( $_GET["username"] ) &&
     isset( $_GET["email"] ) &&
     isset( $_GET["city"] ) &&
     isset( $_GET["country"] ) &&
     isset( $_GET["password"] ) ) {
	$fullname = $_GET["fullname"];
	$username = $_GET["username"];
	$email    = $_GET["email"];
	$city     = $_GET["city"];
	$country  = $_GET["country"];
	$password = $_GET["password"];
	$message = "
	<html>
	<head>
	<title>Values for new account</title>
	</head>
	<body>
	<p>Please create the following account.</p>
	<hr>
	<h3>Full name</h3>
	<p>" . $fullname . "</p>
	<h3>User name</h3>
	<p>" . $username . "</p>	
	<h3>Email</h3>
	<p>" . $email . "</p>
	<h3>City</h3>
	<p>" . $city . "</p>
	<h3>Country</h3>
	<p>" . $country . "</p>
	<h3>Password</h3>
	<p>" . $password . "</p>
	</body>
	</html>
	";

//   $sendgrid_apikey = $_ENV["ACCOUNTDEMO_EMAIL_KEY"];
//   $sendgrid = new SendGrid( $sendgrid_apikey );
// 	
// 	$emailAccount = new SendGrid\Email();
// 
// 	$emailAccount->addTo( "barbara.howell.ms@gmail.com" )
// 	             ->addTo( $email )
// 				       ->setFrom( "barbara.howell.ms@gmail.com" )
// 				       ->setSubject( "New Account" )
// 				       ->setHtml( $message );
// 
// 	if ( $sendgrid->send( $emailAccount ) ) {
// 		header( "Content-type: application/json" );	
// 		$data["complete"]["responseText"] = "Success";
// 		echo json_encode($data);
// 	}
}
?>