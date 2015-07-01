var serverURL = 'localhost:9000'
var socket = require('socket.io-client')(serverURL)

// You can use either `new PIXI.WebGLRenderer`, `new PIXI.CanvasRenderer`, or `PIXI.autoDetectRenderer`
            // which will try to choose the best renderer for the environment you are in.
            var renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight);

            // The renderer will create a canvas element for you that you can then insert into the DOM.
            document.body.appendChild(renderer.view);

            // You need to create a root container that will hold the scene you want to draw.
            var stage = new PIXI.Container();

            // This creates a texture from a 'bunny.png' image.
            var bunnyTexture = PIXI.Texture.fromImage('bunny.png');
            var monedaTexture = PIXI.Texture.fromImage('Coin.png');
            var bunny = new PIXI.Sprite(bunnyTexture);
            var otherBunnies = {}
            bunny.tint = Math.floor(Math.random()*16777215)

            // Setup the position and scale of the bunny
            bunny.position.x = window.innerWidth/2;
            bunny.position.y = window.innerHeight/2;
            bunny.anchor.set(0.5,0.5);
            function getRandomInt(min, max) {
            	return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            var monedas = [];
            for (var i = 0; i < 5; i++) {
            	var moneda = new PIXI.Sprite(monedaTexture);
            	monedas.push(moneda);
            	moneda.position.x = getRandomInt(window.innerWidth, 0);
            	moneda.position.y = getRandomInt(window.innerHeight, 0);
            	moneda.scale.x = 0.5;
            	moneda.scale.y = 0.5;
            	moneda.anchor.set(0.5,0.5);
            	stage.addChild(moneda);
            }

            //bunny.scale.x = 1;
            //bunny.scale.y = 1;

            // Add the bunny to the scene we are building.
            stage.addChild(bunny);

            //KeyboardJS
            var debug = true;
            var preventer = function (evt) {
                //if (true) evt.preventDefault();
            };
            var keyboard = new KeyboardJS(debug, preventer);

            // check key with 'keyboard.keys[asciivalue]' or with 'keyboard.char(character)'
            // characters must be uppercase!
            var allaox;
            var allaoy;
            var allao;
            document.addEventListener("mousedown", function (evt) {
            	allao = true;
            	allaox = evt.pageX;
            	allaoy = evt.pageY;
            	console.log('-- keyIsUp ASCII('+evt.keyCode+')');
            });
            document.addEventListener("mousemove", function (evt) {
            	allao = true;
            	allaox = evt.pageX;
            	allaoy = evt.pageY;
            	console.log('-- keyIsUp ASCII('+evt.keyCode+')');
            	var info = {}
            	info = bunny.position
            	info.color = bunny.tint
            	socket.emit('update_position', info);
            });

            socket.on('update_position', function (pos) {
            	var sprite = otherBunnies[pos.id]
            	if(!sprite) {
            		sprite = new PIXI.Sprite(bunnyTexture)
            		stage.addChild(sprite)
            		otherBunnies[pos.id] = sprite
            		sprite.tint = pos.color
            	}
            	console.log(pos)
            	sprite.position.x = pos.x
            	sprite.position.y = pos.y
            })
            // kick off the animation loop (defined below)
            animate();

            function lineDistance( point1, point2 )
            {
            	var xs = 0;
            	var ys = 0;

            	xs = point2.x - point1.x;
            	xs = xs * xs;

            	ys = point2.y - point1.y;
            	ys = ys * ys;

            	return Math.sqrt( xs + ys );
            }

            function animate() {
            	if (allao) {
            		bunny.position.set(allaox, allaoy);
            		allao = false;
            	}
            	if (keyboard.char('W')) {
            		bunny.position.y -= 1
            		socket.emit('update_position', bunny.position);
            	}
            	if (keyboard.char('A')) {
            		bunny.position.x -= 1
            		socket.emit('update_position', bunny.position);
            	}
            	if (keyboard.char('S')) {
            		bunny.position.y += 1
            		socket.emit('update_position', bunny.position);
            	}
            	if (keyboard.char('D')){

            		socket.emit('update_position', bunny.position);
            		bunny.position.x += 1
            	}


            	monedas.forEach(function (moneda, i) {
            		radiobunny = lineDistance( {x:0,y:0}, {x:bunny.width, y:bunny.height })/3;
            		radiomoneda = lineDistance( {x:0,y:0}, {x:moneda.width, y:moneda.height })/2;
            		if (lineDistance(bunny.position, moneda.position) < radiobunny+radiomoneda) {
            			stage.removeChild(moneda)
            		}
            	});

                // start the timer for the next animation loop
                requestAnimationFrame(animate);

                // each frame we spin the bunny around a bit
                //bunny.rotation += 0.01;

                // this is the main render call that makes pixi draw your container and its children.
                renderer.render(stage);
            }