const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Obteniendo todos los usuarios' });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Obteniendo el usuario con ID: ${id}` });
});

router.post('/', (req, res) => {
  const userData = req.body;
  res.status(201).json({ 
    message: 'Usuario creado exitosamente',
    data: userData
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  res.json({ 
    message: `Actualizando el usuario con ID: ${id}`,
    data: updatedData
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Eliminando el usuario con ID: ${id}` });
});

module.exports = router;