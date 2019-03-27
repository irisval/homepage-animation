// myArray[Math.floor(Math.random() * myArray.length)];
var imgSrcs = ['img/believer.png','img/bmi.jpg','img/delonghi.png','img/el.png','img/fs.png','img/ifba.png','img/mls.png','img/mutti.png','img/nyu.png','img/phaedo.png','img/sv.png','img/tc.jpg']
var imgs = [];
var imgsPlaced = false;
var gridCells = [];
var cellWidth;
var cellHeight;

function setup() {
	rectMode(CENTER);
	var c = createCanvas(windowWidth*(2/3), windowHeight*(2/3));

}



function draw() {
	background(220);
	createGrid(40, 40);	
	gridCells.forEach(function(c) {
		c.calcNewPos();
		// c.drawChar();
	})
	
}


function createGrid(rows, cols) {
	cellWidth = width / cols;
	cellHeight = height / rows;
	for (var x = 0; x < width; x += cellWidth) {
		for (var y = 0; y < height; y += cellHeight) {
			c = new Cell(x, y);
			

			// ---
			if (dist(mouseX, mouseY - 60, c.startX, c.startY) < 60) {
				if (dist(mouseX - 60, mouseY, c.startX, c.startY) <60) {
					c.draw(true);
					// console.log("F");
					// beginShape();
					// stroke(0,0,0);
					// strokeWeight(2);
					// // scale(1.01);
					// rect(c.startX,  c.startY, cellWidth/2, cellHeight/2);
					// endShape(CLOSE);
				} 
			} else {
				c.draw(false);
			}
	

			// --
		}
	}

}




class Cell {
	constructor(x, y) {
		this.startX = x + (cellWidth/2);
		this.startY = y + (cellHeight/2);
		// this.coordinates = [point(this.startX, this.startY), point(this.startX+cellWidth, this.startY), point(this.startX, this.startY+cellHeight), point(this.startX+cellWidth,this.startY+cellHeight)];
		gridCells.push(this);
	}
	draw(mag) {
		
		if (mag) {
			stroke(89,149,218);
			strokeWeight(0.5);
			fill(89,149,218); 
			rect(this.startX,  this.startY, cellWidth, cellHeight);
		} else {
			stroke(89,149,218);
			strokeWeight(0.5);
			fill(89,149,218); 
			rect(this.startX,  this.startY, cellWidth/2, cellHeight/2);
		}
		
		// point(this.startX+(cellWidth/2), this.startY)+(cellHeight/2);
		
	}

}





// function polygon(x, y, radius, npoints) {
//   var angle = TWO_PI / npoints;
//   beginShape();
//   for (var a = 0; a < TWO_PI; a += angle) {
//     var sx = x + cos(a) * radius;
//     var sy = y + sin(a) * radius;
//     vertex(sx, sy);
//   }
//   endShape(CLOSE);
// }








