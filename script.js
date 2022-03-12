const svgns = 'http://www.w3.org/2000/svg';
const container = document.querySelector('svg');
const [oddStarCol, evenStarCol] = ['#ffd', '#c91'];
const starCount = 15;
const starsArray = [];
let flamesArray = [];
let flameY = 535;
let newFlameY = true;
let i = 0;

const drawCircle = attrs => {
    const circle = document.createElementNS(svgns, 'circle');

    for (const [index, prop] of ['cx', 'cy', 'r', 'fill', 'stroke', 'stroke-width'].entries()) {
        if (attrs[index] !== undefined) {
            circle.setAttribute(prop, attrs[index]);
        }
    }

    return circle;
};

const drawCraters = () => {
    const colour = '#ccc';
    const craterData = [
        [160,100,27,colour],
        [185,55,20,colour],
        [230,80,15,colour],
        [260,85,7,colour],
        [250,120,12,colour],
    ];

    for (const crater of craterData) {
        container.appendChild(drawCircle(crater));
    }
};

const drawStars = () => {    
    let starX = 30;
    let starY = 40;

    for (let i = 1; i <= starCount; i++) {
        const starColour = i % 2 === 0 ? evenStarCol : oddStarCol;

        i === 6 && (starX = 50);
        const star = drawCircle([starX, starY, 1, starColour]);
        starsArray.push(star);

        container.appendChild(star);
        starX += 80;

        if (i % 5 === 0) {
            starX = 30;
            starY += 80;
        }        
    }    
};

const drawNoseCone = () => {
    const noseCone = document.createElementNS(svgns, 'polygon');

    for (const [index, prop] of ['points', 'fill'].entries()) {
        noseCone.setAttribute(prop, ['200,390 217,410 183,410','#f00'][index]);
    }

    return noseCone;    
};

const drawFins = () => {
    const fins = document.createElementNS(svgns, 'polygon');

    for (const [index, prop] of ['points', 'fill'].entries()) {
        fins.setAttribute(prop, ['175,490 225,490 250,525, 150,525','#555'][index]);
    }

    return fins;    
};

const drawRocket = () => {
    const ship = document.createElementNS(svgns, 'rect');

    for (const [index, prop] of ['x', 'y', 'rx', 'ry', 'height', 'width', 'fill'].entries()) {
        ship.setAttribute(prop, [175,410,10,50,120,50,'#ddd'][index]);
    }

    return ship;
};

const drawFlame = incrementer => {
    const randX = [190,210][Math.floor(Math.random() * (1 + 1))];
    const randCol = ['#ffffc9','#fff7d8','#ffffe6'][Math.floor(Math.random() * (2 + 1))];

    if (incrementer === 10 && newFlameY) {
        flameY -= 1;
    }

    const flame = drawCircle([randX,flameY,7,randCol]);
    flamesArray.push(flame)
    container.appendChild(flame);
};

const moon = drawCircle([200,100,75,'#eee']);
const noseCone = drawNoseCone();
const fins = drawFins();
const rocket = drawRocket();
const portHole = drawCircle([200, 440, 15, '#aaa', '#555', '3']);

// Stars & craters are appended in the function
drawStars();
container.appendChild(moon);
drawCraters();
container.appendChild(noseCone);
container.appendChild(fins);
container.appendChild(rocket);
container.appendChild(portHole);

const animate = () => {
    i++;

    drawFlame(i);
    // Control/limit rocket & star twinkle speed
    if (i === 10) {
        if (rocket.getAttribute('y') > 320 ) {
            const conePoints = `200,${noseCone.points[0].y -1}, 217,${noseCone.points[1].y -1}, 183,${noseCone.points[2].y -1}`;
            const finPoints = `175,${fins.points[0].y -1}, 225,${fins.points[1].y -1}, 250,${fins.points[2].y -1}, 150,${fins.points[2].y -1}`;
    
            noseCone.setAttribute('points', conePoints);
            fins.setAttribute('points', finPoints);        
            rocket.setAttribute('y', rocket.y.animVal.value - 1);       
            portHole.setAttribute('cy', portHole.cy.animVal.value - 1);            
        } else {
            newFlameY = false;
        }

       for (const star of starsArray) {
            const changeStarCol = star.getAttribute('fill') === oddStarCol ? evenStarCol : oddStarCol;
            star.setAttribute('fill', changeStarCol);
       }

        i = 0;
    }

    for (const flame of flamesArray) {
        if (flame.getAttribute('cy') > 540) {
            // Remove flame when it goes offscreen
            // This should alway be the first element
            flamesArray.shift();
        } else {
            flame.setAttribute('cy', flame.cy.animVal.value + 1);
            flame.setAttribute('r', flame.r.animVal.value + 0.10);
        }        
    }

    requestAnimationFrame(() => {
        animate();
    });
};

animate();
