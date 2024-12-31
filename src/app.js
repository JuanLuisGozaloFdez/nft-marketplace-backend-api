const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const nftRoutes = require('./routes/nftRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/nft', nftRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/stats', statsRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
