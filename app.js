const fs = require('fs')
var server = require('http').createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(fs.readFileSync(__dirname + '/index.html', 'utf-8'))
});


//记录当前连接的用户数量
// let count = 0;
const WebSocket = require('ws');

const WebSocketServer = new WebSocket.Server({ port: 12010 });
WebSocketServer.on('connection', (ws) => {
  ws.on('message', (data, isBinary) => {
    let msg = isBinary ? data : JSON.parse(data)
    if (msg.type == 0) {
      ws.userName = msg.name;
      broadcast(`${ws.userName}加入聊天室`);
    } else {
      broadcast(msg, ws);
    }
  });
  ws.on('close', () => {
    //有人退出也告诉所有的用户
    broadcast(`${ws.userName}离开了聊天室`)
  })
});

//广播
const broadcast = (msg, ws) => {
  //server.connection表示所有的用户
  WebSocketServer.clients.forEach(item => {
    //遍历出每个用户，挨个发消息
    if (ws) {
      item.send(ws.userName + '说:' + msg.text);
    } else {
      item.send(msg);
    }
  });
}


server.listen(3000,'127.0.0.1');
