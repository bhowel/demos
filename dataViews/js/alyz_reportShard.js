
  // ============================================================================
	// REPORT SHARD.
  // Requires static.js.
  // ============================================================================

	// ON DOC READY
	$( document ).ready( function() {

    // Create basic contents.
    createBasicContents();

	})// ON DOC READY

  // ============================================================================
  // GLOBAL VARS.
  // ============================================================================

  // Index page ref.
  var g_indexPageRef = "";

  // Data array for services.
  var g_arrayMaster = new Array();

  // ID unique number.
  var g_idNumber = 0;

  // Services vals.
  var g_queryType_ = s_queryType.select_;

  var g_svcVals = {
    nbrRowsReq_ : 16 };

  // Paging vars.
  var g_pageDirection = s_svcVals.directionNew_;
  var g_index         = 0;

  // Text strings.
  var g_uiStr = {
    titleListSelect_ : "Select statements",
    titleListInsert_ : "Insert statements",
    titleListUpdate_ : "Update statements",
    titleListDelete_ : "Delete statements",
    titleListOther_  : "Other statements"
  };

  // ============================================================================
  // BASIC CONTENT.
  // ============================================================================

  // CREATE BASIC CONTENTS.
  function createBasicContents() {

    // EVENT HANDLERS.

    // Icon images.
    $( ".icon" ).on             ( "mouseover", function( event ) { $( this ).css( "opacity", "0.5" ); });
    $( ".icon" ).on             ( "mouseout", function( event )  { $( this ).css( "opacity", "1" ); });

    // Query filter.
    $( "#_queryTypeSelect" ).on ( "click", function( event )     { g_queryType_ = s_queryType.select_; handleListRequest( true, s_svcVals.directionNew_ ); });
    $( "#_queryTypeInsert" ).on ( "click", function( event )     { g_queryType_ = s_queryType.insert_; handleListRequest( true, s_svcVals.directionNew_ ); });
    $( "#_queryTypeUpdate" ).on ( "click", function( event )     { g_queryType_ = s_queryType.update_; handleListRequest( true, s_svcVals.directionNew_ ); });
    $( "#_queryTypeDelete" ).on ( "click", function( event )     { g_queryType_ = s_queryType.delete_; handleListRequest( true, s_svcVals.directionNew_ ); });
    $( "#_queryTypeOther" ).on  ( "click", function( event )     { g_queryType_ = s_queryType.other_;  handleListRequest( true, s_svcVals.directionNew_ ); });

    // List controls.
    $( "#_iconPrev" ).on        ( "click", function( event )     { handleListRequest( false, s_svcVals.directionPrev_ ); });
    $( "#_iconNext" ).on        ( "click", function( event )     { handleListRequest( false, s_svcVals.directionNext_ ); });

    // Init fields.
    stc_initTestField();
    stc_clearTooltip( $( "#_tooltip" ) );

    // Init ID number, for creating unique IDs.
    g_idNumber = 0;
  }//createBasicContents

  // ============================================================================
  // LIST.
  // ============================================================================

  // DO GET LIST.
  function doGetList( indexPage_ ) {
	  // Store index page ref.
	  g_indexPageRef = indexPage_;

    // Send service request for list. Service callback continues to create content.
    handleListRequest( true, s_svcVals.directionNew_ );
  }//doGetList

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

	    // Init page index and clear out master array.
	    if ( startOver_ ) {
	      g_index       = 0;
	      g_arrayMaster = new Array();
	    }//startOver_ true
    }//parameters valid
  }//setupListRequest

  // GET LIST.
  function getList() {
    if ( stc_isDefined( g_arrayMaster ) && stc_isDefined( g_queryType_ ) ) {
      // TEST Set test result.
      if ( g_indexPageRef.i_isTestMode ) {
	      var testResult_ = "";
	      switch( g_queryType_ ) {
	        case s_queryType.select_: testResult_ = testShardReportResultSelect_; break;
	        case s_queryType.insert_: testResult_ = testShardReportResultInsert_; break;
	        case s_queryType.update_: testResult_ = testShardReportResultUpdate_; break;
	        case s_queryType.delete_: testResult_ = testShardReportResultDelete_; break;
	        case s_queryType.other_ : testResult_ = testShardReportResultOther_; break;
	        default: break;
	      }//switch g_queryType_
      }//is g_indexPageRef.i_isTestMode

      // Send service.
	    var loadMessage_ = s_message.loading_ + " " + s_action.alyzShardList_;
	    var arrayParams_ = new Array();
	    arrayParams_.push( { param: 'queryType', value: g_queryType_ } );
	    arrayParams_.push( { param: 'rowOffset', value: g_arrayMaster.length } );
	    arrayParams_.push( { param: 'rowLimit',  value: g_svcVals.nbrRowsReq_ } );
	    stc_sendService( g_indexPageRef, loadMessage_, s_action.alyzShardList_, arrayParams_, returnList, testResult_, $( "#_tooltip" ), null );
    }//g_arrayMaster g_queryType_ valid
  }//getList

  // RETURN LIST.
  function returnList( data_, status_ ) {
    if ( stc_isDefined( data_ ) && stc_isDefined( status_ ) ) {
	    if ( status_ == s_svcVals.success_ ) {
		    if ( stc_isDefined( data_.shardReportList ) ) {
	        // Create master array.
	        createMasterArray( data_.shardReportList );

	        // Create list.
	        createList();
		    }//shardReportList valid
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

  // CREATE MASTER ARRAY.
  function createMasterArray( arrayList_ ) {
    if ( stc_isDefined( g_arrayMaster ) && stc_isDefined( arrayList_ ) ) {
      // Set page index. Stores start position for table list.
      // If user retrieved replacement rows, index is 0 (and master array is empty at this point).
      // If user retrieved more rows, index is current length of master array.
      g_index = g_arrayMaster.length;

      // Create master array.
      if ( arrayList_.length > 0 ) {
        var obj_    = new Object();
        var length_ = arrayList_.length;
        for ( var i = 0; i < length_; i++ ) {
          // Create object.
          obj_             = new Object();
          obj_.id          = "";
          obj_.rank        = 0;
          obj_.count       = 0;
          obj_.shardAction = "";
          obj_.message     = "";
          obj_.query       = "";

          // Set object properties.
          if ( stc_isDefined( arrayList_[i].rank ) &&
               stc_isDefined( arrayList_[i].count ) &&
               stc_isDefined( arrayList_[i].shardAction ) &&
               stc_isDefined( arrayList_[i].message ) &&
               stc_isDefined( arrayList_[i].query ) ) {

            obj_.id          = s_strListItem + g_idNumber;
            obj_.rank        = parseInt( arrayList_[i].rank );
            obj_.count       = parseInt( arrayList_[i].count );
            obj_.shardAction = arrayList_[i].shardAction;
            obj_.message     = arrayList_[i].message;
            obj_.query       = arrayList_[i].query;
          }//properties valid

          // Add object to master array.
          g_arrayMaster.push( obj_ );

		      // Increment ID number.
		      g_idNumber++;
        }//for each entry
      }//arrayList_ not empty
    }//g_arrayMaster arrayList_ valid
  }//createMasterArray

  // INIT LIST.
  function initList() {
    if ( stc_isDefined( $( "#_listShardReport" ) ) ) {
      // Set list title to match filter type.
      $( "#_listTitle" ).html( "" );
      switch( g_queryType_ ) {
        case s_queryType.select_: $( "#_listTitle" ).html( g_uiStr.titleListSelect_ ); break;
        case s_queryType.insert_: $( "#_listTitle" ).html( g_uiStr.titleListInsert_ ); break;
        case s_queryType.update_: $( "#_listTitle" ).html( g_uiStr.titleListUpdate_ ); break;
        case s_queryType.delete_: $( "#_listTitle" ).html( g_uiStr.titleListDelete_ ); break;
        case s_queryType.other_ : $( "#_listTitle" ).html( g_uiStr.titleListOther_ ); break;
        default: break;
      }//switch g_queryType_

	    // Delete all list rows.
	    $( "#_listShardReport" ).empty();

	    // Hide paging buttons.
	    hidePageButtons();

	    // Add header row.
      var row_ = "<tr>" +
                 "<th width='30px'>Rank</th>" +
                 "<th>Query</th>" +
                 "<th width='40px'>Count</th>" +
                 "<th width='210px'>Shard info</th>" +
                 "<tr>";
      $( "#_listShardReport" ).append( row_ );
    }//_listShardReport valid
  }//initList

  // CREATE LIST.
  function createList() {
    // Set error flag.
    var error_ = true;

    // Init row ID.
    var rowID_ = "";

    // Create list.
    if ( stc_isDefined( g_arrayMaster ) && stc_isDefined( $( "#_listShardReport" ) ) && stc_isNumber( g_index ) ) {
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
               stc_isDefined( g_arrayMaster[i].shardAction ) &&
               stc_isDefined( g_arrayMaster[i].message ) &&
               stc_isDefined( g_arrayMaster[i].query ) ) {

            // If we have exceeded number of requested rows, break.
            if ( iterations_ > ( g_svcVals.nbrRowsReq_ ) ) {
              break;
            } else {
              // Get row values.
              var id_          = g_arrayMaster[i].id;
              var rank_        = g_arrayMaster[i].rank;
              var count_       = g_arrayMaster[i].count;
              var shardAction_ = g_arrayMaster[i].shardAction;
              var message_     = g_arrayMaster[i].message;
              var query_       = g_arrayMaster[i].query;

              // Set row ID.
              rowID_ = stc_getIdentifier( id_, s_strRow );

              // Create shard image and string.
              var imgShard_ = "<img src='img/iconSAError.png' style='height: 30px; width: 30px; vertical-align: middle;' />";
              var strShard_ = shardAction_;
				      switch( shardAction_ ) {

			          case s_shardVals.actionShardRead_:
			            imgShard_ = "<img src='img/iconSAGreenRead.png' style='height: 30px; width: 30px; vertical-align: middle;' />";
			          break;

			          case s_shardVals.actionShardWrite_:
			            imgShard_ = "<img src='img/iconSAGreenWrite.png' style='height: 30px; width: 30px; vertical-align: middle;' />";
			          break;

			          case s_shardVals.actionGlobalRead_:
			            imgShard_ = "<img src='img/iconSAPurpleRead.png' style='height: 30px; width: 30px; vertical-align: middle;' />";
			          break;

			          case s_shardVals.actionGlobalWrite_:
			            imgShard_ = "<img src='img/iconSAPurpleWrite.png' style='height: 30px; width: 30px; vertical-align: middle;' />";
			          break;

			          case s_shardVals.actionMultiShardUpdate_:
			            imgShard_ = "<img src='img/iconSAOrangeMultiUpdate.png' style='height: 30px; width: 30px; vertical-align: middle;' />";
			          break;

			          case s_shardVals.actionParallel_:
			            imgShard_ = "<img src='img/iconSAOrangeParallel.png' style='height: 30px; width: 30px; vertical-align: middle;' />";
			          break;

			          case s_shardVals.actionError_:
			            imgShard_ = "<img src='img/iconSAError.png' style='height: 30px; width: 30px; vertical-align: middle;' />";
			            strShard_ = message_;
			          break;

			          case s_shardVals.actionNone_:
			            imgShard_ = "<img src='img/iconSAError.png' style='height: 30px; width: 30px; vertical-align: middle;' />";
			            strShard_ = message_;
			          break;

			          default: break;
				      }//switch shardAction_

              // Create shard cell.
              var cellShardInfo_ = "<td>" +
							  						       "<table cellspacing='0' cellpadding='0'>" +
								  					       "<tr>" +
								  					       "<td>" + imgShard_ + "</td>" +
								  					       "<td>" + strShard_ + "</td>" +
								  					       "</tr>" +
									  				       "</table>" +
									  				       "</td>";

              // Create row and add to table.
              // To store unchanged ID in row, assign it to name attribute, which does not have to be unique.
              var row_ = "<tr id='" + rowID_ + "' name='" + id_ + "' class='rowShardReport'>" +
                         "<td>" + rank_ + "</td>" +
                         "<td>" + query_ + "</td>" +
                         "<td>" + count_ + "</td>" +
                         cellShardInfo_ +
                         "<tr>";
              $( "#_listShardReport" ).append( row_ );

			        // Set error to false.
			        error_ = false;

              // Increment iterations.
              iterations_++;
            }//iterations_ not gt g_svcVals.nbrRowsReq_
          }//parameters valid
        }//for each entry

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
      $( "#_listShardReport" ).append( "<tr>" + "<td>" + s_message.noMoreRows_ + "</td>" + "<tr>" );
    }//error_ true
  }//createList

  // HIDE PAGE BUTTONS.
  function hidePageButtons() {
    $( "#_iconPrev" ).css( "visibility", "hidden" );
    $( "#_iconNext" ).css( "visibility", "hidden" );
  }//hidePageButtons





