var PROTO_PATH = __dirname + '/proto/protofile.proto';


  var grpc = require('@grpc/grpc-js');
  var protoLoader = require('@grpc/proto-loader');

  console.log(PROTO_PATH);
  var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });

  //var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

  var hello_proto = grpc.loadPackageDefinition(packageDefinition).protofile;
  
  console.dir(hello_proto);
