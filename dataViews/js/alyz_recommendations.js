
  // ============================================================================
	// RECOMMENDATIONS.
  // Requires static.js.
  // ============================================================================

	// ON DOC READY
	$( document ).ready( function() {

	  // Load module/view.
	  parent.loadModule( s_module._1_, s_module1._0_ );

    // Create basic contents.
    createBasicContents();

    // Send service request for list. Service callback continues to create content.
    getList();

	})// ON DOC READY

  // ============================================================================
  // GLOBAL VARS.
  // ============================================================================

  // Data array for services.
  var g_arrayMaster = new Array();

  // ============================================================================
  // BASIC CONTENT.
  // ============================================================================

  // CREATE BASIC CONTENTS.
  function createBasicContents() {

    // EVENT HANDLERS.

    // Icon images.
    $( ".icon" ).on ( "mouseover", function( event ) { $( this ).css( "opacity", "0.5" ); });
    $( ".icon" ).on ( "mouseout", function( event )  { $( this ).css( "opacity", "1" ); });


    // CONTENTS.

    // Init fields.
    stc_initTestField();
    stc_clearTooltip( $( "#_tooltip" ) );
    g_arrayMaster = new Array();

    // Hide load tooltip.
    parent.hideLoadTooltip();
  }//createBasicContents

  // ============================================================================
  // LIST.
  // ============================================================================

  // GET LIST.
  function getList() {
    // Send service.
    var loadMessage_ = s_message.loading_ + " " + s_action.alyzRecommend_;
    var arrayParams_ = new Array();
    stc_sendService( parent, loadMessage_, s_action.alyzRecommend_, arrayParams_, returnList, testRecommendationsResult_, $( "#_tooltip" ), null );
  }//getList

  // RETURN LIST.
  function returnList( data_, status_ ) {
    if ( stc_isDefined( data_ ) && stc_isDefined( status_ ) ) {
	    if ( status_ == s_svcVals.success_ ) {
		    if ( stc_isDefined( data_.recommendationsList ) ) {
	        // Create master array.
	        g_arrayMaster = new Array();
	        g_arrayMaster = $.merge( g_arrayMaster, data_.recommendationsList );

	        // Create list.
	        createList();
		    }//recommendationsList valid
	    }//status is success
    }//data_ status_ valid
  }//returnList

  // INIT LIST.
  function initList() {
    if ( stc_isDefined( $( "#_listRecommendations" ) ) ) {
	    // Delete all list rows.
	    $( "#_listRecommendations" ).empty();
    }//_listRecommendations valid
  }//initList

  // CREATE LIST.
  function createList() {
    // Set error flag.
    var error_ = true;

    // Create list.
    if ( stc_isDefined( g_arrayMaster ) && stc_isDefined( $( "#_listRecommendations" ) ) ) {
      if ( g_arrayMaster.length > 0 ) {
        // Init list.
        initList();

        // Create rows.
        var length_ = g_arrayMaster.length;
        for ( var i = 0; i < length_; i++ ) {
          if ( stc_isDefined( g_arrayMaster[i].title ) &&
               stc_isDefined( g_arrayMaster[i].text0 ) &&
               stc_isDefined( g_arrayMaster[i].list ) &&
               stc_isDefined( g_arrayMaster[i].text1 ) ) {

            // Get row values.
            var title_ = g_arrayMaster[i].title;
            var text0_ = g_arrayMaster[i].text0;
            var list_  = g_arrayMaster[i].list;
            var text1_ = g_arrayMaster[i].text1;

            // Build title and text.
            var strTitle_ = "<h3>" + title_ + "</h3>";
            var strText0_ = "<p>" + text0_ + "</p>";
            var strText1_ = "<p>" + text1_ + "</p>";

            // Build list.
            var listTable_ = "";
            if ( list_.length > 0 ) {
             var listLength_ = list_.length;
             var listItems_  = "";
             for ( var j = 0; j < listLength_; j++ ) {
               listItems_ = listItems_ + "<tr><td>" + list_[j] + "</td></tr>";
             }//for each entry
             listTable_ = "<table cellspacing='0' cellpadding='0'>" + listItems_ + "</table>";
            }//length gt 0

            // Create row and add to table.
            var row_ = "<tr class='rowRecommendations'>" +
                       "<td>" + strTitle_ + strText0_ + listTable_ + strText1_ + "</td>" +
                       "<tr>";
            $( "#_listRecommendations" ).append( row_ );

		        // Set error to false.
		        error_ = false;
          }//parameters valid
        }//for each entry
      }//g_arrayMaster not empty
    }//parameters valid

    // If no data, add no-data row.
    if ( error_ ) {
      $( "#_listRecommendations" ).append( "<tr>" + "<td>" + s_message.noMoreRows_ + "</td>" + "<tr>" );
    }//error_ true
  }//createList
