
	// ON DOC READY
	
	$( document ).ready( function() {
		// Hide icon used in submit animation.
		$( "#divEmailIcon" ).hide();
		$( "#emailIcon" ).hide();
		
		// Test data. Comment out for production.
// 		$( "#fullname" ).val( "John Smith" );
// 		$( "#username" ).val( "John" );
// 		$( "#email" ).val( "squigglysmith@yahoo.com" );
// 		$( "#city" ).val( "MyTown" );
// 		$( "#country" ).val( "MyCountry" );
// 		$( "#password" ).val( "password" );
// 		$( "#repeatpassword" ).val( "password" );

		// When user clicks Submit, validate form and send email with new account data.
		$( "#btnSubmit" ).on( "click", function() { 
			if ( $( "#accountForm" ).parsley().validate({}) ) {
				if ( $( "#termsForm" ).parsley().validate({}) ) {
				  // Show email icon, play animation, then send email.
					$( "#divEmailIcon" ).fadeIn( "slow", function() {
					  $( "#emailIcon" ).slideDown( "slow", function() {
							$( "#emailIcon" ).addClass( "magictime spaceOutUp" );
							  sendAccountMail();							  
					  });
					});		  
				}// if termsForm validate    
			}// if accountForm validate
		});//btnSubmit on click
		
		// Send email with new account data.
		function sendAccountMail() {   
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
				// Hide icon and form, then show ack page.
				setInterval( function() { 
					$( "#divEmailIcon" ).fadeOut( "slow", function() {
						$( "#mainContainer" ).fadeOut( "slow", function() {
						  window.location.href = "ack.html";
						  window.console.log( JSON.stringify( data ) );
						});
					});
				}, 500 );
				}                     
			});//ajax
		}//sendAccountMail	
	
	});// ON DOC READY