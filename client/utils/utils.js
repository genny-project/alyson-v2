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
