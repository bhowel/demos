
  // ============================================================================
  // MESSAGE.
  // ============================================================================

  // ON DOC READY
  $( document ).ready( function() {

    // Show message.
    var message_ = document.getElementById( "_message" );
    if ( message_ ) {
      message_.innerHTML = parent.i_message;
    }//message_

  })// ON DOC READY
