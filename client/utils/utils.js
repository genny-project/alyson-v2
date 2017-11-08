Array.prototype.swap = function(a, b) {

    let originalItem = this[a];
    let secondItem = this[b];
    this[a] = secondItem;
    this[b] = originalItem;

    return this;
}
