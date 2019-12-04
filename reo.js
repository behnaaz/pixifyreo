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
    app.stage.addChild(graphics);
}

function mode(mod) {
    window.drawingMode = (mod === 'Node') ? 'Node' : 'Channel';
}

function distance(p1, p2) {
    return ((p1.x - p2.x) * (p1.x - p2.x)) + ((p1.y - p2.y) * (p1.y - p2.y));
}

function findNode(position) {
    if (points.length === 0) {
        return null;
    }
    var minIndex = 0;
    var min = distance({ x: position.x, y: position.y }, { x: points[0].x, y: points[0].y });
    console.log("min " + min)
    for (var i = 1; i < points.length; i++) {
        var cur = distance({ x: position.x, y: position.y }, { x: points[i].x, y: points[i].y })
        console.log("cur " + cur)

        if (cur < min) {
            min = cur;
            minIndex = i;
        }
    }
    return { x: points[minIndex].x, y: points[minIndex].y };
}

function onPointerDown(event) {
    const newPosition = { x: event.data.global.x, y: event.data.global.y };
    console.log(window.prePoint);
    if (window.drawingMode === 'Node') {
        drawNode(newPosition);
    } else if (window.drawingMode === 'Channel') {
        drawChannel({ x: newPosition.x, y: newPosition.y });
    }
    console.log(points);
}

function drawNode(newPosition) {
    points.push(newPosition);
    graphics.drawCircle(newPosition.x, newPosition.y, 20);
    graphics.beginFill(0xAA4F08);
}

function drawChannel(newPosition) {
    if (window.prePoint !== null) {
        var found = findNode(newPosition);
        if (found !== null) {
            channel(window.prePoint, found);
            window.prePoint = { x: found.x, y: found.y };
            drawNode(window.prePoint);
            drawNode(found);
        }
    } else {
        window.prePoint = { x: newPosition.x, y: newPosition.y };
    }
}

function channel(src, dest) {
    const realPath = new PIXI.Graphics();
    realPath.lineStyle(2, 0xFFFFFF, 1);
    realPath.moveTo(src.x, src.y);
    realPath.lineTo(dest.x, dest.y);
    realPath.angle = 2; //???
    app.stage.addChild(realPath);

    console.log("channel from" + src.x + "," + src.y + "to " + dest.x + " , " + dest.y);
}