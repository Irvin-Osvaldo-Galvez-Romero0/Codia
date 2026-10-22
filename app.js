// Referencias principales a los elementos del DOM
const botonMenuMovil = document.getElementById('botonMenuMovil');
const menuNavegacion = document.getElementById('menuNavegacion');
const listaServicios = document.getElementById('listaServicios');
const formularioContacto = document.getElementById('formularioContacto');
const botonEnviar = document.getElementById('botonEnviar');
const alertaExitoFormulario = document.getElementById('alertaExitoFormulario');
const textoAlertaExito = document.getElementById('textoAlertaExito');
const etiquetaAnioActual = document.getElementById('anioActual');

// Campos de entrada del formulario de cotización
const campoNombre = document.getElementById('campoNombre');
const campoTelefono = document.getElementById('campoTelefono');
const campoCorreo = document.getElementById('campoCorreo');
const campoServicio = document.getElementById('campoServicio');
const campoMensaje = document.getElementById('campoMensaje');

// Abre o cierra el menú de navegación en pantallas móviles
function alternarMenuMovil() {
  const estaAbierto = menuNavegacion.classList.toggle('menuAbierto');
  botonMenuMovil.setAttribute('aria-expanded', String(estaAbierto));
  botonMenuMovil.setAttribute(
    'aria-label',
    estaAbierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
  );
}

// Cierra el menú móvil cuando se selecciona una sección o se hace clic fuera
function cerrarMenuMovil() {
  if (menuNavegacion.classList.contains('menuAbierto')) {
    menuNavegacion.classList.remove('menuAbierto');
    botonMenuMovil.setAttribute('aria-expanded', 'false');
    botonMenuMovil.setAttribute('aria-label', 'Abrir menú de navegación');
  }
}

// Gestiona el desplazamiento suave hacia las secciones internas de la página
function configurarDesplazamientoSuave() {
  const enlacesInternos = document.querySelectorAll('a[href^="#"]');

  enlacesInternos.forEach((enlaceInterno) => {
    enlaceInterno.addEventListener('click', (eventoClick) => {
      const destinoId = enlaceInterno.getAttribute('href');
      if (!destinoId || destinoId === '#') return;

      const seccionDestino = document.querySelector(destinoId);
      if (!seccionDestino) return;

      eventoClick.preventDefault();
      cerrarMenuMovil();

      seccionDestino.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  });
}

// Preselecciona el servicio en el formulario cuando el usuario elige cotizar desde una tarjeta
function configurarSeleccionDesdeTarjetas() {
  if (!listaServicios) return;

  listaServicios.addEventListener('click', (eventoClick) => {
    const botonTarjeta = eventoClick.target.closest('.enlaceCotizarServicio');
    if (!botonTarjeta) return;

    const nombreServicio = botonTarjeta.getAttribute('data-servicio');
    if (nombreServicio && campoServicio) {
      campoServicio.value = nombreServicio;
    }

    const seccionContacto = document.getElementById('contacto');
    if (seccionContacto) {
      seccionContacto.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setTimeout(() => {
      if (campoNombre) campoNombre.focus();
    }, 450);
  });
}

// Muestra un mensaje de error debajo del campo indicado
function mostrarErrorCampo(campoEntrada, idElementoError, textoError) {
  const elementoError = document.getElementById(idElementoError);
  campoEntrada.classList.add('campoConError');

  if (elementoError) {
    elementoError.textContent = textoError;
    elementoError.classList.add('errorVisible');
  }
}

// Limpia los estados de error previos en el formulario antes de volver a validar
function limpiarErroresFormulario() {
  const camposConError = formularioContacto.querySelectorAll('.campoConError');
  const mensajesError = formularioContacto.querySelectorAll('.mensajeErrorCampo');

  camposConError.forEach((campoItem) => campoItem.classList.remove('campoConError'));
  mensajesError.forEach((mensajeItem) => {
    mensajeItem.textContent = '';
    mensajeItem.classList.remove('errorVisible');
  });
}

// Valida el formato y contenido de todos los campos obligatorios del formulario
function validarCamposCotizacion() {
  limpiarErroresFormulario();
  let formularioEsValido = true;

  const valorNombre = campoNombre.value.trim();
  const valorTelefono = campoTelefono.value.trim();
  const valorCorreo = campoCorreo.value.trim();
  const valorServicio = campoServicio.value.trim();
  const valorMensaje = campoMensaje.value.trim();

  const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const patronTelefono = /^[0-9+\s()-]{8,18}$/;

  if (valorNombre.length < 3) {
    mostrarErrorCampo(campoNombre, 'errorNombre', 'Por favor ingresa tu nombre completo.');
    formularioEsValido = false;
  }

  if (!patronTelefono.test(valorTelefono)) {
    mostrarErrorCampo(campoTelefono, 'errorTelefono', 'Ingresa un número de teléfono o WhatsApp válido (mínimo 8 dígitos).');
    formularioEsValido = false;
  }

  if (!patronCorreo.test(valorCorreo)) {
    mostrarErrorCampo(campoCorreo, 'errorCorreo', 'Ingresa una dirección de correo electrónico válida.');
    formularioEsValido = false;
  }

  if (!valorServicio) {
    mostrarErrorCampo(campoServicio, 'errorServicio', 'Selecciona el tipo de servicio que necesitas.');
    formularioEsValido = false;
  }

  if (valorMensaje.length < 10) {
    mostrarErrorCampo(campoMensaje, 'errorMensaje', 'Cuéntanos un poco más sobre lo que necesitas (mínimo 10 caracteres).');
    formularioEsValido = false;
  }

  return formularioEsValido;
}

// Procesa el envío del formulario de contacto y muestra la confirmación al usuario
function manejarEnvioCotizacion(eventoEnvio) {
  eventoEnvio.preventDefault();
  alertaExitoFormulario.hidden = true;

  if (!validarCamposCotizacion()) {
    const primerCampoConError = formularioContacto.querySelector('.campoConError');
    if (primerCampoConError) primerCampoConError.focus();
    return;
  }

  const nombreUsuario = campoNombre.value.trim();
  const servicioElegido = campoServicio.value;

  botonEnviar.disabled = true;
  botonEnviar.textContent = 'Enviando solicitud...';

  setTimeout(() => {
    textoAlertaExito.textContent = `Gracias, ${nombreUsuario}. Hemos registrado tu solicitud para "${servicioElegido}". Nos comunicaremos contigo muy pronto por WhatsApp o correo electrónico.`;
    alertaExitoFormulario.hidden = false;

    formularioContacto.reset();
    botonEnviar.disabled = false;
    botonEnviar.textContent = 'Enviar solicitud de cotización';
  }, 400);
}

// Actualiza el año del copyright automáticamente en el pie de página
function actualizarAnioPiePagina() {
  if (etiquetaAnioActual) {
    etiquetaAnioActual.textContent = String(new Date().getFullYear());
  }
}

// Inicialización de eventos al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
  if (botonMenuMovil) {
    botonMenuMovil.addEventListener('click', alternarMenuMovil);
  }

  document.addEventListener('click', (eventoDocumento) => {
    const clicDentroDeMenu = menuNavegacion && menuNavegacion.contains(eventoDocumento.target);
    const clicEnBotonMenu = botonMenuMovil && botonMenuMovil.contains(eventoDocumento.target);

    if (!clicDentroDeMenu && !clicEnBotonMenu) {
      cerrarMenuMovil();
    }
  });

  if (formularioContacto) {
    formularioContacto.addEventListener('submit', manejarEnvioCotizacion);
  }

  configurarDesplazamientoSuave();
  configurarSeleccionDesdeTarjetas();
  actualizarAnioPiePagina();
});
