

$('.button-toggler').click(function() {
    var data = $(this).attr('data-target');
    $(data).toggleClass('navbar-show');
});