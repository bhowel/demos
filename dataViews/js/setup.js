
  // ============================================================================
  // SETUP.
  // Requires static.js.
  // ============================================================================

  // ON DOC READY
  $( document ).ready( function() {

	  // LOAD module/view.
	  parent.loadModule( s_module.setup_, "" );

    // EVENT HANDLERS.
    $( ".icon" ).on           ( "mouseover", function( event ) { $( this ).css( "opacity", "0.5" ); });
    $( ".icon" ).on           ( "mouseout", function( event )  { $( this ).css( "opacity", "1" ); });
    $( "#_hostAddress" ).on   ( "input", function( event )     { handleSetupEntry( event, "input" ); });
    $( "#_port" ).on          ( "input", function( event )     { handleSetupEntry( event, "input" ); });
    $( "#_userName" ).on      ( "input", function( event )     { handleSetupEntry( event, "input" ); });
    $( "#_password" ).on      ( "input", function( event )     { handleSetupEntry( event, "input" ); });
    $( "#_btnSubmit" ).on     ( "click", function( event )     { doSubmit(); });

    // TEST.
    $( "#_btnTestSubmit" ).on ( "click", function( event )     { doTestSubmit(); });

  })// ON DOC READY

  // ============================================================================
  // GLOBAL VARS.
  // ============================================================================

  // Text strings.
  var g_uiStr = {
    tipHostAddress_   : "Enter the host address.",
    tipPort_          : "Enter the port number.",
    tipUserName_      : "Enter the user name.",
    tipPassword_      : "Enter the password.",
    erEmptyInput_     : "Please make an entry.",
    erSetup_          : "Setup is not complete - cannot successfully connect with this data. Check each field and make sure each one contains valid connection information."
  };

  // ============================================================================
  // FORM.
  // ============================================================================

  // HANDLE SETUP ENTRY.
  function handleSetupEntry( event, action_ ) {
    if ( stc_isDefined( event.target.id ) && stc_isDefined( action_ ) ) {
	    // Get input field.
	    var inputField_ = $( "#" + event.target.id );

	    // Handle event.
	    if ( stc_isDefined( inputField_ ) ) {
	      switch( action_ ) {

	        case "input":
	          validateSetup( inputField_ );
	        break;

	        default: break;
	      }//switch action_
	    }//inputField_ valid
    }//params valid
  }//handleSetupEntry

  // VALIDATE SETUP.
  function validateSetup( inputField_ ) {
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

	        case "_hostAddress":
		        // Set normal title.
		        titleNormal_ = g_uiStr.tipHostAddress_;

		        // Handle error input.
		        if ( val_ == "" ) {
		          // Set error flag and title.
		          error_      = true;
		          titleError_ = g_uiStr.erEmptyInput_;
		        }//val_ empty
	        break;

	        case "_port":
		        // Set normal title.
		        titleNormal_ = g_uiStr.tipPort_;

		        // Handle error input.
		        if ( val_ == "" ) {
		          // Set error flag and title.
		          error_      = true;
		          titleError_ = g_uiStr.erEmptyInput_;
		        }//val_ empty
	        break;

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
      inputField_.removeClass( "bgNearWhiteBorderedGray" ).addClass( "bgError" );
      inputField_.attr( "title", titleError_ );
    } else {
      inputField_.removeClass( "bgError" ).addClass( "bgNearWhiteBorderedGray" );
		  inputField_.attr( "title", titleNormal_ );
    }//not error_

    // Return error flag.
    return error_;
  }//validateSetup

  // ============================================================================
  // SERVICES.
  // ============================================================================

  // DO SUBMIT.
  function doSubmit() {
    // Validate input.
    var error_      = false;
    var inputError_ = false;
    inputError_     = validateSetup( $( "#_hostAddress" ) );   if ( inputError_ ) { error_ = true; }
    inputError_     = validateSetup( $( "#_port" ) );          if ( inputError_ ) { error_ = true; }
		inputError_     = validateSetup( $( "#_userName" ) );      if ( inputError_ ) { error_ = true; }
		inputError_     = validateSetup( $( "#_password" ) );      if ( inputError_ ) { error_ = true; }

    // If input error, handle error.
    // If input correct, send service.
    if ( error_ ) {
      parent.populateLog( s_message.erInput_, "" );
      parent.showLog();
    } else {
      sendSubmit();
    }//error_ false
  }//doSubmit()

  // SEND SUBMIT.
  function sendSubmit() {
    var loadMessage_ = s_message.loading_ + " " + s_action.setup_;
    var arrayParams_ = new Array();
    arrayParams_.push( { param: 'dbms',          value: $( "#_dropdownDBMS" ).val() } );
    arrayParams_.push( { param: 'hostAddress',   value: $( "#_hostAddress" ).val() } );
    arrayParams_.push( { param: 'port',          value: $( "#_port" ).val() } );
    arrayParams_.push( { param: 'userName',      value: $( "#_userName" ).val() } );
    arrayParams_.push( { param: 'password',      value: $( "#_password" ).val() } );
    stc_sendService( parent, loadMessage_, s_action.setup_, arrayParams_, returnSubmit, "", $( "#_tooltip" ), null );
  }//sendSubmit

  // RETURN SUBMIT.
  function returnSubmit( data_, status_, message_ ) {
    // Set error flag.
    var error_ = true;

    // Handle result.
    if ( stc_isDefined( data_ ) && stc_isDefined( status_ ) ) {
	    if ( status_ == s_svcVals.success_ ) {
        // Set error to false.
        error_ = false;

        // Open app.
        parent.goToInitialPage();
	    }//status is success
    }//data_ status_ valid

    // If user input still needs work, tell user what to do.
    if ( error_ ) {
      // Get error list result.
      var errorList_ = null;
      if ( stc_isDefined( data_.errorList ) ) { errorList_ = data_.errorList; }

      // Set error message.
      var errorMessage_ = "";
      if ( message_ != "" ) {
        errorMessage_ = message_;
      }//message_ not empty
      errorMessage_ = g_uiStr.erSetup_ + "<br><br>" + errorMessage_ + "<br><br>";
      if ( stc_isDefined( errorList_ ) ) {
        var length_ = errorList_.length;
        for ( var i = 0; i < length_; i++ ) {
          if ( stc_isDefined( errorList_[i].inputField ) && stc_isDefined( errorList_[i].errorMessage ) ) {
            errorMessage_ = errorMessage_ + errorList_[i].inputField + ": " + errorList_[i].errorMessage  + "<br>";
          }//entry valid
        }//for each entry
      }//errorList_ valid

      // Show message log.
      parent.populateLog( errorMessage_, "" );
      parent.showLog();
    }//error_ true
  }//returnSubmit

  // DO TEST SUBMIT.
  function doTestSubmit() {
    parent.goToInitialPage();
  }//doTestSubmit()


