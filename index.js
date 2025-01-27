const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path'); // Asegúrate de importar el módulo path

const app = express();
const PORT = 3000;
const filePath = './repertorio.json';

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname))); // Sirve archivos estáticos de la carpeta 'public'

// Ruta GET: Devuelve todas las canciones
app.get('/canciones', (req, res) => {
  const canciones = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  res.json(canciones);
});

// Ruta POST: Agrega una nueva canción
app.post('/canciones', (req, res) => {
  const nuevaCancion = req.body;
  const canciones = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  nuevaCancion.id = canciones.length ? canciones[canciones.length - 1].id + 1 : 1;
  canciones.push(nuevaCancion);

  fs.writeFileSync(filePath, JSON.stringify(canciones, null, 2));
  res.send('Canción agregada exitosamente');
});

// Ruta PUT: Modifica una canción existente por ID
app.put('/canciones/:id', (req, res) => {
  const { id } = req.params;
  const canciones = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const index = canciones.findIndex(c => c.id == id);
  if (index !== -1) {
    canciones[index] = { ...canciones[index], ...req.body };
    fs.writeFileSync(filePath, JSON.stringify(canciones, null, 2));
    res.send('Canción modificada exitosamente');
  } else {
    res.status(404).send('Canción no encontrada');
  }
});

// Ruta DELETE: Elimina una canción por ID
app.delete('/canciones/:id', (req, res) => {
  const { id } = req.params;
  const canciones = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const nuevasCanciones = canciones.filter(c => c.id != id);

  if (nuevasCanciones.length !== canciones.length) {
    fs.writeFileSync(filePath, JSON.stringify(nuevasCanciones, null, 2));
    res.send('Canción eliminada exitosamente');
  } else {
    res.status(404).send('Canción no encontrada');
  }
});

// Ruta para servir el archivo HTML en la raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Sirve el archivo index.html
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
