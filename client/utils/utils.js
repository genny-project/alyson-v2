import _ from 'lodash';

Array.prototype.swap = function(a, b) {
    let originalItem = this[a];
    let secondItem = this[b];
    this[a] = secondItem;
    this[b] = originalItem;

    return this;
};

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
    };
};

Array.prototype.compare = function(array) {
    if (!array) {
      return false;
    }
    if (this.length !== array.length) {
      return false;
    }
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] instanceof Array && array[i] instanceof Array) {
        if (!this[i].compare(array[i])) {
          return false;
        }
      }
      else if (this[i] !== array[i]) {
        return false;
      }
    }
    return true;
  };

window.getQueryString = function ( field, url ) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
};

const SMALL_SCREEN = 768;
const MEDIUM_SCREEN = 992;

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
};

window.getFileOrientation = function(file, callback) {

    var reader = new FileReader();
    reader.onload = function(e) {

        var view = new DataView(e.target.result);
        if (view.getUint16(0, false) != 0xFFD8)
        {
            return callback(-2);
        }
        var length = view.byteLength, offset = 2;
        while (offset < length)
        {
            var marker = view.getUint16(offset, false);
            offset += 2;
            if (marker == 0xFFE1)
            {
                if (view.getUint32(offset += 2, false) != 0x45786966)
                {
                    return callback(-1);
                }

                var little = view.getUint16(offset += 6, false) == 0x4949;
                offset += view.getUint32(offset + 4, little);
                var tags = view.getUint16(offset, little);
                offset += 2;
                for (var i = 0; i < tags; i++)
                {
                    if (view.getUint16(offset + (i * 12), little) == 0x0112)
                    {
                        return callback(view.getUint16(offset + (i * 12) + 8, little));
                    }
                }
            }
            else if ((marker & 0xFF00) != 0xFF00)
            {
                break;
            }
            else
            {
                offset += view.getUint16(offset, false);
            }
        }
        return callback(-1);
    };

    reader.readAsArrayBuffer(file);
}

function editDistance(s1, s2) {

  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

// return % of similarity
window.similarity = function(s1, s2) {

  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }

  return 100 * (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}
