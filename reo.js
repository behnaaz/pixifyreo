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
          			[400, 230, 'temp', 'left'],

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
	};
