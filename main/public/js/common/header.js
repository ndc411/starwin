$(function () {
    var pathname= location.pathname;
    $('.active-link').removeClass('active-link');
    if(pathname.indexOf('home')>0) {
        $('.home-link').addClass('active-link');
    }
    else if(pathname.indexOf('about')>0) {
        $('.about-link').addClass('active-link');
    }
    else if(pathname.indexOf('production')>0) {
        $('.production-link').addClass('active-link');
    }
    else if(pathname.indexOf('customerservice')>0) {
        $('.customerservice-link').addClass('active-link');
    }
    else if(pathname.indexOf('contactus')>0) {
        $('.contactus-link').addClass('active-link');
    }
    else if(pathname.indexOf('transaction.html')>0) {
        $('.transaction-link').addClass('active-link');
    }
});