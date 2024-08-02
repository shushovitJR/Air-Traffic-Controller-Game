/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 1100;
const CANVAS_HEIGHT = canvas.height = 600;

let timeToNextPlane = 0;
let planeInterval = 500;
let lasttime = 0;

let planes = [];
class Plane {
    constructor(){
        this.width = 150;
        this.height = 50;
        this.x = canvas.width;
        this.y = Math.random() * 300;
        this.speedX = 3;
        this.speedY = 3;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = './img/airplan.png';
        this.takeoff = false;
        this.landing = false;
    }
    update(){
        if (this.takeoff == 0 && this.landing == 0){
            this.x-=this.speedX;
        }
        if (this.landing == 1 && this.takeoff == 0){
            this.y+=this.speedY;
            if (this.y>=500){
                this.y = 500;
                this.speedY=0;
                this.x+=this.speedX;
            }
            if (this.x>=500){
                this.speedX=0;
                this.speedY=0;
                this.x=500;
            }
        }
            if (this.landing == 0 && this.takeoff == 1){
                this.speedX = 3;
                this.speedY = 2;
             this.y-=this.speedY;   
            this.x-=this.speedX;
        }
        if (this.x<-200 - this.width) this.markedForDeletion = true;
    }
    draw(){
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
    }
    isClicked(mouseX, mouseY) {
        return (
            mouseX >= this.x && mouseX <= this.x + this.width &&
            mouseY >= this.y && mouseY <= this.y + this.height
        );
    }

    handleClick() {
        if (this.takeoff == 0 && this.landing == 0) {
            this.landing = 1;
        } 
        else
        {
            this.landing = 0;
            this.takeoff = 1;
        }
    }
    checkCollision(otherPlane) {
        return !(
            this.x + this.width < otherPlane.x ||
            this.x > otherPlane.x + otherPlane.width ||
            this.y + this.height < otherPlane.y ||
            this.y > otherPlane.y + otherPlane.height
        );
    }
}





class Cloud{
    constructor(){
        this.image = new Image();
        this.image.src = './img/cloud-02.png';
        this.width = 90;
        this.height = 100;
        this.x = Math.random() * (canvas.width-this.width);
        this.y = 10;
        this.speedX = Math.random()*0.5;
    }
    update(){
        this.x+=this.speedX;
        // Boundary checks
        if (this.x <= 0) {
            this.speedX = Math.random()*0.5; // Reverse direction when hitting the boundary
        }
        else if (this.x >= canvas.width - this.width) {
            this.speedX = -(Math.random()*0.5); // Reverse direction when hitting the boundary
        }
    }
    draw(){
        
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
        
    }
};
class Runway{
    constructor(runwayX,runwayY,length,breadth){
        this.x = runwayX;
        this.y = runwayY;
        this.width = length;
        this.height = breadth;
    }
    draw(){
        ctx.fillStyle = 'grey';
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
    drawStripe(){
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x+20,this.y+22,this.width-40,this.height/6);
    }
};

const clouds = [new Cloud(), new Cloud(), new Cloud(), new Cloud(), new Cloud()];
const runway1 = new Runway(500, 500, 500, 50);
const plane1 = new Plane();
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    planes.forEach(plane => {
        if (plane.isClicked(mouseX, mouseY)) {
            plane.handleClick();
            console.log(plane.landing);
            console.log(plane.takeoff);
        }
    });
});
function drawClouds() {
    clouds.forEach(cloud => {
        cloud.update();
        cloud.draw();
    });
}
function drawRunway(){
    runway1.draw();
    runway1.drawStripe();
}
function setRandomInterval(){
    setTimeout(()=>{
        planes.push(new Plane());
        setRandomInterval();
    },Math.random() * (10000 - 3000) + 3000);
}
function animate(){
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    drawClouds();
    ctx.fillStyle = 'green';
    ctx.fillRect(0,450,1200,500);
    drawRunway();
    [...planes].forEach(object=>object.update());
    [...planes].forEach(object=>object.draw());
    planes = planes.filter(object=>!object.markedForDeletion);

    for (let i = 0; i < planes.length; i++) {
        for (let j = i + 1; j < planes.length; j++) {
            if (planes[i].checkCollision(planes[j])) {
                planes[i].speedX = 0;
                planes[i].speedY = 0;
                planes[j].speedX = 0;
                planes[j].speedY = 0;
                ctx.font = "50px Arial";
                ctx.fillStyle = "red";
                ctx.fillText("Game Over",500,300);
            }
        };
    };
    console.log(planes);
    requestAnimationFrame(animate);
}
setRandomInterval();
animate();
