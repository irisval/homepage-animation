// myArray[Math.floor(Math.random() * myArray.length)];
var imgs = ['img/believer.png', 'img/el.png', 'img/fs.png', 'img/google.png', 'img/ifba.png', 'img/li.png', 'img/mls.png', 'img/mutti.png', 'img/nyu.png', 'img/phaedo.png', 'img/sv.png', 'img/yelp.png']
var loadedImgs = [];
var imgLen;
var imgsPlaced = false;
var gridCells = [];
var cellWidth;
var cellHeight;
var lensRadius = 70;
var magAmt = 1.75;
var initialSize = 1;
var magAddition = 2;
var magRadius = lensRadius/4;

var distributionRadius = lensRadius * 0.8;


function setup() {
	rectMode(CENTER);
	var c = createCanvas(windowWidth*(2/3), windowHeight*(2/3));
	for (var i = 0; i < imgs.length; i++) {
		loadedImgs.push([loadImage(imgs[i]), placeImg()]);
	}
	imgLen = loadedImgs.length;
}

function placeImg() {
	
	var p, x, y

	x = Math.floor((Math.random() * (width - 100)) + 1);
	y = Math.floor((Math.random() * (height - 100)) + 1);

	var allChecked = false;

	var counter = 0;
	while (!allChecked && counter < loadedImgs.length) {
		
		p = loadedImgs[counter][1];
		if (p.getStartDist(x, y) < distributionRadius) {
			x = Math.floor((Math.random() * (width - 100)) + 1);
			y = Math.floor((Math.random() * (height - 100)) + 1);
			counter = -1;
		}
		if (counter == imgs.length - 1) {
			allChecked = true;
		} else {
			counter++;
		}	
	}
	return new Point(x, y);
}



function draw() {
	background(220);
	createGrid(30, 30);
}


function createGrid(rows, cols) {
	cellWidth = width / cols;
	cellHeight = height / rows;

	for (var col = 0; col < cols; col += 1) {
		for (var row = 0; row < rows; row += 1) {
	
			p = new Point(cellWidth * col, cellHeight * row);
			c = new Cell(p);
			c.draw();
		}
	}

	
	for (var k = 0; k < loadedImgs.length; k++) {
		i = new Img(loadedImgs[k]);
		i.init();
	}
	

}



var buf = new ArrayBuffer(4);
var f32=new Float32Array(buf);
var u32=new Uint32Array(buf);

function fastSqrt(x) {
	var x2 = 0.5 * (f32[0] = x);
  	u32[0] = (0x5f3759df - (u32[0] >> 1));
  	var y = f32[0];
  	y  = y * ( 1.5 - ( x2 * y * y ) );   // 1st iteration
  	return 1/y;
}


class Point {
	constructor(x, y) {
		this.originalX = x;
		this.originalY = y;
		this.x = x;
		this.y = y;
	}
	getStartDist(xb, yb) {
		return fastSqrt(Math.pow((xb - this.originalX), 2) +  Math.pow((yb - this.originalY), 2));

		//return Math.sqrt(Math.pow((xb - this.originalX), 2) +  Math.pow((yb - this.originalY), 2));
	}
	getCurrDist(xb, yb) {
		return fastSqrt(Math.pow((xb - this.x), 2) +  Math.pow((yb - this.yb), 2));

		//return Math.sqrt(Math.pow((xb - this.x), 2) +  Math.pow((yb - this.yb), 2));
	}
	updateX(xb) {
		this.x = xb;
	}
	updateY(yb) {
		this.y = yb;
	}
	getX() {
		return this.x;
	}
	getY() {
		return this.y;
	}
	getOriginalX() {
		return this.originalX;
	}
	getOriginalY() {
		return this.originalY;
	}
	
}

class Img {
	constructor(imgData) {
		this.img = imgData[0];
		this.coordinate = imgData[1];

		
		this.initialWidth = this.img.width;
		this.initialHeight = this.img.height;
		this.currWidth = this.initialWidth / 50;
		this.currHeight = this.initialHeight / 50;

		this.currX;
		this.currY;
		this.scaleFactor = 1;
		this.dist;
		this.lensRadius = lensRadius;
		this.magRadius = magRadius;
		this.magnify = false;
	}
	updatePoint(xb, yb){
		this.coordinate.updateX(xb);
		this.coordinate.updateY(yb);
	}
	calcPos() {
		// var distX = mouseX - (this.startX + (this.currWidth / 2));
		// var distY = mouseY - (this.startY + (this.currHeight  / 2));
		// this.dist = Math.sqrt((distX * distX) + (distY * distY));
		this.dist = this.coordinate.getStartDist(mouseX, mouseY);

		if (this.dist > this.lensRadius) {
			this.updatePoint( this.coordinate.getOriginalX(), this.coordinate.getOriginalY());
		} else {	
			if (this.dist < this.magRadius) {
				this.magnify = true;
				this.updatePoint(mouseX - (lensRadius / 2),this.coordinate.getOriginalY());
				this.scaleFactor = (lensRadius * 5 / 4) / this.currWidth;
				this.currWidth = (lensRadius * 5 / 4);
				this.currHeight = this.currHeight * this.scaleFactor;
			}
		}

	}
	init() {
		this.calcPos();
		
		image(this.img, this.coordinate.getX(), this.coordinate.getY(), this.currWidth, this.currHeight);
		filter(GRAY);
	}
}



class Cell {
	constructor(point) {
		this.point = point;
		this.startX = point.getOriginalX() + cellWidth/2;
		this.startY = point.getOriginalY() + cellHeight/2;
	
		this.dist = 0;
		this.magnification = 0;
		this.magnify = false;
		this.magRadius = magRadius;
		this.lensRadius = lensRadius;
		// this.size = initialSize;
		this.color = color(68, 68, 68);
		gridCells.push(this);
	}
	updatePoint(xb, yb){
		this.point.updateX(xb);
		this.point.updateY(yb);
	}
	calcPos() {
		var distX = mouseX - this.startX;
		var distY = mouseY - this.startY;
		this.dist = this.point.getStartDist(mouseX, mouseY);

		if (this.dist > this.lensRadius) {
			this.updatePoint(this.startX, this.startY);
		} else {
			var lensDisp = 1 + Math.cos(Math.PI * Math.abs(this.dist / this.lensRadius));
			if (this.dist <= this.magRadius) {
				this.magnify = true;
			}
			this.updatePoint((this.startX - (magAmt * distX * lensDisp / 2.5)),(this.startY - (magAmt * distY * lensDisp / 2.5)))
		}
	}
	drawLine() {
		if (this.dist <= this.lensRadius) {
      		var lineOpacity = map(this.dist, 0, this.lensRadius, 200, 0);
	      	push();
	      	stroke(180, lineOpacity);
	      	strokeWeight(1.5);
	      	line(this.startX, this.startY, this.point.getX(), this.point.getY());
	      	pop();
	    }

	}
	draw() {
		
		this.calcPos();
		this.drawLine();
		stroke(this.color);
		strokeWeight(0.5);
		fill(this.color); 

		
		if (this.magnify) {
			ellipse(this.point.getX(), this.point.getY(), cellWidth/2 * magAmt, cellHeight/2 * magAmt);
		} else {
			ellipse(this.point.getX(), this.point.getY(), cellHeight/2);
		}
		
		
		
		//point(this.startX+(cellWidth/2), this.startY)+(cellHeight/2);
		
	}

}
