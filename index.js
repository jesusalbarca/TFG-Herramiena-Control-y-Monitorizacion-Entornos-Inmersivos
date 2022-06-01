const alert = require('alert');

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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


server.listen(3000, () => {
  console.log('server started at localhost 3000');
});


app.get('/ejecutar', function (req, res) {
  ModelService.find({}, (err, servicios) => {
    if (err) {
      return res.status(500).json({
        message: 'Error mostrando los servicios'
      })
    }
    ModelMessage.find({}, (err, messages) => {
      if (err) {
        return res.status(500).json({
          message: 'Error mostrando los servicios'
        })
      }
      res.render('index.ejs', { servicios: servicios, messages: messages })

    })
    //  return res.render('index.ejs', {servicios: servicios})
  })
})


var servicio_creado = "";
var existe_service = false;
app.get('/insertar_service', function (req, res) {

  ModelMessage.find({}, (err, messages) => {
    if (err) {
      return res.status(500).json({
        message: 'Error mostrando los servicios'
      })
    }
    if (existe_service) {
      existe_service = false;
      res.render('insertar_service.ejs', { messages: messages, alert_service_existe: servicio_creado, alert_service_create: '' });
      servicio_creado = "";

    }
    else if (servicio_creado) {
      res.render('insertar_service.ejs', { messages: messages, alert_service_create: servicio_creado, alert_service_existe: '' });
      servicio_creado = "";

    } else {
      res.render('insertar_service.ejs', { messages: messages, alert_service_create: '', alert_service_existe: '' });
      servicio_creado = "";

    }


  })
});

//router.post('/crear_service', serviceControler.crear);

app.post('/crear_service', function (req, res) {
  console.log('insertar en bbdd pero ERROR --> actualizar fichero proto');
  console.log(req.body);
  var grpcs = [];

  for (let i = 0; i < req.body.array.length; i = i + 3) {
    const grpc = { "name": req.body.array[i], "request": req.body.array[i + 1], "reply": req.body.array[i + 2] };
    grpcs.push(grpc);
  }

  ModelService.find({ name: req.body.name }, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: 'Erro al crear Alumno'
      })
    }
    if (data.length === 0) {
      const servicio = new ModelService({
        name: req.body.name,
        grpcs: grpcs
      })
      console.log('creo el servicio si no existe');

      servicio.save(function (err, servicio) {
        if (err) {
          return res.status(500).json({
            message: 'Erro al crear Alumno'
          })
        } else {
          servicio_creado = req.body.name;
        }
      })
      return res.redirect('/insertar_service');
    } else {
      servicio_creado = req.body.name;
      existe_service = true;
      return res.redirect('/insertar_service');
    }
  });

})

app.get('/', function (req, res) {

  res.render('inicio.ejs');
  // res.redirect('/index');

})

app.get('/prueba', function (req, res) {
  res.redirect('/insertar_service');
})

app.post('/crear_message', function (req, res) {
  var types = [];

  for (let i = 0; i < req.body.array.length; i = i + 2) {
    const type = { "tipo": req.body.array[i], "typename": req.body.array[i + 1] };
    types.push(type);
  }
  
  const message = new ModelMessage({
    name: req.body.nameType,
    types: types
  })

  message.save(function (err, message) {
    if (err) {
      return res.status(500).json({
        msg: 'Erro al crear mesage'
      })
    }
    res.redirect('/insertar_service');
  })
});

app.get('/mostrar_messages', function (req, res) {
  ModelMessage.find({}, (err, messages) => {
    if (err) {
      return res.status(500).json({
        message: 'Error mostrando los servicios'
      })
    }
    if (message_delete) {
      res.render('mostrar_messages', { messages: messages, alert_message_delete: message_delete })
      message_delete = '';

    } else {
      return res.render('mostrar_messages', { messages: messages, alert_message_delete: '' })
    }
  })
});


app.get('/mostrar_servicios', function (req, res) {
  ModelService.find({}, (err, servicios) => {
    if (err) {
      return res.status(500).json({
        message: 'Error mostrando los servicios'
      })
    }
    if (servicio_delete) {
      res.render('mostrar_servicios', { servicios: servicios, alert_service_delete: servicio_delete });
      servicio_delete = '';

    } else {
      return res.render('mostrar_servicios', { servicios: servicios, alert_service_delete: '' })

    }
  })
});


const ModelService = require('./model/Servicio');


app.get('/get/allServices', function (req, res) {
  // res.send('hola');
  ModelService.find({}, (err, servicios) => {
    if (err) {
      return res.status(500).json({
        message: 'Error mostrando los servicios'
      })
    }
    res.send(servicios);
    //   console.log(servicios);
  })
});

const ModelMessage = require('./model/Message');


app.get('/get/allMessages', function (req, res) {
  // res.send('hola');
  ModelMessage.find({}, (err, messages) => {
    if (err) {
      return res.status(500).json({
        message: 'Error mostrando los servicios'
      })
    }
    res.send(messages);
    //   console.log(servicios);
  })
});
var message_delete = "";

app.get('/delete_message/:id/:name', function (req, res) {
  const id = req.params.id;
  ModelMessage.findByIdAndRemove(id, (err, message) => {
    if (err) {
      return res.status(500).json({
        message: 'Error eliminando al message'
      })
    }
    message_delete = req.params.name;
    res.redirect('/mostrar_messages');
  })

});

var servicio_delete = "";
app.get('/delete_service/:id/:name', function (req, res) {
  const id = req.params.id;
  ModelService.findByIdAndRemove(id, (err, service) => {
    if (err) {
      return res.status(500).json({
        message: 'Error eliminando al message'
      })
    }
    servicio_delete = req.params.name;
    res.redirect('/mostrar_servicios');
  })

});
const path = require('path');


//Elmina el archivo proto y lo vuelve a crear con la cabecera
const rutaProto = path.resolve(__dirname, 'proto', 'protofile.proto');

async function delete_protofile() {
  //Archivo proto
  //crear directorio proto si no existe

  var Q_SAVEPATH = "proto";
  fs.promises.mkdir(`${__dirname}/${Q_SAVEPATH}`, { recursive: true })
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

//Insertar servicios de mongodb
const fetch = require("node-fetch");
const { resolve } = require('path');
const { dir } = require('console');

async function generateSintax() {
  //generar sintaxis servicios en arhivo proto
 // console.log(0);
  await delete_protofile();
  await sintaxService();
 // console.log(2);
  //generar sintaxis messages en arhivo proto
  await sintaxMessage();
  console.log('eeey');
  console.log(fs.existsSync(__dirname + '/proto/protofile.proto')  ) ;
  var file_descriptor = fs.openSync(__dirname + '/proto/protofile.proto');
  fs.close(file_descriptor, (err) => {
    if (err)
      console.error('Failed to close file', err);
    else {
      console.log("\n> File Closed successfully");
    }
  });
 // fs.close(__dirname + '/proto/protofile.proto');
//  console.log(4);
 // await sleep(5000);
  grpcs();
  console.log(5);
  console.dir(grpcServices);
}
generateSintax();
/*
generateSintax().then(()=>
  grpcs()
)
*/
async function sintaxService() {
  return new Promise((resolve)=>{
    var services_mongo = fetch('http://localhost:3000/get/allServices');

    services_mongo.then((datos) => datos.json())
      .then((datos) => {

        //generar sintaxis servicios en arhivo proto
        datos.forEach(service => {
          var sintaxFirstServ = 'service ' + service.name + ' { \n';
          var sintaxAllGrpc = '';
          service.grpcs.forEach(grpc => {
            var sintaxGrpc = '  rpc ' + grpc.name + ' (' + grpc.request + ') ' + 'returns ' + '(' + grpc.reply + ') ' + ' {}\n';
            sintaxAllGrpc = sintaxAllGrpc + sintaxGrpc;
          });
          var sintaxEndServ = '} \n';
          var sintax = sintaxFirstServ + sintaxAllGrpc + sintaxEndServ;
          fs.appendFile(rutaProto, sintax, (err) => {
            if (err) throw err;
            console.log('Servicio ' + service.name + ' añadido en proto/protofile.proto de mongodb');
          });

        });
     //   console.log(1);
        resolve();
      })
  })
}

async function sintaxMessage() {

  var messages_mongo = fetch('http://localhost:3000/get/allMessages');

  messages_mongo.then(datos => datos.json())
    .then(datos => {
      //generar sintaxis messages en arhivo proto
      datos.forEach(message => {
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
  //  console.log(3);
}



//GRPC
//var PROTO_PATH = __dirname + '/proto/helloworld.proto';
//hAY QUE ACCEDER A PROTOFILE PROTO
var grpcServices = new Map();

async function grpcs() {


//  var PROTO_PATH = __dirname + '/proto/protofile.proto';
var PROTO_PATH = __dirname + '/proto/helloworld.proto';


  var grpc = require('@grpc/grpc-js');
  var protoLoader = require('@grpc/proto-loader');
  var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });

 var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

 // var hello_proto = grpc.loadPackageDefinition(packageDefinition).protofile;
  //console.dir(hello_proto);
  var services_mongo = fetch('http://localhost:3000/get/allServices');

  services_mongo.then((datos) => datos.json())
    .then((datos) => {
      //generar sintaxis servicios en arhivo proto
      //POSIBLE 
      console.log(datos);
      datos.forEach(service => {
        grpcServices['service' + service.name] = new hello_proto[`${service.name}`]('localhost:50051', grpc.credentials.createInsecure());

      });
    //  console.log(4.4);
    })
 //   console.log(4.5);

}



app.post('/ejecuteService', function (req, res) {
  console.log(req.body);
  var objRequest = {};
  var x = 0;
  req.body.typeAtrb.forEach(tipo => {
    objRequest[`${tipo}`] = req.body.nameAtrb[x];
    x++;
  })
  console.log("----------------");
  console.log(grpcServices);
  const grpcMethod = grpcServices['service' + req.body.ServiceChoose];
  console.log(grpcMethod);
  console.log(objRequest);
  grpcMethod[`${req.body.grpcChoose}`](objRequest, function (err, response) {
    if (err != null) {
   //   console.log('SERVIDOR NO CONECTADO');
    //  alert('SERVIDOR NO CONECTADO');
      console.log(err);
     
      alert(err.details);

      
    } else {
      console.log(response);
      console.log('Servidor:', response.message);
      alert(response + response.message);
      res.redirect('/');
    }
  });
  //  console.log(res.body);
});


function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}