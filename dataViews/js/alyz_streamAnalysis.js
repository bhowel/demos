
  // ============================================================================
	// STREAM ANALYSIS.
  // Requires static.js.
  // ============================================================================

	// ON DOC READY
	$( document ).ready( function() {

	  // Load module/view.
	  parent.loadModule( s_module._1_, s_module1._2_ );

    // Create basic contents.
    createBasicContents();

    // Send service request for list. Service callback continues to create content.
    handleListRequest( true, s_svcVals.directionNew_ );

	})// ON DOC READY

  // ============================================================================
  // GLOBAL VARS.
  // ============================================================================

  // Data arrays for services.
  var g_arrayMaster    = new Array();
  var g_arrayViewNames = new Array();

  // Services vals.
  var g_svcVals = {
    nbrRowsReq_ : 16 };

  // Paging vars.
  var g_pageDirection = s_svcVals.directionNew_;
  var g_index         = 0;

  // Validation.
  var g_viewNameOriginal = "";
  var g_error            = false;

  // Timer.
  var t_timerUpdate = null;

  // Text strings.
  var g_uiStr = {
    tipStreamName_         : "Enter a unique name for the view/stream.\nAllowed characters: letters, numbers, and the underscore(_).",
    tipStreamCompatible_   : "Stream-compatible",
    tipStreamNotCompatible_: "Not stream-compatible",
    tipStreamComplete_     : "Stream complete",
    successMessageResult_  : "Message result is",
    successCreatingStreams_: "creating selected streams.",
    erEmptyStreamName_     : "Please enter a name for the view/stream.",
    erDupeStreamName_      : "duplicates another name. Please enter a unique name.",
    erNoEntries_           : "To create streams, fill out one or more forms under <b>Stream info</b> and try again.",
    erBadRequest_          : "One or more rows has an entry error. Please check for missing or duplicate view names and try again.",
    erEmptyRequest_        : "The following row(s) are missing a unique name and/or the checkbox is not selected. Please fill in any missing info: ",
    erDupeRequest_         : "The request contains one or more duplicate view names. There may be a conflict with existing streams. Enter new, unique names for the current request and try again. If the problem recurs, contact customer support for assistance."
  };

  // ============================================================================
  // BASIC CONTENT.
  // ============================================================================

  // CREATE BASIC CONTENTS.
  function createBasicContents() {

    // EVENT HANDLERS.

    // Icon images.
    $( ".icon" ).on      ( "mouseover", function( event ) { $( this ).css( "opacity", "0.5" ); });
    $( ".icon" ).on      ( "mouseout", function( event )  { $( this ).css( "opacity", "1" ); });

    // Icons.
    $( "#_submit" ).on   ( "click", function( event )     { doSubmitStreams(); });

    // List controls.
    $( "#_iconPrev" ).on ( "click", function( event )     { handleListRequest( false, s_svcVals.directionPrev_ ); });
    $( "#_iconNext" ).on ( "click", function( event )     { handleListRequest( false, s_svcVals.directionNext_ ); });

    // CONTENTS.

    // Init fields.
    stc_initTestField();
    stc_clearTooltip( $( "#_tooltip" ) );

    // Hide load tooltip.
    parent.hideLoadTooltip();
  }//createBasicContents

  // ============================================================================
  // LIST.
  // ============================================================================

  // HANDLE LIST REQUEST.
  function handleListRequest( startOver_, pageDirection_ ) {
    if ( stc_isDefined( pageDirection_ ) ) {
	    // Perform setup actions.
	    setupListRequest( startOver_, pageDirection_ );

	    // Depending on user selection, send request for service result or page to prev/next rows.
	    switch( pageDirection_ ) {

	        case s_svcVals.directionNew_:
	          getList();
	        break;

	        case s_svcVals.directionPrev_:
	          pageList( s_svcVals.directionPrev_ );
	        break;

	        case s_svcVals.directionNext_:
	          // Find out if user is paging thru rows that have already been retrieved, or if
	          // he has reached end of stored rows (in master array) and is asking for next page from service.
	          // Page index marks where we are in master array.
	          // When service returns set of rows, they are added to master array and table index is set to first returned row in master array.
	          // When user pages back and forth thru rows, table index is set to first row pushed to screen.
	          // Difference between table index and number of rows in master array is number of rows currently showing on screen.
	          // If difference is less than or equal to number of available rows on screen, we must get new set of rows.
	          // If difference is greater than number of available rows on screen, we can still page forward.
	          if ( g_arrayMaster && stc_isNumber( g_index ) ) {
	            var nbrRemainingrRows_ = ( g_arrayMaster.length - g_index );
	            if ( stc_isNumber( nbrRemainingrRows_ ) ) {
	             if ( nbrRemainingrRows_ <= g_svcVals.nbrRowsReq_ ) {
	               // Send request for new set of rows.
	               getList();
	             } else {
	               // Show next set of stored rows.
	               pageList( s_svcVals.directionNext_ );
	             }//nbrRemainingrRows_ gt g_svcVals.nbrRowsReq_
	            }//nbrRemainingrRows_ valid
	          }//g_arrayMaster g_index valid
	        break;

	        default: break;

	    }//switch pageDirection_
    }//parameters valid
  }//handleListRequest

  // SETUP LIST REQUEST.
  function setupListRequest( startOver_, pageDirection_ ) {
    if ( stc_isDefined( pageDirection_ ) ) {
	    // Set page direction.
	    g_pageDirection = pageDirection_;

	    // Clear out viewName array.
	    if ( !parent.i_isTestMode ) {
	      g_arrayViewNames = new Array();
	    }//not parent.i_isTestMode

	    // Init page index and clear out master array.
	    if ( startOver_ ) {
	      g_index       = 0;
	      g_arrayMaster = new Array();
	    }//startOver_
    }//parameters valid
  }//setupListRequest

  // GET LIST.
  function getList() {
    if ( stc_isDefined( g_arrayMaster ) ) {
      // Send service.
	    var loadMessage_ = s_message.loading_ + " " + s_action.alyzStreamList_;
	    var arrayParams_ = new Array();
	    arrayParams_.push( { param: 'queryType', value: s_queryType.select_ } );
	    arrayParams_.push( { param: 'rowOffset', value: g_arrayMaster.length } );
	    arrayParams_.push( { param: 'rowLimit',  value: g_svcVals.nbrRowsReq_ } );
	    stc_sendService( parent, loadMessage_, s_action.alyzStreamList_, arrayParams_, returnList, testStreamResultSelect_, $( "#_tooltip" ), null );
    }//g_arrayMaster valid
  }//getList

  // RETURN LIST.
  function returnList( data_, status_ ) {
    if ( stc_isDefined( data_ ) && stc_isDefined( status_ ) ) {
	    if ( status_ == s_svcVals.success_ ) {
	      if ( stc_isDefined( data_.streamList ) && stc_isDefined( data_.viewNameList ) ) {
		      // Set page index. Stores start position for table list.
		      // If user retrieved replacement rows, index is 0 (and master array is empty at this point).
		      // If user retrieved more rows, index is current length of master array.
		      g_index = g_arrayMaster.length;

          // Create/update master array.
	        g_arrayMaster = $.merge( g_arrayMaster, data_.streamList );

          // Create viewName array.
          g_arrayViewNames = $.merge( g_arrayViewNames, data_.viewNameList );

          // Create list.
          createList();
	      }//streamList_ viewNameList_ valid
	    }//status is success
    }//data_ status_ valid
  }//returnList

  // PAGE LIST.
  function pageList( pageDirection_ ) {
    if ( stc_isDefined( g_arrayMaster ) && stc_isDefined( pageDirection_ ) ) {
      // Set index from which to start making list rows.
      var newIndex_ = 0;
      switch( pageDirection_ ) {
          case s_svcVals.directionNew_ : break;
          case s_svcVals.directionPrev_: newIndex_ = ( g_index - g_svcVals.nbrRowsReq_ ); break;
          case s_svcVals.directionNext_: newIndex_ = ( g_index + g_svcVals.nbrRowsReq_ ); break;
          default: break;
      }//switch pageDirection_
      if ( newIndex_ < 0 ) { newIndex_ = 0; }

     // Create list.
      if ( stc_isNumber( newIndex_ ) ) {
        if ( newIndex_ >= 0 ) {
	        if ( stc_isDefined( g_arrayMaster[newIndex_] ) ) {
	          // Set new index.
	          g_index = newIndex_;

	          // Create list.
	          createList();

	          // Hide load tooltip.
	          stc_hideTooltip( $( "#_tooltip" ) );
	        }//entry valid
        }//newIndex_ not lt 0
      }//newIndex_ valid
    }//g_arrayMaster pageDirection_ valid
  }//pageList

  // INIT LIST.
  function initList() {
    if ( stc_isDefined( $( "#_listStreamAnalysis" ) ) ) {
      // Set list title to match filter type.
      $( "#_listTitle" ).html( "Select statements" );

	    // Delete all list rows.
	    $( "#_listStreamAnalysis" ).empty();

	    // Hide buttons.
	    hidePageButtons();

	    // Add header row.
      var row_ = "<tr>" +
                 "<th width='40px'>Rank</th>" +
                 "<th>Query</th>" +
                 "<th width='45px'>Count</th>" +
                 "<th width='100px'>Avg query time</th>" +
                 "<th width='250px'>Stream info</th>" +
                 "<tr>";
      $( "#_listStreamAnalysis" ).append( row_ );
    }//_listStreamAnalysis valid
  }//initList

  // CREATE LIST.
  function createList() {
    // Set error flag.
    var error_ = true;

    // Init row ID.
    var rowID_ = "";

    // Create list.
    if ( stc_isDefined( g_arrayMaster ) && stc_isDefined( $( "#_listStreamAnalysis" ) ) && stc_isNumber( g_index ) ) {
      if ( g_arrayMaster.length > 0 ) {
        // Init list.
        initList();

        // Create rows.
        var length_     = g_arrayMaster.length;
        var iterations_ = 1;
        for ( var i = g_index; i < length_; i++ ) {
          if ( stc_isDefined( g_arrayMaster[i].id ) &&
               stc_isDefined( g_arrayMaster[i].rank ) &&
               stc_isDefined( g_arrayMaster[i].count ) &&
               stc_isDefined( g_arrayMaster[i].avgQueryTimeBefore ) &&
               stc_isDefined( g_arrayMaster[i].avgQueryTimeAfter ) &&
               stc_isDefined( g_arrayMaster[i].streamInfo ) &&
               stc_isDefined( g_arrayMaster[i].viewName ) &&
               stc_isDefined( g_arrayMaster[i].query ) ) {

            // If we have exceeded number of requested rows, break.
            if ( iterations_ > ( g_svcVals.nbrRowsReq_ ) ) {
              break;
            } else {
              // Get row values.
              var id_         = g_arrayMaster[i].id;
              var rank_       = parseInt( g_arrayMaster[i].rank );
              var count_      = parseInt( g_arrayMaster[i].count );
              var streamInfo_ = g_arrayMaster[i].streamInfo;
              var viewName_   = g_arrayMaster[i].viewName;
              var query_      = g_arrayMaster[i].query;

	            var avgQueryTimeBefore_ = g_arrayMaster[i].avgQueryTimeBefore;
	            if ( avgQueryTimeBefore_ != "" ) { avgQueryTimeBefore_ = parseFloat( g_arrayMaster[i].avgQueryTimeBefore ); }

	            var avgQueryTimeAfter_  = g_arrayMaster[i].avgQueryTimeAfter;
	            if ( avgQueryTimeAfter_ != "" ) { avgQueryTimeAfter_ = parseFloat( g_arrayMaster[i].avgQueryTimeAfter ); }

              // Set row ID.
              rowID_ = stc_getIdentifier( id_, s_strRow );

              // Build avg query time.
              var cellAvgQueryTime_ = "<td>" + avgQueryTimeBefore_ + "</td>";
              if ( streamInfo_ == s_svcVals.complete_ && stc_isNumber( avgQueryTimeAfter_ ) ) {
                cellAvgQueryTime_ = "<td>" +
							  						        "<table cellspacing='0' cellpadding='0'>" +
								  					        "<tr>" +
								  					        "<td style='text-align: right;'>Before:</td>" +
								  					        "<td>" + avgQueryTimeBefore_ + "</td>" +
								  					        "</tr>" +
								  					        "<tr>" +
								  					        "<td style='text-align: right;'>After:</td>" +
								  					        "<td>" + avgQueryTimeAfter_ + "</td>" +
								  					        "</tr>" +
									  				        "</table>" +
									  				        "</td>";
              }//complete and avgQueryTimeAfter_ is number

              // Create stream info.

              // Default - for non-compatible streams.
              var cellStreamInfo_ = "<td>" + g_uiStr.tipStreamNotCompatible_ + "</td>";

              // For complete streams.
              if ( streamInfo_ == s_svcVals.complete_ ) {
                cellStreamInfo_ = "<td>" +
							  						       "<table cellspacing='0' cellpadding='0'>" +
								  					       "<tr>" +
								  					       "<td>" + g_uiStr.tipStreamComplete_ + "</td>" +
								  					       "</tr>" +
								  					       "<tr>" +
								  					       "<td>View name: " + viewName_ + "</td>" +
								  					       "</tr>" +
									  				       "</table>" +
									  				       "</td>";
              }//complete

              // For compatible streams.
              if ( streamInfo_ == "true" || streamInfo_ == s_svcVals.selected_ ) {
                // Build IDs for fields.
                var inputID_    = stc_getIdentifier( id_, s_strInput );
                var checkboxID_ = stc_getIdentifier( id_, s_strCheckbox );

                // Build checkbox.
                var checkbox_ = "<input class='checkboxCreateStream' type='checkbox' id='" + checkboxID_ + "' name='" + id_ + "'>Create stream/view";
                if ( streamInfo_ == s_svcVals.selected_ ) {
                  checkbox_ = "<input class='checkboxCreateStream' type='checkbox' id='" + checkboxID_ + "' name='" + id_ + "' checked>Create stream/view";
                }//checked

                // Build input field value.
                var inputFieldValue_ = "";
                if ( viewName_ != "" ) { inputFieldValue_ = viewName_; }

                // Build cell.
                cellStreamInfo_ = "<td>" +
							  						      "<table cellspacing='0' cellpadding='0'>" +
								  					      "<tr>" +
								  					      "<td><img src='img/iconOK.png' style='vertical-align: middle;' /></td>" +
								  					      "<td>" + g_uiStr.tipStreamCompatible_ + "</td>" +
								  					      "<td>" +
								  					      "</tr>" +
								  					      "<tr>" +
								  					      "<td></td>" +
									  				      "<td>" + checkbox_ + "</td>" +
									  				      "</tr>" +
								  					      "<tr>" +
								  					      "<td></td>" +
								  					      "<td>" +
									  				      "<span>* View name: </span>" +
									  				      "<input id='" + inputID_ + "' name='" + id_ + "' class='inputViewName inputSmall bgNearWhiteBorderedGray' style='width: 80px;' type='text' title='" + g_uiStr.tipStreamName_ + "' value='" + inputFieldValue_ + "' />" +
									  				      "</td>" +
									  				      "</tr>" +
									  				      "</table>" +
									  				      "</td>";
              }//streamInfo_ true and matches selected

              // Set class name.
              var className_ = "rowStream";
              if ( streamInfo_ == s_svcVals.complete_ ) { className_ = "rowStream bgHighlight"; }

              // Create row and add to table.
              // To store unchanged ID in row, assign it to name attribute, which does not have to be unique.
              var row_ = "<tr id='" + rowID_ + "' name='" + id_ + "' class='" + className_ + "'>" +
                         "<td>" + rank_ + "</td>" +
                         "<td>" + query_ + "</td>" +
                         "<td>" + count_ + "</td>" +
                         cellAvgQueryTime_ +
                         cellStreamInfo_ +
                         "<tr>";
              $( "#_listStreamAnalysis" ).append( row_ );

			        // Set error to false.
			        error_ = false;

              // Increment iterations.
              iterations_++;
            }//iterations_ not gt g_svcVals.nbrRowsReq_
          }//parameters valid
        }//for each entry

        // Assign events for list.
        $( ".checkboxCreateStream" ).on ( "change", function( event ) { handleCheckbox( event, "change" ); });
        $( ".inputViewName" ).on        ( "focus", function( event )  { handleViewName( event, "focus" ); });
        $( ".inputViewName" ).on        ( "input", function( event )  { handleViewName( event, "input" ); });
        $( ".inputViewName" ).on        ( "blur", function( event )   { handleViewName( event, "blur" ); });

        // Show previous button if there are previous rows.
        if ( g_index > 0 ) {
          $( "#_iconPrev" ).css( "visibility", "visible" );
        }//g_index gt 0

        // Show next button.
        $( "#_iconNext" ).css( "visibility", "visible" );
      }//g_arrayMaster not empty
    }//parameters valid

    // If no data, add no-data row.
    if ( error_ ) {
      $( "#_listStreamAnalysis" ).append( "<tr>" + "<td>" + s_message.noMoreRows_ + "</td>" + "<tr>" );
    }//error_ true
  }//createList

  // HIDE PAGE BUTTONS.
  function hidePageButtons() {
    $( "#_iconPrev" ).css( "visibility", "hidden" );
    $( "#_iconNext" ).css( "visibility", "hidden" );
  }//hidePageButtons

  // ============================================================================
  // STREAM FORM.
  // ============================================================================

  // HANDLE VIEW NAME.
  function handleViewName( event, action_ ) {
    if ( stc_isDefined( event.target.id ) && stc_isDefined( action_ ) ) {
	    // Get input field.
	    var inputField_ = $( "#" + event.target.id );

	    // Init error flag.
	    var error_ = false;
	    g_error    = false;

	    // Handle event.
	    if ( stc_isDefined( inputField_ ) ) {
		    // Get ID and input value.
		    var id_       = inputField_.attr( "name" );
		    var viewName_ = inputField_.val();

		    // Handle event according to specified action.
		    if ( stc_isDefined( id_ ) && stc_isDefined( viewName_ ) ) {

		      switch( action_ ) {

		        case "focus":

					    // Store original viewName.
					    g_viewNameOriginal = viewName_;

					    // If viewName empty - insert default viewName, auto-select checkbox, update master.
					    if ( viewName_ == "" ) {
					      // Create default viewName.
					      var viewName_ = createDefaultViewName();

						    // Store original viewName.
						    g_viewNameOriginal = viewName_;

					      // Update viewNames.
					      updateViewNames( viewName_ );

					      // Insert default viewName into input field.
					      $( inputField_ ).val( viewName_ );

						    // Update master.
						    updateMaster( id_, s_strInput, inputField_, viewName_ );

						    // Auto-select checkbox and update master.
						    if ( viewName_ != "" ) {
					        autoSelectCheckbox( id_ );
						    }//viewName_ not empty
					    }//empty

		        break;

		        case "input":

					    // Update master.
					    updateMaster( id_, s_strInput, inputField_, viewName_ );

					    // Auto-select checkbox and update master.
					    if ( viewName_ != "" ) {
				        autoSelectCheckbox( id_ );
					    }//viewName_ not empty

		        break;

		        case "blur":

		          // Perform final validation and update.

		          // Handle changed viewName.
		          if ( g_viewNameOriginal != viewName_ ) {
		            // Remove original viewName from list.
		            removeViewName( g_viewNameOriginal );

		            // Update viewNames. Returns flag indicating whether user entered duplicate viewName.
		            var viewNameValid_ = updateViewNames( viewName_ );

		            // If user entered duplicate viewName, handle error.
		            if ( !viewNameValid_ && viewName_ != "" ) {
			            // Wipe out corresponding input field.
			            inputField_.val( "" );

			            // Update master.
			            updateMaster( id_, s_strInput, inputField_, "" );

			            // Populate error log.
			            parent.populateLog( viewName_ + " " + g_uiStr.erDupeStreamName_, s_svcVals.error_ );

			            // Set error flag.
			            error_  = true;
			            g_error = true;
		            }//not viewNameValid_
		          }//g_viewNameOriginal not same as viewName_

		          // Handle empty viewName.
		          if ( viewName_ == "" ) {
		            // Populate error log.
		            parent.populateLog( g_uiStr.erEmptyStreamName_, s_svcVals.error_ );

		            // Set error flag.
		            error_  = true;
		            g_error = true;
		          }//viewName_ empty

		          // Set field border and title.
		          if ( error_ ) {
		            inputField_.removeClass( "bgNearWhiteBorderedGray" ).addClass( "bgError" );
		            inputField_.attr( "title", g_uiStr.erEmptyStreamName_ );
		          } else {
		            inputField_.removeClass( "bgError" ).addClass( "bgNearWhiteBorderedGray" );
		            inputField_.attr( "title", g_uiStr.tipStreamName_ );
		          }//not error_

		        break;

		        default: break;
		      }//switch action_

		    }//id_ viewName_ valid
	    }//inputField_ valid
    }//params valid
  }//handleViewName

  // CREATE DEFAULT VIEW NAME.
  function createDefaultViewName() {
    // Create viewName for return.
    var viewName_ = "";

    // Get unique number for creating default viewName.
    var nbrStr_ = stc_getDefaultNumber( parent, g_arrayViewNames, "viewName", s_strViewName, 4, 9999, "0" );

    // Create default viewName.
    viewName_ = s_strViewName + nbrStr_;

    // Return viewName.
    return viewName_;
  }//createDefaultViewName

  // HANDLE CHECKBOX.
  function handleCheckbox( event, action_ ) {
    if ( stc_isDefined( event.target.id ) && stc_isDefined( action_ ) ) {
	    // Get checkbox.
	    var checkbox_ = $( "#" + event.target.id );

	    // Handle event.
	    if ( stc_isDefined( checkbox_ ) ) {
		    // Get ID.
		    var id_ = checkbox_.attr( "name" );

		    // Handle event according to specified action.
		    if ( stc_isDefined( id_ ) ) {
		      switch( action_ ) {

		        case "change":

				    // Update master.
				    updateMaster( id_, s_strCheckbox, checkbox_, null );

				    // Set up processing vars.
				    var inputID_    = "";
				    var inputField_ = null;
				    var viewName_   = "";

				    // If checkbox selected, insert default value into corresponding input field.
				    // If checkbox unselected, wipe out input field.
			      inputID_ = stc_getIdentifier( id_, s_strInput );
			      if ( stc_isDefined( $( "#" + inputID_ ) ) ) {
			        inputField_ = $( "#" + inputID_ );
			        if ( inputField_ ) {
			          if ( $( checkbox_ ).is( ":checked" ) ) {
						      // Create default viewName.
						      viewName_ = createDefaultViewName();

						      // Update viewNames.
					        updateViewNames( viewName_ );

					        // Insert viewName into corresponding input field.
					        inputField_.val( viewName_ );

			            // Update master.
			            updateMaster( id_, s_strInput, inputField_, viewName_ );
			          } else {
			            // Remove input field value from viewNames list.
			            removeViewName( inputField_.val() );

			            // Wipe out corresponding input field.
			            inputField_.val( "" );

			            // Update master.
			            updateMaster( id_, s_strInput, inputField_, "" );

		              // Set field border and title.
		              inputField_.removeClass( "bgError" ).addClass( "bgNearWhiteBorderedGray" );
		              inputField_.attr( "title", g_uiStr.tipStreamName_ );
			          }//unchecked
			        }//inputField_ valid
			      }//input field valid

		        break;

		        default: break;
		      }//switch action_
		    }//id_ valid
	    }//checkbox_ valid
    }//params valid
  }//handleCheckbox

  // AUTO SELECT CHECKBOX.
  function autoSelectCheckbox( id_ ) {
    if ( stc_isDefined( id_ ) ) {
      var checkboxID_ = stc_getIdentifier( id_, s_strCheckbox );
      if ( stc_isDefined( $( "#" + checkboxID_ ) ) ) {
        // Select check box.
        $( "#" + checkboxID_ ).prop( "checked", true );

        // Update master.
        updateMaster( id_, s_strCheckbox, $( "#" + checkboxID_ ), null );
      }//checkbox valid
    }//id_ valid
  }//autoSelectCheckbox

  // UPDATE MASTER.
  function updateMaster( id_, strField_, inputField_, val_ ) {
    if ( stc_isDefined( id_ ) && stc_isDefined( strField_ ) ) {
	    if ( stc_isDefined( g_arrayMaster ) ) {
	      var length_ = g_arrayMaster.length;
	      for ( var i = 0; i < length_; i++ ) {
	        if ( stc_isDefined( g_arrayMaster[i].id ) ) {
	          if ( id_ == g_arrayMaster[i].id ) {

				      switch( strField_ ) {

				        case s_strInput:
							    if ( stc_isDefined( inputField_ ) && stc_isDefined( val_ ) ) {
						        // Filter out special charcters.
						        val_ = val_.replace(/[^\w\s]/gi, '');
						        inputField_.val( val_ );

							      // Update master.
							      g_arrayMaster[i].viewName = val_;
							    }//inputField_ val_ valid
				        break;

				        case s_strCheckbox:
			            if ( stc_isDefined( inputField_ ) ) {
				            if ( inputField_.is( ":checked" ) ) {
				              g_arrayMaster[i].streamInfo = s_svcVals.selected_;
				            } else {
				              g_arrayMaster[i].streamInfo = "true";
				            }//unchecked
			            }//inputField valid
				        break;

				        default: break;
				      }//switch strField_

	            break;
	          }//match
	        }//idCurrent_ valid
	      }//for each entry
	    }//g_arrayMaster valid
    }//params valid
  }//updateMaster

  // UPDATE VIEW NAMES.
  function updateViewNames( viewName_ ) {
    var viewNameValid_ = false;
    if ( stc_isDefined( viewName_ ) ) {
      // Find out if viewName is already in list.
      var viewNameExists_ = checkDuplicateViewName( viewName_ );

	    // If viewName not already in list, add it to list.
	    if ( !viewNameExists_ && viewName_ != "" ) {
		    var obj_      = new Object();
		    obj_.viewName = viewName_;
		    g_arrayViewNames.push( obj_ );
		    viewNameValid_ = true;
	    }//not in list
    }//viewName_ valid
    return viewNameValid_;
  }//updateViewNames

  // CHECK DUPICATE VIEW NAME.
  function checkDuplicateViewName( viewName_ ) {
    var viewNameExists_ = false;
    if ( stc_isDefined( viewName_ ) ) {
	    if ( stc_isDefined( g_arrayViewNames ) ) {
	      var length_ = g_arrayViewNames.length;
	      for ( var i = 0; i < length_; i++ ) {
	        if ( stc_isDefined( g_arrayViewNames[i].viewName ) ) {
	          if ( viewName_ == g_arrayViewNames[i].viewName ) {
	            viewNameExists_ = true;
	          }//match
	        }//viewName valid
	      }//for each entry
	    }//g_arrayViewNames valid
    }//viewName_ valid
    return viewNameExists_;
  }//checkDuplicateViewName

  // REMOVE VIEW NAME.
  function removeViewName( viewName_ ) {
    if ( stc_isDefined( viewName_ ) ) {
	    if ( stc_isDefined( g_arrayViewNames ) ) {
        var arrayWork_ = new Array();
	      var length_    = g_arrayViewNames.length;
	      for ( var i = 0; i < length_; i++ ) {
	        if ( stc_isDefined( g_arrayViewNames[i].viewName ) ) {
	          if ( viewName_ != g_arrayViewNames[i].viewName ) {
	            arrayWork_.push( g_arrayViewNames[i] );
	          }//not match
	        }//viewName valid
	      }//for each entry
	    }//g_arrayViewNames valid
	    g_arrayViewNames = new Array();
	    g_arrayViewNames = $.merge( g_arrayViewNames, arrayWork_ );
    }//viewName_ valid
  }//removeViewName

  // ============================================================================
  // STREAM SERVICES.
  // ============================================================================

  // DO SUBMIT STREAMS.
	function doSubmitStreams() {
		// Use timer to call actual submit function.
		// Gives time for last events to finish.
		t_timerUpdate = setTimeout( "submitStreams()", 200 );
  }//doSubmitStreams

  // SUBMIT STREAMS.
  function submitStreams() {
	  // Clear timer.
	  clearTimeout( t_timerUpdate );

	  // If there are no errors in fields, validate and send service.
	  // If there are errors, do not send message to log.
	  // If errors exist, message log is already performing error animation.
	  // Additional error message will overload log animation.
	  if ( !g_error ) {
		  // Validate streams.
		  var requestValid_ = validateStreams();

	    // If streams have no errors, send service.
	    if ( requestValid_ ) {
	      sendStreamRequest();
	    }//requestValid_ true
	  }//g_error false
  }//submitStreams

  // VALIDATE STREAMS.
  function validateStreams() {
    // Check for and show log if any errors.
    // Set up processing vars.
    var requestValid_      = true;
    var checkDuplicateStr_ = "";
    var uniqueCount_       = 0;
    var submitCount_       = 0;
    var errorCount_        = 0;
    var errorString_       = "";

    // Loop thru master array and find any entries that have: viewName but not selected, selected but no viewName.
    if ( stc_isDefined( g_arrayMaster ) ) {
      var length_ = g_arrayMaster.length;
      for ( var i = 0; i < length_; i++ ) {
        // Get properties.
        var viewName_   = g_arrayMaster[i].viewName;
        var rank_       = g_arrayMaster[i].rank;
        var streamInfo_ = g_arrayMaster[i].streamInfo;

        // Add viewName to checkDuplicateStr_. We will use string later to
        // determine whether streams contain any duplicate viewNames.
        if ( checkDuplicateStr_.indexOf( viewName_ ) < 0 ) {
          checkDuplicateStr_ = checkDuplicateStr_ + " " + viewName_;
          uniqueCount_++;
        }//not found

        // If viewName not empty or if selected, check for errors.
        if ( stc_isDefined( viewName_ ) && stc_isDefined( rank_ ) && stc_isDefined( streamInfo_ ) ) {
          var error_ = false;
          if ( viewName_ != "" || streamInfo_ == s_svcVals.selected_ ) {
            // Set error flag if error found.
            if ( viewName_ != "" && streamInfo_ == "true" )              { error_ = true; }
            if ( viewName_ == "" && streamInfo_ == s_svcVals.selected_ ) { error_ = true; }

					  // If error flag is true, build error string.
					  if ( error_ ) {
			        if ( errorCount_ > 0 ) {
			          errorString_ = errorString_ + " , Rank: " + rank_;
			        } else {
			          errorString_ = errorString_ + " Rank: " + rank_;
			        }//count not gt 0

			        // Increment error count.
			        errorCount_++;
					  }//error_ true

					  // Count valid submissions.
					  if ( viewName_ != "" && streamInfo_ == s_svcVals.selected_ ) { submitCount_++; }
          }//viewName_ not empty or streamInfo_ selected
        }//properties valid
      }//for each entry
    }//g_arrayMaster valid

    // Add header to error string.
    if ( errorCount_ > 0 ) {
      errorString_ = g_uiStr.erEmptyRequest_ + "<br>" + errorString_;
    }//count gt 0

    // Check for duplicates.
    if ( g_arrayViewNames.length > uniqueCount_ ) {
	    if ( errorCount_ > 0 ) {
	      errorString_ = errorString_ + "<br><br>" + g_uiStr.erDupeRequest_;
	    } else {
	      errorString_ = g_uiStr.erDupeRequest_;
	    }//count gt 0
      errorCount_++;
    }//g_arrayViewNames.length gt uniqueCount_

    // If any errors, populate log.
    if ( errorCount_ > 0 ) {
      parent.populateLog( errorString_, s_svcVals.error_ );
    } else if ( submitCount_ == 0 ) {
      parent.populateLog( g_uiStr.erNoEntries_, s_svcVals.error_ );
    }//no submissions

    // If streams have errors, set flag to false.
    if ( errorCount_ > 0 || submitCount_ == 0 ) {
      requestValid_ = false;
    }//errorCount_ gt 0 or submitCount_ is 0

    // Return flag.
    return requestValid_;
  }//validateStreams

  // SEND STREAM REQUEST.
  function sendStreamRequest() {
    if ( stc_isDefined( g_arrayMaster ) ) {
      if ( g_arrayMaster.length > 0 ) {
	      // Send service.
		    var loadMessage_ = s_message.loading_ + " " + s_action.alyzStreamRequest_;
		    var arrayParams_ = new Array();
		    arrayParams_.push( { param: 'arrayStream',    value: g_arrayMaster } );
		    arrayParams_.push( { param: 'arrayViewNames', value: g_arrayViewNames } );
		    stc_sendService( parent, loadMessage_, s_action.alyzStreamRequest_, arrayParams_, returnStreamRequest, resultStreamRequest_, $( "#_tooltip" ), null );
      }//parameters not empty
    }//parameters valid
  }//sendStreamRequest

  // RETURN STREAM REQUEST.
  function returnStreamRequest( data_, status_ ) {
    if ( stc_isDefined( data_ ) && stc_isDefined( status_ ) ) {
	    if ( status_ == s_svcVals.success_ ) {
		    if ( stc_isDefined( data_.message ) ) {
		      // Populate message log.
		      parent.populateLog( g_uiStr.successMessageResult_ + " " + data_.message + " for " + g_uiStr.successCreatingStreams_, s_svcVals.success_ );

		      // Send refresh service.
		      handleListRequest( true, s_svcVals.directionNew_ );
		    }//message valid
	    }//status is success
    }//data_ status_ valid
  }//returnStreamRequest











