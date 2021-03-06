$(function(){
  $visible = $(".toc-level-0 .toc-level-0 ol:visible");
  if ($visible.length == 0) {
   $(".toc-level-0 .toc-level-0:first").find("> ol").slideToggle();
  }

  $(".toc-level-0 .toc-level-0 > a").click(function() {
    $(this).parent().find('> ol').slideToggle(function() {
      positionBackToTop(true);
    });

    return false;
  });

  $(function(){
    $('.anchorable-toc').each(function(){
      var toc = $(this),
      id = toc.attr('id'),
      href = "#" + id,
      anchor = '<a class="toc-anchor" href="'+href+'"></a>';

      toc.prepend(anchor);
    });
  });
});
