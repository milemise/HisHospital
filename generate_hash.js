const bcrypt = require('bcryptjs');

async function generateHash(password) {
    try {
        const salt = await bcrypt.genSalt(10); // Genera un "salt" (valor aleatorio)
        const hash = await bcrypt.hash(password, salt); // Hashea la contraseña con el salt
        console.log(`Contraseña original: "${password}"`);
        console.log(`Hash bcrypt: "${hash}"`);
    } catch (error) {
        console.error('Error al generar hash:', error);
    }
}

// Llama a la función para cada contraseña que quieras hashear
generateHash('password123');
generateHash('adminpass');
generateHash('medpass');
// Puedes añadir más si necesitas