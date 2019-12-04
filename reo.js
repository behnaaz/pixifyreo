var drawingMode = 'Node';
const graphics = new PIXI.Graphics();
const app = new PIXI.Application({
    antialias: true
});
var points = [];
var kanals = [];
var prePoint = null;

function windowLoad() {
    document.body.appendChild(app.view);
    app.renderer.plugins.interaction.on('mousedown', onPointerDown);
    app.stage.addChild(graphics);
}

function reportPoints() {
    var result = [];
    for (var i = 0; i < points.length; i++) {
        var type = 'rep';
        result.push({ id: 'node' + i, nodeType: type, x: points[i].x, y: points[i].y });
    }
    return result;
}

function reportChannels() {
    var result = [];
    for (var i = 0; i < kanals.length; i++) {
        var type = 'sync';
        result.push({ id: 'channel' + i, source: kanals[i].source, target: kanals[i].target, channelType: type });
    }
    return result;
}

function showResult() {
    document.getElementById('result').innerText = JSON.stringify({ nodes: reportPoints(), channels: reportChannels() });
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

    for (var i = 1; i < points.length; i++) {
        var cur = distance({ x: position.x, y: position.y }, { x: points[i].x, y: points[i].y })

        if (cur < min) {
            min = cur;
            minIndex = i;
        }
    }
    return { x: points[minIndex].x, y: points[minIndex].y, id: minIndex };
}

function onPointerDown(event) {
    const newPosition = { x: event.data.global.x, y: event.data.global.y };
    console.log(window.prePoint);
    if (window.drawingMode === 'Node') {
        drawNode(newPosition);
    } else {
        drawChannel({ x: newPosition.x, y: newPosition.y });
    }
    showResult();
}

function drawNode(newPosition) {
    var old = findNode({ x: newPosition.x, y: newPosition.y });
    if (old && distance({ x: old.x, y: old.y }, { x: newPosition.x, y: newPosition.y }) < 400) {
        return;
    }
    graphics.beginFill(0xAA4F08);

    graphics.drawCircle(newPosition.x, newPosition.y, 20);
    points.push(newPosition);

}

function drawChannel(newPosition) {
    if (window.prePoint === null) {
        window.prePoint = { x: newPosition.x, y: newPosition.y };
        return;
    }
    var found = findNode(newPosition);
    if (found == null) {
        return;
    }
    channel(window.prePoint, found);
    drawNode(window.prePoint);
    drawNode(found);
    kanals.push({ source: found.id, target: findNode(window.prePoint).id });
    window.prePoint = { x: found.x, y: found.y };
}

function createGradTexture() {
    // adjust it if somehow you need better quality for very very big images
    const quality = 256;
    const canvas = document.createElement('canvas');
    canvas.width = quality;
    canvas.height = 1;

    const ctx = canvas.getContext('2d');

    // use canvas2d API to create gradient
    const grd = ctx.createLinearGradient(0, 0, quality, 0);
    grd.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
    grd.addColorStop(0.3, 'cyan');
    grd.addColorStop(0.7, 'red');
    grd.addColorStop(1, 'green');

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, quality, 1);

    return PIXI.Texture.from(canvas);
}

function channel(src, dest) {
    const realPath = new PIXI.Graphics();
    realPath.lineStyle(2, 0xFFFFFF, 1);
    realPath.moveTo(src.x, src.y);
    realPath.lineTo(dest.x, dest.y);
    graphics.lineStyle(0);
    realPath.angle = 2; //???

    ////////
    const gradTexture = createGradTexture();

    const sprite = new PIXI.Sprite(gradTexture);
    sprite.position.set(dest.x - 20, dest.y - 20);
    //sprite.rotation = Math.PI / 8;
    sprite.width = 25;
    sprite.height = 25;
    app.stage.addChild(sprite);

    /////////////

    app.stage.addChild(realPath);

    console.log("channel from" + src.x + "," + src.y + "to " + dest.x + " , " + dest.y);
}