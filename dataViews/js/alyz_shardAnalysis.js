
  // =============================================================================
	// SHARD ANALYSIS.
  // Requires static.js.
  // ============================================================================

	// ON DOC READY
	$( document ).ready( function() {

	  // Load module/view.
	  parent.loadModule( s_module._1_, s_module1._1_ );

    // Create basic contents.
    createBasicContents();

    // Go to first step.
    goToStep( g_step );

	})// ON DOC READY

  // ============================================================================
  // GLOBAL VARS.
  // ============================================================================

  // Analysis steps.
  var g_stepVals = {
    start_               : "start",
    defineDomain_        : "defineDomain",
    createRelationships_ : "createRelationships",
    generateReport_      : "generateReport" };
  var g_step = g_stepVals.start_;

  // Processing vars.
  var g_arrayDomain        = new Array();
  var g_domainName         = "";
  var g_domainIndex        = null;
  var g_domainNameLast     = "";
  var g_domainNameSelected = "";
  var g_nbrPhysicalShards  = 0;
  var g_shardingStrategy   = "";
  var g_callbackDomain     = null;
  var g_error              = false;

  // Text strings.
  var g_uiStr = {
    tipGoTo_               : "Go to ",
    tipReturnTo_           : "Return to ",
    tipStart_              : "Start",
    tipDefineDomain_       : "Define your domain",
    tipCreateRelationships_: "Create relationships",
    tipGenerateReport_     : "Generate report",
    tipSelectDomain_       : "Select a domain.",
    tipDomainName_         : "Enter a unique name for your domain.\nAllowed characters: letters, numbers, and the underscore(_).",
    tipPhysicalShards_     : "Enter the number of physical shards for your domain.",
    tipShardingStrategy_   : "Select a sharding strategy.",
    erEmptyDomainName_     : "Please enter a name for your domain.",
    erDupeDomainName_      : "duplicates another name. Please enter a unique name.",
    erEmptyPhysicalShards_ : "Please enter a number from 1 - 999."
  };

  // ============================================================================
  // BASIC CONTENT.
  // ============================================================================

  // CREATE BASIC CONTENTS.
  function createBasicContents() {

    // EVENT HANDLERS.

    // Icon images.
    $( ".icon" ).on                      ( "mouseover", function( event ) { $( this ).css( "opacity", "0.5" ); });
    $( ".icon" ).on                      ( "mouseout", function( event )  { $( this ).css( "opacity", "1" ); });

    // Next step icons.
    $( "#_nextFromStart" ).on            ( "click", function( event )     { goToStep( g_stepVals.defineDomain_ ); });
    $( "#_nextFromDefineDomain" ).on     ( "click", function( event )     { submitDomain( leaveDomain ); });
    $( "#_nextFromGenerateReport0" ).on  ( "click", function( event )     { goToStep( g_stepVals.start_ ); });
    $( "#_nextFromGenerateReport1" ).on  ( "click", function( event )     { });

    // Domain buttons and form fields.
    $( "#_btnDomainNew" ).on             ( "click", function( event )     { addNewDomain(); });
    $( "#_btnDomainSave" ).on            ( "click", function( event )     { submitDomain( refreshDomain ); });
    $( "#_dropdownDomain" ).on           ( "click", function( event )     { handleDomainDropdown( this, "click" ); });
    $( "#_domainName" ).on               ( "focus", function( event )     { handleDomainName( this, "focus" ); });
    $( "#_domainName" ).on               ( "input", function( event )     { handleDomainName( this, "input" ); });
    $( "#_domainName" ).on               ( "blur", function( event )      { handleDomainName( this, "blur" ); });
    $( "#_numberPhysicalShards" ).on     ( "input", function( event )     { handlePhysicalShards( this, "input" )  });
    $( "#_numberPhysicalShards" ).on     ( "blur", function( event )      { handlePhysicalShards( this, "blur" )  });
    $( "#_dropdownShardingStrategy" ).on ( "click", function( event )     { handleShardingStrategy( this, "click" ); });

    // CONTENTS.

    // Init fields.
    stc_initTestField();
    stc_clearTooltip( $( "#_tooltip" ) );
    g_domainName         = "";
    g_domainIndex        = null;
    g_domainNameLast     = "";
    g_domainNameSelected = "";
    g_nbrPhysicalShards  = 0;
    g_shardingStrategy   = "";

    // Set form titles.
    $( "#_dropdownDomain" ).prop( "title", g_uiStr.tipSelectDomain_ );
    $( "#_domainName" ).prop( "title", g_uiStr.tipDomainName_ );
    $( "#_numberPhysicalShards" ).prop( "title", g_uiStr.tipPhysicalShards_ );
    $( "#_dropdownShardingStrategy" ).prop( "title", g_uiStr.tipShardingStrategy_ );

    // Hide load tooltip.
    parent.hideLoadTooltip();
  }//createBasicContents

  // ============================================================================
  // STEPS.
  // ============================================================================

  // TOGGLE SHOW STEP.
  function toggleShowStep( step_ ) {
    // Hide all steps.
    $( "#_stepStart" ).css( "visibility", "hidden" );
    $( "#_stepStart" ).css( "display", "none" );

    $( "#_stepDefineDomain" ).css( "visibility", "hidden" );
    $( "#_stepDefineDomain" ).css( "display", "none" );

    $( "#_rowContainerDomainForm" ).css( "visibility", "hidden" );
    $( "#_rowContainerDomainForm" ).css( "display", "none" );

    $( "#_containerSchemaWheel" ).css( "visibility", "hidden" );
    $( "#_containerSchemaWheel" ).css( "display", "none" );

    $( "#_stepGenerateReport" ).css( "visibility", "hidden" );
    $( "#_stepGenerateReport" ).css( "display", "none" );

    $( "#_rowContainerReport" ).css( "visibility", "hidden" );
    $( "#_rowContainerReport" ).css( "display", "none" );

    // Set log position.
    parent.positionMessageLog( 326, 120 );

    // Set help position.
    parent.positionHelpDialog( 20, 340 );

    // Show selected step.
    if ( stc_isDefined( step_ ) ) {
	    switch( step_ ) {

	      case g_stepVals.start_:
	        $( "#_stepStart" ).css( "visibility", "visible" );
	        $( "#_stepStart" ).css( "display", "block" );
	      break;

	      case g_stepVals.defineDomain_:
	        $( "#_stepDefineDomain" ).css( "visibility", "visible" );
	        $( "#_stepDefineDomain" ).css( "display", "block" );

			    $( "#_rowContainerDomainForm" ).css( "visibility", "visible" );
			    $( "#_rowContainerDomainForm" ).css( "display", "block" );
	      break;

	      case g_stepVals.createRelationships_:
	        $( "#_containerSchemaWheel" ).css( "visibility", "visible" );
	        $( "#_containerSchemaWheel" ).css( "display", "block" );
	      break;

	      case g_stepVals.generateReport_:
	        $( "#_stepGenerateReport" ).css( "visibility", "visible" );
	        $( "#_stepGenerateReport" ).css( "display", "block" );

	        $( "#_rowContainerReport" ).css( "visibility", "visible" );
	        $( "#_rowContainerReport" ).css( "display", "block" );
	      break;

	      default: break;
	    }//switch step_
    }//step_ valid
  }//toggleShowStep

  // GO TO STEP.
  function goToStep( step_ ) {
    // Init screen.
    parent.initSpecial( s_module1._1_ );

    // Init create relationships.
    stc_loadIframe( "_containerSchemaWheel", "" );

    // Go to specified step.
    if ( stc_isDefined( step_ ) ) {
	    // Store step.
	    g_step = step_;

	    // Show step.
	    switch( step_ ) {

	      case g_stepVals.start_:
			    // Set next/back icons.
			    parent.setBackIcon( "", false );
			    parent.setNextIcon( "", false );

			    // Hide tree icons.
			    parent.toggleShowTreeIcons( false );

			    // Show step.
	        toggleShowStep( step_ );
	      break;

	      case g_stepVals.defineDomain_:
	        // Set next/back icons.
	        parent.setBackIcon( g_uiStr.tipReturnTo_ + g_uiStr.tipStart_, true );
	        parent.setNextIcon( "", false );

			    // Hide tree icons.
			    parent.toggleShowTreeIcons( false );

	        // Get domains. Callback will show step.
	        getDomain( initDomain );
	      break;

	      case g_stepVals.createRelationships_:
	        // Set next/back icons.
	        parent.setBackIcon( g_uiStr.tipReturnTo_ + g_uiStr.tipDefineDomain_, true );
	        parent.setNextIcon( g_uiStr.tipGoTo_ + g_uiStr.tipGenerateReport_, true );

			    // Show tree icons.
			    parent.toggleShowTreeIcons( true );

          // Turn overflow off.
	        parent.toggleUseOverflow( false );

          // Show step.
          toggleShowStep( g_stepVals.createRelationships_ );
          stc_loadIframe( "_containerSchemaWheel", "stats_schemaWheel.html" );
	      break;

	      case g_stepVals.generateReport_:
	        // Set next/back icons.
	        parent.setBackIcon( g_uiStr.tipReturnTo_ + g_uiStr.tipCreateRelationships_, true );
	        parent.setNextIcon( "", false );

			    // Hide tree icons.
			    parent.toggleShowTreeIcons( false );

	        // Show step.
	        toggleShowStep( step_ );
	        $( "#_listContainerReport" )[0].contentWindow.doGetList( parent );
	      break;

	      default: break;
	    }//switch step_
    }//step_ valid
  }//goToStep

  // GO NEXT FROM CREATE RELATIONSHIPS.
  function goNextFromCreateRelationships() {
    goToStep( g_stepVals.generateReport_ );
  }//goNextFromCreateRelationships

  // GO NEXT FROM DOMAIN.
  function goNextFromDomain() {
    goToStep( g_stepVals.createRelationships_ );
  }//goNextFromDomain

  // RETURN TO LAST STEP.
  function returnToLastStep() {
    if ( stc_isDefined( g_step ) ) {
	    // Depending on current step, go to last step.
	    switch( g_step ) {

	      case g_stepVals.start_: break;

	      case g_stepVals.defineDomain_:
	        goToStep( g_stepVals.start_ );
	      break;

	      case g_stepVals.createRelationships_:
	        goToStep( g_stepVals.defineDomain_ );
	      break;

	      case g_stepVals.generateReport_:
	        goToStep( g_stepVals.createRelationships_ );
	      break;

	      default: break;
	    }//switch g_step
    }//g_step valid
  }//returnToLastStep

  // ============================================================================
  // DOMAIN FORM.
  // ============================================================================

  // GET DOMAIN INDEX.
  function getDomainIndex( domainName_ ) {
    var index_ = 0;
    if ( stc_isDefined( g_arrayDomain ) & stc_isDefined( domainName_ ) ) {
      var length_ = g_arrayDomain.length;
      for ( var i = 0; i < length_; i++ ) {
        if ( stc_isDefined( g_arrayDomain[i].domainName ) ) {
          if ( g_arrayDomain[i].domainName == domainName_ ) {
            index_ = i;
            break;
          }//match
        }//domainName valid
      }//for each entry
    }//params valid
    return index_;
  }//getDomainIndex

  // ADD NEW DOMAIN.
  function addNewDomain() {
    // Get unique number for creating default domain name.
    var nbrStr_ = stc_getDefaultNumber( parent, g_arrayDomain, "domainName", s_strDomainName, 4, 9999, "0" );

    // Create object.
    var obj_               = new Object();
    obj_.domainName        = s_strDomainName + nbrStr_;
    obj_.nbrPhysicalShards = 1;
    obj_.shardingStrategy  = s_shardVals.shardStrategyModulus_;

    // Add object to master array.
    g_arrayDomain.push( obj_ );

    // Set up domain form.
    setupDomainForm( g_arrayDomain.length - 1 );
  }//addNewDomain

  // SETUP DOMAIN FORM.
  function setupDomainForm( index_ ) {
    // Create domain dropdown options.
    if ( stc_isDefined( $( "#_dropdownDomain" ) ) ) {
      var options_ = "";
      var option_  = "";
      var length_  = g_arrayDomain.length;
      for ( var i = 0; i < length_; i++ ) {
        option_ = "<option value='" + i + "'>" + g_arrayDomain[i].domainName + "</option>";
        if ( i == index_ ) { option_ = "<option selected value='" + i + "'>" + g_arrayDomain[i].domainName + "</option>"; }
        options_ += option_;
      }//for each entry
      $( "#_dropdownDomain" ).find( "option" ).remove().end().append( options_ );
    }//_dropdownDomain valid

	  // Use selected domain to set values of domain fields.
    setDomainFields();
  }//setupDomainForm

  // SET DOMAIN FIELDS.
  function setDomainFields() {
	  // Get index of selected domain.
    var indexDomain_ = parseInt( $( "#_dropdownDomain" ).val() );

    // Init error flag.
    g_error = false;

    // Use index to set input values, then update master fields.
    if ( stc_isNumber( indexDomain_ ) ) {
		    // Domain name.
		    var domainName_ = g_arrayDomain[indexDomain_].domainName;
		    if ( stc_isDefined( domainName_ ) ) {
		      $( "#_domainName" ).val( domainName_ );
		      $( "#_domainName" ).prop( "name", indexDomain_ );
		      updateMasterFields( "_domainName" );
		    }//domainName_ valid

		    // Physical shards.
		    var nbrPhysicalShards_ = parseInt( g_arrayDomain[indexDomain_].nbrPhysicalShards );
		    if ( stc_isDefined( nbrPhysicalShards_ ) ) {
		      $( "#_numberPhysicalShards" ).val( nbrPhysicalShards_ );
		      updateMasterFields( "_numberPhysicalShards" );
		    }//nbrPhysicalShards_ valid

		    // Sharding strategy.
		    $( "#_dropdownShardingStrategy" ).val( s_shardVals.shardStrategyModulus_ );
		    var shardingStrategy_ = g_arrayDomain[indexDomain_].shardingStrategy;
		    if ( stc_isDefined( shardingStrategy_ ) ) {
		      if ( shardingStrategy_ == s_shardVals.shardStrategyStripes_ ) {
		        $( "#_dropdownShardingStrategy" ).val( s_shardVals.shardStrategyStripes_ );
		      } else if ( shardingStrategy_ == s_shardVals.shardStrategyModulus_ ) {
		        $( "#_dropdownShardingStrategy" ).val( s_shardVals.shardStrategyModulus_ );
		      }//shardStrategyModulus_
		      updateMasterFields( "_dropdownShardingStrategy" );
		    }//shardingStrategy_ valid
    }//indexDomain_ valid
  }//setDomainFields

  // HANDLE DOMAIN DROPDOWN.
  function handleDomainDropdown( inputField_, action_ ) {
    if ( stc_isDefined( inputField_ ) && stc_isDefined( action_ ) ) {
	    // Handle event according to specified action.
      switch( action_ ) {
        case "click": setDomainFields(); break;
        default     : break;
      }//switch action_
    }//params valid
  }//handleDomainDropdown

  // HANDLE DOMAIN NAME.
  function handleDomainName( inputField_, action_ ) {
    if ( stc_isDefined( inputField_ ) && stc_isDefined( action_ ) ) {
	    // Init error flag.
	    var error_ = false;
	    g_error    = false;

	    // Handle event according to specified action.
      switch( action_ ) {

        case "focus":

          // Store currently-selected domain name.
          g_domainNameLast = g_domainName;

        break;

        case "input":

          // Update master field.
          updateMasterFields( "_domainName" );

        break;

        case "blur":

          // Check for duplicate domain name.
          error_  = checkDuplicateDomainName();
          g_error = error_;
          if ( error_ ) {
			      // Insert original value into name field.
			      g_domainName = g_domainNameLast;

			      // Populate message log.
			      parent.populateLog( $( "#_domainName" ).val() + " " + g_uiStr.erDupeDomainName_, s_svcVals.error_ );

			      // Wipe out input field.
			      $( "#_domainName" ).val( "" );

			      // Update master field (using original value).
			      updateMasterFields( "_domainName" );
          }//error_ true

          // Revise option in domain dropdown to match currently-selected domain name.
          var indexDomain_ = updateDomainOptions();

          // Update master array with currently-selected domain name.
          if ( stc_isDefined( indexDomain_ ) ) {
            updateMasterArray( "_domainName", indexDomain_ );
          }//indexDomain_ valid

        break;

        default: break;
      }//switch action_

    }//params valid
  }//handleDomainName

  // CHECK DUPLICATE DOMAIN NAME.
  function checkDuplicateDomainName() {
    // Set up error flag.
    var error_ = false;

    // Perform validation.
    if ( stc_isDefined( $( "#_dropdownDomain" ) ) && stc_isDefined( $( "#_domainName" ) ) && stc_isDefined( g_arrayDomain ) &&
         stc_isDefined( g_domainName ) && stc_isDefined( g_domainNameLast ) && stc_isNumber( g_domainIndex ) ) {

      if ( g_domainName != "" ) {
	      var options_ = $( "#_dropdownDomain" ).find( "option" );
	      if ( stc_isDefined( options_ ) ) {
		      var done_   = false;
		      var length_ = options_.length;
		      for ( var i = 0; i < length_; i++ ) {
						// If user changed name of currently-selected domain, find out if it matches another existing name.
		        if ( options_[i].text == g_domainName && i != g_domainIndex ) {
				      // Set error flag.
				      error_ = true;

		          // Set action flag.
		          done_ = true;
		        }//name match but index not match

			      // If specified action was performed, break.
			      if ( done_ ) { break; }
		      }//for each entry
	      }//options_ valid
      }//g_domainName not empty
    }//params valid

    // Return error flag.
    return error_;
  }//checkDuplicateDomainName

  // HANDLE PHYSICAL SHARDS.
  function handlePhysicalShards( inputField_, action_ ) {
    if ( stc_isDefined( inputField_ ) && stc_isDefined( action_ ) ) {
	    // Handle event according to specified action.
      switch( action_ ) {

        case "input":

          // Update master field.
          updateMasterFields( "_numberPhysicalShards" );

        break;

        case "blur":

          // Update master array.
			    if ( stc_isDefined( $( "#_dropdownDomain" ) ) ) {
			      if ( g_nbrPhysicalShards > 0 ) {
					    var indexDomain_ = parseInt( $( "#_dropdownDomain" ).val() );
					    if ( stc_isNumber( indexDomain_ ) ) {
					      updateMasterArray( "_numberPhysicalShards", indexDomain_ ) ;
					    }//indexDomain_ valid
			      }//g_nbrPhysicalShards not empty
			    }//_dropdownDomain valid

        break;

        default: break;
      }//switch action_

    }//params valid
  }//handlePhysicalShards

  // HANDLE SHARDING STRATEGY.
  function handleShardingStrategy( inputField_, action_ ) {
    if ( stc_isDefined( inputField_ ) && stc_isDefined( action_ ) ) {
	    // Handle event according to specified action.
      switch( action_ ) {

        case "click":

          // Update master field.
          updateMasterFields( "_dropdownShardingStrategy" );

			    // Update master array.
			    if ( stc_isDefined( $( "#_dropdownDomain" ) ) ) {
				    var indexDomain_ = parseInt( $( "#_dropdownDomain" ).val() );
				    if ( stc_isNumber( indexDomain_ ) ) {
				      updateMasterArray( "_dropdownShardingStrategy", indexDomain_ );
				    }//indexDomain_ valid
			    }//_dropdownDomain valid

        break;

        default: break;
      }//switch action_

    }//params valid
  }//handleShardingStrategy

  // UPDATE DOMAIN OPTIONS.
  function updateDomainOptions() {
    // Set up return index, to be used for further update.
    var indexDomain_ = null;

    // Perform update.
    if ( stc_isDefined( $( "#_dropdownDomain" ) ) && stc_isDefined( g_arrayDomain ) &&
         stc_isDefined( g_domainName ) && stc_isNumber( g_domainIndex ) ) {

      if ( g_domainName != "" ) {
	      var options_ = $( "#_dropdownDomain" ).find( "option" );
	      if ( stc_isDefined( options_ ) ) {
		      var done_   = false;
		      var length_ = options_.length;
		      for ( var i = 0; i < length_; i++ ) {
		        if ( options_[i].value == g_domainIndex ) {
		          // Revise name in domain dropdown to match currently-selected domain name.
		          $( "#_dropdownDomain" ).find( "option" )[i].text = g_domainName;

		          // Set return index.
		          indexDomain_ = i;

		          // Set action flag.
		          done_ = true;
		        }//match

			      // If specified action was performed, break.
			      if ( done_ ) { break; }
		      }//for each entry
	      }//options_ valid
      }//g_domainName not empty
    }//params valid

    // Return index.
    return indexDomain_;
  }//updateDomainOptions

  // UPDATE MASTER ARRAY.
  function updateMasterArray( inputFieldID_, indexDomain_ ) {
    if ( stc_isDefined( inputFieldID_ ) && stc_isNumber( indexDomain_ ) && stc_isDefined( g_arrayDomain ) ) {
	    // Update according to passed field ID.

      switch( inputFieldID_ ) {

        case "_domainName":

          if ( stc_isDefined( g_domainName ) ) {
            g_arrayDomain[indexDomain_].domainName = g_domainName;
          }//g_domainName valid

        break;

        case "_numberPhysicalShards":

			    if ( stc_isDefined( g_nbrPhysicalShards ) ) {
			      g_arrayDomain[indexDomain_].nbrPhysicalShards = g_nbrPhysicalShards;
			    }//g_nbrPhysicalShards valid

        break;

        case "_dropdownShardingStrategy":

			    if ( stc_isDefined( g_shardingStrategy ) ) {
			      g_arrayDomain[indexDomain_].shardingStrategy = g_shardingStrategy;
			    }//g_shardingStrategy valid

        break;

        default: break;
      }//switch inputFieldID_

    }//params valid
  }//updateMasterArray

  // UPDATE MASTER FIELDS.
  function updateMasterFields( inputFieldID_ ) {
    if ( stc_isDefined( inputFieldID_ ) ) {
	    // Set up processing vars.
	    var inputField_  = null;
	    var val_         = null;
	    var indexDomain_ = null;

	    // Update according to passed field ID.

      switch( inputFieldID_ ) {

        case "_domainName":

			    // Get input field. Validate and update master field.
			    inputField_ = $( "#" + inputFieldID_ );
			    if ( stc_isDefined( inputField_ ) ) {
		        // Get input val.
				    val_ = inputField_.val();

		        // Filter out special charcters.
		        val_ = val_.replace(/[^\w\s]/gi, '');
		        inputField_.val( val_ );

		        // Get domain index.
				    indexDomain_ = inputField_.prop( "name" );

				    // Validate. If valid, update master field. If invalid, init fields.
				    if ( val_ != "" ) {
				      // Valid.
				      g_domainName  = val_;
				      g_domainIndex = parseInt( indexDomain_ );
				      $( inputField_ ).removeClass( "bgError" ).addClass( "bgNearWhiteBorderedGray" );
				      $( inputField_ ).attr( "title", g_uiStr.tipDomainName_ );
				    } else {
				      // Invalid.
				      g_domainName  = "";
				      g_domainIndex = null;
				      $( inputField_ ).val( "" );
				      $( inputField_ ).removeClass( "bgNearWhiteBorderedGray" ).addClass( "bgError" );
				      $( inputField_ ).attr( "title", g_uiStr.erEmptyDomainName_ );
				    }//val_ empty
			    }//inputField_ valid

        break;

        case "_numberPhysicalShards":

			    // Get input field. Validate and update master field.
			    inputField_ = $( "#" + inputFieldID_ );
			    if ( stc_isDefined( inputField_ ) ) {
		        // Get input val.
				    val_ = inputField_.val();

				    // Validate. If valid, update master field. If invalid, init fields.
				    if ( val_ != "" && val_ != 0 && stc_isInputNumeric( val_ ) ) {
				      // Valid.
				      g_nbrPhysicalShards = parseInt( val_ );
				      inputField_.removeClass( "bgError" ).addClass( "bgNearWhiteBorderedGray" );
				      inputField_.attr( "title", g_uiStr.tipPhysicalShards_ );
				    } else {
				      // Invalid.
				      g_nbrPhysicalShards = 0;
				      inputField_.val( "" );
				      inputField_.removeClass( "bgNearWhiteBorderedGray" ).addClass( "bgError" );
				      inputField_.attr( "title", g_uiStr.erEmptyPhysicalShards_ );
				    }//not valid
			    }//inputField_ valid

        break;

        case "_dropdownShardingStrategy":

			    // Update master fields.
          g_shardingStrategy = $( "#_dropdownShardingStrategy" ).val();

        break;

        default: break;
      }//switch inputFieldID_

    }//params valid
  }//updateMasterFields

  // ============================================================================
  // DOMAIN SERVICES.
  // ============================================================================

  // VALIDATE DOMAIN FIELDS.
  function validateDomainFields() {
	  // Set up processing vars.
	  var message_   = "";
	  var error_     = false;
	  var valsValid_ = false;
	  var serviceOK_ = false;

	  // Update master fields once more. Values are updated when oninput fires,
	  // therefore, if input fields contain default values, default values are
	  // not updated until we explicitly do that here.
	  updateMasterFields( "_domainName" );
	  updateMasterFields( "_numberPhysicalShards" );
	  updateMasterFields( "_dropdownShardingStrategy" );

	  // Check if service parameters are valid. If so, set service OK flag to true.
	  if ( stc_isDefined( g_domainName ) && stc_isDefined( g_nbrPhysicalShards ) && stc_isDefined( g_shardingStrategy )  ) {
		  // Set valid vals flag.
		  valsValid_ = true;

		  // Validate stored input values.
		  if ( g_domainName == "" || g_nbrPhysicalShards == 0 ) {
	      message_ = s_message.erInput_;
	      error_   = true;
		  }//g_domainName or g_nbrPhysicalShards not valid
		  if ( g_shardingStrategy == "" ) {
	      message_ = s_message.erApplication_ + " " + s_message.support_;
	      error_   = true;
		  }//g_shardingStrategy not valid

		  // If any parameter not valid, show error.
		  // If all parameters valid, set service OK flag to true.
		  if ( error_ ) {
	      // Populate message log.
	      parent.populateLog( message_, s_svcVals.error_ );
		  } else {
			  // Set service OK flag.
			  serviceOK_ = true;
		  }//error_ false

		  // Return service OK flag.
		  return serviceOK_;
	  }//vals valid

	  // If vals not valid, populate message log.
	  if ( !valsValid_ ) {
      message_ = s_message.erApplication_ + " " + s_message.support_;
      parent.populateLog( message_, s_svcVals.error_ );
	  }//valsValid_ not valid
  }//validateDomainFields

  // GET DOMAIN.
  function getDomain( callback_ ) {
    // Store callback.
    g_callbackDomain = callback_;

    // Send service.
    var loadMessage_ = s_message.loading_ + " " + s_action.alyzGetDomains_;
    var arrayParams_ = new Array();
    stc_sendService( parent, loadMessage_, s_action.alyzGetDomains_, arrayParams_, returnDomain, testGetDomainsResult_, $( "#_tooltip" ), null );
  }//getDomain

  // SUBMIT DOMAIN.
  function submitDomain( callback_ ) {
	  // If there are no errors in fields, validate and send service.
	  // If there are errors, do not send message to log.
	  // If errors exist, message log is already performing error animation.
	  // Additional error message will overload log animation.
	  if ( !g_error ) {
		  // Validate input values.
		  var serviceOK_ = validateDomainFields();

		  // If values valid, send service.
		  if ( serviceOK_ ) {
		    // If test mode, update test data.
		    if ( parent.i_isTestMode && stc_isDefined( testSubmitDomainResult_ ) && stc_isDefined( g_arrayDomain ) ) {
		      testSubmitDomainResult_.domainList = new Array();
		      var length_ = g_arrayDomain.length;
		      var obj_    = new Object();
		      for ( var i = 0; i < length_; i++ ) {
		        if ( stc_isDefined( g_arrayDomain[i] ) ) {
		          obj_                   = new Object();
		          obj_.domainName        = g_arrayDomain[i].domainName;
		          obj_.nbrPhysicalShards = parseInt( g_arrayDomain[i].nbrPhysicalShards );
		          obj_.shardingStrategy  = g_arrayDomain[i].shardingStrategy;
		          testSubmitDomainResult_.domainList.push( obj_ );
		        }//entry valid
		      }//for each entry
		    }//is parent.i_isTestMode and params valid

	      // Store selected domain name.
	      g_domainNameSelected = g_domainName;

	      // Store callback.
	      g_callbackDomain = callback_;

	      // Send service.
		    var loadMessage_ = s_message.loading_ + " " + s_action.alyzSubmitDomain_;
		    var arrayParams_ = new Array();
		    arrayParams_.push( { param: 'domainName',        value: g_domainName } );
		    arrayParams_.push( { param: 'nbrPhysicalShards', value: g_nbrPhysicalShards } );
		    arrayParams_.push( { param: 'shardingStrategy',  value: g_shardingStrategy } );
		    stc_sendService( parent, loadMessage_, s_action.alyzSubmitDomain_, arrayParams_, returnDomain, testSubmitDomainResult_, $( "#_tooltip" ), null );
		  }//serviceOK_ true
	  }//g_error false
  }//submitDomain

  // RETURN DOMAIN.
  function returnDomain( data_, status_ ) {
    if ( stc_isDefined( data_ ) ) {
	    // Get message.
	    var message_ = "";
	    if ( stc_isDefined( data_.message ) ) {
	      message_ = data_.message;
	    }//message valid

	    // Handle domain list.
	    if ( stc_isDefined( data_.domainList ) ) {
        // Set application domain name.
        if ( stc_isDefined( g_domainName ) ) {
          if ( g_domainName != "" ) {
            parent.i_domainName = g_domainName;
          }//not empty
        }//g_domainName valid

        // Set application number of physical shards.
        if ( stc_isDefined( g_nbrPhysicalShards ) ) {
          parent.i_nbrPhysicalShards = g_nbrPhysicalShards;
        }//g_nbrPhysicalShards valid

        // Create master array.
        g_arrayDomain = new Array();
        g_arrayDomain = $.merge( g_arrayDomain, data_.domainList );

	      // Fire callback.
	      g_callbackDomain( message_ );
	    }//domainList valid
    }//data_ valid
  }//returnDomain

  // ============================================================================
  // DOMAIN SERVICES CALLBACKS.
  // ============================================================================

  // INIT DOMAIN.
  // Fires after initial service for Define your domain.
  function initDomain() {
    // Get index of current domain from either initial setup or from earlier run in Define your domain.
    // We use name to find index, because we are starting with fresh array and sequence of indexes might be different.
    var index_ = getDomainIndex( parent.i_domainName );

    // Set up domain form using current domain name.
    setupDomainForm( index_ );

    // Show step.
    toggleShowStep( g_stepVals.defineDomain_ );
  }//initDomain

  // REFRESH DOMAIN.
  // Fires after saving current changes in domain values.
  function refreshDomain( message_ ) {
    // Populate message log.
    if ( stc_isDefined( message_ ) ) {
      parent.populateLog( message_ + ".", s_svcVals.success_ );
    }//message valid

	  if ( stc_isDefined( g_domainNameSelected ) ) {
	    // Get index of current domain - last one selected before sending submit service.
    // We use name to find index, because we are starting with fresh array and sequence of indexes might be different.
	    var index_ = getDomainIndex( g_domainNameSelected );

	    // Set up domain form using last selected domain name.
	    setupDomainForm( index_ );
	  }//g_domainNameSelected valid
  }//refreshDomain

  // LEAVE DOMAIN.
  // Fires after saving current changes in domain values, and before going to next step.
  function leaveDomain( message_ ) {
    // Populate message log.
    if ( stc_isDefined( message_ ) ) {
      parent.populateLog( message_ + ".", s_svcVals.info_ );
    }//message valid

    // Go to next step.
	  goNextFromDomain();
  }//leaveDomain





