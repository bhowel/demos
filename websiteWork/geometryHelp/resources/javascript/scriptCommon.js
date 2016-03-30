
/**
 * ................BASIC OPERATIONS
 */    

// LOAD IFRAME
function loadIframe( pageName_ ) {
    iframeElement_ = window.document.getElementById( "iframePage" );
    if ((iframeElement_ != null) && (iframeElement_ != undefined)) {
        iframeElement_.src = pageName_;        
    }//iframe valid
}//loadIframe()

/**
 * ................TREE OPERATIONS
 */
 
// TOGGLE PLUS MINUS
function togglePlusMinus(windowDocumentID_, elementToShow_, imageToChange_) {
    /* Get the tree element to show or hide. */
    elementToShow_ = windowDocumentID_.getElementById(elementToShow_);
    
    /* Get the plus/minus image. */
    imageToChange_ = windowDocumentID_.getElementById(imageToChange_);   
    
    /* Show/hide the element and update the plus/minus image. */
    if (elementToShow_.style.display == "none")
    {
        elementToShow_.style.display = "block";
        imageToChange_.src           = 'images/minus.gif';
        
    }//show element
    else
    {
        elementToShow_.style.display = "none";
        imageToChange_.src           = 'images/plus.gif';
        
    }//hide element

}//togglePlusMinus()

// TOGGLE FOLDER IMAGE
function toggleFolderImage(windowDocumentID_, elementToShow_, imageToChange_, folderToChange_) {
    /* Get the tree element to show or hide. */
    elementToShow_ = windowDocumentID_.getElementById(elementToShow_);
    
    /* Get the plus/minus image. */
    imageToChange_ = windowDocumentID_.getElementById(imageToChange_);   

    /* Get the folder image. */
    folderToChange_ = windowDocumentID_.getElementById(folderToChange_);
    
    /* Show/hide the element and update the plus/minus image. */
    if (elementToShow_.style.display == "none")
    {
        elementToShow_.style.display = "block";
        imageToChange_.src           = 'images/minus.gif';
        folderToChange_.src          = 'images/iconFolderOpen.gif';
        
    }//show element
    else
    {
        elementToShow_.style.display = "none";
        imageToChange_.src           = 'images/plus.gif';
        folderToChange_.src          = 'images/iconFolderClosed.gif';
        
    }//hide element

}//toggleFolderImage()

// TOGGLE TREE
function toggleTree(windowDocumentID_, elementToShow_, imageToChange_, plusImage_, minusImage_) {
    /* Get tree element to show or hide. */
    elementToShow_ = windowDocumentID_.getElementById(elementToShow_);

    /* Show/hide element and update plus/minus image. */
    if (elementToShow_.style.display == "none")
    {
        elementToShow_.style.display = "block";
        imageToChange_.src           = minusImage_;
        
    }//show element
    else
    {
        elementToShow_.style.display = "none";
        imageToChange_.src           = plusImage_;
        
    }//hide element

}//toggleTree()

/**
 * ................ELEMENT OPERATIONS
 */

// SWAP IMAGE
function swapImage(targetImage, overSrc) {
    targetImage.oSrc = targetImage.src;
    targetImage.src = overSrc;
  
}//swapImage()

// RESTORE IMAGE
function restoreImage(targetImage) {
    if(targetImage.oSrc != null)
    {
        targetImage.src = targetImage.oSrc;
        
    }//image not null
  
}//restoreImage()

// CHANGE CLASS
function changeClass(windowDocumentID_, elementToChange_, newClass_) {
    elementToChange_ = windowDocumentID_.getElementById(elementToChange_);

    if ((elementToChange_ != null) && (elementToChange_ != undefined))
    {
        elementToChange_.className = newClass_;
        
    }//element valid
        
}//changeClass()

//  CHANGE THIS CLASS
function changeThisClass(elementToChange_, newClass_) {
    if ((elementToChange_ != null) && (elementToChange_ != undefined))
    {
        elementToChange_.className = newClass_;
        
    }//element valid
        
}//changeThisClass()

// CHANGE THIS SPECIFIED CLASS
function changeThisSpecifiedClass(elementToChange_, newClass_, specifiedClass_) {
    if ((elementToChange_ != null) && (elementToChange_ != undefined))
    {
        if(elementToChange_.className != specifiedClass_)
        {
            elementToChange_.className = newClass_;
            
        }//element does not have specified class
        
    }//element valid
        
}//changeThisSpecifiedClass()

// HIDE ELEMENT
function hideElement(windowDocumentID_, elementToHide_) {
    elementToHide_ = windowDocumentID_.getElementById(elementToHide_);

    if ((elementToHide_ != null) && (elementToHide_ != undefined))
    {
        elementToHide_.style.display = "none";

    }//element valid
    
}//hideElement()

// HIDE THIS ELEMENT
function hideThisElement(elementToHide_) {
    if ((elementToHide_ != null) && (elementToHide_ != undefined))
    {
        elementToHide_.style.display = "none";

    }//element valid
    
}//hideThisElement()

// SHOW ELEMENT
function showElement(windowDocumentID_, elementToShow_) {
    elementToShow_ = windowDocumentID_.getElementById(elementToShow_);

    if ((elementToShow_ != null) && (elementToShow_ != undefined))
    {
        elementToShow_.style.display = "block";

    }//element valid
    
}//showElement()

// SHOW THIS ELEMENT
function showThisElement(elementToShow_) {
    if ((elementToShow_ != null) && (elementToShow_ != undefined))
    {
        elementToShow_.style.display = "block";

    }//element valid
    
}//showThisElement()

// SHOW INLINE ELEMENT
function showInlineElement(windowDocumentID_, elementToShow_) {
    elementToShow_ = windowDocumentID_.getElementById(elementToShow_);

    if ((elementToShow_ != null) && (elementToShow_ != undefined))
    {
        elementToShow_.style.display = "";

    }//element valid
    
}//showInlineElement()

// CHANGE INNER HTML
function changeInnerHTML(windowDocumentID_, elementToChange_, newInnerHTML_) {
    elementToChange_ = windowDocumentID_.getElementById(elementToChange_);

    if ((elementToChange_ != null) && (elementToChange_ != undefined))
    {
        elementToChange_.innerHTML = newInnerHTML_;

    }//element valid
        
}//changeInnerHTML()

// CHANGE INNER TEXT
function changeInnerText(windowDocumentID_, elementToChange_, newInnerText_) {
    elementToChange_ = windowDocumentID_.getElementById(elementToChange_);

    if ((elementToChange_ != null) && (elementToChange_ != undefined))
    {
        elementToChange_.innerText = newInnerText_;

    }//element valid
        
}//changeInnerText()

