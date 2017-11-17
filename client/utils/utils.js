Array.prototype.swap = function(a, b) {

    let originalItem = this[a];
    let secondItem = this[b];
    this[a] = secondItem;
    this[b] = originalItem;

    return this;
}

window.getQueryString = function ( field, url ) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
};

window.getScreenSize = function() {

    let screenSize = '';
    if (window.innerWidth < 576) {
        screenSize = 'xs';
    }
    else if (window.innerWidth >= 576 && window.innerWidth < 768) {
        screenSize = 'sm';
    }
    else if (window.innerWidth >= 768 && window.innerWidth < 992) {
        screenSize = 'md';
    }
    else if (window.innerWidth >= 992) {
        screenSize = 'lg';
    }

    return screenSize;
}

