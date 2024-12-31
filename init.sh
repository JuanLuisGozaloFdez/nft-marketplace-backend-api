#!/bin/bash

# Crear la estructura de directorios
mkdir -p src/{config,controllers,models,routes,services,utils}
mkdir -p tests

# Crear archivos principales
touch src/index.js
touch src/app.js
touch .env
touch .gitignore
touch README.md
touch LICENSE
touch CONTRIBUTING.md

# Crear archivos en config
touch src/config/database.js
touch src/config/blockchain.js

# Crear archivos en controllers
touch src/controllers/authController.js
touch src/controllers/nftController.js
touch src/controllers/marketplaceController.js
touch src/controllers/userController.js

# Crear archivos en models
touch src/models/User.js
touch src/models/NFT.js
touch src/models/Listing.js
touch src/models/Transaction.js

# Crear archivos en routes
touch src/routes/authRoutes.js
touch src/routes/nftRoutes.js
touch src/routes/marketplaceRoutes.js
touch src/routes/userRoutes.js

# Crear archivos en services
touch src/services/blockchainService.js
touch src/services/ipfsService.js
touch src/services/nftService.js
touch src/services/marketplaceService.js

# Crear archivos en utils
touch src/utils/validation.js
touch src/utils/errorHandler.js
touch src/utils/jwtUtils.js
touch src/utils/blockchainUtils.js

# Agregar contenido básico a README.md
echo "# NFT Marketplace Backend API

Este proyecto es el backend para un marketplace de NFTs genérico.

## Instalación

\`\`\`
npm install
\`\`\`

## Uso

\`\`\`
npm start
\`\`\`

## Contribución

Por favor, lee CONTRIBUTING.md para detalles sobre nuestro código de conducta y el proceso para enviarnos pull requests.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.
" > README.md

# Agregar contenido básico a .env
echo "PORT=3000
MONGODB_URI=mongodb://localhost:27017/nft_marketplace
JWT_SECRET=your_jwt_secret_here
BLOCKCHAIN_PROVIDER_URL=https://mainnet.infura.io/v3/YOUR-PROJECT-ID
" > .env

# Agregar contenido básico a .gitignore
echo "node_modules/
.env
*.log
" > .gitignore

# Agregar contenido básico a CONTRIBUTING.md
echo "# Contribución

Agradecemos tu interés en contribuir a este proyecto. Por favor, sigue estas pautas:

1. Haz un fork del repositorio
2. Crea una nueva rama para tu feature o bugfix
3. Haz tus cambios y asegúrate de que los tests pasen
4. Envía un pull request

Gracias por tu contribución!
" > CONTRIBUTING.md

# Crear package.json básico
npm init -y

# Instalar dependencias básicas
npm install express mongoose dotenv jsonwebtoken cors web3 ipfs-http-client

# Instalar dependencias de desarrollo
npm install --save-dev nodemon jest supertest

# Modificar package.json para incluir scripts básicos
sed -i 's/"scripts": {/"scripts": {\n    "start": "node src\/index.js",\n    "dev": "nodemon src\/index.js",\n    "test": "jest",/g' package.json

echo "Estructura del proyecto creada con éxito!"

