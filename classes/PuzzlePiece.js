export default class PuzzlePiece {
  constructor(x, y, width, height, borders, image, imgX, imgY, dropZone) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.borders = borders;
    this.isDragging = false;
    this.image = image;
    this.imgX = imgX;
    this.imgY = imgY;
    this.dropZone = dropZone;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    this.drawTopBorder(ctx);
    this.drawRightBorder(ctx);
    this.drawBottomBorder(ctx);
    this.drawLeftBorder(ctx);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(
      this.image,
      this.imgX - 25,
      this.imgY - 25,
      this.width + 50,
      this.height + 50,
      this.x - 25,
      this.y - 25,
      this.width + 50,
      this.height + 50
    );
    ctx.restore();
    ctx.stroke();
  }

  drawTopBorder(ctx) {
    const midX = this.x + this.width / 2;
    if (this.borders.top === "smooth") {
      ctx.lineTo(this.x + this.width, this.y);
    } else if (this.borders.top === "inward") {
      ctx.lineTo(midX - this.width * 0.1, this.y);
      ctx.bezierCurveTo(
        midX - this.width * 0.2,
        this.y + this.height * 0.2,
        midX + this.width * 0.2,
        this.y + this.height * 0.2,
        midX + this.width * 0.1,
        this.y
      );
      ctx.lineTo(this.x + this.width, this.y);
    } else if (this.borders.top === "outward") {
      ctx.lineTo(midX - this.width * 0.1, this.y);
      ctx.bezierCurveTo(
        midX - this.width * 0.2,
        this.y - this.height * 0.2,
        midX + this.width * 0.2,
        this.y - this.height * 0.2,
        midX + this.width * 0.1,
        this.y
      );
      ctx.lineTo(this.x + this.width, this.y);
    }
  }

  drawRightBorder(ctx) {
    const midY = this.y + this.height / 2;
    if (this.borders.right === "smooth") {
      ctx.lineTo(this.x + this.width, this.y + this.height);
    } else if (this.borders.right === "inward") {
      ctx.lineTo(this.x + this.width, midY - this.height * 0.1);
      ctx.bezierCurveTo(
        this.x + this.width - this.width * 0.2,
        midY - this.height * 0.2,
        this.x + this.width - this.width * 0.2,
        midY + this.height * 0.2,
        this.x + this.width,
        midY + this.height * 0.1
      );
      ctx.lineTo(this.x + this.width, this.y + this.height);
    } else if (this.borders.right === "outward") {
      ctx.lineTo(this.x + this.width, midY - this.height * 0.1);
      ctx.bezierCurveTo(
        this.x + this.width + this.width * 0.2,
        midY - this.height * 0.2,
        this.x + this.width + this.width * 0.2,
        midY + this.height * 0.2,
        this.x + this.width,
        midY + this.height * 0.1
      );
      ctx.lineTo(this.x + this.width, this.y + this.height);
    }
  }

  drawBottomBorder(ctx) {
    const midX = this.x + this.width / 2;
    if (this.borders.bottom === "smooth") {
      ctx.lineTo(this.x, this.y + this.height);
    } else if (this.borders.bottom === "inward") {
      ctx.lineTo(midX + this.width * 0.1, this.y + this.height);
      ctx.bezierCurveTo(
        midX + this.width * 0.2,
        this.y + this.height - this.height * 0.2,
        midX - this.width * 0.2,
        this.y + this.height - this.height * 0.2,
        midX - this.width * 0.1,
        this.y + this.height
      );
      ctx.lineTo(this.x, this.y + this.height);
    } else if (this.borders.bottom === "outward") {
      ctx.lineTo(midX + this.width * 0.1, this.y + this.height);
      ctx.bezierCurveTo(
        midX + this.width * 0.2,
        this.y + this.height + this.height * 0.2,
        midX - this.width * 0.2,
        this.y + this.height + this.height * 0.2,
        midX - this.width * 0.1,
        this.y + this.height
      );
      ctx.lineTo(this.x, this.y + this.height);
    }
  }

  drawLeftBorder(ctx) {
    const midY = this.y + this.height / 2;
    if (this.borders.left === "smooth") {
      ctx.lineTo(this.x, this.y);
    } else if (this.borders.left === "inward") {
      ctx.lineTo(this.x, midY + this.height * 0.1);
      ctx.bezierCurveTo(
        this.x + this.width * 0.2,
        midY + this.height * 0.2,
        this.x + this.width * 0.2,
        midY - this.height * 0.2,
        this.x,
        midY - this.height * 0.1
      );
      ctx.lineTo(this.x, this.y);
    } else if (this.borders.left === "outward") {
      ctx.lineTo(this.x, midY + this.height * 0.1);
      ctx.bezierCurveTo(
        this.x - this.width * 0.2,
        midY + this.height * 0.2,
        this.x - this.width * 0.2,
        midY - this.height * 0.2,
        this.x,
        midY - this.height * 0.1
      );
      ctx.lineTo(this.x, this.y);
    }
  }

  isClicked(mouseX, mouseY) {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.width &&
      mouseY > this.y &&
      mouseY < this.y + this.height
    );
  }
}
