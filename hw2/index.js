import net from 'net';

const database = {};
const guid = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

const onEnd = () => {
  console.log('ENDED');
};

const server = net.createServer(c => {
  console.log('socket opened');
  c.setEncoding('utf8');

  c.on('end', onEnd);
  c.on('data', (data) => {

    if (data.startsWith('open')) {
      const uuid = guid();
      database[uuid] = {
        items: 0
      };
      c.write(`opened\n${uuid}`);
    }
    if (data.startsWith('add')) {

      const uuid = data.replace("\r\n", "").replace(/add\n([^\r]*)/ig, '$1 - $0 - $2');
      console.log(uuid, database);
      // database[uuid].items += 1;
      c.write(`added`);
    }
    if (data.startsWith('process')) {
      delete database[uuid];
      c.write(`processed`);
    }
  });
});


server.listen(8080, function() {
  console.log('server started');
});
