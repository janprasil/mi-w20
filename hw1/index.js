import net from 'net';

const server = net.createServer(c => {
  console.log('socket opened');

  c.setEncoding('utf8');

  c.on('end', () => {
    console.log('connection/socket closed');
  });

  c.on('data', (data) => {
    console.log('Data:'+data);
    c.write('Answer:'+data);
    // c.end(); // close socket/conection
  });

});

server.listen(8124, () => { // start server (port 8124)
  console.log('server started');
});
