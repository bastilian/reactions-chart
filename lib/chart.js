var Canvas = require('canvas');
var Image  = Canvas.Image;

var request = require('sync-request');
var emojis  = JSON.parse(request('GET', 'https://api.github.com/emojis?client_id='
                                        + process.env['GH_CLIENT'] + '&client_secret=' + process.env['GH_SECRET'], {
  headers: {
    'User-Agent': 'Reactions Chart'
  }
}).getBody('utf8'));

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

class Chart {

  constructor(data, height, width) {
    this.data   = data;
    this.width  = width;
    this.height = height;
    this.canvas = new Canvas(this.width, this.height);
    this.ctx    = this.canvas.getContext('2d');
    this.ctx.fillStyle = '#393939';
  }

  emojiImage (emojikey) {
    var img = new Image;
    if (emojis[emojikey]) {
      img.src = request('GET', emojis[emojikey]).getBody();
    } else {
      img.src = request('GET', emojis['x']).getBody();
    }

    return img
  }

  keys () {
    return Object.keys(this.data);
  }

  barwidth () {
    return this.width/6
  }

  maxReactions () {
    return this.keys().map(function (key) {
      return parseInt(this.data[key]);
    }.bind(this)).max();
  }

  unitHeight () {

    return this.height/this.maxReactions();
  }

  emojiDimmension () {
    return this.barwidth()/2.5;
  }

  drawBar (idx, emojikey, count) {
    var x = this.barwidth()*idx;
    var y = 175;
    var height = this.unitHeight()*parseInt(count);

    this.ctx.fillRect(x, y-height-10, this.emojiDimmension(), height);
    this.ctx.drawImage(this.emojiImage(emojikey), x, y, this.emojiDimmension(), this.emojiDimmension());
  }

  png () {
    var idx = 0;

    for (var emojikey in this.data) {
      this.drawBar(idx, emojikey, this.data[emojikey])

      idx++;
    }

    return this.canvas.toBuffer();
  }

}

module.exports = Chart;
