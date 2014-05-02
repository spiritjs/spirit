var fs = require('fs')
var spirit = require('../..');

var graph = spirit.Graph('linecount');
var Component = spirit.Component;
var InPorts = spirit.InPorts;
var OutPorts = spirit.OutPorts;

/*
graph.addNode('Read File', 'read component');
graph.addNode('Split by Lines', 'splitstr component');
graph.addNode('Count Lines', 'Counter component');
graph.addNode('Display', 'Output');

graph.addEdge({ id: 'Read File', port: 'out' }, { id: 'Split by Lines', port: 'in' });
graph.addEdge({ id: 'Split by Lines', port: 'out' }, { id: 'Count Lines', port: 'in' });
graph.addEdge({ id: 'Count Lines', port: 'out' }, { id: 'Display', port: 'in' });
*/
var readFile = new Component({
  inPorts: new InPorts([
    {
      name: 'in'
    }
  ]),
  outPorts: new OutPorts([
    {
      name: 'out'
    }
  ])
});
readFile.inPorts.ports.in.on('data', function (filename) {
  var str = fs.readFileSync(filename).toString();
  readFile.outPorts.ports.out.send(str)
  readFile.outPorts.ports.out.disconnect()
})

var splitStr = new Component(
  {
    inPorts: new InPorts([
      {
        name: 'in'
      },
      {
        name: 'delimiter'
      }
    ]),
    outPorts: new OutPorts([
      {
        name: 'out'
      }
    ])
  }
)
splitStr.delimiter = "\n"
splitStr.string = ""
splitStr.inPorts.ports.delimiter.on('data', function (data) {
  splitStr.delimiter = data;
});
splitStr.inPorts.ports.in.on('data', function (data) {
  splitStr.string += data;
});
splitStr.inPorts.ports.in.on('disconnect', function () {
  var parts = splitStr.string.split(splitStr.delimiter);
  for (var i = 0; i < parts.length; i++) {
    splitStr.outPorts.ports.out.send(parts[i]);
  }
  splitStr.outPorts.ports.out.disconnect();
  splitStr.string = '';
});

var counter = new Component(
  {
    inPorts: new InPorts([
      {
        name: 'in'
      }
    ]),
    outPorts: new OutPorts([
      {
        name: 'count'
      }
    ])
  }
)
counter.count = 0;
counter.inPorts.ports.in.on('data', function (data) {
  counter.count++;
});
counter.inPorts.ports.in.on('disconnect', function (data) {
  counter.outPorts.ports.count.send(counter.count)
  counter.outPorts.ports.count.disconnect()
  counter.count = 0
});

var output = new Component(
  {
    inPorts: new InPorts([
      {
        name: 'in'
      }
    ]),
    outPorts: new OutPorts([
      {
        name: 'out'
      }
    ])
  }
)
output.outPorts.ports.out.on('data', function (data) {
  process.stdout.write(data + '\n')
});
output.inPorts.ports.in.on('data', function (data) {
  //output.outPorts.ports.out.send(data - 1)
  output.outPorts.ports.out.emit('data', data - 1)
  output.outPorts.ports.out.disconnect();
});

graph.addNode('Read File', readFile);
graph.addNode('Split by Lines', splitStr);
graph.addNode('Count Lines', counter);
graph.addNode('Display', output);

graph.addEdge({ id: 'Read File', port: 'out' }, { id: 'Split by Lines', port: 'in' });
graph.addEdge({ id: 'Split by Lines', port: 'out' }, { id: 'Count Lines', port: 'in' });
graph.addEdge({ id: 'Count Lines', port: 'count' }, { id: 'Display', port: 'in' });

graph.addInitial({ data: __filename }, { id: 'Read File', port: 'in' });

//graph.removeNode('Count Lines');

//console.log(JSON.stringify(graph, null, 2));

var network = spirit.Network(graph);
network.connect()
network.up();
//console.dir(network)
