var Swiftype=window.Swiftype||{},currentRevision="CURRENT_REVISION_WILL_APPEAR_HERE_WHEN_DEPLOYED",documentType="guides-"+currentRevision.replace(/\./g,"-");!function(){Swiftype.key="mcczggHkMKJhaGtuW4wP",Swiftype.inputElement="#st-search-input",Swiftype.resultContainingElement="#st-results-container",Swiftype.attachElement="#st-search-input",Swiftype.renderStyle="overlay",Swiftype.disableAutocomplete=!0,Swiftype.searchSearchFields={},Swiftype.searchSearchFields[documentType]=["body","title","url"],Swiftype.searchFetchFields={},Swiftype.searchFetchFields[documentType]=["title","body","url"],Swiftype.searchDocumentTypes=[documentType];var e=document.createElement("script");e.type="text/javascript",e.async=!0,e.src="//swiftype.com/embed.js";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}(),$(function(){var e=function(e,t){window.location="/"+currentRevision+e.url};$("#st-search-input").swiftype({engineKey:"mcczggHkMKJhaGtuW4wP",searchFields:Swiftype.searchSearchFields,fetchFields:Swiftype.searchFetchFields,documentTypes:Swiftype.searchDocumentTypes,onComplete:e})}),$("#st-search-input").keypress(function(e){return 13===e.keyCode?!1:void 0});