const bcrypt = require('bcryptjs');

async function generateHash(password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        console.log(`Contraseña original: "${password}"`);
        console.log(`Hash bcrypt: "${hash}"`);
    } catch (error) {
        console.error('Error al generar hash:', error);
    }
}

generateHash('password123');
generateHash('adminpass');
generateHash('medpass');