Sistema HIS: Gestión Hospitalaria Simplificada
Este proyecto es una aplicación web integral (HIS) diseñada para optimizar la gestión de pacientes e internaciones en un entorno hospitalario. Su objetivo principal es mejorar la eficiencia operativa, la calidad de la atención médica y la administración de recursos mediante una interfaz moderna y funcional.

Funcionalidades Clave del Sistema
El sistema implementa el flujo completo de atención al paciente desde la admisión hasta el alta, incluyendo la gestión de recursos hospitalarios:

Proceso de Admisión y Recepción:
Registro de Pacientes: Permite la creación y actualización de la información personal y médica de los pacientes.
Admisión de Emergencia Flexible: En situaciones de emergencia, se puede registrar un paciente con solo el género obligatorio, generando automáticamente un DNI temporal (EMERG_...) y otros datos de relleno. La información completa se puede actualizar posteriormente.
Asignación de Cama Inteligente: Asigna pacientes a camas disponibles considerando:
Compatibilidad de género para camas en habitaciones compartidas.
Gestión de Internaciones:
Visibilidad de Admisiones: Lista detallada de todas las admisiones, con estados como Activa, En Proceso, Dada de Alta, Cancelada.
Modificación de Admisiones: Permite actualizar los detalles de la internación, incluyendo cambios de cama.
Control de Estado de Cama: Actualización automática del estado de la cama a Ocupada al asignar y Libre al dar de alta o cancelar.
Gestión de Recursos Hospitalarios:
Administración de Infraestructura: Gestión completa (CRUD) de Alas, Habitaciones y Camas, con sus estados y tipos.
Gestión de Personal Médico: Administración (CRUD) de Médicos y Especialidades.
Control de Historial y Procesos:
Evaluación de Enfermería y Médica: Módulos para registrar evaluaciones periódicas y el plan de cuidados.
Proceso de Alta Hospitalaria: Permite finalizar la internación de un paciente.
Control de Acceso y Seguridad:
Sistema de autenticación y autorización (RBAC) con roles (admin, medico, enfermero, recepcion).
Protección de rutas mediante middlewares de autenticación y roles.
Manejo de Errores y Flexibilidad:
Consideración de errores de carga o arrepentimiento de admisión, permitiendo la cancelación lógica de admisiones (cambiando su estado a Cancelada) liberando la cama.
Tecnologías Utilizadas
El proyecto está desarrollado con un stack principal basado en Node.js y Express, siguiendo el paradigma de renderizado del lado del servidor:
Backend: Node.js, Express, PostgreSQL, pg (cliente DB), Sequelize (ORM), bcryptjs (cifrado), express-session (sesiones), Passport.js (autenticación), connect-flash (mensajes flash), Helmet (seguridad/CSP), dotenv (variables de entorno), express-rate-limit.
Frontend: Pug (motor de plantillas), Bootstrap (framework CSS), Font Awesome (iconos), JavaScript (Vanilla JS).
Base de Datos: PostgreSQL .
 Requisitos e Instalación Local
Para hacer funcionar el sistema:

Requisitos: Node.js (v14+), PostgreSQL.
Clonar Repositorio:
Bash

git clone <https://github.com/milemise/HisHospital>
cd HisHospitales
Instalar Dependencias: npm install
Archivo .env: Crear en la raíz
DB_NAME=his_internacion_pg
DB_USER=postgres
DB_PASSWORD=jere123
DB_HOST=localhost
SESSION_SECRET=a8b3f2c5d1e0f9g7h6i4j2k1l0m9n8o7p6q5r4s3t2u1v0w9x8y7z6a5b4c3d
NODE_ENV=development

Preparar la Base de Datos:
Recomendado para una instalación limpia: Abrir pgAdmin,
Crear DB llamada his_internacion_pg en pgAdmin.
Ejecutar el script SQL de respaldo desde la terminal:
Bash
psql -U postgres -d his_internacion_pg -f respaldo/hospital.sql
Usuarios de Prueba:
admin: admin@his.com / Contraseña: admin 
Iniciar la Aplicación:
Bash

node app.js
Luego, acceder a http://localhost:3000/auth/login en tu navegador.