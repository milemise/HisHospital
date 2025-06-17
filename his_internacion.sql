-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-06-2025 a las 05:28:19
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `his_internacion`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ala`


CREATE TABLE `ala` (
  `id_ala` int(11) NOT NULL, 
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `ala` (`id_ala`, `nombre`) VALUES
(1, 'Ala A - Cardiología'),
(2, 'Ala B - Pediatría'),
(3, 'Ala C - Traumatología'),
(4, 'Ala D - Urgencias');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitaciones
CREATE TABLE `habitaciones` (
  `id_habitacion` int(11) NOT NULL,
  `numero` varchar(10) NOT NULL, 
  `tipo` enum('Individual','Compartida','Suite') NOT NULL, 
  `estado` enum('Disponible','Ocupada','Mantenimiento','Limpieza') NOT NULL DEFAULT 'Disponible', 
  `id_ala` int(11) NOT NULL 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
INSERT INTO `habitaciones` (`id_habitacion`, `numero`, `tipo`, `estado`, `id_ala`) VALUES
(3, '101', 'Individual', 'Disponible', 1),
(4, '202', 'Compartida', 'Disponible', 2),
(5, '305', 'Individual', 'Disponible', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cama`

CREATE TABLE `cama` (
  `id_cama` int(11) NOT NULL,
  `id_habitacion` int(11) NOT NULL,
  `numero` varchar(10) NOT NULL,
  `estado` enum('Libre','Ocupada','En Limpieza','Fuera de Servicio') NOT NULL DEFAULT 'Libre', 
  `genero_asignado` enum('M','F') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
CREATE TABLE `pacientes` (
  `id_paciente` int(11) NOT NULL, 
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `dni` varchar(50) NOT NULL UNIQUE,
  `fecha_nacimiento` date NOT NULL,
  `genero` enum('Masculino','Femenino','Otro','No especificado') DEFAULT 'No especificado',
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `id_obra_social` int(11) DEFAULT NULL,
  `numero_afiliado` varchar(50) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, 
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------



CREATE TABLE `obras_sociales` (
  `id_obra_social` int(11) NOT NULL, 
  `nombre` varchar(100) NOT NULL,
  `codigo` varchar(20) NOT NULL UNIQUE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `obras_sociales` (`id_obra_social`, `nombre`, `codigo`) VALUES
(1, 'OSDE', 'OSDE210'),
(2, 'Swiss Medical', 'SWISS456'),
(3, 'Galeno', 'GAL789');

-- --------------------------------------------------------


CREATE TABLE `admisiones` (
  `id_admision` int(11) NOT NULL,
  `id_paciente` int(11) DEFAULT NULL, 
  `fecha_ingreso` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, 
  `fecha_alta` datetime DEFAULT NULL,
  `motivo_internacion` text DEFAULT NULL, 
  `es_emergencia` tinyint(1) NOT NULL DEFAULT 0, 
  `estado_admision` enum('Activa','En Proceso','Dada de Alta','Cancelada') NOT NULL DEFAULT 'Activa',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;









CREATE TABLE `asignacion_cama` (
  `id_asignacion_cama` int(11) NOT NULL,
  `id_admision` int(11) NOT NULL, 
  `id_cama` int(11) NOT NULL, 
  `fecha_asignacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_liberacion` datetime DEFAULT NULL,
  `es_actual` tinyint(1) NOT NULL DEFAULT 1 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------




CREATE TABLE `especialidad` (
  `id_especialidad` int(11) NOT NULL, 
  `nombre` varchar(100) NOT NULL UNIQUE, 
  `descripcion` text DEFAULT NULL 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `especialidad` (`id_especialidad`, `nombre`, `descripcion`) VALUES
(1, 'Cardiología', 'Especialidad médica que se encarga del corazón'),
(2, 'Pediatría', 'Especialidad médica que atiende a niños'),
(3, 'Traumatología', 'Especialidad médica de huesos y músculos');

-- --------------------------------------------------------


CREATE TABLE `medicos` (
  `id_medico` int(11) NOT NULL, 
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) DEFAULT NULL, 
  `id_especialidad` int(11) NOT NULL, 
  `matricula` varchar(50) NOT NULL UNIQUE,
  `telefono` varchar(20) DEFAULT NULL, 
  `email` varchar(100) NOT NULL UNIQUE, 
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



INSERT INTO `medicos` (`id_medico`, `nombre`, `apellido`, `id_especialidad`, `matricula`, `telefono`, `email`, `activo`) VALUES
(1, 'Juan', 'Pérez', 1, 'MP12345', '3515551234', 'juan.perez@hospital.com', 1),
(2, 'María', 'Gómez', 2, 'MP54321', '3515554321', 'maria.gomez@hospital.com', 1),
(3, 'Carlos', 'López', 3, 'MP67890', '3515556789', 'carlos.lopez@hospital.com', 1);

-- --------------------------------------------------------



CREATE TABLE `evaluaciones` (
  `id_evaluacion` int(11) NOT NULL, 
  `id_admision` int(11) NOT NULL,
  `id_paciente` int(11) DEFAULT NULL, 
  `id_medico` int(11) NOT NULL, 
  `fecha_evaluacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, 
  `diagnostico` text DEFAULT NULL, 
  `observaciones_medicas` text DEFAULT NULL, 
  `signos_vitales` JSON DEFAULT NULL, 
  `plan_cuidados` text DEFAULT NULL, 
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------




CREATE TABLE `altas` (
  `id_alta` int(11) NOT NULL, 
  `id_admision` int(11) NOT NULL UNIQUE, 
  `id_medico` int(11) NOT NULL, 
  `fecha_alta_real` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, 
  `diagnostico_final` text NOT NULL, 
  `tratamiento_indicado` text NOT NULL, 
  `medicamentos_recetados` text NOT NULL, 
  `fecha_control_sugerido` date DEFAULT NULL, 
  `observaciones_alta` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------



CREATE TABLE `turnos` (
  `id_turno` int(11) NOT NULL, 
  `id_paciente` int(11) DEFAULT NULL,
  `id_medico` int(11) DEFAULT NULL, 
  `fecha_hora` datetime NOT NULL,
  `estado` enum('pendiente','confirmado','cancelado','finalizado') NOT NULL 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------


CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL, 
  `nombre_usuario` varchar(100) NOT NULL, 
  `email` varchar(100) NOT NULL UNIQUE, 
  `password_hash` varchar(255) NOT NULL, 
  `rol` enum('admin','medico','enfermero','recepcion') NOT NULL, 
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



INSERT INTO `usuarios` (`id_usuario`, `nombre_usuario`, `email`, `password_hash`, `rol`) VALUES
(1, 'admin', 'admin@his.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqL3LmbrM3i6ZngBzRjKjF3tJQ1dK', 'admin'); -- Contraseña real debe ser hashed

-- --------------------------------------------------------



--
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
`
--
INSERT INTO `sequelizemeta` (`name`) VALUES
('20250530004355-fix-duplicate-nombre-column.js'),
('20250530010146-fix-column-names.js');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admisiones`
--
ALTER TABLE `admisiones`
  ADD PRIMARY KEY (`id_admision`),
  ADD KEY `id_paciente` (`id_paciente`);

--
-- Indices de la tabla `ala`
--
ALTER TABLE `ala`
  ADD PRIMARY KEY (`id_ala`),
  ADD UNIQUE KEY `nombre` (`nombre`); 

--
-- Indices de la tabla `altas`
--
ALTER TABLE `altas`
  ADD PRIMARY KEY (`id_alta`),
  ADD UNIQUE KEY `id_admision` (`id_admision`),
  ADD KEY `id_medico` (`id_medico`);

--
-- Indices de la tabla `asignacion_cama`
--
ALTER TABLE `asignacion_cama`
  ADD PRIMARY KEY (`id_asignacion_cama`),
  ADD KEY `id_cama` (`id_cama`),
  ADD KEY `id_admision` (`id_admision`);

--
-- Indices de la tabla `cama`
--
ALTER TABLE `cama`
  ADD PRIMARY KEY (`id_cama`),
  ADD KEY `id_habitacion` (`id_habitacion`);

--
-- Indices de la tabla `especialidad`
--
ALTER TABLE `especialidad`
  ADD PRIMARY KEY (`id_especialidad`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `evaluaciones`
--
ALTER TABLE `evaluaciones`
  ADD PRIMARY KEY (`id_evaluacion`),
  ADD KEY `id_paciente` (`id_paciente`),
  ADD KEY `id_medico` (`id_medico`),
  ADD KEY `id_admision` (`id_admision`);

--
-- Indices de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD PRIMARY KEY (`id_habitacion`),
  ADD KEY `id_ala` (`id_ala`);

--
-- Indices de la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD PRIMARY KEY (`id_medico`),
  ADD KEY `id_especialidad` (`id_especialidad`);

--
-- Indices de la tabla `obras_sociales`
--
ALTER TABLE `obras_sociales`
  ADD PRIMARY KEY (`id_obra_social`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id_paciente`);

--
-- Indices de la tabla `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`id_turno`),
  ADD KEY `id_medico` (`id_medico`),
  ADD KEY `id_paciente` (`id_paciente`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `admisiones`
--
ALTER TABLE `admisiones`
  MODIFY `id_admision` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ala`
--
ALTER TABLE `ala`
  MODIFY `id_ala` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `altas`
--
ALTER TABLE `altas`
  MODIFY `id_alta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `asignacion_cama`
--
ALTER TABLE `asignacion_cama`
  MODIFY `id_asignacion_cama` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cama`
--
ALTER TABLE `cama`
  MODIFY `id_cama` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `especialidad`
--
ALTER TABLE `especialidad`
  MODIFY `id_especialidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `evaluaciones`
--
ALTER TABLE `evaluaciones`
  MODIFY `id_evaluacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  MODIFY `id_habitacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `medicos`
--
ALTER TABLE `medicos`
  MODIFY `id_medico` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `obras_sociales`
--
ALTER TABLE `obras_sociales`
  MODIFY `id_obra_social` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id_paciente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id_turno` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2; -- Empieza en 1

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `admisiones`
--
ALTER TABLE `admisiones`
  ADD CONSTRAINT `fk_admision_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE SET NULL ON UPDATE CASCADE; -- Renombrado FK

--
-- Filtros para la tabla `altas`
--
ALTER TABLE `altas`
  ADD CONSTRAINT `fk_alta_admision` FOREIGN KEY (`id_admision`) REFERENCES `admisiones` (`id_admision`) ON DELETE CASCADE ON UPDATE CASCADE, -- Cascade para borrar alta si se borra admisión
  ADD CONSTRAINT `fk_alta_medico` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`);

--
-- Filtros para la tabla `asignacion_cama`
--
ALTER TABLE `asignacion_cama`
  ADD CONSTRAINT `fk_asignacion_cama_admision` FOREIGN KEY (`id_admision`) REFERENCES `admisiones` (`id_admision`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_asignacion_cama_cama` FOREIGN KEY (`id_cama`) REFERENCES `cama` (`id_cama`);

--
-- Filtros para la tabla `cama`
--
ALTER TABLE `cama`
  ADD CONSTRAINT `fk_cama_habitacion` FOREIGN KEY (`id_habitacion`) REFERENCES `habitaciones` (`id_habitacion`);

--
-- Filtros para la tabla `evaluaciones`
--
ALTER TABLE `evaluaciones`
  ADD CONSTRAINT `fk_evaluacion_admision` FOREIGN KEY (`id_admision`) REFERENCES `admisiones` (`id_admision`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_evaluacion_medico` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`),
  ADD CONSTRAINT `fk_evaluacion_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE SET NULL ON UPDATE CASCADE; -- Corregida FK, permite NULL al inicio

--
-- Filtros para la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD CONSTRAINT `fk_habitacion_ala` FOREIGN KEY (`id_ala`) REFERENCES `ala` (`id_ala`);

--
-- Filtros para la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD CONSTRAINT `fk_medico_especialidad` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidad` (`id_especialidad`);

--
-- Filtros para la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD CONSTRAINT `fk_paciente_obra_social` FOREIGN KEY (`id_obra_social`) REFERENCES `obras_sociales` (`id_obra_social`) ON DELETE SET NULL ON UPDATE CASCADE; -- Nueva FK

--
-- Filtros para la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD CONSTRAINT `fk_turno_medico` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`),
  ADD CONSTRAINT `fk_turno_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;