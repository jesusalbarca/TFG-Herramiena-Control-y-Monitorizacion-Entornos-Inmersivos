const alert =require('alert'); 

const express = require('express');
const db = require('./db');
const app = express();
const server = require("http").Server(app);
const fs = require('fs');


app.set('view engine', 'ejs');

const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

app.use(express.urlencoded({extended:true}));
app.use(express.json());


server.listen(3000, () => {
    console.log('server started at localhost 3000');
});


app.get('/', function (req, res){
  ModelService.find({}, (err, servicios)=>{
    if(err){
        return res.status(500).json({
            message: 'Error mostrando los servicios'
        })
    }
    ModelMessage.find({}, (err, messages)=>{
      if(err){
          return res.status(500).json({
              message: 'Error mostrando los servicios'
          })
      }
      res.render('index.ejs', {servicios: servicios, messages: messages})
    
    })
  //  return res.render('index.ejs', {servicios: servicios})
  })
})

/*
app.get('/', function (req, res){
  var services_mongo = fetch('http://localhost:3000/get/allServices');

  services_mongo.then((datos)=>datos.json())
  .then((datos)=>{
    //generar sintaxis servicios en arhivo proto
    console.log(services_mongo);
  })
})
*/

app.get('/insertar_service', function(req, res){
  ModelMessage.find({}, (err, messages)=>{
    if(err){
        return res.status(500).json({
            message: 'Error mostrando los servicios'
        })
    }
    res.render('insertar_service.ejs', {messages: messages})
    })
});

//router.post('/crear_service', serviceControler.crear);

app.post('/crear_service', function(req,res){
  console.log('insertar en bbdd pero ERROR --> actualizar fichero proto');
  console.log(req.body);
  var grpcs = [];

 for(let i = 0; i<req.body.array.length;i=i+3){
    const grpc = {"name":req.body.array[i], "request":req.body.array[i+1], "reply":req.body.array[i+2]};
    grpcs.push(grpc);
 }

 const servicio = new ModelService ({
     name: req.body.name, 
     grpcs: grpcs
 })
 servicio.save(function(err, servicio){
     if(err){
         return res.status(500).json({
             message: 'Erro al crear Alumno'
         })
     }
 })
 //error operation not permitted, open PATH syscall: 'open'
// p1();

 res.redirect('/insertar_service');

})


app.post('/crear_message', function(req, res){
  var types = [];

  for(let i=0; i<req.body.array.length;i=i+2){
      const type = {"tipo":req.body.array[i], "typename":req.body.array[i+1]};
      types.push(type);
  }
  const message = new ModelMessage ({
      name: req.body.nameType, 
      types: types
  })

  message.save(function(err, message){
      if(err){
          return res.status(500).json({
              msg: 'Erro al crear mesage'
          })
      }
      res.redirect('/insertar_service');
  })
});

app.get('/mostrar_messages', function(req, res){
  ModelMessage.find({}, (err, messages)=>{
    if(err){
        return res.status(500).json({
            message: 'Error mostrando los servicios'
        })
    }
    return res.render('mostrar_messages', {messages: messages})
})
});


app.get('/mostrar_servicios', function(req, res){
  ModelService.find({}, (err, servicios)=>{
    if(err){
        return res.status(500).json({
            message: 'Error mostrando los servicios'
        })
    }

    return res.render('mostrar_servicios', {servicios: servicios})
  })
});


const ModelService = require('./model/Servicio');


app.get('/get/allServices', function(req, res){
   // res.send('hola');
   ModelService.find({}, (err, servicios)=>{
      if(err){
          return res.status(500).json({
              message: 'Error mostrando los servicios'
          })
      }
    res.send(servicios);
//   console.log(servicios);
    })
});

const ModelMessage = require('./model/Message');


app.get('/get/allMessages', function(req, res){
   // res.send('hola');
   ModelMessage.find({}, (err, messages)=>{
    if(err){
        return res.status(500).json({
            message: 'Error mostrando los servicios'
        })
    }
    res.send(messages);
//   console.log(servicios);
    })
});

app.get('/delete_message/:id', function(req, res){
  const id= req.params.id;
  ModelMessage.findByIdAndRemove(id, (err, message)=>{
    if(err){
      return res.status(500).json({
        message: 'Error eliminando al message'
      })
    }
    res.redirect('/insertar_service');
  })

});


app.get('/delete_service/:id', function(req, res){
  const id= req.params.id;
  ModelService.findByIdAndRemove(id, (err, service)=>{
    if(err){
      return res.status(500).json({
        message: 'Error eliminando al message'
      })
    }
    res.redirect('/mostrar_servicios');
  })

});
const path = require('path');


//Elmina el archivo proto y lo vuelve a crear con la cabecera
const rutaProto = path.resolve(__dirname, 'proto', 'protofile.proto');
function p1(){
  console.log('p1');
  
  try {
    fs.promises.unlink(rutaProto);
    console.log('successfully deleted /proto/protofile.proto');
  } catch (error) {
    console.error('there was an error:', error.message);
  }
  var headproto = 'syntax = "proto3"; \npackage helloworld;\n';
  console.log(rutaProto);
  fs.writeFile(rutaProto, headproto, (err) => {
      if (err) throw err;
      console.log('Cabezera insertada en proto/protofile.proto');
  });

}
function delete_protofile() {
//Archivo proto
//crear directorio proto si no existe

  var Q_SAVEPATH = "proto"; 
  fs.promises.mkdir(`${__dirname}/${Q_SAVEPATH}`, {recursive: true})
      .then(() => console.log("[DIR INIT] Success on initialising the persistency directories for gRPC (/proto) : " + `${__dirname}/${Q_SAVEPATH}`))
      .catch(() => console.error("[ERROR] Something went wrong initialising directory : " + `${__dirname}/${Q_SAVEPATH}`));

      try {
        fs.promises.unlink(rutaProto);
        console.log('successfully deleted /proto/protofile.proto');
      } catch (error) {
        console.error('there was an error:', error.message);
      }
      var headproto = 'syntax = "proto3"; \npackage helloworld;\n';
                  fs.appendFile(rutaProto, headproto, (err) => {
                      if (err) throw err;
                      console.log('Cabezera insertada en proto/protofile.proto');
                  });
}
delete_protofile();

//Insertar servicios de mongodb
const fetch = require("node-fetch");



//generar sintaxis servicios en arhivo proto
sintaxService();
//generar sintaxis messages en arhivo proto
sintaxMessage();

function sintaxService (){
  var services_mongo = fetch('http://localhost:3000/get/allServices');

  services_mongo.then((datos)=>datos.json())
                .then((datos)=>{
                  
                  //generar sintaxis servicios en arhivo proto
                  datos.forEach(service => {
                    var sintaxFirstServ = 'service ' + service.name + ' { \n';
                    var sintaxAllGrpc = '';
                    service.grpcs.forEach(grpc =>{
                      var sintaxGrpc = '  rpc ' + grpc.name  + ' (' +  grpc.request + ') ' + 'returns ' + '('+  grpc.reply + ') ' + ' {}\n';
                      sintaxAllGrpc = sintaxAllGrpc + sintaxGrpc;
                    });
                    var sintaxEndServ = '} \n';
                    var sintax = sintaxFirstServ + sintaxAllGrpc + sintaxEndServ;
                    fs.appendFile(rutaProto, sintax, (err) => {
                      if (err) throw err;
                          console.log('Servicio ' + service.name + ' añadido en proto/protofile.proto de mongodb');
                    });
                    
                 });
              })
}

function sintaxMessage(){
  
  var messages_mongo = fetch('http://localhost:3000/get/allMessages');

  messages_mongo.then(datos=>datos.json())
                .then(datos=>{
                  //generar sintaxis messages en arhivo proto
                  datos.forEach(message =>{
                    var sintaxFirst = 'message ' + message.name + ' {\n';
                    var sintaxTypes = '';
                    var inc = 1;
                    message.types.forEach(tipo => {
                        var sintaxType = tipo.tipo + ' ' + tipo.typename + ' = ' + inc + '; \n';
                        sintaxTypes = sintaxTypes + sintaxType;
                        inc++;
                    })
                    var sintaxEnd = '} \n';
                    var sintax = sintaxFirst + sintaxTypes + sintaxEnd;
                    fs.appendFile(rutaProto, sintax, (err) => {
                      if (err) throw err;
                          console.log('Message ' + message.name + ' añadido en proto/protofile.proto de mongodb');
                    });
                  })
                })
}



//GRPC
var PROTO_PATH = __dirname + '/proto/helloworld.proto';
//hAY QUE ACCEDER A PROTOFILE PROTO
//var PROTO_PATH = __dirname + '/proto/protofile.proto';


var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
    
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

//var hello_proto = grpc.loadPackageDefinition(packageDefinition).protofile;

var services_mongo = fetch('http://localhost:3000/get/allServices');
const grpcServices = new Map();

services_mongo.then((datos)=>datos.json())
.then((datos)=>{
  //generar sintaxis servicios en arhivo proto
  
  datos.forEach(service => {
    grpcServices['service' + service.name]= new hello_proto[`${service.name}`]('localhost:50051', grpc.credentials.createInsecure());
    
  });

})


app.post('/ejecuteService', function(req, res){
  console.log(req.body);
  var objRequest = {};
  var x=0;
  req.body.typeAtrb.forEach(tipo =>{
    objRequest[`${tipo}`] = req.body.nameAtrb[x];
    x++;
  })
  const grpcMethod = grpcServices['service'+req.body.ServiceChoose];

  console.log(objRequest);
  grpcMethod[`${req.body.grpcChoose}`](objRequest, function(err, response){
    if (err!=null){
      console.log('SERVIDOR NO CONECTADO');
      alert('SERVIDOR NO CONECTADO');
      console.log(err);
    }else{
      console.log('Greeting:', response.message);
      alert(response.message);
      res.redirect('/');
    }
  });
//  console.log(res.body);
});
