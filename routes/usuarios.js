<<<<<<< HEAD
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
=======
// routes/usuarios.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController'); // Asegúrate de que este controlador exista y sea correcto

// Importa los middlewares de autenticación y autorización desde tu archivo centralizado
// Asegúrate de que este archivo exista en 'middlewares/authMiddleware.js'
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

// Aplica los middlewares de protección a todas las rutas de gestión de usuarios
// Típicamente, solo los administradores tienen acceso completo a la gestión de usuarios
router.use(isAuthenticated); // Requiere que el usuario esté logeado
router.use(isAdmin);         // Requiere que el usuario logeado tenga el rol 'admin'

// Rutas para la gestión de usuarios (CRUD)
// GET /usuarios - Muestra la lista de todos los usuarios
router.get('/', usuarioController.listarUsuarios);

// GET /usuarios/nuevo - Muestra el formulario para crear un nuevo usuario
router.get('/nuevo', usuarioController.formularioNueva);

// POST /usuarios - Guarda un nuevo usuario enviado desde el formulario
router.post('/', usuarioController.guardarUsuario);

// GET /usuarios/editar/:id - Muestra el formulario para editar un usuario específico
router.get('/editar/:id', usuarioController.formularioEditar);

// POST /usuarios/actualizar/:id - Actualiza un usuario específico
router.post('/actualizar/:id', usuarioController.actualizarUsuario);

// POST /usuarios/eliminar/:id - Elimina un usuario específico
router.post('/eliminar/:id', usuarioController.eliminarUsuario);
>>>>>>> aa8027501b4c073def9c20a08ba1531f326b1aa0

module.exports = router;