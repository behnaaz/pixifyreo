function constrainify() {
    document.getElementById('constraints').innerText = map(document.getElementById('result').innerText);
}

function map(network) {
    var result = "";
    const model = JSON.parse(network);
    for (var i = 0; i < model.channels.length; i++) {
        result += result.length === 0 ? "" : " AND ";
        result += mapChannel(model.channels[i]);
    }
    return result;
}

function mapNode(node) {
    return node.id;
}

function data(end) {
    return end + 'data';
}

function flow(end) {
    return end + 'flow';
}

function mapChannel(channel) {
    var dataAware = true;

    if (channel.channelType == 'sync') {
        return dataAware ?
            ('( ' + data(channel.id + channel.source) + " eqiv " + data(channel.id + channel.target) + ' ) AND (NOT ' + flow(channel.id + channel.source) + ' equiv ' + data(channel.id + channel.target)) + ')' : '' +
            dataAware ? (' AND ( NOT (' + flow(channel.id + channel.source) + ") eqiv " + data(channel.id + channel.target) + ' == NULL )') : '';
    }
    return channel.id;
}