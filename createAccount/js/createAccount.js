
	// ON DOC READY
	
	$( document ).ready( function() {
// 		$( "#fullname" ).val( "John Smith" );
// 		$( "#username" ).val( "John" );
// 		$( "#email" ).val( "squigglysmith@yahoo.com" );
// 		$( "#city" ).val( "MyTown" );
// 		$( "#country" ).val( "MyCountry" );
// 		$( "#password" ).val( "password" );
// 		$( "#repeatpassword" ).val( "password" );

		$( "#btnSubmit" ).on( "click", function() { 
			if ( $( "#accountForm" ).parsley().validate({}) ) {
				if ( $( "#termsForm" ).parsley().validate({}) ) {

					var fullname = $( "#fullname" ).val();
					var username = $( "#username" ).val();
					var email    = $( "#email" ).val();
					var city     = $( "#city" ).val();
					var country  = $( "#country" ).val();
					var password = $( "#password" ).val();

					$.ajax({
						type: "POST",
						url: "sendAccountEmail.php?fullname=" + fullname + 
																		 "&username=" + username +
																		 "&email="    + email +
																		 "&city="     + city +
																		 "&country="  + country +
																		 "&password=" + password,
						dataType: "json",
						complete: function( data ) {
							window.location.href = "ack.html";
							window.console.log( JSON.stringify( data ) );
						}                     
					});//ajax

			
				}// if termsForm validate    
			}// if accountForm validate
		});//btnSubmit on click

	});// ON DOC READY