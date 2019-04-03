// myArray[Math.floor(Math.random() * myArray.length)];
var imgs = ['img/believer.png','img/bmi.jpg','img/delonghi.png','img/fs.png','img/ifba.png','img/mls.png','img/el.png','img/mutti.png','img/nyu.png','img/phaedo.png','img/sv.png','img/tc.jpg']
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
var magRadius = lensRadius/2;


function setup() {
	rectMode(CENTER);
	var c = createCanvas(windowWidth*(2/3), windowHeight*(2/3));
	for (var i = 0; i < imgs.length; i++) {
		loadedImgs.push([loadImage(imgs[i]), Math.floor((Math.random() * (width - 50)) + 1),Math.floor((Math.random() * (height-50)) + 1)]);
	}
	imgLen = loadedImgs.length;
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
			x = cellWidth * col;
			y = cellHeight * row;

			c = new Cell(x, y, -1);
			c.draw();
		}
	}

	
	var imgCounter = 0;
	var i;
	for (var j = 0; j < loadedImgs.length; j++) {
		
		i = new Img(imgCounter);
		i.init();
		imgCounter++;
	}
// var i = new Img(30, 40, 3);
// i.init();
}


class Img {
	constructor(imgID) {
		this.imgID = imgID;
		this.img = loadedImgs[imgID][0];
		this.initialWidth; 
		this.initialHeight;
		this.startX = loadedImgs[imgID][1];
		this.startY = loadedImgs[imgID][2];
		this.currX;
		this.currY;
		this.dist;
		this.lensRadius = lensRadius;
		this.magRadius = magRadius;
		this.magnify = false;
	}
	calcPos() {
		var distX = mouseX - (this.startX + (this.initialWidth / 2));
		var distY = mouseY - (this.startY+ (this.initialHeight / 2));
		this.dist = Math.sqrt((distX * distX) + (distY * distY));
		if (this.dist > this.lensRadius) {
			this.currX = this.startX;
			this.currY = this.startY;
		} else {
			this.magnify = true;
			// var lensDisp = 1 + Math.cos(Math.PI * Math.abs(this.dist / this.lensRadius));
			console.log("DISTANCE: " + this.dist);
				
			if (this.dist < this.magRadius) {
				this.magnify = true;
			}
	

			
			// this.currX = this.startX - (magAmt * distX * lensDisp / 2.5);
		 //    this.currY = this.startY - (magAmt * distY * lensDisp / 2.5);

		}

	}
	init() {
	
		this.initialWidth = this.img.width;
		this.initialHeight = this.img.height;
		this.calcPos();
		if (this.magnify) {
			// image(this.img, this.currX, this.currY, this.initialWidth /4, this.initialHeight / 4);
		
			image(this.img, this.startX, this.startY, this.initialWidth /4, this.initialHeight / 4);

			filter(GRAY);
		
		} else {
			image(this.img, this.startX, this.startY, this.initialWidth / 50, this.initialHeight / 50);
			
		}
	}
}

class Cell {
	constructor(x, y) {
		this.startX = x + (cellWidth/2);
		this.startY = y + (cellHeight/2);
		this.currX = x + (cellWidth/2);
		this.currY = y + (cellHeight/2);
		this.dist = 0;
		this.magnification = 0;
		this.magnify = false;
		this.magRadius = magRadius;
		this.lensRadius = lensRadius;
		// this.size = initialSize;
		this.color = color(68, 68, 68);
		gridCells.push(this);
	}

	calcPos() {
		var distX = mouseX - this.startX;
		var distY = mouseY - this.startY;
		this.dist = Math.sqrt((distX * distX) + (distY * distY));

		if (this.dist > this.lensRadius) {
			this.currX = this.startX;
			this.currY = this.startY;
		} else {
			// this.color = color(253,204,198);
			var lensDisp = 1 + Math.cos(Math.PI * Math.abs(this.dist / this.lensRadius));
			if (this.dist <= this.magRadius) {
				this.magnify = true;
			}
			
			this.currX = this.startX - (magAmt * distX * lensDisp / 2.5);
		    this.currY = this.startY - (magAmt * distY * lensDisp / 2.5);

		    // this.lensMag = magAmt * (1 - Math.sin(Math.PI * Math.abs(this.distFromInitPos / this.lensRadius) / 2));
		    // this.size = initialSize * (this.lensMag + 1); 
		}
	}
	drawLine() {
		if (this.dist <= this.lensRadius) {
      		var lineOpacity = map(this.dist, 0, this.lensRadius, 200, 0);
	      	push();
	      	stroke(180, lineOpacity);
	      	line(this.startX, this.startY, this.currX, this.currY);
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
			ellipse(this.currX,  this.currY, cellWidth/2 * magAmt, cellHeight/2 * magAmt);
		} else {
			ellipse(this.currX,  this.currY, cellWidth/2, cellHeight/2);
		}
		
		
		
		//point(this.startX+(cellWidth/2), this.startY)+(cellHeight/2);
		
	}

}