
	// ON DOC READY
	
	$( document ).ready( function() {
		// Hide icon used in submit animation.
		$( "#divEmailIcon" ).hide();
		$( "#emailIcon" ).hide();
		
		// Test data. Comment out for production.
		$( "#firstname" ).val( "MyFirstName" );
		$( "#lastname" ).val( "MyLastName" );
		$( "#email" ).val( "myEmail@myProvider.com" );
		$( "#password" ).val( "password" );
		$( "#repeatpassword" ).val( "password" );

		// When user clicks Submit, validate form and send email with new account data.
		$( "#btnSubmit" ).on( "click", function() { 
			if ( $( "#accountForm" ).parsley().validate({}) ) {
				// Show email icon, play animation, then send email.
				$( "#divEmailIcon" ).fadeIn( "slow", function() {
					$( "#emailIcon" ).slideDown( "slow", function() {
						$( "#emailIcon" ).addClass( "magictime spaceOutUp" );
							sendAccountMail();							  
					});
				});		     
			}// if accountForm validate
		});//btnSubmit on click
		
		// Send email with new account data.
		function sendAccountMail() {   
			var firstname = $( "#firstname" ).val();
			var lastname  = $( "#lastname" ).val();
			var email     = $( "#email" ).val();
			var password  = $( "#password" ).val();

			$.ajax({
				type: "POST",
				url: "sendAccountEmail.php?firstname=" + firstname + 
																 "&lastname=" + lastname +
																 "&email="    + email +
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