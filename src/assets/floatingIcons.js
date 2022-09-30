export function draw_canvas(iconid) {
    // create constructor function
    function Particle(x, y, directionX, directionY, size, image) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.image = image;
    }
    // add draw method to particle prototype
    Particle.prototype.draw = function () {
        ctx.save()
        //Convert degrees to radian 
        rad += offset;
        if (rad >= 0.2 * Math.PI || rad <= -0.2 * Math.PI) {
            offset = 0 - offset;
        }
        if (transparency <= 1) {
            transparency += 0.0009;
            if (transparency >= 1) {
                transparency = 1;
            }
            ctx.globalAlpha = transparency;
        }
        //Set the origin to the center of the image
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        //Rotate the canvas around the origin
        ctx.rotate(rad);
        //draw the image    
        ctx.drawImage(this.image, this.size / 2 * (-1), this.size / 2 * (-1), this.size, this.size);
        // Restore canvas state as saved from above
        ctx.restore();
    };
    // add update method to particle prototype
    Particle.prototype.update = function () {
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
            this.directionY = -this.directionY;
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
    // animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particleArray.length; i++) {
            particleArray[i].update();
        }
    }
    // create particle array
    function init(iconid) {
        if (iconid === 'everything') {
            let image_sun = new Image();
            image_sun.src = '/weather-icons/icons8-sun-40.png';
            let image_cloudy = new Image();
            image_cloudy.src = '/weather-icons/icons8-haze-40.png';
            let image_heavyrain = new Image();
            image_heavyrain.src = '/weather-icons/icons8-rain-40.png';
            let image_lightrain = new Image();
            image_lightrain.src = '/weather-icons/icons8-light-rain-40.png';
            let image_sleet = new Image();
            image_sleet.src = '/weather-icons/icons8-sleet-40.png';
            let image_snow = new Image();
            image_snow.src = '/weather-icons/icons8-snow-storm-40.png';
            let image_storm = new Image();
            image_storm.src = '/weather-icons/icons8-storm-40.png';
            var icons = [];
            icons.push(image_sun);
            icons.push(image_cloudy);
            icons.push(image_heavyrain);
            icons.push(image_lightrain);
            icons.push(image_sleet);
            icons.push(image_snow);
            icons.push(image_storm);
        }
        for (let i = 0; i < 10; i++) {
            let size;
            if (innerWidth > innerHeight) {
                size = (Math.random() * 0.4 + 0.6) * innerWidth / 40;
            } else {
                size = (Math.random() * 0.4 + 0.6) * innerHeight / 25;
            }
            let x = Math.random() * (innerWidth - size * 2);
            let y = Math.random() * (innerHeight - size * 2);
            let directionX = (Math.random() * .4) - .2;
            let directionY = (Math.random() * .4) - .2;
            if (iconid === 'everything') {
                let temp = parseInt(Math.random() * 7);
                particleArray.push(new Particle(x, y, directionX, directionY, size, icons[temp]));
            } else {
                let icon = new Image();
                icon.src = '/weather-icons/icons8-' + iconid + '-40.png';
                icon.onload = function () {
                    particleArray.push(new Particle(x, y, directionX, directionY, size, icon));
                }
            }
        }
    }
    let particleArray = [];
    let rad = 0;
    const canvas = document.getElementById('icon1');
    const ctx = canvas.getContext('2d');
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = document.body.scrollHeight;
    let transparency = 0;
    ctx.globalAlpha = transparency;
    ctx.clearRect(0, 0, window.innerWidth, document.body.scrollHeight);
    let offset = (Math.random() - 0.5) * 0.001 * Math.PI / 180;
    init(iconid);
    animate();
    // window.addEventListener('resize', function () {
    //   canvas.width = innerWidth;
    //   canvas.height = innerHeight;
    //   init();
    // });
}