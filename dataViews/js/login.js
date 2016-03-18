
  // ============================================================================
  // LOGIN.
  // Requires static.js.
  // ============================================================================

  // ON DOC READY
  $( document ).ready( function() {

	  // LOAD module/view.
	  parent.loadModule( s_module.login_, "" );

    // EVENT HANDLERS.
    $( ".icon" ).on           ( "mouseover", function( event ) { $( this ).css( "opacity", "0.5" ); });
    $( ".icon" ).on           ( "mouseout", function( event )  { $( this ).css( "opacity", "1" ); });
    $( "#_userName" ).on      ( "input", function( event )     { handleLoginEntry( event, "input" ); });
    $( "#_password" ).on      ( "input", function( event )     { handleLoginEntry( event, "input" ); });
    $( "#_btnLogin" ).on      ( "click", function( event )     { doLogin(); });

    // TEST.
    $( "#_btnTestLogin" ).on  ( "click", function( event )     { doTestLogin(); });

  })// ON DOC READY

  // ============================================================================
  // GLOBAL VARS.
  // ============================================================================

  // Text strings.
  var g_uiStr = {
    tipUserName_ : "Enter your user name.",
    tipPassword_ : "Enter your password.",
    erEmptyInput_: "Please make an entry.",
    erLogin_     : "Login is not correct."
  };

  // ============================================================================
  // FORM.
  // ============================================================================

  // HANDLE LOGIN ENTRY.
  function handleLoginEntry( event, action_ ) {
    if ( stc_isDefined( event.target.id ) && stc_isDefined( action_ ) ) {
	    // Get input field.
	    var inputField_ = $( "#" + event.target.id );

	    // Handle event.
	    if ( stc_isDefined( inputField_ ) ) {
	      switch( action_ ) {

	        case "input":
	          validateLogin( inputField_ );
	        break;

	        default: break;
	      }//switch action_
	    }//inputField_ valid
    }//params valid
  }//handleLoginEntry

  // VALIDATE LOGIN.
  function validateLogin( inputField_ ) {
    // Init error flag.
    var error_ = false;

    // Init titles.
    var titleNormal_ = "";
    var titleError_  = "";

    // Validate field.
    if ( stc_isDefined( inputField_ ) ) {
	    // Get ID.
	    var id_ = inputField_.attr( "id" );

	    // Get input value.
	    var val_ = inputField_.val();

	    // Validate.
	    if ( stc_isDefined( id_ ) && stc_isDefined( val_ ) ) {
	      switch( id_ ) {

	        case "_userName":
		        // Set normal title.
		        titleNormal_ = g_uiStr.tipUserName_;

		        // Handle error input.
		        if ( val_ == "" ) {
		          // Set error flag and title.
		          error_      = true;
		          titleError_ = g_uiStr.erEmptyInput_;
		        }//val_ empty
	        break;

	        case "_password":
		        // Set normal title.
		        titleNormal_ = g_uiStr.tipPassword_;

		        // Handle error input.
		        if ( val_ == "" ) {
		          // Set error flag and title.
		          error_      = true;
		          titleError_ = g_uiStr.erEmptyInput_;
		        }//val_ empty
	        break;

	        default: break;
	      }//switch id_
	    }//id_ val_ valid
    }//inputField_ valid

    // Set field border and title.
    if ( error_ ) {
      inputField_.addClass( "bgError" );
      inputField_.attr( "title", titleError_ );
    } else {
      inputField_.removeClass( "bgError" );
		  inputField_.attr( "title", titleNormal_ );
    }//not error_

    // Return error flag.
    return error_;
  }//validateLogin

  // ============================================================================
  // SERVICES.
  // ============================================================================

  // DO LOGIN.
  function doLogin() {
    // Validate input.
    var error_      = false;
    var inputError_ = false;
    inputError_     = validateLogin( $( "#_userName" ) ); if ( inputError_ ) { error_ = true; }
    inputError_     = validateLogin( $( "#_password" ) ); if ( inputError_ ) { error_ = true; }

    // If input error, handle error.
    // If input correct, send service.
    if ( error_ ) {
      parent.populateLog( s_message.erInput_, "" );
      parent.showLog();
    } else {
      sendLogin();
    }//error_ false
  }//doLogin()

  // SEND LOGIN.
  function sendLogin() {
    // Send service.
    var loadMessage_ = s_message.loading_ + " " + s_action.login_;
    var arrayParams_ = new Array();
    arrayParams_.push( { param: 'userName', value: $( "#_userName" ).val() } );
    arrayParams_.push( { param: 'password', value: $( "#_password" ).val() } );
    stc_sendService( parent, loadMessage_, s_action.login_, arrayParams_, returnLogin, "", $( "#_tooltip" ), null );
  }//sendLogin

  // RETURN LOGIN.
  function returnLogin( data_, status_, message_ ) {
    // Set error flag.
    var error_ = true;

    // Handle result.
    if ( stc_isDefined( data_ ) && stc_isDefined( status_ ) ) {
	    if ( status_ == s_svcVals.success_ ) {
        // Set error to false.
        error_ = false;

		    // Set up result vals.
		    var userName_      = "";
		    var setupComplete_ = "";

		    // Get result vals.
		    if ( stc_isDefined( data_.userName ) )      { userName_      = data_.userName; }
		    if ( stc_isDefined( data_.setupComplete ) ) { setupComplete_ = data_.setupComplete; }

        // Open app or go to setup.
        if ( setupComplete_ == "true" ) {
          parent.goToInitialPage();
        } else {
          parent.goToSetup();
        }//setupComplete_ false
	    }//status is success
    }//data_ status_ valid

    // If data in error, handle error.
    if ( error_ ) {
      var errorMessage_ = g_uiStr.erLogin_ + " " + s_message.support_;
      if ( message_ != "" ) {
        errorMessage_ = message_ + " " + s_message.support_;
      }//message_ not empty
      parent.populateLog( errorMessage_, "" );
      parent.showLog();
    }//error_ true
  }//returnLogin

  // DO TEST LOGIN.
  function doTestLogin() {
    parent.i_isTestMode = true;
    parent.goToSetup();
  }//doTestLogin()