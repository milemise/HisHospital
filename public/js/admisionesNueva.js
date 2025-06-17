document.addEventListener('DOMContentLoaded', function() {
  const pacienteSelector = document.getElementById('id_paciente_seleccionado');
  const emergenciaToggle = document.getElementById('es_emergencia');
  const newPatientFields = document.getElementById('newPacienteFields');
  
  const newPatientName = document.getElementById('nombre_paciente_nuevo');
  const newPatientApellido = document.getElementById('apellido_paciente_nuevo');
  const newPatientDNI = document.getElementById('dni_paciente_nuevo');
  const newPatientFechaNacimiento = document.getElementById('fecha_nacimiento_nuevo');
  const newPatientGenero = document.getElementById('genero_paciente_nuevo');

  const nombreContainer = document.getElementById('nombreNuevoContainer');
  const apellidoContainer = document.getElementById('apellidoNuevoContainer');
  const dniContainer = document.getElementById('dniNuevoContainer');
  const fechaNacimientoContainer = document.getElementById('fechaNacimientoNuevoContainer');
  const generoContainer = document.getElementById('generoNuevoContainer');
  const telefonoContainer = document.getElementById('telefonoNuevoContainer');
  const emailContainer = document.getElementById('emailNuevoContainer');
  const direccionContainer = document.getElementById('direccionNuevoContainer');
  const grupoSanguineoContainer = document.getElementById('grupoSanguineoNuevoContainer');
  const alergiasContainer = document.getElementById('alergiasNuevoContainer');
  const medicamentosContainer = document.getElementById('medicamentosNuevoContainer');
  const obraSocialContainer = document.getElementById('obraSocialNuevoContainer');
  const numeroAfiliadoContainer = document.getElementById('numeroAfiliadoNuevoContainer');
  
  function updateNewPatientFieldsVisibility() {
    const isNewOptionSelected = pacienteSelector.value === 'nuevo';
    const isEmergencyOn = emergenciaToggle.checked;

    // 1. Controla la visibilidad general del contenedor de campos del nuevo paciente
    if (isNewOptionSelected || isEmergencyOn) {
      newPatientFields.style.display = 'block';
    } else {
      newPatientFields.style.display = 'none';
    }

    // 2. Lógica para establecer/remover atributos 'required' y visibilidad de campos individuales
    if (isEmergencyOn) {
      // Si la emergencia está ACTIVA, aplicamos reglas de emergencia
      
      // Ocultar campos que no son obligatorios en emergencia
      nombreContainer.style.display = 'none';
      apellidoContainer.style.display = 'none';
      dniContainer.style.display = 'none';
      fechaNacimientoContainer.style.display = 'none';
      telefonoContainer.style.display = 'none';
      emailContainer.style.display = 'none';
      direccionContainer.style.display = 'none';
      grupoSanguineoContainer.style.display = 'none';
      alergiasContainer.style.display = 'none';
      medicamentosContainer.style.display = 'none';
      obraSocialContainer.style.display = 'none';
      numeroAfiliadoContainer.style.display = 'none';

      // Mostrar solo Género
      generoContainer.style.display = 'block'; 

      // Remover 'required' de los campos que son opcionales en emergencia
      newPatientName.removeAttribute('required');
      newPatientApellido.removeAttribute('required');
      newPatientDNI.removeAttribute('required');
      newPatientFechaNacimiento.removeAttribute('required');
      // Establecer 'required' para Género
      newPatientGenero.setAttribute('required', 'true'); 
      
      // Limpiar valores de campos opcionales para evitar enviar datos que no se corresponden
      newPatientName.value = '';
      newPatientApellido.value = '';
      newPatientDNI.value = '';
      newPatientFechaNacimiento.value = '';
      // No borrar newPatientGenero.value aquí, ya que el usuario puede seleccionarlo

    } else if (isNewOptionSelected) { 
      // Si NO es emergencia, pero se seleccionó "Registrar Nuevo Paciente" (estándar)
      
      // Mostrar todos los campos
      nombreContainer.style.display = 'block';
      apellidoContainer.style.display = 'block';
      dniContainer.style.display = 'block';
      fechaNacimientoContainer.style.display = 'block';
      generoContainer.style.display = 'block';
      telefonoContainer.style.display = 'block';
      emailContainer.style.display = 'block';
      direccionContainer.style.display = 'block';
      grupoSanguineoContainer.style.display = 'block';
      alergiasContainer.style.display = 'block';
      medicamentosContainer.style.display = 'block';
      obraSocialContainer.style.display = 'block';
      numeroAfiliadoContainer.style.display = 'block';

      // Todos los campos principales son OBLIGATORIOS para un paciente nuevo estándar
      newPatientName.setAttribute('required', 'true');
      newPatientApellido.setAttribute('required', 'true');
      newPatientDNI.setAttribute('required', 'true');
      newPatientGenero.setAttribute('required', 'true');
      newPatientFechaNacimiento.setAttribute('required', 'true'); 

    } else { 
      // Si no es ni "Nuevo Paciente" seleccionado ni "Emergencia" activa
      
      // Ocultar todos los campos y remover 'required'
      newPatientFields.style.display = 'none'; 
      nombreContainer.style.display = 'none';
      apellidoContainer.style.display = 'none';
      dniContainer.style.display = 'none';
      fechaNacimientoContainer.style.display = 'none';
      generoContainer.style.display = 'none';
      telefonoContainer.style.display = 'none';
      emailContainer.style.display = 'none';
      direccionContainer.style.display = 'none';
      grupoSanguineoContainer.style.display = 'none';
      alergiasContainer.style.display = 'none';
      medicamentosContainer.style.display = 'none';
      obraSocialContainer.style.display = 'none';
      numeroAfiliadoContainer.style.display = 'none';

      newPatientName.removeAttribute('required');
      newPatientApellido.removeAttribute('required');
      newPatientDNI.removeAttribute('required');
      newPatientGenero.removeAttribute('required');
      newPatientFechaNacimiento.removeAttribute('required');
    }
  }

  // Añadir listeners para detectar cambios y actualizar la visibilidad
  pacienteSelector.addEventListener('change', updateNewPatientFieldsVisibility);
  emergenciaToggle.addEventListener('change', updateNewPatientFieldsVisibility);

  // Llamada inicial para establecer el estado correcto de los campos al cargar la página
  updateNewPatientFieldsVisibility();

  // Ajuste para pre-seleccionar paciente si viene un ID en la URL
  const urlParams = new URLSearchParams(window.location.search);
  const pacienteIdFromUrl = urlParams.get('id_paciente');
  if (pacienteIdFromUrl) {
      pacienteSelector.value = pacienteIdFromUrl;
      pacienteSelector.dispatchEvent(new Event('change'));
  }
});