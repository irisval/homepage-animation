// myArray[Math.floor(Math.random() * myArray.length)];
var imgSrcs = ['img/believer.png','img/bmi.jpg','img/delonghi.png','img/el.png','img/fs.png','img/ifba.png','img/mls.png','img/mutti.png','img/nyu.png','img/phaedo.png','img/sv.png','img/tc.jpg']
var imgs = [];
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
	img = loadImage(imgSrcs[0]);
}



function draw() {
	background(220);
	createGrid(40, 40);	
	// gridCells.forEach(function(c) {
	// 	c.calcNewPos();
	// 	// c.drawChar();
	// })
	console.log(mouseX);
	console.log(mouseY);
	
}


function createGrid(rows, cols) {
	cellWidth = width / cols;
	cellHeight = height / rows;
	for (var x = 0; x < width; x += cellWidth) {
		for (var y = 0; y < height; y += cellHeight) {
			c = new Cell(x, y);
			c.draw();
	}
	l = new Logo(width/2, height/2);
	l.draw();
}
}

class Logo {
	constructor(x, y) {
		this.startX = x;
		this.startY = y;
		this.dist = 0;
		this.lensRadius = lensRadius;
		this.magRadius = magRadius;
		this.size = initialSize;
	}
	magnify() {
		var distX = mouseX - this.startX;
		var distY = mouseY - this.startY;
		this.dist = Math.sqrt((distX * distX) + (distY * distY));
		if (this.dist < this.lensRadius) {
			this.lensMag = magAmt * (1 - Math.sin(Math.PI * Math.abs(this.dist / this.lensRadius) / 2));
		   
			if (this.dist <= this.magRadius) {
				 this.size = initialSize * (this.lensMag + 1);
			}
		}
		
	} 
	draw() {
		this.magnify();
		image(img, this.startX, this.startY, (img.width/3) * this.size, (img.height / 3) * this.size);
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
		this.size = initialSize;
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
			this.color = color(253,204,198);
			var lensDisp = 1 + Math.cos(Math.PI * Math.abs(this.dist / this.lensRadius));
			if (this.dist <= this.magRadius) {
				this.magnify = true;
			}
			this.currX = this.startX - (magAmt * distX * lensDisp / 2.5);
		    this.currY = this.startY - (magAmt * distY * lensDisp / 2.5);

		    this.lensMag = magAmt * (1 - Math.sin(Math.PI * Math.abs(this.distFromInitPos / this.lensRadius) / 2));
		    this.size = initialSize * (this.lensMag + 1); 
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
			rect(this.currX,  this.currY, cellWidth/2 * magAmt, cellHeight/2 * magAmt);
		} else {
			rect(this.currX,  this.currY, cellWidth/2, cellHeight/2);
		}
		
		
		// point(this.startX+(cellWidth/2), this.startY)+(cellHeight/2);
		
	}

}