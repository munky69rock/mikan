const fs = require('fs');
const SHA1 = require('sha1');
const Canvas = require('canvas');
const path = require('path');
const Font = Canvas.Font;

const DEFAULT_COLOR = '#ef4136';
new Font('Noto', path.join(__dirname, '..', 'font', 'NotoSansCJKjp-Regular.otf'));

class StampGenerator {
  constructor(color = DEFAULT_COLOR) {
    this.canvas = new Canvas(280, 280);
    this.context = this.canvas.getContext('2d');
    this.color = color;
  }
  
  render(text, cb = () => {}) {
    this.clear();
    this.drawFrame();
    this.drawText(text);

    const hash = SHA1(text);
    const filename = path.join(__dirname, '..', 'tmp', 'stamp', `${hash}.png`);
    fs.stat(filename, (err) => {
      if (!err) {
        return cb(false, hash);
      }
      if (err.code != 'ENOENT') {
        return cb(true);
      }
      const out = fs.createWriteStream(filename);
      this.canvas.pngStream()
        .on('data', chunk => out.write(chunk))
        .on('end', () => {
          cb(false, hash);
        });
    });
  }

  drawFrame() {
    let ctx = this.context;

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.moveTo(20, 10);
    ctx.lineTo(240, 10);
    ctx.quadraticCurveTo(250, 10, 250, 20);
    ctx.lineTo(250, 240);
    ctx.quadraticCurveTo(250, 250, 240, 250);
    ctx.lineTo(20, 250);
    ctx.quadraticCurveTo(10, 250, 10, 240);
    ctx.lineTo(10, 20);
    ctx.quadraticCurveTo(10, 10, 20, 10);
    ctx.stroke();
  }
  
  drawText(text) {
    let ctx = this.context;
    let len = text.length;
    let dim = Math.ceil(Math.sqrt(len));
    let charsize = 240.0/dim;
    
    ctx.fillStyle = this.color;
    ctx.font = `${charsize}px Noto`;
    for (let row = 0; row < dim; row++) {
      for (let col = 0; col < dim; col++) {
        if (row * dim + col >= len) {
          break;
        }
        ctx.fillText(text.charAt(row * dim + col), (dim - row - 1) * charsize + 10, (col + 1) * charsize);
      }
    }
  }
  
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

module.exports = StampGenerator;
