const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'https://tudominio.com', // Reemplaza con tu dominio
  optionsSuccessStatus: 200
}));

// Configuración de headers de seguridad
app.use(helmet());

// Rutas y lógica de la aplicación aquí

const options = {
  key: fs.readFileSync('./ssl/key.pem'),
  cert: fs.readFileSync('./ssl/cert.pem')
};

https.createServer(options, app).listen(443, () => {
  console.log('Servidor HTTPS corriendo en el puerto 443');
});
