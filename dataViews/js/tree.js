
  // ============================================================================
  // TREE.
  // Requires static.js, jquery-ui.js.
  // Uses prefix t_ for vars, tree_ for functions.
  // ============================================================================

	// ============================================================================
	// GLOBAL VARS.
	// ============================================================================

  // Window key down events.
  var t_SHIFTDown = false;

  // Index page ref.
  var t_indexPageRef = "";

  // Editable flag.
  var t_editable = false;

  // Flat file flag.
  var t_flatFile = false;

  // Data arrays.
  var t_treeMaster        = new Array();
  var t_treeMasterStore   = new Array();
  var t_treeMasterFlat    = new Array();
  var t_roots             = new Array();
  var t_physicalShards    = new Array();
  var t_treeSelections    = new Array();
  var t_treeRowSelections = new Array();
  var t_allTableNames     = new Array();

  // Load vars.
  var t_loadRowID          = "";
  var t_loadMainID         = "";
  var t_loadMainParentName = "";
  var t_loadMainName       = "";
  var t_loadMiniID         = "";

  // Currently-selected object.
  var t_objectSelected = new Object();
  var t_formParent     = new Object();
  var t_formChild      = new Object();

  // Name of master parent - parent of all shard trees.
  var t_masterParentName = "";

  // Root name string. Used to check for duplicate root names.
  var t_rootNameStr_ = "";

  // Tree elements.
  var t_container  = null;
  var t_tree       = null;
  var t_title      = null;
  var t_list       = null;

  // Tree icons.
  var t_iconTreeClose         = null;
  var t_iconEdit              = null;
  var t_iconRegenerate        = null;
  var t_iconDelete            = null;
  var t_iconAddTreeStatic     = null;
  var t_iconAddTreeRelational = null;

  // Traverse vars.
  var t_nameTraverse           = "";
  var t_parentNameTraverse     = "";
  var t_objectTraverse         = "";
  var t_doTraverse             = false;
  var t_recurseAll             = false;
  var t_startRecurseLevel      = 0;
  var t_nbrRecurseLimit        = 0;
  var t_duplicateShard         = false;
  var t_traverseDuplicateShard = false;
  var t_updateValid            = true;

  // Drag and drop vars.
  var t_sourceID_       = "";
  var t_targetID_       = "";
  var t_timerUpdateJSON = null;
  var t_updateLocation  = "";
  var t_openRoot        = false;
  var t_currentRoot     = "";

  // Helper - element that substitutes for tree row during drag.
  var t_helper               = null;
  var t_createHelperFunction = null;

  // Relation form elements.
  var t_containerRelation = null;
  var t_formRelation      = null;
  var t_titleRelation     = null;
  var t_iconRelationClose = null;

  // Callbacks.
  var t_callbackInitialLoad = null;
  var t_callbackWipeLoad    = null;
  var t_callbackSelection   = null;
  var t_callbackDropPoints  = null;

  // Row colors.
  var t_colorBackground    = s_grayD + ";";
  var t_colorRowSelected   = s_grayA + ";";
  var t_colorRowUnselected = s_grayD + ";";

  // Text.
  var t_charLimit = {
    tree_ : 30,
    fk_   : 45 };

  // Text strings.
  var t_uiStr = {
    tipToggle_            : "Click to show/hide descendants of this element: + to show, - to hide.",
    tipRootName_          : "To edit the name, click inside the box. The name must be unique.\nAllowed characters: letters, numbers, and the underscore(_).\n\nTo show in the main display, click the row outside the box.",
    tipHeatHigh_          : "Table has high heat.",
    tipHeatXHigh_         : "Table has extremely high heat.",
    tipImageUpdate_       : "Click to save changes to name.",
    titleRelationForm_    : "Define Database Connection",
    titleRTreeForm_       : "Relational Shard Root",
    titleSTreeForm_       : "Static Shard Root",
    successChangeLocation_: "The location change was successfully completed.",
    successAddRoot_       : "The new root was successfully added.",
    successDeleteItem_    : "The item was successfully deleted.",
    successRenameRoot_    : "The root was successfully renamed.",
    successRegenerateRoot_: "The root was successfully regenerated.",
    successUpdate_        : "The update was successfully completed.",
    confirmRevert_        : "This action will remove ALL changes you have made in this session. Click OK to proceed.",
    erSameLocation_       : "The action was not completed because the selected item already exists at the chosen location.",
    erSameAsTarget_       : "The action was not completed because the selected item is the same as the chosen target.",
    erOwnHierarchy_       : "The action was not completed because the selected item is being moved to a lower position within its own hierarchy.",
    erEmptyRootName_      : "Please enter a name for the root.",
    erDupeRootName_       : "duplicates another name. Please enter a unique name.",
    erNoMoreShards_       : "Sorry, cannot create the new shard root, because there are no more unassigned physical shards.",
    erDupeOnAnotherShard_ : "Sorry, cannot allow this move. There is another instance of the table you are handling on another shard. Tables can only appear on one shard."
  };

	// ============================================================================
	// TREE.
	// ============================================================================

	// SETUP TREE.
	function tree_setupTree( indexPage_, helper_, containerTree_, handleIDTree_, tree_, list_, titleTree_, titleTextTree_,
	                         iconTreeClose_, iconTreeEdit_, iconRegenerate_, iconDelete_, iconAddTreeStatic_, iconAddTreeRelational_,
	                         containerRelation_, handleIDRelation_, formRelation_, titleRelation_, iconRelationClose_,
	                         isEditable_, isDraggable_, recurseAll_, recurseLimit_, createFlatFile_,
	                         colorBackground_, colorRowSelected_, colorRowUnselected_,
	                         callbackInitialLoad_, callbackWipeLoad_, callbackSelection_, createHelperFunction_, callbackDropPoints_ ) {

	  // REFS/FLAGS.

	  // Store index page ref.
	  t_indexPageRef = indexPage_;

	  // Set editable flag.
	  t_editable = isEditable_;

	  // Set flat file flag.
	  t_flatFile = createFlatFile_;

	  // Set flag for whether we recurse through all descendants during table selection.
	  // Set recurse limit.
	  t_recurseAll      = recurseAll_;
	  t_nbrRecurseLimit = recurseLimit_;

	  // WINDOW EVENTS.

    // Assign window keydown events.
    $( window ).bind( "keydown", function( event ) {
      if ( event.keyCode == 16 ) { t_SHIFTDown = true; }
    });

    $( window ).bind( "keyup", function( event ) {
      if ( event.keyCode == 16 ) { t_SHIFTDown = false; }
    });

    // TREE COMPONENTS.

	  // Init tree components.
	  t_container     = null;
	  t_tree          = null;
	  t_title         = null;
	  t_iconTreeClose = null;
	  t_list          = null;

	  // Store container. Assign draggable event to container.
	  if ( stc_isDefined( containerTree_ ) ) {
	    t_container = containerTree_;
	    if ( stc_isDefined( handleIDTree_ ) && isDraggable_ ) {
	      t_container.draggable( { handle: "#" + handleIDTree_ } );
	    }//handleIDTree_ valid and container is draggable
	  }//containerTree_ valid

	  // Store tree element.
	  if ( stc_isDefined( tree_ ) ) {
	    t_tree = tree_;
	  }//tree_ valid

	  // Store list.
	  if ( stc_isDefined( list_ ) ) {
	    t_list = list_;
	  }//list_ valid

	  // Store and set title.
	  if ( stc_isDefined( titleTree_ ) ) {
	    t_title = titleTree_;
	    t_title.html( titleTextTree_ );
	  }//titleTree_ valid

	  // Store helper vars.
	  t_helper               = helper_;
	  t_createHelperFunction = createHelperFunction_;

	  // Set background color.
	  t_colorBackground = colorBackground_;
	  if ( stc_isDefined( t_container ) ) {
	    t_container.css( "background-color", t_colorBackground );
	  }//t_container valid

	  // Set colors for row selection.
	  t_colorRowSelected   = colorRowSelected_;
	  t_colorRowUnselected = colorRowUnselected_;

	  // TREE ICONS Store and assign events to tree icons.

	  if ( stc_isDefined( iconTreeClose_ ) ) {
	    t_iconTreeClose = iconTreeClose_;
	    t_iconTreeClose.on( "click", function( event ) { tree_closeTree(); });
	  }//iconTreeClose_ valid

	  if ( stc_isDefined( iconTreeEdit_ ) ) {
	    t_iconEdit = iconTreeEdit_;
		  if ( t_editable ) {
			  t_iconEdit.on( "click", function( event ) { tree_doSelectedRelationForm(); });
		  }//t_editable
	  }//iconTreeEdit_ valid

	  if ( stc_isDefined( iconRegenerate_ ) ) {
	    t_iconRegenerate = iconRegenerate_;
		  if ( t_editable ) {
			  t_iconRegenerate.on( "click", function( event ) { tree_regenerateRoot(); });
		  }//t_editable
	  }//iconRegenerate_ valid

	  if ( stc_isDefined( iconDelete_ ) ) {
	    t_iconDelete = iconDelete_;
		  if ( t_editable ) {
			  t_iconDelete.on( "click", function( event ) { tree_deleteItem(); });
		  }//t_editable
	  }//iconDelete_ valid

	  if ( stc_isDefined( iconAddTreeStatic_ ) ) {
	    t_iconAddTreeStatic = iconAddTreeStatic_;
		  if ( t_editable ) {
			    t_iconAddTreeStatic.css( "visibility", "visible" );
			    t_iconAddTreeStatic.on( "click", function( event ) { tree_addRoot( s_tableType.shardTreeStatic_ ) ; });
		  }//t_editable
	  }//iconAddTreeStatic_ valid

	  if ( stc_isDefined( iconAddTreeRelational_ ) ) {
	    t_iconAddTreeRelational = iconAddTreeRelational_;
		  if ( t_editable ) {
			    t_iconAddTreeRelational.css( "visibility", "visible" );
			    t_iconAddTreeRelational.on( "click", function( event ) { tree_addRoot( s_tableType.shardTreeRelational_ ) ; });
		  }//t_editable
	  }//iconAddTreeRelational_ valid

	  // RELATION FORM COMPONENTS.

	  // Init relation components.
	  t_containerRelation = null;
	  t_formRelation      = null;
	  t_titleRelation     = null;
	  t_iconRelationClose = null;

	  // Store and configure container.
	  if ( stc_isDefined( containerRelation_ ) ) {
	    // Store container.
	    t_containerRelation = containerRelation_;

	    // Assign draggable event.
	    if ( stc_isDefined( handleIDRelation_ ) && isDraggable_ ) {
	      t_containerRelation.draggable( { handle: "#" + handleIDRelation_ } );
	    }//handleIDRelation_ valid and container is draggable

	    // Set position.
	    t_containerRelation.css( "top", 110 );
	    t_containerRelation.css( "left", 360 );
	  }//containerRelation_ valid

	  // Store form.
	  if ( stc_isDefined( formRelation_ ) ) {
	    t_formRelation = formRelation_;
	  }//formRelation_ valid

	  // Store title.
	  if ( stc_isDefined( titleRelation_ ) ) {
	    t_titleRelation = titleRelation_;
	  }//titleRelation_ valid

	  // RELATION ICONS Store and assign events to relation icons.

	  if ( stc_isDefined( iconRelationClose_ ) ) {
	    t_iconRelationClose = iconRelationClose_;
	    t_iconRelationClose.on( "click", function( event ) { tree_closeRelationForm(); });
	  }//iconRelationClose_ valid

	  // CALLBACKS Store callbacks.
	  t_callbackInitialLoad = callbackInitialLoad_;
	  t_callbackWipeLoad    = callbackWipeLoad_;
	  t_callbackSelection   = callbackSelection_;
	  t_callbackDropPoints  = callbackDropPoints_;
	}//tree_setupTree

	// SHOW TREE.
	function tree_showTree( x_, y_ ) {
	  if ( stc_isDefined( t_container ) ) {
	    // Position and show tree.
	    // Don't re-position if dialog has already been positioned.
	    if ( t_container.position().top == 0 && t_container.position().left == 0 ) {
	      t_container.css( "top", y_ );
	      t_container.css( "left", x_ );
	    }//never positioned
	    t_container.css( "visibility", "visible" );
	  }//t_container valid

	  // Show tree icons.
	  tree_toggleShowTreeEditIcons( true );
	  if ( stc_isDefined( t_iconTreeClose ) ) { t_iconTreeClose.css( "visibility", "visible" ); }
	  if ( t_editable ) {
	    if ( stc_isDefined( t_iconAddTreeStatic ) )     { t_iconAddTreeStatic.css( "visibility", "visible" ); }
	    if ( stc_isDefined( t_iconAddTreeRelational ) ) { t_iconAddTreeRelational.css( "visibility", "visible" ); }
	  }//t_editable
	}//tree_showTree

  // CLOSE TREE.
  function tree_closeTree() {
	  // Close relation form.
	  tree_closeRelationForm();

	  // Close tree.
	  if ( stc_isDefined( t_container ) ) { t_container.css( "visibility", "hidden" ); }

	  // Hide tree icons.
	  tree_toggleShowTreeEditIcons( false );
	  if ( stc_isDefined( t_iconTreeClose ) )         { t_iconTreeClose.css( "visibility", "hidden" ); }
	  if ( stc_isDefined( t_iconAddTreeStatic ) )     { t_iconAddTreeStatic.css( "visibility", "hidden" ); }
	  if ( stc_isDefined( t_iconAddTreeRelational ) ) { t_iconAddTreeRelational.css( "visibility", "hidden" ); }
  }//tree_closeTree

  // TOGGLE SHOW TREE EDIT ICONS.
  function tree_toggleShowTreeEditIcons( show_ ) {
	  if ( show_ ) {
		  // Show edit icons.
		  if ( t_editable ) {
		    // If root (but not global) or non-top-level table is selected, show edit icon.
		    // If empty table with existing duplicate in tree is selected, show delete icon.
		    // If root (but not global) is selected, show regenerate icon.
		    // If empty root (but not global) is selected, show delete icon.
		    if ( stc_isDefined( t_objectSelected ) ) {
		      // Get table length.
	        var tableLength_ = 0;
	        if ( stc_isDefined( t_objectSelected.tables ) ) {
	          tableLength_ = t_objectSelected.tables.length;
	        }//tables valid

	        // Handle icons.
			    if ( stc_isDefined( t_objectSelected.type ) ) {
			      // Show edit icon.
			      if ( t_objectSelected.type != s_tableType.shardTreeGlobal_ ) {
			        // Show for non-root table, if not top-level table.
			        if ( stc_isDefined( t_objectSelected.foreignKeys ) ) {
				        if ( t_objectSelected.foreignKeys.length > 0 ) {
			            // Edit icon.
			            if ( stc_isDefined( t_iconEdit ) ) { t_iconEdit.css( "visibility", "visible" ); }
				        }//foreignKeys not empty
			        }//foreignKeys valid

			        // Show for non-global root.
			        if ( tree_isRoot( t_objectSelected.type ) ) {
			          // Edit icon.
			          if ( stc_isDefined( t_iconEdit ) ) { t_iconEdit.css( "visibility", "visible" ); }
			        }//root
			      }//not global root

			      // If empty table with existing duplicate in tree is selected, show delete icon.
			      if ( !tree_isRoot( t_objectSelected.type ) && tableLength_ == 0 ) {
			        var nbrDuplicateTables_ = tree_checkForDuplicateTable( t_objectSelected.name );
			        if ( nbrDuplicateTables_ > 1 ) {
			          if ( stc_isDefined( t_iconDelete ) ) { t_iconDelete.css( "visibility", "visible" ); }
			        }//nbrDuplicateTables_ gt 1
			      }//not root and is empty

			      // If root (but not global) is selected, show regenerate and delete icons.
			      if ( tree_isRoot( t_objectSelected.type ) && t_objectSelected.type != s_tableType.shardTreeGlobal_ ) {
			        // Regenerate icon.
			        if ( stc_isDefined( t_iconRegenerate ) ) { t_iconRegenerate.css( "visibility", "visible" ); }

			        // Delete icon. Show only if selected root is empty.
			        if ( tableLength_ == 0 ) {
			          if ( stc_isDefined( t_iconDelete ) ) { t_iconDelete.css( "visibility", "visible" ); }
			        }//empty
			      }//root
			    }//t_objectSelected.type valid
		    }//t_objectSelected valid
		  }//t_editable
	  } else {
		  // Hide edit icons.
		  if ( stc_isDefined( t_iconEdit ) )       { t_iconEdit.css( "visibility", "hidden" ); }
		  if ( stc_isDefined( t_iconRegenerate ) ) { t_iconRegenerate.css( "visibility", "hidden" ); }
		  if ( stc_isDefined( t_iconDelete ) )     { t_iconDelete.css( "visibility", "hidden" ); }
	  }//not show_
  }//toggleShowTreeIcon

	// ============================================================================
	// SERVICE.
	// ============================================================================

  // SETUP TREE REQUEST.
  function tree_setupTreeRequest() {
    // Clear out master array.
    t_treeMaster = new Array();

    // Init data arrays.
    t_roots             = new Array();
    t_physicalShards    = new Array();
    t_treeSelections    = new Array();
    t_treeRowSelections = new Array();

    // Init vars for currently-selected object.
    t_loadRowID          = "";
    t_loadMainID         = "";
    t_loadMainParentName = "";
    t_loadMainName       = "";

    // Init root name string.
    t_rootNameStr_ = "";

    // Init master parent name.
    t_masterParentName = "";

    // Zero out heat indicator in index page.
    t_indexPageRef.zeroOutHeatIndicator();
  }//tree_setupTreeRequest

  // SETUP TREE UPDATE.
  function tree_setupTreeUpdate() {
    // Unselect all tree rows.
    tree_unselectAllRows();

    // Clear out master array.
    t_treeMaster = new Array();

    // Init root name string.
    t_rootNameStr_ = "";

    // Init data arrays.
    t_roots             = new Array();
    t_physicalShards    = new Array();
    t_treeSelections    = new Array();
    t_treeRowSelections = new Array();

    // Init vars for currently-selected object.
    t_loadRowID          = "";
    t_loadMainID         = "";
    t_loadMainParentName = "";
    t_loadMainName       = "";

    // Zero out heat indicator in index page.
    t_indexPageRef.zeroOutHeatIndicator();
  }//tree_setupTreeUpdate

  // SETUP TREE REGENERATE.
  function tree_setupTreeRegenerate() {
    // Unselect all tree rows.
    tree_unselectAllRows();

    // Init root name string.
    t_rootNameStr_ = "";

    // Init data arrays.
    t_roots             = new Array();
    t_physicalShards    = new Array();
    t_treeSelections    = new Array();
    t_treeRowSelections = new Array();

    // Zero out heat indicator in index page.
    t_indexPageRef.zeroOutHeatIndicator();
  }//tree_setupTreeRegenerate

	// GET TREE.
  function tree_getTree( action_ ) {
    // Check action.
    if ( !stc_isDefined( action_ ) ) { action_ = s_message.notFound_; }

    // Send service.
    var loadMessage_ = s_message.loading_ + " " + action_;
    var arrayParams_ = new Array();
    stc_sendService( t_indexPageRef, loadMessage_, action_, arrayParams_, tree_returnTree, testTree_, $( "#_tooltip" ), null );
  }//tree_getTree

	// SUBMIT TREE.
  function tree_submitTree( action_ ) {
    // Check action.
    if ( !stc_isDefined( action_ ) ) { action_ = s_message.notFound_; }

    // Send service.
    var loadMessage_ = s_message.loading_ + " " + action_;
    var arrayParams_ = new Array();
	  arrayParams_.push( { param: 'tree', value: t_treeMaster } );

	  if ( t_indexPageRef.i_isTestMode ) {
	    // Update global thermometer in index page.
	    t_indexPageRef.updateThermometerDB( 14 );

	    // Create tree list.
	    tree_createTreeList();

	    // Fire initial load callback.
	    t_callbackInitialLoad();
	  } else {
	    stc_sendService( t_indexPageRef, loadMessage_, action_, arrayParams_, tree_returnTree, testTree_, $( "#_tooltip" ), null );
	  }//not i_isTestMode
  }//tree_submitTree

  // RETURN TREE.
  function tree_returnTree( data_, status_ ) {
    if ( stc_isDefined( data_ ) && stc_isDefined( status_ ) ) {
	    if ( status_ == s_svcVals.success_ ) {
		    // Setup result vals.
		    var tables_      = new Array;
		    var summaryInfo_ = null;
		    var heatTotal_   = 0;

	      // Get result vals.
	      if ( stc_isDefined( data_.tables ) )      { tables_      = data_.tables; }
	      if ( stc_isDefined( data_.summaryInfo ) ) { summaryInfo_ = data_.summaryInfo; }

	      // Handle result.
	      if ( stc_isDefined( tables_ ) ) {
	        // Update global thermometer in index page.
	        if ( stc_isDefined( summaryInfo_ ) ) {
	          if ( stc_isDefined( summaryInfo_.heat ) ) {
	            heatTotal_ = parseInt( summaryInfo_.heat );
			        if ( stc_isNumber( heatTotal_ ) ) {
			          t_indexPageRef.updateThermometerDB( heatTotal_ );
			        }//heatTotal_ valid
	          }//heat valid
	        }//summaryInfo valid

	        // Merge tables_ into t_treeMaster.
	        t_treeMaster = new Array();
	        t_treeMaster = $.merge( t_treeMaster, tables_ );

	        // Store tree master so it can be used to revert file.
	        // Do this only once. If array has entries, leave it alone.
	        if ( stc_isDefined( t_treeMasterStore ) ) {
	          if ( t_treeMasterStore.length == 0 ) {
	            t_treeMasterStore = new Array();
	            t_treeMasterStore = $.merge( t_treeMasterStore, tables_ );
	          }//empty
	        }//t_treeMasterStore valid

			    // Create tree list.
			    tree_createTreeList();

			    // If needed, create flat file.
			    if ( t_flatFile ) {
			      tree_doCreateFlatTreeArray( t_treeMaster )
			    }//t_flatFile true

			    // Fire initial load callback.
			    t_callbackInitialLoad();
	      }//tables_ valid
	    }//status is success
    }//data_ status_ valid
  }//tree_returnTree

  // ============================================================================
  // UTILITY.
  // ============================================================================

  // BUILD TREE ID.
  // Build ID from parentName + tree string + name.
  // Service result can contain multiple instances of same table with different parents,
  // so we add parentName and name to make ID unique.
  // Replace any white spaces in parentName and name before using them for ID.
	function tree_buildTreeID( obj_ ) {
	  var id_ = null;
	  if ( stc_isDefined( obj_ ) ) {
	    if ( stc_isDefined( obj_.parentName ) && stc_isDefined( obj_.name ) ) {
		    var parentName_        = obj_.parentName;
		    var name_              = obj_.name;
		    var noSpaceParentName_ = parentName_.replace( /\s/g, "_" );
		    var noSpaceName_       = name_.replace( /\s/g, "_" );
		    id_                    = noSpaceName_ + s_strTree + noSpaceParentName_;
	    }//parentName name valid
	  }//obj_ valid
	  return id_;
  }//tree_buildTreeID

  // IS ROOT.
	function tree_isRoot( type_ ) {
    var isShardTreeRoot_ = false;
    if ( stc_isDefined( type_ ) ) {
	    if ( type_ == s_tableType.shardTreeGlobal_ ||
	         type_ == s_tableType.shardTreeRelational_ ||
	         type_ == s_tableType.shardTreeStatic_ ) {
	      isShardTreeRoot_ = true;
	    }//is root
    }//type_ valid
    return isShardTreeRoot_;
  }//tree_isRoot

  // BUILD TABLES ID ARRAY.
  // Build simple array of IDs to use as tables property.
	function tree_buildTablesIDArray( obj_ ) {
	  var tables_ = new Array();
	  if ( stc_isDefined( obj_ ) ) {
	    if ( stc_isDefined( obj_.tables ) ) {
	      if ( obj_.tables.length > 0 ) {
			    var length_ = obj_.tables.length;
			    for ( var i = 0; i < length_; i++ ) {
			      var id_ = tree_buildTreeID( obj_.tables[i] );
			      if ( stc_isDefined( id_ ) ) {
				      tables_.push( id_ );
			      }//id_ valid
			    }//for each entry
	      }//tables not empty
	    }//tables valid
	  }//obj_ valid
	  return tables_;
  }//tree_buildTablesIDArray

  // BUILD TABLES NAME ARRAY.
  // Build simple array of table names.
	function tree_buildTablesNameArray( obj_ ) {
	  var tables_ = new Array();
	  var name_   = "";
	  if ( stc_isDefined( obj_ ) ) {
	    if ( stc_isDefined( obj_.tables ) ) {
	      if ( obj_.tables.length > 0 ) {
			    var length_ = obj_.tables.length;
			    for ( var i = 0; i < length_; i++ ) {
			      var id_ = tree_buildTreeID( obj_.tables[i] );
			      if ( stc_isDefined( id_ ) ) {
				      name_ = stc_splitStringFront( id_, s_strTree );
				      tables_.push( name_ );
			      }//id_ valid
			    }//for each entry
	      }//tables not empty
	    }//tables valid
	  }//obj_ valid
	  return tables_;
  }//tree_buildTablesNameArray

  // DO GET TREE OBJECT.
	function tree_doGetTreeObject( parentName_, name_ ) {
	  if ( stc_isDefined( parentName_ ) && stc_isDefined( name_ ) ) {
			t_parentNameTraverse = parentName_;
			t_nameTraverse       = name_;
			t_objectTraverse     = new Object();
			t_doTraverse         = true;
			tree_getTreeObject( t_treeMaster );
			t_doTraverse         = false;
	  }//parentName_ name_ valid
  }//tree_doGetTreeObject

  // GET TREE OBJECT.
	function tree_getTreeObject( obj_ ) {
    for ( i in obj_ ) {
      if ( typeof( obj_[i] ) == "object" ) {
        // If parentName and name of current object matches stored parentName and name, store object.
        // Set flag to stop recursing.
        if ( stc_isDefined( obj_[i].parentName ) && stc_isDefined( obj_[i].name ) ) {
	        if ( obj_[i].parentName == t_parentNameTraverse && obj_[i].name == t_nameTraverse ) {
	          // Store object.
	          t_objectTraverse = obj_[i];

		        // Stop recursing and return to caller.
		        t_doTraverse = false;
		        break;
	        }//parentName and name match
        }//parentName and name valid

        // Check flag and recurse.
        if ( t_doTraverse ) {
          tree_getTreeObject( obj_[i] );
        } else {
          return;
        }//not t_doTraverse

      }//if object
    }//for each obj_
  }//tree_getTreeObject

  // DO GET ALL TABLE NAMES.
	function tree_doGetAllTableNames( obj_ ) {
	  t_allTableNames = new Array();
	  if ( stc_isDefined( obj_ ) ) {
      if ( obj_.name ) {
        t_allTableNames.push( obj_.name );
      }//name valid
			tree_getAllTableNames( obj_ );
	  }//obj_ valid
  }//tree_doGetAllTableNames

  // GET ALL TABLE NAMES.
	function tree_getAllTableNames( obj_ ) {
    for ( i in obj_ ) {
      if ( typeof( obj_[i] ) == "object" ) {
        if ( obj_[i].name ) {
	        t_allTableNames.push( obj_[i].name );
        }//name valid

        // Recurse.
        tree_getAllTableNames( obj_[i] );
      }//if object
    }//for each obj_
  }//tree_getAllTableNames

  // REVERT TREE.
	function tree_revertTree() {
	  // Close form.
	  tree_closeRelationForm();

	  // Revert tree.
		var yes_ = confirm( t_uiStr.confirmRevert_ );
		if ( yes_ ) {
      // SUBMIT AND REFRESH TREE ARRAY.

	    // Set up for tree update.
	    // DEPENDENCY: Do this BEFORE recreating master array and setting vars for initial load.
	    tree_setupTreeUpdate();

	    // Recreate master tree array from stored tree.
	    delete t_treeMaster;
	    t_treeMaster = new Array();
	    t_treeMaster = $.merge( t_treeMaster, t_treeMasterStore );

	    // Init vars for initial load.
	    t_loadMainID         = "";
	    t_loadMainParentName = "";
	    t_loadMainName       = "";
	    t_loadRowID          = "";

	    // Fire wipe load callback.
	    t_callbackWipeLoad();

	    // Submit tree. Callback returns updated tree.
	    tree_submitTree( s_action.treeUpdate_ );
		}//yes_
  }//tree_revertTree

  // ============================================================================
  // FLAT TREE ARRAY.
  // ============================================================================

	// DO CREATE FLAT TREE ARRAY.
	function tree_doCreateFlatTreeArray( objectJSON_ ) {
		// Init master array.
		t_treeMasterFlat = new Array();

		// Build array from JSON object.
		if ( stc_isDefined( objectJSON_ ) ) {
	    var length_ = objectJSON_.length;
	    for ( var i = 0; i < length_; i++ ) {
	      // Create object.
	      tree_createFlatTreeObject( null, objectJSON_[i] );

	      // Recursively add any descendants.
	      if ( stc_isDefined( objectJSON_[i] ) ) {
	        if ( stc_isDefined( objectJSON_[i].tables ) ) {
	          if ( objectJSON_[i].tables.length > 0 ) {
	            tree_createFlatTreeArray( objectJSON_[i] );
	          }//tables not empty
	        }//tables valid
        }//entry valid
	    }//for each entry
		}//objectJSON_ valid
	}//tree_doCreateFlatTreeArray

	// CREATE FLAT TREE ARRAY.
	function tree_createFlatTreeArray( treeObject_ ) {
		if ( stc_isDefined( treeObject_ ) ) {
	      if ( stc_isDefined( treeObject_.tables ) ) {
	        var array_  = treeObject_.tables;
	        var length_ = array_.length;
			    for ( var i = 0; i < length_; i++ ) {
			      // Create object.
			      tree_createFlatTreeObject( treeObject_, array_[i] )

			      // Recursively add any descendants.
			      if ( stc_isDefined( array_[i] ) ) {
	            if ( stc_isDefined( array_[i].tables ) ) {
	              if ( array_[i].tables.length > 0 ) {
	                tree_createFlatTreeArray( array_[i] );
	              }//tables not empty
	            }//tables valid
            }//entry valid
			    }//for each entry
	      }//tables valid
		}//treeObject_ valid
	}//tree_createFlatTreeArray

  // CREATE FLAT TREE OBJECT.
	function tree_createFlatTreeObject( treeObject_, entry_ ) {
	  if ( stc_isDefined( entry_.parentName ) && stc_isDefined( entry_.name ) ) {
			// Init object.
			var obj_ = new Object();

			// Create object.
			if ( stc_isDefined( entry_ ) ) {
		    // Init properties.
		    obj_.id               = "";
		    obj_.parentID         = "";
		    obj_.shardParentName  = s_message.notFound_;
		    obj_.ancestorName     = s_message.notFound_;
		    obj_.parentName       = s_message.notFound_;
		    obj_.name             = s_message.notFound_;
		    obj_.text             = s_message.notFound_;
		    obj_.type             = s_message.notFound_;
		    obj_.level            = 0;
		    obj_.nbrShard         = 0;
		    obj_.keyShard         = s_message.notFound_;
		    obj_.avgTime          = s_message.notFound_;
		    obj_.totalTimePercent = s_message.notFound_;
		    obj_.totalTime        = s_message.notFound_;
		    obj_.frequency        = s_message.notFound_;
		    obj_.heat             = s_message.notFound_;
		    obj_.columns          = new Array();
		    obj_.foreignKeys      = new Array();
		    obj_.tables           = new Array();
		    obj_.related          = new Array();
		    obj_.x                = 0;
		    obj_.y                = 0;
		    obj_.positionSet      = false;

		    // Build unique tree ID from name and parentName.
		    var id_ = tree_buildTreeID( entry_ );

		    // Build unique tree ID for parent.
		    var parentID_ = "";
		    if ( stc_isDefined( treeObject_ ) ) {
		      parentID_ = tree_buildTreeID( treeObject_ );
		    }//treeObject_ valid

		    // Set object level.
		    var level_ = 0;
		    if ( stc_isDefined( treeObject_ ) ) {
		      if ( stc_isDefined( treeObject_.level ) ) {
		        level_ = treeObject_.level + 1;
		      }//level valid
		    }//treeObject_ valid

		    // Set object properties.
		    if ( stc_isDefined( id_ ) )                     { obj_.id               = id_; }
		    if ( stc_isDefined( parentID_ ) )               { obj_.parentID         = parentID_; }
	      if ( stc_isDefined( entry_.shardParentName ) )  { obj_.shardParentName  = entry_.shardParentName; }
	      if ( stc_isDefined( entry_.ancestorName ) )     { obj_.ancestorName     = entry_.ancestorName; }
	      if ( stc_isDefined( entry_.parentName ) )       { obj_.parentName       = entry_.parentName; }
	      if ( stc_isDefined( entry_.name ) )             { obj_.name             = entry_.name; }
	      if ( stc_isDefined( entry_.name ) )             { obj_.text             = entry_.name; }
	      if ( stc_isDefined( entry_.type ) )             { obj_.type             = entry_.type; }
	      if ( stc_isDefined( level_ ) )                  { obj_.level            = level_; }
	      if ( stc_isDefined( entry_.nbrShard ) )         { obj_.nbrShard         = entry_.nbrShard; }
	      if ( stc_isDefined( entry_.keyShard ) )         { obj_.keyShard         = entry_.keyShard; }
	      if ( stc_isDefined( entry_.avgTime ) )          { obj_.avgTime          = stc_addCommas( parseInt( entry_.avgTime ) ); }
	      if ( stc_isDefined( entry_.totalTimePercent ) ) { obj_.totalTimePercent = parseInt( entry_.totalTimePercent ); }
	      if ( stc_isDefined( entry_.totalTime ) )        { obj_.totalTime        = stc_addCommas( parseInt( entry_.totalTime ) ); }
	      if ( stc_isDefined( entry_.frequency ) )        { obj_.frequency        = stc_addCommas( parseInt( entry_.frequency ) ); }
	      if ( stc_isDefined( entry_.heat ) )             { obj_.heat             = parseInt( entry_.heat ); }
	      if ( stc_isDefined( entry_.columns ) )          { obj_.columns          = entry_.columns; }
	      if ( stc_isDefined( entry_.foreignKeys ) )      { obj_.foreignKeys      = entry_.foreignKeys; }

	      // Build simple array of IDs for object tables array.
	      obj_.tables = tree_buildTablesIDArray( entry_ );

	      // Merge tables to create related array.
	      // Add parent ID.
	      obj_.related = $.merge( [], obj_.tables );
	      if ( parentID_ != "" ) {
	        obj_.related.push( parentID_ );
	      }//parentID_ not empty

		    // Set x/y.
		    if ( stc_isDefined( entry_.x ) ) {
		      if ( entry_.x != "" ) {
		        obj_.x = parseInt( entry_.x );
		      }//x not empty
		    }//x valid
		    if ( stc_isDefined( entry_.y ) ) {
		      if ( entry_.y != "" ) {
		        obj_.y = parseInt( entry_.y );
		      }//y not empty
		    }//y valid

		    // Add object to master array.
		    t_treeMasterFlat.push( obj_ );
			}//entry_ valid
	  }//parentName name valid
	}//tree_createFlatTreeObject

	// GET FLAT TREE OBJECT.
	function tree_getFlatTreeObject( id_ ) {
	  var obj_ = new Object();
	  if ( stc_isDefined( t_treeMasterFlat ) ) {
	    var length_ = t_treeMasterFlat.length;
	    for ( var i = 0; i < length_; i++ ) {
	      if ( t_treeMasterFlat[i].id == id_ ) {
		      obj_ = t_treeMasterFlat[i];
		      break;
	      }//match
	    }//for each entry
	  }//t_treeMasterFlat valid
	  return obj_;
  }//tree_getFlatTreeObject

  // UPDATE FLAT TREE POSITION.
  // Update x/y position in flat tree array.
  function tree_updateFlatTreePosition( id_, x_, y_ ) {
    if ( stc_isDefined( t_treeMasterFlat ) && stc_isDefined( id_ )  && stc_isDefined( x_ )  && stc_isDefined( y_ )  ) {
      var length_ = t_treeMasterFlat.length;
      for ( var i = 0; i < length_; i++ ) {
        // If ID valid, determine if match and update.
        if ( stc_isDefined( t_treeMasterFlat[i].id ) ) {
          if ( t_treeMasterFlat[i].id == id_ ) {
            // Update x/y.
            if ( stc_isDefined( t_treeMasterFlat[i].x ) ) { t_treeMasterFlat[i].x = x_; }
            if ( stc_isDefined( t_treeMasterFlat[i].y ) ) { t_treeMasterFlat[i].y = y_; }

            // Set position set flag.
            if ( stc_isDefined( t_treeMasterFlat[i].positionSet ) ) { t_treeMasterFlat[i].positionSet = true; }

            // Break.
            break;
          }//matches passed ID
        }//id_ valid
      }//for each entry
    }//params valid
  }//tree_updateFlatTreePosition

  // INIT FLAT TREE POSITIONS.
  // Init x/y position in flat tree array.
  // Allows load function to restore hierarchical positions in layout array after user disrupts hierarchy.
  function tree_initFlatTreePositions() {
    if ( stc_isDefined( t_treeMasterFlat ) ) {
      var length_ = t_treeMasterFlat.length;
      for ( var i = 0; i < length_; i++ ) {
        // Update x/y.
        if ( stc_isDefined( t_treeMasterFlat[i].x ) ) { t_treeMasterFlat[i].x = 0; }
        if ( stc_isDefined( t_treeMasterFlat[i].y ) ) { t_treeMasterFlat[i].y = 0; }

        // Set position set flag.
        if ( stc_isDefined( t_treeMasterFlat[i].positionSet ) ) { t_treeMasterFlat[i].positionSet = false; }
      }//for each entry
    }//params valid
  }//tree_initFlatTreePositions

	// ============================================================================
	// PHYSICAL SHARD ARRAY.
	// ============================================================================

	// CREATE PHYSICAL SHARD ARRAY.
	function tree_createPhysicalShardArray() {
    // Create array with one entry for each physical shard in selected domain.
    if ( stc_isDefined( t_physicalShards ) && stc_isNumber( t_indexPageRef.i_nbrPhysicalShards ) ) {
      t_physicalShards = new Array();
      var length_      = t_indexPageRef.i_nbrPhysicalShards;
      var obj_         = new Object();
      for ( var i = 0; i < length_; i++ ) {
	      obj_ = new Object();
	      obj_.nbrShard = i + 1;
	      obj_.name     = "";
	      t_physicalShards.push( obj_ );
      }//for each entry
    }//params valid
  }//tree_createPhysicalShardArray

	// GET DEFAULT PHYSICAL SHARD.
	function tree_getDefaultPhysicalShard() {
    var nbrShardDefault_ = 0;
    if ( stc_isDefined( t_physicalShards ) ) {
      var length_ = t_physicalShards.length;
      for ( var i = 0; i < length_; i++ ) {
        if ( t_physicalShards[i].name == "" ) {
          nbrShardDefault_ = t_physicalShards[i].nbrShard;
          break;
        }//name_ is empty
      }//for each entry
    }//params valid
    return nbrShardDefault_;
  }//tree_getDefaultPhysicalShard

	// UPDATE PHYSICAL SHARD ARRAY.
	function tree_updatePhysicalShardArray( nbr_, name_ ) {
    // Insert name_ into entry with matching shard number.
    if ( stc_isDefined( t_physicalShards ) && stc_isDefined( name_ ) && stc_isNumber( nbr_ ) ) {
      var length_ = t_physicalShards.length;
      for ( var i = 0; i < length_; i++ ) {
        if ( t_physicalShards[i].nbrShard == nbr_ ) {
          t_physicalShards[i].name = name_;
        }//match
      }//for each entry
    }//params valid
  }//tree_updatePhysicalShardArray

	// CREATE PHYSICAL SHARD OPTIONS.
	function tree_createPhysicalShardOptions( obj_ ) {
	  // Set up processing vars.
    var options_ = "";
    var option_  = "";

    // Create options from available empty options.
    if ( stc_isDefined( t_physicalShards ) && stc_isDefined( obj_ ) ) {
      var length_ = t_physicalShards.length;
      for ( var i = 0; i < length_; i++ ) {
	      if ( t_physicalShards[i].name == "" ) {
	        option_ = "<option value='" + t_physicalShards[i].nbrShard + "'>" + t_physicalShards[i].nbrShard + "</option>";
	        options_ += option_;
	      }//name_ empty
      }//for each entry
    }//params valid

    // Return options.
    return options_;
  }//tree_createPhysicalShardOptions

	// ============================================================================
	// LIST.
	// ============================================================================

	// CREATE TREE LIST.
	function tree_createTreeList() {
    if ( stc_isDefined( t_list ) ) {
	    // Init list.
	    t_list.html( "" );

	    // Set error flag.
	    var error_ = true;

	    // Create list.
	    if ( t_treeMaster ) {
	      // Create array with one entry for each physical shard in selected domain.
	      // We will update this array when creating each row in tree list.
	      tree_createPhysicalShardArray();

	      // Create data rows.
	      if ( t_treeMaster.length > 0 ) {
	        // Create rows.
	        var length_ = t_treeMaster.length;
	        for ( var i = 0; i < length_; i++ ) {
			      // Create row and add to list.
			      var row_ = tree_createTreeRow( null, t_treeMaster[i] );

			      // Recursively add any descendants.
			      var entry_ = t_treeMaster[i];
			      if ( stc_isDefined( entry_ ) ) {
			        if ( stc_isDefined( entry_.tables ) ) {
			          if ( entry_.tables.length > 0 ) {
			            tree_createTreeDescendantRows( entry_ );
			          }//tables not empty
			        }//tables valid
		        }//entry_ valid
	        }//for each entry

	        // Add dummy input field. Used to receive focus away from rootName fields.
          var rowDummy_ = "<div><input id='_dummy' type='text' style='opacity: 0.0;' /></div>";
          t_list.append( rowDummy_ );

	        // Assign event handlers to elements in list.

	        $( ".imgToggle" ).on ( "click", function( event ) { tree_doToggleShowRows( event ); });

	        $( ".rowTree" ).on ( "click", function( event )     { tree_clickRow( event ); });
	        $( ".rowTree" ).on ( "mouseover", function( event ) { tree_doHandleTreeRow( event, null, "mouseover" ); });
	        $( ".rowTree" ).on ( "mouseout", function( event )  { tree_doHandleTreeRow( event, null, "mouseout" ); });

	        $( ".rowRoot" ).on ( "click", function( event )     { tree_clickRow( event ); });
	        $( ".rowRoot" ).on ( "mouseover", function( event ) { tree_doHandleTreeRow( event, null, "mouseover" ); });
	        $( ".rowRoot" ).on ( "mouseout", function( event )  { tree_doHandleTreeRow( event, null, "mouseout" ); });

	        // Assign edit event handlers to elements in list.
	        if ( t_editable ) {
	          $( ".inputTree" ).on       ( "focus", function( event ) { tree_handleRootName( event, "focus" ); });
	          $( ".inputTree" ).on       ( "input", function( event ) { tree_handleRootName( event, "input" ); });
	          $( ".imageUpdateRoot" ).on ( "click", function( event ) { tree_saveRootName( event ); });

						$( ".rowTree" ).draggable({
						  helper  : function( event ) { return t_helper; },
						  cursor  : "row-resize",
						  opacity : 0.5,
						  distance: 5,
						  start   : function( event, ui ) { tree_doHandleTreeRow( event, ui, "dragstart" ); },
						  stop    : function( event, ui ) { tree_doHandleTreeRow( event, ui, "dragstop" ); }
						});

		        $( ".rowTree" ).droppable ({ accept: ".rowTree" });
		        $( ".rowRoot" ).droppable ({ accept: ".rowTree" });
	        }//t_editable

	        // Set error to false.
	        error_ = false;
	      }//t_treeMaster not empty
	    }//parameters valid

	    // If no data, add no-data row.
	    if ( error_ ) {
	      t_list.html( "" );
	      t_list.html( "<span style='font-size: 10pt;'>" + s_message.noMoreRows_ + "</span>" );
	    }//error_ true
    }//t_list valid
	}//tree_createTreeList

  // CREATE TREE DESCENDANT ROWS.
	function tree_createTreeDescendantRows( parentEntry_ ) {
		if ( stc_isDefined( parentEntry_ ) ) {
	      if ( stc_isDefined( parentEntry_.tables ) ) {
	        var array_  = parentEntry_.tables;
	        var length_ = array_.length;
			    for ( var i = 0; i < length_; i++ ) {
			      // Create row and add to list.
			      var row_ = tree_createTreeRow( parentEntry_, array_[i] )

			      // Recursively add any descendants.
			      var entry_ = array_[i];
			      if ( stc_isDefined( row_ ) && stc_isDefined( entry_ ) ) {
	            if ( stc_isDefined( entry_.tables ) ) {
	              if ( entry_.tables.length > 0 ) {
	                tree_createTreeDescendantRows( entry_ );
	              }//tables not empty
	            }//tables valid
            }//entry_ valid
			    }//for each entry
	      }//tables valid
		}//parentEntry_ valid
	}//tree_createTreeDescendantRows

  // CREATE TREE ROW.
	function tree_createTreeRow( parentEntry_, entry_ ) {
    // Init row and IDs.
    var row_    = null;
    var cellID_ = "";
    var rowID_  = "";

    // Create row.
    if ( stc_isDefined( entry_ ) ) {
      // Init row values.
      var id_               = "";
      var shardParentName_  = s_message.notFound_;
      var parentName_       = s_message.notFound_;
      var name_             = s_message.notFound_;
      var type_             = s_message.notFound_;
      var avgTime_          = s_message.notFound_;
      var totalTimePercent_ = s_message.notFound_;
      var totalTime_        = s_message.notFound_;
      var frequency_        = s_message.notFound_;
      var heat_             = s_message.notFound_;
      var level_            = 0;
      var keyShard_         = s_message.notFound_;
      var nbrShard_         = 0;
      var tables_           = new Array();

      // Get row values.
      if ( stc_isDefined( entry_.shardParentName ) )  { shardParentName_  = entry_.shardParentName; }
      if ( stc_isDefined( entry_.parentName ) )       { parentName_       = entry_.parentName; }
      if ( stc_isDefined( entry_.name ) )             { name_             = entry_.name; }
      if ( stc_isDefined( entry_.type ) )             { type_             = entry_.type; }
      if ( stc_isDefined( entry_.avgTime ) )          { avgTime_          = stc_addCommas( parseInt( entry_.avgTime ) ); }
      if ( stc_isDefined( entry_.totalTimePercent ) ) { totalTimePercent_ = parseInt( entry_.totalTimePercent ); }
      if ( stc_isDefined( entry_.totalTime ) )        { totalTime_        = stc_addCommas( parseInt( entry_.totalTime ) ); }
      if ( stc_isDefined( entry_.frequency ) )        { frequency_        = stc_addCommas( parseInt( entry_.frequency ) ); }
      if ( stc_isDefined( entry_.heat ) )             { heat_             = parseInt( entry_.heat ); }
      if ( stc_isDefined( entry_.nbrShard ) )         { nbrShard_         = parseInt( entry_.nbrShard ); }
      if ( stc_isDefined( entry_.keyShard ) )         { keyShard_         = entry_.keyShard; }
      if ( stc_isDefined( entry_.tables ) )           { tables_           = entry_.tables; }

	    // Build unique tree ID from name and parentName.
	    id_ = tree_buildTreeID( entry_ );

      // Set cell and row IDs. Use ID to make them unique.
      cellID_ = stc_getIdentifier( id_, s_strCell );
      rowID_  = stc_getIdentifier( id_, s_strRow );

      // If this is root, store values used to track and handle roots.
      if ( tree_isRoot( type_ ) ) {
        // Add root info to master root array.
        var objRoot_    = new Object();
        objRoot_.parentName = parentName_;
        objRoot_.name   = name_;
        t_roots.push( objRoot_ );

        // Add name to rootName string. Used to check for duplicate rootNames.
        var addRootStr_ = '"' + name_ + '"';
        t_rootNameStr_ = t_rootNameStr_ + " " + addRootStr_;

        // Update physical shard array. Insert rootName into entry with matching shard number.
        if ( type_ == s_tableType.shardTreeStatic_ ) {
          tree_updatePhysicalShardArray( nbrShard_, name_ );
        }//static root

	      // If this global root, store master parentName.
	      // Used as parentName of all shard trees.
	      if ( type_ == s_tableType.shardTreeGlobal_ ) {
			    t_masterParentName = parentName_;
	      }//global root
      }//root

	    // Store IDs used to select first row.
	    if ( t_loadMainID == "" && t_loadMainParentName == "" && t_loadMainName == "" && t_loadRowID == "" ) {
		    if ( !tree_isRoot( type_ ) ) {
			    t_loadMainID         = id_;
			    t_loadMainParentName = parentName_;
			    t_loadMainName       = name_;
			    t_loadRowID          = rowID_;
		    }//not root
	    }//empty

	    // Set level - determines position in hierarchy.
	    // Used for setting offset and various display options.
	    // DEPENDENCY: Do this before any other task in this function, because many tasks require known level.
	    entry_.level = 0;
	    if ( stc_isDefined( parentEntry_ ) ) {
	      if ( stc_isDefined( parentEntry_.level ) ) {
	        entry_.level = parentEntry_.level + 1;
	      }//level_ valid
	    }//parentEntry valid
	    level_ = entry_.level;

      // Set offset. Offset positions elements on each row to show how far each table is nested within hierarchy.
      var marginLeft_ = 0;
      for ( var j = 0; j < level_; j++ ) {
        marginLeft_ = marginLeft_ + 15;
      }//for level_
      var offset_ = "<img src='img/transparent.gif' style='vertical-align: middle; height: 15px; width: " + marginLeft_ + "px;' />";

      // Set row class.
      var class_ = "rowTree";
      if ( tree_isRoot( type_ ) ) {
        var class_ = "rowRoot";
      }//root

      // Set row style.
      // Determines how row displays, whether row is initially visible, and sets initial background color.
      // For initial tree, level 0 is visible.
      var display_ = "display: none;";
      if ( level_ < 1 ) {
        display_ = "display: block;";
	      if ( tables_.length > 0 ) {
		      display_ = "display: table;";
	      }//tables_ not empty
      }//level_ lt 2
      var styleRow_ = " style='" + display_ + " background-color: " + t_colorRowUnselected + ";'";

      // Set cell style.
      // Determines font weight. Weight for roots and parent tables (with descendants) is bold.
      var fontWeight_ = "font-weight: normal;";
      if ( tree_isRoot( type_ ) || tables_.length > 0 ) {
        fontWeight_ = "font-weight: bold;";
      }//root or tables_ not empty
      var styleCell_ = " style='" + fontWeight_ + "'";

      // Create toggle image.
      // If this is parent table, user clicks image to show/hide descendants.
      // Image toggle uses 2 images to indicate open/closed.
      // For initial tree, all levels have closed image.
      var imgToggleID_ = rowID_ + s_strImageToggle;
      var imgToggle_   = "";
      if ( tables_.length > 0 ) {
        // Set image source.
        var imgToggleSrc_ = "src='img/iconPlus.png'";

        // Create string.
        imgToggle_ = "&nbsp;<img id='" + imgToggleID_ + "' class='imgToggle' style='height: 15px; width: 15px; vertical-align: middle;' " + imgToggleSrc_ + " title='" + t_uiStr.tipToggle_ + "' />";
      }//tables_ not empty

      // Create heat image.
      var imgHeatID_    = rowID_ + s_strImageHeat;
      var imgHeat_      = "";
      var imgHeatSrc_   = "";
      var imgHeatTitle_ = "";
      if ( !tree_isRoot( type_ ) ) {
	      // Create image for heat that is warm and above.
	      if ( heat_ > s_heatVals.warm_ ) {
	        // Set vals for warm.
	        imgHeatSrc_   = "src='img/iconCaution.png'";
	        imgHeatTitle_ = t_uiStr.tipHeatHigh_;

		      // Set vals for hot.
		      if ( heat_ > s_heatVals.hot_ ) {
		        imgHeatSrc_   = "src='img/iconDanger.png'";
		        imgHeatTitle_ = t_uiStr.tipHeatXHigh_;
		      }//heat_ gt hot_

		      // Create string.
		      imgHeat_ = "&nbsp;<img id='" + imgHeatID_ + "' class='imgHeat' " + imgHeatSrc_ + " style='height: 15px; width: 15px; vertical-align: middle;' title='" + imgHeatTitle_ + "' />";
	      }//heat_ gt warm_
      }//not root

      // Set title.
      var title_    = "";
      var lineEdit_ = "\nClick to show in the main display.";
      if ( tree_isRoot( type_ ) ) {
        // Set edit instrux line.
        if ( t_editable ) {
	        if ( type_ != s_tableType.shardTreeGlobal_ ) {
	          lineEdit_ = "\nClick to show in main display.\nFor other actions, click the row, then\nclick the edit, regenerate, or delete button\nat the top of the tree.";
          }//not global root
        }//t_editable true

        // Set title.
        title_ = "Name: " + name_ +
                 "\nType: " + type_ + "\n" +
                 lineEdit_;
      } else {
        // Set edit instrux line.
        if ( t_editable ) {
	        if ( level_ > 1 ) {
	          lineEdit_ = "\nClick to show in the main display.\nTo edit properties, click the row, then click the edit button at the top of the tree." +
	                      "\n\nTo move the table, drag it to a new position in the tree or onto a point in the wheel.\nTo copy the table, click, then SHIFT + drag the table.";
	        }//level_ gt 1
        }//t_editable true

        // Set title.
        title_ = "On shard root: " + shardParentName_ +
                 "\nTable: " + name_ +
                 "\nType: " + type_ +
                 "\n\nAverage query time:\t" + avgTime_ + " ms" +
                 "\n% of total:\t\t\t" + totalTimePercent_ +
                 "\nFrequency:\t\t\t" + frequency_ + "/sec" + "\n" +
                 lineEdit_;
      }//not root

      // Create string for displayed name.
      var textNormalized_ = stc_normalizeText( name_, t_charLimit.tree_ );
      var nameDisplay_    = stc_addEllipsis( name_, textNormalized_, t_charLimit.tree_ );

      // Create contents for editable non-global root.
      // DEPENDENCY: Do this after creating nameDisplay_.
      // In editable tables, name appears in input field.
      // Store ID in name attribute of input field and update image.      
      if ( ( tree_isRoot( type_ ) ) &&
           ( type_ != s_tableType.shardTreeGlobal_ ) && 
           ( t_editable )
         ) {
        // Create input field and include update icon and mouseover title.
				var inputID_      = rowID_ + s_strInput;
				var nameDisplay0_ = "<input id='" + inputID_ + "' name='" + id_ + "' class='inputTree bgTransBorderedTan' style='width: 50%; cursor: default;' type='text'";
				var imgUpdateID_  = rowID_ + s_strImageUpdate;
				var imgUpdate_    = "&nbsp;<img id='" + imgUpdateID_ + "' name='" + id_ + "' class='imageUpdateRoot' src='img/iconUpdate.png' style='vertical-align: middle; visibility: hidden;' title='" + t_uiStr.tipImageUpdate_ + "' />";
				var nameDisplay1_ = " title='" + t_uiStr.tipRootName_ + "' value='" + name_ + "' />";
				nameDisplay_      = nameDisplay0_ + nameDisplay1_ + imgUpdate_;    
      }//root but not global root



      // Create row.
      // Store ID in row's name attribute.
      row_ = "<div id='" + rowID_ + "' name='" + id_ + "' class='" + class_ + "' " + styleRow_ + " title='" + title_ + "'>" +
             "<span id='" + cellID_ + "' class='cellTree'" + styleCell_ + ">" + offset_ + imgToggle_ + "&nbsp;" + nameDisplay_ + imgHeat_ + "</span>" +
             "</div>";

      // Add to list.
      // Assign event handlers.
      if ( stc_isDefined( row_ ) ) {
        // Add to list.
        t_list.append( row_ );

        // Assign edit event handlers.
        if ( t_editable ) {
		      if ( tree_isRoot( type_ ) ) {
		        $( "#" + rowID_ ).on ( "dropover", function( event, ui )  { tree_doHandleTreeRow( event, ui, "dropover" ); } );
		        $( "#" + rowID_ ).on ( "dropout", function( event, ui )   { tree_doHandleTreeRow( event, ui, "dropout" ); } );
		        $( "#" + rowID_ ).on ( "drop", function( event, ui )      { tree_doHandleTreeRow( event, ui, "drop" ); } );
		      } else {
		        $( "#" + rowID_ ).on ( "dragstart", function( event, ui ) { tree_doHandleTreeRow( event, ui, "dragstart" ); } );
		        $( "#" + rowID_ ).on ( "dragstop", function( event, ui )  { tree_doHandleTreeRow( event, ui, "dragstop" ); } );
		        $( "#" + rowID_ ).on ( "dropover", function( event, ui )  { tree_doHandleTreeRow( event, ui, "dropover" ); } );
		        $( "#" + rowID_ ).on ( "dropout", function( event, ui )   { tree_doHandleTreeRow( event, ui, "dropout" ); } );
		        $( "#" + rowID_ ).on ( "drop", function( event, ui )      { tree_doHandleTreeRow( event, ui, "drop" ); } );
		      }//not root
        }//t_editable
      }//row_ valid
    }//params valid

		// Return row.
		var rowCurrent_ = null;
		if ( stc_isDefined( rowID_ ) ) {
		  if ( rowID_ != "" ) {
		    rowCurrent_ = $( "#" + rowID_ );
		  }//rowID_ not empty
		}//rowID_ valid
		return rowCurrent_;
	}//tree_createTreeRow

  // ============================================================================
  // LIST EVENTS.
  // ============================================================================

  // GET SELECTED ROW ID.
  function tree_getSelectedRowID( id_, class_ ) {
    var rowID_   = null;
    var element_ = $( "#" + id_ );
    if ( stc_isDefined( element_ ) && stc_isDefined( class_ ) ) {
	    switch( class_ ) {
        case "rowTree"                           : rowID_ = element_.attr( "id" ); break;
        case "rowTree ui-draggable"              : rowID_ = element_.attr( "id" ); break;
        case "rowTree ui-draggable ui-droppable" : rowID_ = element_.attr( "id" ); break;
        case "rowRoot"                           : rowID_ = element_.attr( "id" ); break;
        case "rowRoot ui-droppable"              : rowID_ = element_.attr( "id" ); break;
        case "cellTree"                          : rowID_ = element_.parent().attr( "id" ); break;
        case "imgToggle"                         : rowID_ = element_.parent().parent().attr( "id" ); break;
        case "imgHeat"                           : rowID_ = element_.parent().parent().attr( "id" ); break;
        default: break;
	    }//switch class_
    }//currentElement_ class_ valid
    return rowID_;
  }//tree_getSelectedRowID

  // DO HANDLE TREE ROW.
  function tree_doHandleTreeRow( event, ui, action_ ) {
	  // Cancel event propagation.
	  event.stopPropagation();

	  // Get row and handle specified action.
	  var rowID_ = null;
	  if ( stc_isDefined( action_ ) && stc_isDefined( event.target.id ) && stc_isDefined( event.target.className ) ) {
	    rowID_ = tree_getSelectedRowID( event.target.id, event.target.className );
		  if ( stc_isDefined( rowID_ ) ) {
		    // Get row.
		    var row_ = $( "#" + rowID_ );

        // Get ID.
        var id_ = row_.attr( "name" );

        // Get table name.
        var tableName_ = stc_splitStringFront( id_, s_strTree );

		    // Call function that handles each type of event.
		    if ( stc_isDefined( row_ ) && stc_isDefined( id_ ) && stc_isDefined( tableName_ ) ) {
		      tree_handleTreeRow( row_, rowID_, id_, tableName_, ui, action_ )
		    }//row_ id_ tableName_ valid
		  }//rowID_ valid
	  }//params valid
  }//tree_doHandleTreeRow

  // HANDLE TREE ROW.
  function tree_handleTreeRow( row_, rowID_, id_, tableName_, ui, action_ ) {
	  // Handle specified event.
    if ( stc_isDefined( row_ ) && stc_isDefined( rowID_ ) && stc_isDefined( id_ ) && stc_isDefined( tableName_ ) && stc_isDefined( action_ ) ) {

      switch( action_ ) {

        case "mouseover":
          // Change row color to select color.
          tree_selectTreeRow( row_ );
        break;

        case "mouseout":
			    // If row not selected, change row color to unselected color.
			    if ( !stc_isRowSelected( t_treeRowSelections, rowID_ ) ) {
			      tree_unselectTreeRow( row_ );
			    }//not selected
        break;

        case "dragstart":
				  // Close relation form.
				  tree_closeRelationForm();

			    // Init all root name edit.
			    tree_initAllRootEdit( null );

          // Show name of table in helper.
          // Helper is element used to represent tree item dragged by user.
          var textNormalized_ = stc_normalizeText( tableName_, t_charLimit.tree_ );
          var nameDisplay_    = stc_addEllipsis( tableName_, textNormalized_, t_charLimit.tree_ );
          t_helper.html( nameDisplay_ );

          // Store ID in helper, so it can be used to find source table when dropped.
          t_helper.attr( "name", id_ );

          // Show drop points in calling page.
          t_callbackDropPoints( true );
        break;

        case "dragstop":
					// Helper is element used to represent tree item dragged by user. It resides in calling page so it can remain
					// above and separate from tree and can be used in both tree and calling page.
					// Once it invoked by user, it becomes child of list in tree and no longer works as it should.
					// So we destroy it and recreate it at drag end. This causes helper to work correctly on next drag event.
					if ( stc_isDefined( ui ) ) {
	          ui.helper.remove();
	          t_helper = t_createHelperFunction();

	          // Hide drop points in calling page.
	          t_callbackDropPoints( false );
					}//ui valid
        break;

        case "dropover":
		      // Highlight row.
		      row_.css( "background-color", s_color.yellowLight_ );
        break;

        case "dropout":
			    // Unhighlight row. Row color depends on whether row is selected.
			    if ( stc_isRowSelected( t_treeRowSelections, rowID_ ) ) {
			      tree_selectTreeRow( row_ );
			    } else {
			      tree_unselectTreeRow( row_ );
			    }//not selected
        break;

        case "drop":
			    // Unhighlight row. Row color depends on whether row is selected.
			    if ( stc_isRowSelected( t_treeRowSelections, rowID_ ) ) {
			      tree_selectTreeRow( row_ );
			    } else {
			      tree_unselectTreeRow( row_ );
			    }//not selected

          // Get source and target table IDs.
          var sourceID_ = t_helper.attr( "name" );
          var targetID_ = id_;

          // Update table drop.
          tree_doUpdateTableDrop( "", sourceID_, targetID_ );
        break;

        default: break;
      }//switch action_

    }//params valid
  }//tree_handleTreeRow

  // SELECT TREE ROW.
  function tree_selectTreeRow( row_ ) {
	  if ( stc_isDefined( row_ ) ) {
      row_.css( "background-color", t_colorRowSelected );
	  }//row_ valid
  }//tree_selectTreeRow

  // UNSELECT TREE ROW.
  function tree_unselectTreeRow( row_ ) {
	  if ( stc_isDefined( row_ ) ) {
      row_.css( "background-color", t_colorRowUnselected );
	  }//row_ valid
  }//tree_unselectTreeRow

  // UNSELECT ALL ROWS.
  function tree_unselectAllRows() {
    // Empty out all selection arrays.
    t_treeSelections    = new Array();
    t_treeRowSelections = new Array();

    // Init currently-selected object.
    t_objectSelected = null;

    // Unselect all rows.
    tree_unselectTreeRow( $( ".rowTree" ) );
    tree_unselectTreeRow( $( ".rowRoot" ) );

    // Hide all tree icons.
    tree_toggleShowTreeEditIcons( false );

    // Init all root name edit.
    tree_initAllRootEdit( null );
  }//tree_unselectAllRows

  // CLICK ROW.
  function tree_clickRow( event ) {
    // Cancel propagation.
	  event.stopPropagation();

	  // Close relation form.
	  tree_closeRelationForm();

	  // Handle event.
	  var rowID_ = null;
	  if ( stc_isDefined( event.target.id ) && stc_isDefined( event.target.className ) ) {
	    rowID_ = tree_getSelectedRowID( event.target.id, event.target.className );
		  if ( stc_isDefined( rowID_ ) ) {
		    var row_ = $( "#" + rowID_ );
		    if ( stc_isDefined( row_ ) ) {
			    // Get parentName and name of table.
			    var id_         = row_.attr( "name" );
			    var parentName_ = stc_splitStringBack( id_, s_strTree );
			    var name_       = stc_splitStringFront( id_, s_strTree );

		      // Handle row selection.
		      if ( stc_isDefined( parentName_ ) && stc_isDefined( name_ ) ) {
		        tree_doSelectRows( id_, parentName_, name_, rowID_ );
		      }//parentName_ name_ valid
		    }//row_ valid
		  }//rowID_ valid
	  }//event.target.id event.target.className valid
  }//tree_clickRow

  // DO SELECT ROWS.
  // Unselect/select tree row and descendants.
  // Store IDs for handling by calling page.
  function tree_doSelectRows( id_, parentName_, name_, rowID_ ) {
    // Unselect all rows.
    // Fire selection callback.
    if ( stc_isDefined( id_ ) && stc_isDefined( parentName_ ) && stc_isDefined( name_ ) && stc_isDefined( rowID_ ) ) {
	    // Store initial position of top row. Used to scroll it back into sight if selection hides it.
	    var posTopRow_ = $( "#" + rowID_ ).position().top;

      // Unselect all tree rows.
      tree_unselectAllRows();

      // Store IDs.
      t_loadMainID = id_;
      t_loadRowID  = rowID_;
	    t_treeSelections.push( id_ );
	    t_treeRowSelections.push( rowID_ );

	    // Store names.
	    t_loadMainParentName = parentName_;
	    t_loadMainName       = name_;

      // Set this row to selected state.
      tree_selectTreeRow( $( "#" + rowID_ ) );

	    // Get object for selected table.
	    var obj_ = new Object();
			tree_doGetTreeObject( parentName_, name_ );
			obj_ = t_objectTraverse;

			// Set start recurse level.
			t_startRecurseLevel = obj_.level;

	    // Select descendant rows.
	    if ( stc_isDefined( obj_ ) ) {
	      tree_selectDescendantRows( obj_ );
	    }//obj_ valid

	    // Store object.
	    t_objectSelected = new Object();
	    t_objectSelected = obj_;

      // Open up root.
      if ( t_openRoot ) {
        tree_openRoot();
      }//t_openRoot true

	    // Show icons according to selected item.
	    tree_toggleShowTreeEditIcons( true );

	    // If selection scrolled top row out of sight, scroll it back into view.
	    if ( stc_isDefined( t_tree ) ) {
				if ( $( "#" + rowID_ ).position().top < 0 ) {
				  t_tree.scrollTop( posTopRow_ );
				}//scrolled out of sight
	    }//t_tree valid

	    // Fire selection callback.
	    t_callbackSelection();
    }//id_ rowID_ valid
  }//tree_doSelectRows

  // SELECT DESCENDANT ROWS.
	function tree_selectDescendantRows( obj_ ) {
    for ( i in obj_ ) {
      if ( typeof( obj_[i] ) == "object" ) {
		    if ( stc_isDefined( obj_[i].parentName ) && stc_isDefined( obj_[i].name ) ) {
			    // Build IDs.
			    var id_    = tree_buildTreeID( obj_[i] );
		      var rowID_ = stc_getIdentifier( id_, s_strRow );

	        // Select.
	        if ( stc_isDefined( id_ ) && stc_isDefined( rowID_ ) ) {

			      var doSelect_ = false;

		        if ( t_recurseAll ) {
				      doSelect_ = true;
		        } else {
				      var levelCurrent_ = parseInt( obj_[i].level );
				      if ( ( levelCurrent_ - t_startRecurseLevel ) < t_nbrRecurseLimit ) {
				        doSelect_ = true;
				      }//levelCurrent_ - t_startRecurseLevel lt t_nbrRecurseLimit
		        }//not t_recurseAll

		        if ( doSelect_ ) {
					    // Store IDs.
					    t_treeSelections.push( id_ );
					    t_treeRowSelections.push( rowID_ );

			        // Set this row to selected state.
			        tree_selectTreeRow( $( "#" + rowID_ ) );
		        }//doSelect_ true
	        }//id_ rowID_ valid
        }//parentName and name valid

        // Recurse
		    tree_selectDescendantRows( obj_[i] );
      }//if object
    }//for each obj_
  }//tree_selectDescendantRows

  // OPEN ROOT.
  function tree_openRoot() {
    if ( stc_isDefined( t_roots ) && stc_isDefined( t_currentRoot ) ) {
      var obj_ = new Object();
      var length_ = t_roots.length;
	    for ( var i = 0; i < length_; i++ ) {
	      obj_ = new Object();
	      obj_ = t_roots[i];
	      if ( stc_isDefined( obj_ ) ) {
		      if ( stc_isDefined( obj_.name ) ) {
		        if ( obj_.name == t_currentRoot ) {
							var id_          = tree_buildTreeID( obj_ );
							var rowID_       = stc_getIdentifier( id_, s_strRow );
							var imgToggleID_ = rowID_ + s_strImageToggle;
	            var img_         = $( "#" + imgToggleID_ );
	            if ( stc_isDefined( img_ ) ) {
	              tree_toggleShowSection( img_, true );
	            }//img_ valid
		        }//match
		      }//obj_ valid
	      }//obj_ valid
	    }//for each entry
    }//params valid
    t_openRoot = false;
  }//tree_openRoot

  // TOGGLE SHOW SECTION.
  function tree_toggleShowSection( img_, show_ ) {
    if ( stc_isDefined( img_ ) ) {
      // Set toggle image to opposite of what we want, so it gets toggled in next function.
      if ( show_ ) {
        img_.attr( "src", "img/iconPlus.png" );
      } else {
        img_.attr( "src", "img/iconMinusWhite.png" );
      }//not show_

      // Fire toggle function.
      tree_toggleShowRows( img_ );
    }//img_ valid
  }//tree_toggleShowSection

  // DO TOGGLE SHOW ROWS.
  // Show/hide rows containing descendants of table in toggled row.
  function tree_doToggleShowRows( event, img_ ) {
    // Cancel propagation.
    event.stopPropagation();

	  // Close relation form.
	  tree_closeRelationForm();

    // Handle event.
	  if ( stc_isDefined( event.target.id ) ) {
	    var img_ = $( "#" + event.target.id );
	    if ( stc_isDefined( img_ ) ) {
		    // Toggle rows.
		    tree_toggleShowRows( img_ );
	    }//img_ valid
	  }//event.target.id valid
  }//tree_doToggleShowRows

  // TOGGLE SHOW ROWS.
  function tree_toggleShowRows( img_ ) {
    if ( stc_isDefined( img_ ) ) {
	    // Init all root name edit.
	    tree_initAllRootEdit( null );

	    // Find out if we are showing or hiding.
	    var show_ = false;
	    if ( img_.attr( "src" ) == "img/iconPlus.png" ) { show_ = true; }

      // Set toggle image.
      if ( show_ ) {
        img_.attr( "src", "img/iconMinusWhite.png" );
      } else {
        img_.attr( "src", "img/iconPlus.png" );
      }//not show_

	    // Get parentName and name of table.
	    var id_         = img_.parent().parent().attr( "name" );
	    var parentName_ = stc_splitStringBack( id_, s_strTree );
	    var name_       = stc_splitStringFront( id_, s_strTree );

	    // Get object for selected table.
	    var obj_ = new Object();
	    if ( stc_isDefined( parentName_ ) && stc_isDefined( name_ ) ) {
				tree_doGetTreeObject( parentName_, name_ );
				obj_ = t_objectTraverse;
	    }//parentName_ name_ valid

	    // Toggle row and descendant rows.
	    if ( stc_isDefined( obj_ ) ) {
	      tree_toggleShowDescendantRows( obj_, show_ );
	    }//obj_ valid
    }//img_ valid
  }//tree_toggleShowRows

  // TOGGLE SHOW DESCENDANT ROWS.
	function tree_toggleShowDescendantRows( obj_, show_ ) {
    for ( i in obj_ ) {
      if ( typeof( obj_[i] ) == "object" ) {
	      if ( stc_isDefined( obj_[i].parentName ) && stc_isDefined( obj_[i].name ) ) {
			    // Build IDs.
			    var id_    = tree_buildTreeID( obj_[i] );
		      var rowID_ = stc_getIdentifier( id_, s_strRow );

		      // Get row.
		      var row_ = null;
		      if ( stc_isDefined( rowID_ ) ) {
		        var row_ = $( "#" + rowID_ );
		      }//rowID_ valid

	        // Find out if object has tables.
	        var hasTables_ = false;
	        if ( stc_isDefined( obj_[i].tables ) ) {
	          if ( obj_[i].tables.length > 0 ) {
	            hasTables_ = true;
	          }//tables not empty
	        }//tables valid

	        // Hide/show row.
	        if ( stc_isDefined( row_ ) ) {
		        if ( show_ ) {
		          row_.css( "display", "block" );

		          // If table has descendants, handle toggle image.
		          if ( hasTables_ ) {
	              // Hide/show row.
	              row_.css( "display", "table" );

				        // Set toggle image.
		            var imgToggleID_ = rowID_ + s_strImageToggle;
		            var img_         = $( "#" + imgToggleID_ );
		            if ( stc_isDefined( img_ ) ) {
			            if ( show_ ) {
						        img_.attr( "src", "img/iconMinusWhite.png" );
			            } else {
						        img_.attr( "src", "img/iconPlus.png" );
			            }//not show_
		            }//img_ valid
		          }//hasTables_
		        } else {
		          row_.css( "display", "none" );
		        }//not show_
	        }//row valid
		    }//parentName name valid

        // Recurse.
        tree_toggleShowDescendantRows( obj_[i], show_ );
      }//if object
    }//for each obj_
  }//tree_toggleShowDescendantRows

  // ============================================================================
  // UPDATE DRAG AND DROP TABLE.
  // ============================================================================

  // DO UPDATE TABLE DROP.
	function tree_doUpdateTableDrop( updateLocation_, sourceID_, targetID_ ) {
		// Store source and target IDs.
		t_sourceID_ = sourceID_;
		t_targetID_ = targetID_;

		// Store update location.
		t_updateLocation = updateLocation_;

		// Use timer to call actual update function.
		// Gives time for last events to finish.
		t_timerUpdateJSON = setTimeout( "tree_updateTableDrop()", 200 );
  }//tree_doUpdateTableDrop

  // UPDATE TABLE DROP.
	function tree_updateTableDrop() {
	  // Clear timer.
	  clearTimeout( t_timerUpdateJSON );

	  // Perform update.
	  if ( stc_isDefined( t_sourceID_ ) && stc_isDefined( t_targetID_ ) ) {
	    // Extract parent and table names from IDs.
	    var sourceTableName_  = stc_splitStringFront( t_sourceID_, s_strTree );
      var sourceParentName_ = stc_splitStringBack( t_sourceID_, s_strTree );
      var targetTableName_  = stc_splitStringFront( t_targetID_, s_strTree );
      var targetParentName_ = stc_splitStringBack( t_targetID_, s_strTree );

	    // Get JSON objects. Source is dragged table, target is table onto which source is dropped.
	    var sourceJSON_ = null;
	    if ( stc_isDefined( sourceParentName_ ) && stc_isDefined( sourceTableName_ ) ) {
	      tree_doGetTreeObject( sourceParentName_, sourceTableName_ );
	      sourceJSON_ = t_objectTraverse;
	    }//sourceParentName_ sourceTableName_ valid

	    var targetJSON_ = null;
	    if ( stc_isDefined( targetParentName_ ) && stc_isDefined( targetTableName_ ) ) {
	      tree_doGetTreeObject( targetParentName_, targetTableName_ );
	      targetJSON_ = t_objectTraverse;
	    }//targetParentName_ targetTableName_ valid

	    // Store vars for selecting target after update.
	    var selectMainID_         = t_targetID_;
	    var selectMainParentName_ = targetParentName_;
	    var selectMainName_       = targetTableName_;
	    var selectRowID_          = stc_getIdentifier( t_targetID_, s_strRow );

	    // Use JSON objects to update master tree array.
	    if ( stc_isDefined( sourceJSON_ ) && stc_isDefined( targetJSON_ ) ) {

	      // VALIDATION.

	      // Before proceeding, make sure user is performing valid update.
	      var updateValid_ = true;

	      // Check if user is moving/copying source to self.
	      if ( sourceTableName_ == targetTableName_ ) {
	        updateValid_ = false;
	        t_indexPageRef.populateLog( t_uiStr.erSameAsTarget_, s_svcVals.error_);
	      }//source same as target

	      // Check if user is moving/copying source to lower position under itself.
	      if ( updateValid_ ) {
	        tree_doCheckForDuplicateAncestor( targetParentName_, targetTableName_, sourceJSON_ );
				  if ( !t_updateValid) {
				    updateValid_ = false;
				    t_indexPageRef.populateLog( t_uiStr.erOwnHierarchy_, s_svcVals.error_);
				  }//t_updateValid false
	      }//updateValid_

	      // Check if user is moving/copying source to target that already has another
	      // direct instance of same source (lower descendants are OK).
	      if ( updateValid_ ) {
				  updateValid_ = tree_checkForDuplicateSource( targetJSON_, sourceTableName_ );
	      }//updateValid_

	      // Check if user is putting table on more than one shard.
	      if ( updateValid_ ) {
				  if ( sourceJSON_.shardParentName != targetJSON_.shardParentName ) {
					  updateValid_ = tree_checkForDuplicateShard( sourceJSON_, sourceJSON_.shardParentName, targetJSON_.shardParentName );
					  if ( !updateValid_ ) {
				      t_indexPageRef.populateLog( t_uiStr.erDupeOnAnotherShard_, s_svcVals.error_);
					  }//not updateValid_
				  }//old and new shard parents are not same
	      }//updateValid_

	      // UPDATE.

		    // Update master tree array.
		    if ( updateValid_ ) {
			    // Stringify master tree array.
			    var strMaster_ = JSON.stringify( t_treeMaster );

			    // Set up vars for update.
			    var newMaster_        = "";
			    var strSource_        = "";
			    var strSourceUpdated_ = "";
			    var strTarget_        = "";
			   	var strTargetUpdated_ = "";
			   	var parsed_           = null;
			   	var fkObj_            = null;

			    // Stringify source.
			    strSource_ = JSON.stringify( sourceJSON_ );

			    // Stringify target.
			    strTarget_ = JSON.stringify( targetJSON_ );

	        // SOURCE.

			    // If user is not copying source, delete source from original location.
			    if ( !t_SHIFTDown ) {
				    // Delete source from tree string.
				    strMaster_ = stc_removeEntryString( strMaster_, strSource_ );

				    // Parse stringified JSON back into JSON.
				    parsed_ = JSON.parse( strMaster_ );

				    // Recreate master tree array.
				    delete t_treeMaster;
				    t_treeMaster = new Array();
				    t_treeMaster = $.merge( t_treeMaster, parsed_ );

				    // Get target JSON object again.
			      tree_doGetTreeObject( targetParentName_, targetTableName_ );
			      targetJSON_ = t_objectTraverse;

				    // Stringify target again.
				    strTarget_ = JSON.stringify( targetJSON_ );
			    }//shift key not down

			    // TARGET.

			    // Set open root flag to true, so target's root gets opened up after initial load.
			    // Store target's root as current root.
			    t_openRoot    = true;
			    t_currentRoot = targetJSON_.shardParentName;

			    // Change shard parentName in all source tables.
			    if ( sourceJSON_.shardParentName != targetJSON_.shardParentName ) {
			      var str0_ = '"shardParentName":"';
			      var str1_ = '",';
			      var searchStr_  = str0_ + sourceJSON_.shardParentName + str1_;
			      var replaceStr_ = str0_ + targetJSON_.shardParentName + str1_;
			      var regExp_ = new RegExp( searchStr_, 'g' );
			      strSourceUpdated_ = strSource_.replace( regExp_, replaceStr_ );
			      sourceJSON_ = JSON.parse( strSourceUpdated_ );
			    }//shard parents do not match

			    // Change source's parentName to target name.
			    sourceJSON_.parentName = targetTableName_;

			    // Change source's ancestorName to target parentName.
			    sourceJSON_.ancestorName = targetParentName_;

			    // Change ancestorName in source's direct children to target name.
			    // We do not have to revise any parentName/ancestorName values below this level.
			    if ( stc_isDefined( sourceJSON_.tables ) ) {
				    var length_ = sourceJSON_.tables.length;
				    for ( var i = 0; i < length_; i++ ) {
				      sourceJSON_.tables[i].ancestorName = targetTableName_;
				    }//for each entry
			    }//tables valid

			    // Init source's foreign key, then insert new default key.
			    // If target is root, leave foreign key blank.
			    if ( stc_isDefined( sourceJSON_.foreignKeys ) ) {
			      sourceJSON_.foreignKeys = [];
				    if ( !tree_isRoot( targetJSON_.type ) ) {
				      fkObj_ = tree_createForeignKey( targetJSON_, sourceJSON_ );
				      if ( stc_isDefined( fkObj_ ) ) {
				        sourceJSON_.foreignKeys.push( fkObj_ );
				      }//fkObj_ valid
				    }//target not root
			    }//foreignKeys valid

			    // Stringify source again.
			    strSource_ = JSON.stringify( sourceJSON_ );

			    // Insert source into target JSON.
			    if ( stc_isDefined( targetJSON_.tables ) ) {
			      // Target already has tables array.
			      // Push source onto tables array.
			      targetJSON_.tables.push( sourceJSON_ );
			    } else {
			      // Target has no tables array.
			      // Create new tables array, push source onto tables array.
			      targetJSON_.tables = new Array();
			      targetJSON_.tables.push( sourceJSON_ );
			    }//tables valid

			    // Stringify updated target.
			    strTargetUpdated_ = JSON.stringify( targetJSON_ );

			    // In stringified master, replace original target with updated target.
			    newMaster_ = "";
			    newMaster_ = strMaster_.replace( strTarget_, strTargetUpdated_ );
			    strMaster_ = newMaster_;

		      // Populate message log.
		      t_indexPageRef.populateLog( t_uiStr.successChangeLocation_, s_svcVals.info_ );

			    // RELATION FORM.

			    // Populate and show relation form.
			    // We show form if user drops table onto another table,
			    // not when user drops table onto root.
			    if ( !tree_isRoot( targetJSON_.type ) ) {
				    var error_ = tree_populateRelationForm( targetJSON_, sourceJSON_ );
				    if ( error_ ) {
				      t_indexPageRef.populateLog( s_message.erApplication_ + " " + s_message.support_, s_svcVals.error_);
				    } else {
				      tree_showRelationForm();
				    }// not error_
			    }//target not root

			    // SUBMIT AND REFRESH TREE ARRAY.

			    // Set up for tree update.
			    // DEPENDENCY: Do this BEFORE recreating master array and setting vars for initial load.
			    tree_setupTreeUpdate();

			    // Parse stringified JSON back into JSON.
			    parsed_ = JSON.parse( strMaster_ );

			    // Recreate master tree array.
			    delete t_treeMaster;
			    t_treeMaster = new Array();
			    t_treeMaster = $.merge( t_treeMaster, parsed_ );

			    // Set vars for initial load.
			    t_loadMainID         = selectMainID_;
			    t_loadMainParentName = selectMainParentName_;
			    t_loadMainName       = selectMainName_;
			    t_loadRowID          = selectRowID_;

			    // Submit tree. Callback returns updated tree.
			    tree_submitTree( s_action.treeUpdate_ );
		    }//updateValid_

		    // If update invalid and came from outside tree, fire selection callback.
		    if ( !updateValid_ ) {
		      if ( t_updateLocation != "" ) {
		        t_callbackSelection();
		      }//t_updateLocation not empty
		    }//updateValid_ not valid
	    }//sourceJSON_ targetJSON_ valid
	  }//t_sourceID_ t_targetID_ valid
  }//tree_updateTableDrop

  // ============================================================================
  // CHECK FOR DUPLICATE.
  // ============================================================================

  // CHECK FOR DUPLICATE TABLE
  // Check if table has more than one instance in tree.
	function tree_checkForDuplicateTable( name_ ) {
    // Stringify master tree array.
    var strMaster_ = JSON.stringify( t_treeMaster );

    // Create string to use in searching for name.
    // Name value can occur in many places, such as parentName, ancestorName, and as table for key.
    // We want to find only instances where name is used strictly as name, so we look for param + value.
    var strName_ = '"name":"' + name_ + '"';

    // Search for all instances of name in tree.
    var indices_ = new Array();
    for( var pos_ = strMaster_.indexOf( strName_ ); pos_ !== -1; pos_ = strMaster_.indexOf( strName_, pos_ + 1 ) ) {
        indices_.push( pos_ );
    }//for each position of name

    // Return array length. If length gt 1, tree contains more than one instance of table.
    return indices_.length;
  }//tree_checkForDuplicateTable

  // CHECK FOR DUPLICATE SOURCE
  // Check if user is moving/copying source to target that already has another
  // direct instance of same source (lower descendants are OK).
	function tree_checkForDuplicateSource( targetJSON_, sourceTableName_ ) {
	  var updateValid_ = true;
	  if ( stc_isDefined( targetJSON_ ) && stc_isDefined( sourceTableName_ ) ) {
	    var targetChildren_ = tree_buildTablesNameArray( targetJSON_ );
	    if ( stc_isDefined( targetChildren_ ) ) {
	      if ( targetChildren_.length > 0 ) {
			    var length_ = targetChildren_.length;
			    for ( var i = 0; i < length_; i++ ) {
			      if ( targetChildren_[i] == sourceTableName_ ) {
			        updateValid_ = false;
			        t_indexPageRef.populateLog( t_uiStr.erSameLocation_, s_svcVals.error_);
			        break;
			      }//match
			    }//for each entry
	      }//targetChildren_ not empty
	    }//targetChildren_ valid
	  }//targetJSON_ sourceTableName_ valid
    return updateValid_;
  }//tree_checkForDuplicateSource

  // DO CHECK FOR DUPLICATE ANCESTOR.
  function tree_doCheckForDuplicateAncestor( parentName_, name_, sourceJSON_ ) {
	  t_updateValid = true;
    if ( stc_isDefined( parentName_ ) && stc_isDefined( name_ ) && stc_isDefined( sourceJSON_ ) ) {
	    tree_checkForDuplicateAncestor( parentName_, name_, sourceJSON_ );
    }//params valid
    return t_updateValid;
  }//tree_doCheckForDuplicateAncestor

  // CHECK FOR DUPLICATE ANCESTOR.
	function tree_checkForDuplicateAncestor( parentName_, name_, obj_ ) {
    for ( i in obj_ ) {
      if ( typeof( obj_[i] ) == "object" ) {
		    var recurse_ = true;
		    if ( stc_isDefined( obj_[i].parentName ) && stc_isDefined( obj_[i].name ) ) {
			    if ( ( obj_[i].parentName == parentName_ ) && ( obj_[i].name == name_ ) ) {
			      recurse_      = false;
			      t_updateValid = false;
			    }//both match
		    }//parentName name valid

        // Recurse.
        if ( recurse_ ) {
          tree_checkForDuplicateAncestor( parentName_, name_, obj_[i] );
        }//recurse_ true
      }//if object
    }//for each obj_
  }//tree_checkForDuplicateAncestor

  // CHECK FOR DUPLICATE SHARD.
	function tree_checkForDuplicateShard( sourceJSON_, shardParentNameOld_, shardParentNameNew_ ) {
		// Set up valid flag.
		var updateValid_ = true;

		// Check for duplicate shard. If user is moving/copying table to different shard, find out
		// if result leaves any given table on more than one shard.
		if ( stc_isDefined( sourceJSON_ ) && stc_isDefined( shardParentNameOld_ ) && stc_isDefined( shardParentNameNew_ ) ) {
	    // Create flat array of all table names in source object - table that is being moved/copied.
	    tree_doGetAllTableNames( sourceJSON_ );

	    // Search thru tree and find any instances of source tables on any shard other than new shard.
	    // Search function sets t_duplicateShard flag.
	    if ( t_SHIFTDown ) {
	      // User is copying source, so search with current tree object.
	      tree_doCheckDupeShard( t_treeMaster, shardParentNameNew_ );
	    } else {
		    // User is moving source, so create temporary tree object that no longer contains source.

		    // Stringify master tree array.
		    var strMaster_ = JSON.stringify( t_treeMaster );

		    // Stringify source.
		    var strSource_ = JSON.stringify( sourceJSON_ );

		    // Delete source from tree string.
			  strMaster_ = stc_removeEntryString( strMaster_, strSource_ );

			  // Parse stringified JSON back into JSON.
			  var parsed_ = JSON.parse( strMaster_ );

			  // Create tree array.
			  var treeMaster_ = new Array();
			  treeMaster_ = $.merge( treeMaster_, parsed_ );

			  // Search with temporary tree object.
			  tree_doCheckDupeShard( treeMaster_, shardParentNameNew_ );
	    }//not shift down - user is moving source

	    // Set valid flag according to t_duplicateShard flag.
		  if ( t_duplicateShard ) {
		    updateValid_ = false;
		  }//	t_duplicateShard true
		}//params valid

		// Return valid flag.
		return updateValid_;
	}//tree_checkForDuplicateShard

  // DO CHECK DUPE SHARD.
	function tree_doCheckDupeShard( obj_, shardParentNameNew_ ) {
	  // Init flags. During check, if duplicate shard condition is found, set t_duplicateShard to true,
	  // then set t_traverseDuplicateShard to false to stop further recursion.
	  t_duplicateShard         = false;
	  t_traverseDuplicateShard = true;

	  // Run duplicate shard check. Sets t_duplicateShard and t_traverseDuplicateShard flags.
	  tree_isDupeShard( obj_, shardParentNameNew_ );

    // Start recursion thru tree object.
    if ( t_traverseDuplicateShard ) {
      tree_checkDupeShard( obj_, shardParentNameNew_ );
    }//t_traverseDuplicateShard true

		// Make sure traverse flag is false.
		t_traverseDuplicateShard = false;
  }//tree_doCheckDupeShard

  // CHECK DUPE SHARD.
	function tree_checkDupeShard( obj_, shardParentNameNew_ ) {
    for ( i in obj_ ) {
      if ( typeof( obj_[i] ) == "object" ) {
        // Run duplicate shard check. Sets t_duplicateShard and t_traverseDuplicateShard flags.
        tree_isDupeShard( obj_[i], shardParentNameNew_ );

        // Check traverse flag and recurse.
        if ( t_traverseDuplicateShard ) {
          tree_checkDupeShard( obj_[i], shardParentNameNew_ );
        } else {
          return;
        }//not t_traverseDuplicateShard

      }//if object
    }//for each obj_
  }//tree_checkDupeShard

  // IS DUPE SHARD.
	function tree_isDupeShard( obj_, shardParentNameNew_ ) {
	  if ( stc_isDefined( obj_ ) && stc_isDefined( shardParentNameNew_ ) ) {
      if ( stc_isDefined( obj_.name ) && stc_isDefined( obj_.shardParentName ) ) {
        // Run check if current object is on shard other than new shard.
        if ( obj_.shardParentName != shardParentNameNew_ ) {
	        // If current name is included in array of source names, it means
	        // at least one table in source is on shard other than new shard.
	        // This is duplicate shard condition, and is error.
		      if ( $.inArray( obj_.name, t_allTableNames ) > -1 ) {
	          t_duplicateShard         = true;
	          t_traverseDuplicateShard = false;
		      }//found
        }//shardParentName not match
      }//name shardParentName valid
	  }//params valid
  }//tree_isDupeShard

  // ============================================================================
  // EDIT.
  // ============================================================================

  // DELETE ITEM.
	function tree_deleteItem() {
	  // Close relation form.
	  tree_closeRelationForm();

	  // Delete item and update.
	  if ( stc_isDefined( t_objectSelected ) ) {
	    if ( t_editable && stc_isDefined( t_objectSelected.type ) ) {

	      // Get table length.
        var tableLength_ = 0;
        if ( stc_isDefined( t_objectSelected.tables ) ) {
          tableLength_ = t_objectSelected.tables.length;
        }//tables valid

	      // Handle delete action.
	      if ( t_objectSelected.type != s_tableType.shardTreeGlobal_ && tableLength_ == 0 ) {

					// Confirm and delete.
					var yes_ = confirm( s_message.confirmDelete_ );
					if ( yes_ ) {

		        // DELETE ITEM.

				    // If static root, remove rootName from physical shard array.
				    if ( tree_isRoot( t_objectSelected.type ) && t_objectSelected.type == s_tableType.shardTreeStatic_ ) {
				      tree_updatePhysicalShardArray( t_objectSelected.nbrShard, "" );
				    }//static root

				    // Stringify master tree array.
				    var strMaster_ = JSON.stringify( t_treeMaster );

				    // Stringify item.
				    var strItem_ = JSON.stringify( t_objectSelected );

				    // Delete item from tree string.
				    strMaster_ = stc_removeEntryString( strMaster_, strItem_ );

		        // Populate message log.
		        t_indexPageRef.populateLog( t_uiStr.successDeleteItem_, s_svcVals.info_ );

		        // SUBMIT AND REFRESH TREE ARRAY.

				    // Set up for tree update.
				    // DEPENDENCY: Do this BEFORE recreating master array and setting vars for initial load.
				    tree_setupTreeUpdate();

				    // Parse stringified JSON back into JSON.
				    parsed_ = JSON.parse( strMaster_ );

				    // Recreate master tree array.
				    delete t_treeMaster;
				    t_treeMaster = new Array();
				    t_treeMaster = $.merge( t_treeMaster, parsed_ );

				    // Init vars for initial load.
				    t_loadMainID         = null;
				    t_loadMainParentName = null;
				    t_loadMainName       = null;
				    t_loadRowID          = null;

				    // Fire wipe load callback.
				    t_callbackWipeLoad();

				    // Submit tree. Callback returns updated tree.
				    tree_submitTree( s_action.treeUpdate_ );

					}//yes_

	      }//not global and is empty
	    }//t_editable	and type valid
	  }//t_objectSelected valid
  }//tree_deleteItem

  // ============================================================================
  // ROOT EDIT.
  // ============================================================================

  // ADD ROOT.
	function tree_addRoot( type_ ) {
	  // Close relation form.
	  tree_closeRelationForm();

	  // Get next default physical shard number.
    var nbrShardDefault_ = tree_getDefaultPhysicalShard();

    // Determine if we can add root. If user is adding static root, there must be available physical shard.
    var okToAdd_ = true;
    if ( type_ == s_tableType.shardTreeStatic_ ) {
      if ( nbrShardDefault_ == 0 ) { okToAdd_ = false; }
    }//static root

    // If OK to add, proceed with add operation.
    // If not, populate message log.
    if ( okToAdd_ ) {
		  // Create new root and update.
		  if ( stc_isDefined( t_masterParentName ) && stc_isDefined( type_ ) ) {
		    if ( t_masterParentName != "" ) {

			    // CREATE NEW ROOT.

			    // Get unique number for creating default root name, then create name.
			    var strRoot_ = s_strStaticRoot;
			    if ( type_ == s_tableType.shardTreeRelational_ ) { strRoot_ = s_strRelationalRoot; }
	        var nbrStr_ = stc_getDefaultNumber( t_indexPageRef, t_roots, "name", strRoot_, 4, 9999, "0" );
	        var name_   = strRoot_ + nbrStr_;

			    // Create new shard tree root.
			    var obj_             = new Object();
			    obj_.shardParentName = name_;
			    obj_.ancestorName    = t_masterParentName;
			    obj_.parentName      = t_masterParentName;
			    obj_.name            = name_;
			    obj_.type            = type_;
			    obj_.level           = "0";
			    obj_.nbrShard        = "0";
			    obj_.keyShard        = "newShardKey" + "_" + name_;
			    obj_.tables          = new Array();

			    // Set shard number.
			    if ( obj_.type == s_tableType.shardTreeStatic_ ) {
			      obj_.nbrShard = nbrShardDefault_.toString();
			    }//static root

			    // Add new root to master.
			    t_treeMaster.push( obj_ );

			    // Store master.
			    var masterArray_ = new Array();
			    masterArray_ = $.merge( masterArray_, t_treeMaster );

			    // Update physical shard array. Insert rootName into entry with matching shard number.
			    if ( obj_.type == s_tableType.shardTreeStatic_ ) {
			      tree_updatePhysicalShardArray( obj_.nbrShard, name_ );
			    }//static root

		      // Populate message log.
		      t_indexPageRef.populateLog( t_uiStr.successAddRoot_, s_svcVals.info_ );

			    // RELATION FORM.

			    // DEPENDENCY: Do this after updating physical shard array.
			    // Populate and show relation form.
			    var error_ = tree_populateRelationForm( obj_, null );
			    if ( error_ ) {
			      t_indexPageRef.populateLog( s_message.erApplication_ + " " + s_message.support_, s_svcVals.error_);
			    } else {
			      tree_showRelationForm();
			    }// not error_

			    // SUBMIT AND REFRESH TREE ARRAY.

			    // Set up for tree update.
			    // DEPENDENCY: Do this BEFORE recreating master array and setting vars for initial load.
			    tree_setupTreeUpdate();

			    // Recreate master tree array.
			    delete t_treeMaster;
			    t_treeMaster = new Array();
			    t_treeMaster = $.merge( t_treeMaster, masterArray_ );

			    // Init vars for initial load.
			    t_loadMainID         = null;
			    t_loadMainParentName = null;
			    t_loadMainName       = null;
			    t_loadRowID          = null;

			    // Fire wipe load callback.
			    t_callbackWipeLoad();

			    // Submit tree. Callback returns updated tree.
			    tree_submitTree( s_action.treeUpdate_ );
		    }//t_masterParentName not empty
		  }//t_masterParentName type_ valid
    } else {
      t_indexPageRef.populateLog( t_uiStr.erNoMoreShards_, s_svcVals.error_);
    }//not okToAdd_
  }//tree_addRoot

  // REGENERATE ROOT.
	function tree_regenerateRoot() {
	  // Close relation form.
	  tree_closeRelationForm();

	  // Regenerate root and update.
	  if ( stc_isDefined( t_objectSelected ) ) {
	    if ( t_editable && stc_isDefined( t_objectSelected.type ) ) {
	      if ( tree_isRoot( t_objectSelected.type ) &&
	           t_objectSelected.type != s_tableType.shardTreeGlobal_ ) {

		      // Populate message log.
		      t_indexPageRef.populateLog( t_uiStr.successRegenerateRoot_, s_svcVals.info_ );

	        // SUBMIT AND REFRESH TREE ARRAY.

			    // Set up for tree regenerate.
			    tree_setupTreeRegenerate();

			    // Submit tree. Callback returns updated tree.
			    tree_submitTree( s_action.treeUpdate_ );

	      }//root and not global
	    }//t_editable	and type valid
	  }//t_objectSelected valid
  }//tree_regenerateRoot

  // INIT ALL ROOT EDIT.
  function tree_initAllRootEdit( id_ ) {
	  // Use dummy field to receive focus away from all rootName fields.
	  if ( !stc_isDefined( id_ ) ) {
	    $( "#_dummy" ).focus();
	  }//id_ not valid

	  // Restore each input field to non-edit condition.
	  $( ".inputTree" ).each( function( i ) {
		  if ( $( this ).attr( "id" ) != id_ ) {
			  // Get existing rootName.
			  var rootName_ = stc_splitStringFront( $( this ).prop( "name" ), s_strTree );

		    // Restore rootName.
		    $( this ).val( rootName_ );

		    // Restore normal border and title.
			  $( this ).removeClass( "bgError" ).addClass( "bgTransBorderedTan" );
			  if ( t_editable ) {
			    $( this ).attr( "title", t_uiStr.tipRootName_ );
			  }//t_editable true

			  // Set cursor to default.
			  $( this ).css( "cursor", "default" );

	      // Hide update icon.
	      var rowID_       = stc_splitStringFront( $( this ).attr( "id" ), s_strInput );
	      var imgUpdateID_ = rowID_ + s_strImageUpdate;
	      if ( stc_isDefined( $( "#" + imgUpdateID_ ) ) ) {
	        $( "#" + imgUpdateID_ ).css( "visibility", "hidden" );
	      }//element valid
		  }//no match
		});
  }//tree_initAllRootEdit

  // VALIDATE ROOT NAME.
  function tree_validateRootName( inputField_ ) {
    // Init error flag.
    var error_ = false;

    // Init error title.
    var titleError_ = "";

    // Validate field.
    if ( stc_isDefined( inputField_ ) ) {
	    // Get ID.
	    var id_ = inputField_.attr( "name" );

      // Get existing name stored in ID.
      var rootNameExisting_ = stc_splitStringFront( id_, s_strTree );

	    // Get input value.
	    var rootName_ = inputField_.val();

	    // Get update icon.
      var updateIcon_  = null;
      var rowID_       = stc_splitStringFront( inputField_.attr( "id" ), s_strInput );
      var imgUpdateID_ = rowID_ + s_strImageUpdate;
      if ( stc_isDefined( $( "#" + imgUpdateID_ ) ) ) {
        updateIcon_ = $( "#" + imgUpdateID_ );
      }//element valid

	    // Validate.
	    if ( stc_isDefined( id_ ) && stc_isDefined( rootNameExisting_ ) && stc_isDefined( rootName_ ) && stc_isDefined( updateIcon_ ) ) {
        // Filter out special characters.
        rootName_ = rootName_.replace(/[^\w\s]/gi, '');
        inputField_.val( rootName_ );

        // Check for empty rootName.
        if ( rootName_ == "" ) {
          // Set error flag and title.
          error_      = true;
          titleError_ = t_uiStr.erEmptyRootName_;
        }//rootName_ empty

        // Check for duplicate rootName.
        if ( rootName_ != "" ) {
          if ( rootName_ != rootNameExisting_ ) {
		        var searchStr_ = '"' + rootName_ + '"';
		        if ( t_rootNameStr_.indexOf( searchStr_ ) > -1 ) {
	            // Set error flag and title.
	            error_      = true;
	            titleError_ = rootName_ + " " + t_uiStr.erDupeRootName_;
		        }//found
          }//user changed name
        }//not empty

        // Set field border and title and hide/show update icon.
        if ( error_ ) {
          // Set field border and title.
          inputField_.removeClass( "bgTransBorderedTan" ).addClass( "bgError" );
          inputField_.attr( "title", titleError_ );

          // Hide update icon.
          updateIcon_.css( "visibility", "hidden" );
        } else {
          // Set field border and title.
          inputField_.removeClass( "bgError" ).addClass( "bgTransBorderedTan" );
				  if ( t_editable ) {
				    inputField_.attr( "title", t_uiStr.tipRootName_ );
				  }//t_editable true

          // If user has changed value, show update icon.
          if ( rootName_ != rootNameExisting_ ) {
	          updateIcon_.css( "visibility", "visible" );
          }//user changed value
        }//not error_
	    }//id_ rootNameExisting_ rootName_ updateIcon_ valid
    }//inputField_ valid

    // Return error flag.
    return error_;
  }//tree_validateRootName

  // HANDLE ROOT NAME.
  function tree_handleRootName( event, action_ ) {
    if ( stc_isDefined( event.target.id ) && stc_isDefined( action_ ) ) {
	    // Get input field.
	    var inputField_ = $( "#" + event.target.id );

	    // Handle event.
	    if ( stc_isDefined( inputField_ ) ) {
	      switch( action_ ) {

	        case "focus":
	          tree_initAllRootEdit( event.target.id );
	          inputField_.css( "cursor", "text" );
	        break;

	        case "input":
	          tree_validateRootName( inputField_ );
	        break;

	        default: break;
	      }//switch action_
	    }//inputField_ valid
    }//params valid
  }//tree_handleRootName

  // SAVE ROOT NAME.
  function tree_saveRootName( event ) {
    if ( stc_isDefined( event.target.id ) ) {
	    // Get input field. If valid, process update.
      var rowID_   = stc_splitStringFront( event.target.id, s_strImageUpdate );
      var inputID_ = rowID_ + s_strInput;
      if ( $( "#" + inputID_ ) ) {
        var inputField_ = $( "#" + inputID_ );
        if ( stc_isDefined( inputField_ ) ) {
			    // Init error flag.
			    var error_ = false;

			    // Get ID.
			    var id_ = inputField_.attr( "name" );

	        // Get existing name stored in ID.
	        var rootNameExisting_ = stc_splitStringFront( id_, s_strTree );

			    // Get input value.
			    var rootName_ = inputField_.val();

			    // Check for errors and update.
			    if ( stc_isDefined( id_ ) && stc_isDefined( rootNameExisting_ ) && stc_isDefined( rootName_ ) ) {
	          // Validate field.
	          error_ = tree_validateRootName( inputField_ );

	          // If no errors, update JSON.
	          // Handle any errors.
	          if ( error_ ) {
	            // Insert original value.
	            inputField_.val( rootNameExisting_ );

		          // Set field border and title.
		          if ( inputField_.val() != "" ) {
		            inputField_.removeClass( "bgError" ).addClass( "bgTransBorderedTan" );
		            inputField_.attr( "title", t_uiStr.erEmptyRootName_ );
		          }//not empty
	          } else {
	            if ( rootName_ != rootNameExisting_ ) {
	              tree_updateRootName( id_, rootName_ );
	            }//user changed name
	          }//error_
			    }//id_ rootNameExisting_ rootName_ valid

        }//inputField_ valid
      }//element valid
    }//params valid
  }//tree_saveRootName

  // UPATE ROOT NAME.
	function tree_updateRootName( id_, rootNameNew_ ) {
		if ( stc_isDefined( id_ ) && stc_isDefined( rootNameNew_ ) ) {
	    var rootNameExisting_ = stc_splitStringFront( id_, s_strTree );
	    var rootParentName_   = stc_splitStringBack( id_, s_strTree );
	    if ( rootParentName_ == t_masterParentName ) {
		    // Stringify master.
		    var strMaster_ = JSON.stringify( t_treeMaster );

	      // Replace all instances of existing root name with new one.
	      var searchStr_  = '"' + rootNameExisting_ + '"';
	      var replaceStr_ = '"' + rootNameNew_ + '"';
	      var regExp_ = new RegExp( searchStr_, 'g' );
	      strMaster_ = strMaster_.replace( regExp_, replaceStr_ );

		    // Create new ID.
		    var obj_        = new Object();
		    obj_.parentName = rootParentName_;
		    obj_.name       = rootNameNew_;
		    var idNew_      = tree_buildTreeID( obj_ ) ;

        // Populate message log.
        t_indexPageRef.populateLog( t_uiStr.successRenameRoot_, s_svcVals.info_ );

        // SUBMIT AND REFRESH TREE ARRAY.

		    // Set up for tree update.
		    // DEPENDENCY: Do this BEFORE recreating master array and setting vars for initial load.
		    tree_setupTreeUpdate();

		    // Parse stringified JSON back into JSON.
		    var parsed_ = JSON.parse( strMaster_ );

		    // Recreate master tree array.
		    delete t_treeMaster;
		    t_treeMaster = new Array();
		    t_treeMaster = $.merge( t_treeMaster, parsed_ );

		    // Set vars for initial load.
		    t_loadMainID         = idNew_;
		    t_loadMainParentName = rootParentName_;
		    t_loadMainName       = rootNameNew_;
		    t_loadRowID          = stc_getIdentifier( idNew_, s_strRow );

		    // Submit tree. Callback returns updated tree.
		    tree_submitTree( s_action.treeUpdate_ );
	    }//rootParentName_ same as t_masterParentName
		}//id_ rootNameNew_ valid
  }//tree_updateRootName

  // ============================================================================
  // RELATION FORM.
  // ============================================================================

  // CLOSE RELATION FORM.
  function tree_closeRelationForm() {
    if ( stc_isDefined( t_containerRelation) ) {
	    t_containerRelation.css( "visibility", "hidden" );
    }//t_containerRelation valid
  }//tree_closeRelationForm

  // DO SELECTED RELATION FORM.
  function tree_doSelectedRelationForm() {
    // Init error flag.
    var error_ = false;

    // Populate and show form according to type.
    if ( stc_isDefined( t_objectSelected ) ) {
      // Get type.
      var type_ = t_objectSelected.type;

      // Populate and show form according to type.
      if ( stc_isDefined( type_ ) ) {
	      switch( type_ ) {

	        case s_tableType.shardTreeGlobal_:
	        break;

	        case s_tableType.shardTreeRelational_:
				    error_ = tree_populateRelationForm( t_objectSelected, null );
				    if ( !error_ ) {
				      tree_showRelationForm();
				    }// not error_
	        break;

	        case s_tableType.shardTreeStatic_:
				    error_ = tree_populateRelationForm( t_objectSelected, null );
				    if ( !error_ ) {
				      tree_showRelationForm();
				    }// not error_
	        break;

	        default:
	          // Store current object as child object.
	          var objChild_ = new Object();
	          objChild_     = t_objectSelected;

				    // Get parent object.
				    var objParent_ = new Object();
						tree_doGetTreeObject( t_objectSelected.ancestorName, t_objectSelected.parentName );
						objParent_ = t_objectTraverse;

				    // Populate and show relation form.
				    error_ = tree_populateRelationForm( objParent_, objChild_ );
				    if ( !error_ ) {
				      tree_showRelationForm();
				    }// not error_
	        break;

	      }//switch type_
      }//type_ valid
    }//t_objectSelected valid

    // If error, populate message log.
    if ( error_ ) {
      t_indexPageRef.populateLog( s_message.erApplication_ + " " + s_message.support_, s_svcVals.error_);
    }//error_
  }//tree_doSelectedRelationForm

  // POPULATE RELATION FORM.
  function tree_populateRelationForm( objParent_, objChild_ ) {
	  // Init error flag.
	  var error_ = false;

	  // Store objects connected to form.
    t_formParent = new Object(); t_formParent = objParent_;
    t_formChild  = new Object(); t_formChild  = objChild_;

	  // Populate form.
	  if ( stc_isDefined( t_containerRelation ) && stc_isDefined( t_formRelation ) && stc_isDefined( t_titleRelation ) && stc_isDefined( objParent_ ) ) {
      // Clear out form.
      t_formRelation.html( "" );
      t_titleRelation.html( "" );

      // Get type.
      var type_ = objParent_.type;

      // Create form.
      if ( stc_isDefined( type_ ) ) {
        // Create var for title.
        var title_ = "";

        // Create vars for form labels.
        var formLabel0_        = "<div class='cellFluid' style='margin-top: 10px;'>";
        var formLabel1_        = "</div>";
        var formLabel_         = "";
        var formLabelComplete_ = "";

        // Create vars for form fields.
        var formField0_           = "<div class='cellFluid' style='margin-top: 10px;'>";
        var formField1_           = "<div class='cellFluidSeparator'>&nbsp;</div>" +
                                    "<div class='fieldForm'>" +
                                    "<button id='_btnRelationSave'   title='Save changes.'>Save</button>&nbsp;" +
                                    "<button id='_btnRelationCancel' title='Close without saving changes.'>Cancel</button>" +
                                    "</div>";
        var formField1ReadOnly_   = "<div class='cellFluidSeparator'>&nbsp;</div></div>";
        var formField_            = "";
        var formFieldComplete_    = "";

        // Populate form according to type.
	      switch( type_ ) {

	        case s_tableType.shardTreeGlobal_:
	        break;

	        case s_tableType.shardTreeRelational_:

	          // Set container style.
	          t_containerRelation.css( "width", "400px" );
	          t_containerRelation.css( "height", "130px" );
	          t_containerRelation.css( "min-width", "400px" );
	          t_containerRelation.css( "min-height", "130px" );

	          // Set title.
	          title_ = t_uiStr.titleRTreeForm_;

	          // Get shard key.
	          var keyShard_ = s_message.notFound_;
	          if ( stc_isDefined( objParent_.keyShard ) ) {
	            keyShard_ = objParent_.keyShard;
	          }//keyShard valid

	          // Create form label/field strings.
	          formLabel_ = "<span class='labelFormFirst'>Shard key:</span>";
	          formField_ = "<input id='_keyShard' class='inputSmall fieldFormFirst bgFieldReadonly' style='width: 200px;' type='text' disabled='disabled' value='" + keyShard_ + "' />";

			      // Concatenate form label and field strings.
			      formLabelComplete_ = formLabel0_ + formLabel_ + formLabel1_;
			      formFieldComplete_ = formField0_ + formField_ + formField1ReadOnly_;

	        break;

	        case s_tableType.shardTreeStatic_:

	          // Set container style.
	          t_containerRelation.css( "width", "350px" );
	          t_containerRelation.css( "height", "190px" );
	          t_containerRelation.css( "min-width", "350px" );
	          t_containerRelation.css( "min-height", "190px" );

	          // Set title.
	          title_ = t_uiStr.titleSTreeForm_;

	          // Get number of current physical shard.
	          var nbrShard_ = s_message.notFound_;
	          if ( stc_isDefined( objParent_.nbrShard ) ) {
	            nbrShard_ = objParent_.nbrShard;
	          }//nbrShard valid

				    // Create physical shard dropdown options.
				    var optionsPhysicalShard_ = tree_createPhysicalShardOptions( objParent_ );

	          // Create form label/field strings.
	          // Concatenate form label and field strings.
	          if ( optionsPhysicalShard_ != "" ) {
		          // Create label/field strings.
		          formLabel_ = "<span class='labelFormFirst'>Current physical shard:</span>" +
		                       "<span class='labelForm'>Select new physical shard:</span>";
		          formField_ = "<input class='inputSmall fieldFormFirst bgFieldReadonly' style='width: 100px;' type='text' disabled='disabled' value='" + nbrShard_ + "' />" +
		                       "<select id='_dropdownPhysicalShard' class='selectSmall fieldForm bgNearWhiteBorderedGray' size='1' style='width: 117px; cursor: default;'>" +
		                       optionsPhysicalShard_ + "</select>";

				      // Concatenate form label and field strings.
				      formLabelComplete_ = formLabel0_ + formLabel_ + formLabel1_;
				      formFieldComplete_ = formField0_ + formField_ + formField1_;
	          } else {
		          // Set container style.
		          t_containerRelation.css( "height", "130px" );
		          t_containerRelation.css( "min-height", "130px" );

		          // Create label/field strings.
		          formLabel_ = "<span class='labelFormFirst'>Current physical shard:</span>";
		          formField_ = "<input class='inputSmall fieldFormFirst bgFieldReadonly' style='width: 100px;' type='text' disabled='disabled' value='" + nbrShard_ + "' />";

			        // Concatenate label and field strings.
			        formLabelComplete_ = formLabel0_ + formLabel_ + formLabel1_;
			        formFieldComplete_ = formField0_ + formField_ + formField1ReadOnly_;
	          }//empty

	        break;

	        default:

	          if ( stc_isDefined( objChild_ ) ) {
		          // Set container style.
		          t_containerRelation.css( "width", "550px" );
		          t_containerRelation.css( "height", "350px" );
		          t_containerRelation.css( "min-width", "550px" );
		          t_containerRelation.css( "min-height", "350px" );

		          // Set title.
		          title_ = t_uiStr.titleRelationForm_;

		          // Create options.
		          var optionsParent_ = tree_createRelationOptions( objParent_ );
		          var optionsChild_  = tree_createRelationOptions( objChild_ );

		          // Get FK.
		          var fk0_ = s_message.notFound_;
		          var fk1_ = s_message.notFound_;
		          if ( stc_isDefined( objChild_.foreignKeys ) ) {
		            keys_ = objChild_.foreignKeys;
		            if ( stc_isDefined( keys_[0] ) ) {
						      fk0_ = "REF: " + keys_[0].reference + "(" + keys_[0].key + ")";
						      fk1_ = "FK: " + keys_[0].fk;
		            }//first entry valid
		          }//foreignKeys valid

				      // Create strings for displayed FK.
				      var textNormalized_ = stc_normalizeText( fk0_, t_charLimit.fk0_ );
				      var fk0Display_     = stc_addEllipsis( fk0_, textNormalized_, t_charLimit.fk0_ );

				      textNormalized_ = stc_normalizeText( fk1_, t_charLimit.fk0_ );
				      var fk1Display_ = stc_addEllipsis( fk1_, textNormalized_, t_charLimit.fk0_ );

		          // Create form label/field strings.
		          formLabel_ = "<span class='labelFormFirst'>Parent table:</span>" +
		                       "<span class='labelForm'>Child table:</span>" +
		                       "<span class='labelForm'>Foreign key:</span>" +
		                       "<span class='labelForm'>&nbsp;</span>" +
		                       "<div class='cellFluidSeparator'>&nbsp;</div>" +
		                       "<span class='labelForm'>Select new parent column:</span>" +
		                       "<span class='labelForm'>Select new child column:</span>";
		          formField_ = "<input class='inputSmall fieldFormFirst bgFieldReadonly' style='width: 300px;' type='text' disabled='disabled' value='" + objParent_.name + "' />" +
		                       "<input class='inputSmall fieldForm fieldFormSmall bgFieldReadonly' style='width: 300px;' type='text' disabled='disabled' value='" + objChild_.name + "' />" +
		                       "<input class='inputSmall fieldForm fieldFormSmall bgFieldReadonly' style='width: 300px;' type='text' disabled='disabled' title='" + fk0_ + "' value='" + fk0Display_ + "' />" +
		                       "<input class='inputSmall fieldForm fieldFormSmall bgFieldReadonly' style='width: 300px;' type='text' disabled='disabled' title='" + fk1_ + "' value='" + fk1Display_ + "' />" +
		                       "<div class='cellFluidSeparator'>&nbsp;</div>" +
		                       "<select id='_dropdownColParent' class='selectSmall fieldForm fieldFormSmall bgNearWhiteBorderedGray' size='1' style='width: 317px; cursor: default;'>"+
		                       optionsParent_ + "</select>" +
		                       "<select id='_dropdownColChild' class='selectSmall fieldForm fieldFormSmall bgNearWhiteBorderedGray' size='1' style='width: 317px; cursor: default;'>" +
		                       optionsChild_ + "</select>";

				      // Concatenate form label and field strings.
				      formLabelComplete_ = formLabel0_ + formLabel_ + formLabel1_;
				      formFieldComplete_ = formField0_ + formField_ + formField1_;

	          }//objChild_ valid

	        break;

	      }//switch type_

	      // Set title.
	      t_titleRelation.html( title_ );

        // Append form to dialog.
        t_formRelation.html( formLabelComplete_ + formFieldComplete_ );

        // Assign event to form buttons.
		    if ( stc_isDefined( $( "#_btnRelationSave" ) ) ) {
		      $( "#_btnRelationSave" ).on( "click", function( event ) { tree_handleRelationForm(); });
		    }//_btnRelationSave valid
		    if ( stc_isDefined( $( "#_btnRelationCancel" ) ) ) {
		      $( "#_btnRelationCancel" ).on( "click", function( event ) { tree_closeRelationForm(); });
		    }//_btnRelationCancel valid
      }//type_ valid
	  }//params valid

	  // Return error flag.
	  return error_;
  }//tree_populateRelationForm

  // SHOW RELATION FORM.
  function tree_showRelationForm() {
	  if ( stc_isDefined( t_containerRelation ) ) {
	    t_containerRelation.css( "visibility", "visible" );
	  }//t_containerRelation valid
  }//tree_showRelationForm

	// CREATE RELATION OPTIONS.
	function tree_createRelationOptions( obj_ ) {
	  // Set up processing vars.
    var options_ = "";
    var option_  = "";

    // Create options.
    if ( stc_isDefined( obj_ ) ) {
      if ( stc_isDefined( obj_.columns ) ) {
	      var length_ = obj_.columns.length;
	      for ( var i = 0; i < length_; i++ ) {
	        option_ = "<option value='" + obj_.columns[i] + "'>" + obj_.columns[i] + "</option>";
	        options_ += option_;
	      }//for each entry
      }//columns valid
    }//obj_ valid

    // Return options.
    return options_;
  }//tree_createRelationOptions

  // CREATE FOREIGN KEY.
  function tree_createForeignKey( objParent_, objChild_ ) {
	  var fkObj_ = new Object();
	  if ( stc_isDefined( objParent_ ) && stc_isDefined( objChild_ ) ) {
	    if ( stc_isDefined( objParent_.columns ) && stc_isDefined( objChild_.columns ) ) {
		    if ( stc_isDefined( objParent_.columns[0] ) && stc_isDefined( objChild_.columns[0] ) ) {
		      fkObj_.table     = objChild_.name;
		      fkObj_.reference = objParent_.name;
		      fkObj_.key       = objParent_.columns[0];
		      fkObj_.fk        = objChild_.columns[0];
		    }//columns valid
	    }//columns valid
	  }//params valid
	  return fkObj_;
  }//tree_createForeignKey

  // HANDLE RELATION FORM.
  function tree_handleRelationForm() {
	  if ( stc_isDefined( t_formParent ) ) {
      // Get type.
      var type_ = t_formParent.type;

	    // Set up processing vars.
	    var selectMainID_         = "";
	    var selectMainParentName_ = "";
	    var selectMainName_       = "";
	    var selectRowID_          = "";
	    var strMaster_            = "";
	    var newMaster_            = "";
	    var parsed_               = "";
	    var doUpdate_             = false;

	    // Stringify master tree array.
	    strMaster_ = JSON.stringify( t_treeMaster );

      // Handle form according to type.
      if ( stc_isDefined( type_ ) ) {
	      switch( type_ ) {

	        case s_tableType.shardTreeGlobal_:
	        break;

	        case s_tableType.shardTreeRelational_:
	        break;

	        case s_tableType.shardTreeStatic_:
				    // Store vars for selecting current item after update.
				    selectMainID_         = tree_buildTreeID( t_formParent );
				    selectMainParentName_ = t_formParent.parentName;
				    selectMainName_       = t_formParent.name;
				    selectRowID_          = stc_getIdentifier( selectMainID_, s_strRow );

	          // Get number of current physical shard.
	          var nbrShard_ = 0;
	          if ( stc_isDefined( t_formParent.nbrShard ) ) {
	            nbrShard_ = parseInt( t_formParent.nbrShard );
	          }//nbrShard valid

				    // Get physical shard dropdown selection.
				    var nbrShardNew_ = 0;
				    if ( stc_isDefined( $( "#_dropdownPhysicalShard" ) ) ) {
				      nbrShardNew_ = parseInt( $( "#_dropdownPhysicalShard" ).val() );
				    }//_dropdownPhysicalShard valid

				    // If user changed number, update.
				    if ( nbrShardNew_ > 0 && ( nbrShard_ != nbrShardNew_ ) ) {
					    // Remove rootName from entry in physical shard array with old shard number.
					    tree_updatePhysicalShardArray( nbrShard_, "" );

					    // Update physical shard array. Insert rootName into entry with new shard number.
					    tree_updatePhysicalShardArray( nbrShardNew_, t_formParent.name );

					    // In stringified master, replace original shard number with new shard number.
					    var strShardOriginal_ = '"nbrShard":"' + nbrShard_ + '"';
					    var strShardNew_      = '"nbrShard":"' + nbrShardNew_ + '"';
					    newMaster_ = strMaster_.replace( strShardOriginal_, strShardNew_ );
					    strMaster_ = newMaster_;

					    // Set update flag.
					    doUpdate_ = true;
				    }//nbrShardNew_ gt 0 and not same as nbrShard_
	        break;

	        default:
	          if ( stc_isDefined( t_formChild ) ) {
					    // Store vars for selecting current item after update.
					    selectMainID_         = tree_buildTreeID( t_formChild );
					    selectMainParentName_ = t_formChild.parentName;
					    selectMainName_       = t_formChild.name;
					    selectRowID_          = stc_getIdentifier( selectMainID_, s_strRow );

					    // Stringify child's foreign keys.
					    var strChildKeys_ = JSON.stringify( t_formChild.foreignKeys );

		          // Get current FK.
		          var fk_ = "";
		          if ( stc_isDefined( t_formChild.foreignKeys ) ) {
		            keys_ = t_formChild.foreignKeys;
		            if ( stc_isDefined( keys_[0] ) ) {
						      fk_ = keys_[0];
		            }//first entry valid
		          }//foreignKeys valid

		          // Get parent column.
		          var colParent_ = "";
					    if ( stc_isDefined( $( "#_dropdownColParent" ) ) ) {
					      colParent_ = $( "#_dropdownColParent" ).val();
					    }//_dropdownColParent valid

		          // Get child column.
		          var colChild_ = "";
					    if ( stc_isDefined( $( "#_dropdownColChild" ) ) ) {
					      colChild_ = $( "#_dropdownColChild" ).val();
					    }//_dropdownColChild valid

					    // If user changed foreign key, update.
					    if ( t_formParent.name != fk_.reference ||
					         colParent_ != fk_.key ||
					         colChild_ != fk_.fk ) {

					      if ( stc_isDefined( t_formParent.name ) && stc_isDefined( colParent_ ) && stc_isDefined( colChild_ ) ) {
						      if ( t_formParent.name != "" && colParent_ != "" && colChild_ != "" ) {

								    // Set open root flag to true, so current root gets opened up after initial load.
								    // Store current root as current root.
								    t_openRoot    = true;
								    t_currentRoot = t_formParent.shardParentName;

								    // Init child's foreign key, then insert new key.
								    if ( stc_isDefined( t_formChild.foreignKeys ) ) {
								      t_formChild.foreignKeys = [];
								      var fkObj_              = new Object();
								      fkObj_.table            = t_formChild.name;
								      fkObj_.reference        = t_formParent.name;
								      fkObj_.key              = colParent_;
								      fkObj_.fk               = colChild_;
									    t_formChild.foreignKeys.push( fkObj_ );
								    }//foreignKeys valid

								    // Stringify updated child keys.
								    var strChildUpdated_ = JSON.stringify( t_formChild.foreignKeys );

								    // In stringified master, replace original child keys with updated child keys.
								    newMaster_ = strMaster_.replace( strChildKeys_, strChildUpdated_ );
								    strMaster_ = newMaster_;

								    // Set update flag.
								    doUpdate_ = true;

						      }//params not empty
					      }//params valid
					    }//new key not same as existing key
	          }//t_formChild valid
	        break;

	      }//switch type_
      }//type_ valid
	  }//params valid

	  // Close form.
	  tree_closeRelationForm();

	  // Do final update steps.
	  if ( doUpdate_ ) {
      // Populate message log.
      t_indexPageRef.populateLog( t_uiStr.successUpdate_, s_svcVals.info_ );

	    // SUBMIT AND REFRESH TREE ARRAY.

	    // Set up for tree update.
	    // DEPENDENCY: Do this BEFORE recreating master array and setting vars for initial load.
	    tree_setupTreeUpdate();

	    // Parse stringified JSON back into JSON.
	    parsed_ = JSON.parse( strMaster_ );

	    // Recreate master tree array.
	    delete t_treeMaster;
	    t_treeMaster = new Array();
	    t_treeMaster = $.merge( t_treeMaster, parsed_ );

	    // Set vars for initial load.
	    t_loadMainID         = selectMainID_;
	    t_loadMainParentName = selectMainParentName_;
	    t_loadMainName       = selectMainName_;
	    t_loadRowID          = selectRowID_;

	    // Submit tree. Callback returns updated tree.
	    tree_submitTree( s_action.treeUpdate_ );
	  }//doUpdate_
  }//tree_handleRelationForm











