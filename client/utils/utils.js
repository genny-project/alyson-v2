import _ from 'lodash';

Array.prototype.swap = function(a, b) {

    let originalItem = this[a];
    let secondItem = this[b];
    this[a] = secondItem;
    this[b] = originalItem;

    return this;
}

Array.prototype.differences = function(array) {

    let deleted = [];
    let added = [];

    if(this.length > array.length) {

        for (var i = 0; i < this.length; i++) {
            let currentItem = this[i];
            if(array.filter(x => _.isEqual(currentItem, x)).length == 0) {
                deleted.push(currentItem);
            }
        }
    }

    if(array.length > this.length) {

        for (var i = 0; i < array.length; i++) {
            let currentItem = array[i];
            if(this.filter(x => _.isEqual(currentItem, x)).length == 0) {
                added.push(currentItem);
            }
        }
    }

    return {
        added: added,
        deleted: deleted,
    }
}

window.getQueryString = function ( field, url ) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
}

const SMALL_SCREEN = 768;
const MEDIUM_SCREEN = 992;
const LARGE_SCREEN = 1400;

window.getScreenSize = function() {

    let screenSize = '';
    if (window.innerWidth < SMALL_SCREEN) {
        screenSize = 'sm';
    }
    else if (window.innerWidth >= SMALL_SCREEN && window.innerWidth < MEDIUM_SCREEN) {
        screenSize = 'md';
    }
    else if (window.innerWidth >= MEDIUM_SCREEN) {
        screenSize = 'lg';
    }

    return screenSize;
}
