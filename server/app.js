const express = require('express');
const menuRoutes = require('./routes/menuRoutes');
const tableRoutes = require('./routes/tableRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
app.use(express.json());

// Not: statik dosya servisi (app.use(express.static('public'))) kaldırıldı.
// Artık arayüz React (client klasörü) tarafından, ayrı bir Vite dev server'da çalışıyor.

app.use('/api', menuRoutes);
app.use('/api', tableRoutes);
app.use('/api', orderRoutes);
app.use('/api', reportRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
