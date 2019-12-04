var drawingMode = 'Node';
const graphics = new PIXI.Graphics();
const app = new PIXI.Application({
    antialias: true
});
var points = [];
var prePoint = null;

function windowload() {
    document.body.appendChild(app.view);

    app.renderer.plugins.interaction.on('mousedown', onPointerDown);

    var rad = 10;
    var nodes = [
        [20, 30, 'a', 'left'],
        [100, 400, 'b', 'up'],
        [130, 300, 'c', 'right']
    ];
    var channels = [
        [0, 1, 'sync'],
        [1, 2, 'fifo']
    ];
    // Rectangle 2
    graphics.lineStyle(2, 0xFFFFFF, 1);
    graphics.beginFill(0xAA4F08);
    graphics.drawRect(530, 50, 140, 100);
    graphics.endFill();

    // Circle + line style 1
    for (var i = 0; i < nodes.length; i++) {
        graphics.lineStyle(2, 0xFEEB77, 1);
        graphics.beginFill(0x650A5A, 1);
        graphics.drawCircle(nodes[i][0], nodes[i][1], rad);
        graphics.endFill();
    }

    for (var i = 0; i < channels.length; i++) {
        const realPath = new PIXI.Graphics();
        realPath.lineStyle(2, 0xFFFFFF, 1);
        var src = nodes[channels[i][0]];
        var dest = nodes[channels[i][1]];
        realPath.moveTo(src[0], src[1]);
        realPath.lineTo(dest[0], dest[1]);
        realPath.position.x = rad;
        realPath.position.y = rad;
        app.stage.addChild(realPath);
    }
    app.stage.addChild(graphics);
}

function mode(mod) {
    window.drawingMode = (mod === 'Node') ? 'Node' : 'Channel';
}


function onPointerDown(event) {
    if (window.prePoint)
        console.log("b4from" + window.prePoint.x + "," + window.prePoint.y);

    const newPosition = { x: event.data.global.x, y: event.data.global.y };
    console.log(window.prePoint);
    if (window.drawingMode === 'Node') {
        points.push(newPosition);
        graphics.drawCircle(newPosition.x, newPosition.y, 20);
        window.prePoint = { x: newPosition.x, y: newPosition.y };
    } else if (window.drawingMode === 'Channel' && window.prePoint !== null) {
        console.log("from" + window.prePoint.x + "," + window.prePoint.y + "to " + newPosition.x + " , " + newPosition.y);

        channel(window.prePoint, newPosition);
    }
    console.log(points);
}

function channel(src, dest) {
    const realPath = new PIXI.Graphics();
    realPath.lineStyle(2, 0xFFFFFF, 1);
    realPath.moveTo(src.x, src.y);
    realPath.lineTo(dest.x, dest.y);
    realPath.angle = 2; //???
    app.stage.addChild(realPath);

    console.log("from" + src.x + "," + src.y + "to " + dest.x + " , " + dest.y);
}

/*
	var drawer = new function {	
		const app = new PIXI.Application({
			antialias: true
		});
		document.body.appendChild(app.view);
		const graphics = new PIXI.Graphics();
		var rad = 10;
		var nodes = [
			[40, 30, 'a', 'left'],
			[100, 400, 'b', 'up'],
			[130, 300, 'c', 'right'],
          	[400, 230, 'temp', 'left']
		];
		var channels = [
			[0, 1, 'sync'],
			[1, 2, 'fifo'],
            [0, 3, '??']
		];
		// Rectangle 2
		graphics.lineStyle(2, 0xFFFFFF, 1);
		graphics.beginFill(0xAA4F08);
		graphics.drawRect(530, 50, 140, 100);
		graphics.endFill();
		// Circle + line style 1
		for (var i = 0; i < nodes.length; i++) {
			graphics.lineStyle(2, 0xFEEB77, 1);
			graphics.beginFill(0x650A5A, 1);
			graphics.drawCircle(nodes[i][0], nodes[i][1], rad);
			graphics.endFill();
		}
		for (var i = 0; i < channels.length; i++) {
			const realPath = new PIXI.Graphics();
			realPath.lineStyle(2, 0xFFFFFF, 1);
			var src = nodes[channels[i][0]];
			var dest = nodes[channels[i][1]];
          
			realPath.moveTo(src[0], src[1]);
			realPath.lineTo(dest[0], dest[1]);
			//realPath.angle = 2;
			app.stage.addChild(realPath);
		}
		app.stage.addChild(graphics);
	};*/