/**
 * Romsan R&S Consulting - Interactividad, Pestañas de Demostración, Acordeón FAQ y Cotizador
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Elementos principales de la interfaz
  const botonMenuMovil = document.getElementById('botonMenuMovil');
  const menuNavegacion = document.getElementById('menuNavegacion');
  const pestanasPanel = document.querySelectorAll('.pestanaPanel');
  const contenidosPestanas = document.querySelectorAll('.contenidoPestana');
  const listaServicios = document.getElementById('listaServicios');
  const itemsAcordeon = document.querySelectorAll('.itemAcordeon');
  const formularioContacto = document.getElementById('formularioContacto');
  const botonEnviar = document.getElementById('botonEnviar');
  const alertaExitoFormulario = document.getElementById('alertaExitoFormulario');
  const textoAlertaExito = document.getElementById('textoAlertaExito');
  const campoNombre = document.getElementById('campoNombre');
  const campoTelefono = document.getElementById('campoTelefono');
  const campoCorreo = document.getElementById('campoCorreo');
  const campoServicio = document.getElementById('campoServicio');
  const campoMensaje = document.getElementById('campoMensaje');
  const etiquetaAnioActual = document.getElementById('anioActual');

  // Actualiza año actual en el copyright
  if (etiquetaAnioActual) {
    etiquetaAnioActual.textContent = String(new Date().getFullYear());
  }

  // ---------------------------------------------------------------------------
  // 2. Control del Menú Móvil
  // ---------------------------------------------------------------------------
  function alternarMenuMovil() {
    if (!menuNavegacion || !botonMenuMovil) return;
    const estaAbierto = menuNavegacion.classList.toggle('menuAbierto');
    botonMenuMovil.setAttribute('aria-expanded', String(estaAbierto));
    botonMenuMovil.setAttribute(
      'aria-label',
      estaAbierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
    );
  }

  function cerrarMenuMovil() {
    if (menuNavegacion && menuNavegacion.classList.contains('menuAbierto')) {
      menuNavegacion.classList.remove('menuAbierto');
      if (botonMenuMovil) {
        botonMenuMovil.setAttribute('aria-expanded', 'false');
        botonMenuMovil.setAttribute('aria-label', 'Abrir menú de navegación');
      }
    }
  }

  if (botonMenuMovil) {
    botonMenuMovil.addEventListener('click', alternarMenuMovil);
  }

  // Cerrar al hacer clic fuera
  document.addEventListener('click', (evento) => {
    const dentroDelMenu = menuNavegacion && menuNavegacion.contains(evento.target);
    const dentroDelBoton = botonMenuMovil && botonMenuMovil.contains(evento.target);
    if (!dentroDelMenu && !dentroDelBoton) {
      cerrarMenuMovil();
    }
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') {
      cerrarMenuMovil();
    }
  });

  // ---------------------------------------------------------------------------
  // 3. Desplazamiento Suave en Enlaces Internos
  // ---------------------------------------------------------------------------
  const enlacesInternos = document.querySelectorAll('a[href^="#"]');
  enlacesInternos.forEach((enlace) => {
    enlace.addEventListener('click', (evento) => {
      const destinoId = enlace.getAttribute('href');
      if (!destinoId || destinoId === '#') return;

      const elementoDestino = document.querySelector(destinoId);
      if (elementoDestino) {
        evento.preventDefault();
        cerrarMenuMovil();
        elementoDestino.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ---------------------------------------------------------------------------
  // 4. Pestañas Interactivas de Demostración en el Hero (POS, Dashboard, IA)
  // ---------------------------------------------------------------------------
  pestanasPanel.forEach((pestana) => {
    pestana.addEventListener('click', () => {
      const tabTarget = pestana.getAttribute('data-tab');

      // Actualizar estado de las pestañas
      pestanasPanel.forEach((p) => {
        p.classList.remove('activa');
        p.setAttribute('aria-selected', 'false');
      });
      pestana.classList.add('activa');
      pestana.setAttribute('aria-selected', 'true');

      // Mostrar el contenido correspondiente
      contenidosPestanas.forEach((contenido) => {
        if (contenido.id === `vista-${tabTarget}`) {
          contenido.classList.add('visible');
          contenido.removeAttribute('hidden');
        } else {
          contenido.classList.remove('visible');
          contenido.setAttribute('hidden', 'true');
        }
      });
    });
  });

  // ---------------------------------------------------------------------------
  // 5. Acordeón Interactivo de Preguntas Frecuentes (FAQ)
  // ---------------------------------------------------------------------------
  itemsAcordeon.forEach((item) => {
    const boton = item.querySelector('.botonPregunta');
    if (!boton) return;

    boton.addEventListener('click', () => {
      const estaAbierto = item.classList.contains('abierto');

      // Cerrar otros acordeones si se desea comportamiento único
      itemsAcordeon.forEach((otroItem) => {
        otroItem.classList.remove('abierto');
        const otroBoton = otroItem.querySelector('.botonPregunta');
        if (otroBoton) otroBoton.setAttribute('aria-expanded', 'false');
      });

      if (!estaAbierto) {
        item.classList.add('abierto');
        boton.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---------------------------------------------------------------------------
  // 6. Selección Rápida de Solución desde las Tarjetas de Servicio
  // ---------------------------------------------------------------------------
  if (listaServicios) {
    listaServicios.addEventListener('click', (evento) => {
      const botonCotizar = evento.target.closest('.enlaceCotizarServicio');
      if (!botonCotizar) return;

      const servicioElegido = botonCotizar.getAttribute('data-servicio');
      if (servicioElegido && campoServicio) {
        // Encontrar la opción que coincida o empiece por el nombre
        for (let i = 0; i < campoServicio.options.length; i++) {
          const opcion = campoServicio.options[i];
          if (opcion.value === servicioElegido || opcion.value.includes(servicioElegido)) {
            campoServicio.selectedIndex = i;
            break;
          }
        }
      }

      // Scroll suave hacia el formulario de contacto
      const seccionContacto = document.getElementById('contacto');
      if (seccionContacto) {
        seccionContacto.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      setTimeout(() => {
        if (campoNombre) campoNombre.focus();
      }, 450);
    });
  }

  // ---------------------------------------------------------------------------
  // 7. Validación y Envío del Formulario de Cotización
  // ---------------------------------------------------------------------------
  function mostrarError(campo, idError, mensaje) {
    const elementoError = document.getElementById(idError);
    if (campo) campo.classList.add('campoConError');
    if (elementoError) {
      elementoError.textContent = mensaje;
      elementoError.classList.add('errorVisible');
    }
  }

  function limpiarErrores() {
    if (!formularioContacto) return;
    const camposError = formularioContacto.querySelectorAll('.campoConError');
    const textosError = formularioContacto.querySelectorAll('.mensajeErrorCampo');

    camposError.forEach((c) => c.classList.remove('campoConError'));
    textosError.forEach((t) => {
      t.textContent = '';
      t.classList.remove('errorVisible');
    });
  }

  function validarFormulario() {
    limpiarErrores();
    let esValido = true;

    const valNombre = campoNombre.value.trim();
    const valTelefono = campoTelefono.value.trim();
    const valCorreo = campoCorreo.value.trim();
    const valServicio = campoServicio.value.trim();
    const valMensaje = campoMensaje.value.trim();

    const regexTelefono = /^[0-9+\s()-]{8,18}$/;
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (valNombre.length < 2) {
      mostrarError(campoNombre, 'errorNombre', 'Por favor indícanos tu nombre o el de tu negocio.');
      esValido = false;
    }

    if (!regexTelefono.test(valTelefono)) {
      mostrarError(campoTelefono, 'errorTelefono', 'Ingresa un número de teléfono o WhatsApp válido (mínimo 8 dígitos).');
      esValido = false;
    }

    if (!regexCorreo.test(valCorreo)) {
      mostrarError(campoCorreo, 'errorCorreo', 'Ingresa un correo electrónico válido para enviarte la propuesta.');
      esValido = false;
    }

    if (!valServicio) {
      mostrarError(campoServicio, 'errorServicio', 'Selecciona qué solución o servicio te interesa.');
      esValido = false;
    }

    if (valMensaje.length < 6) {
      mostrarError(campoMensaje, 'errorMensaje', 'Cuéntanos brevemente qué te gustaría que haga tu sistema.');
      esValido = false;
    }

    return esValido;
  }

  if (formularioContacto) {
    formularioContacto.addEventListener('submit', (evento) => {
      evento.preventDefault();
      if (alertaExitoFormulario) alertaExitoFormulario.hidden = true;

      if (!validarFormulario()) {
        const primerError = formularioContacto.querySelector('.campoConError');
        if (primerError) primerError.focus();
        return;
      }

      const nombre = campoNombre.value.trim();
      const servicio = campoServicio.value;

      if (botonEnviar) {
        botonEnviar.disabled = true;
        botonEnviar.innerHTML = '<span>Procesando solicitud...</span>';
      }

      // Simulación de envío exitoso y preparación de mensaje para WhatsApp opcional
      setTimeout(() => {
        if (textoAlertaExito) {
          textoAlertaExito.innerHTML = `¡Muchas gracias, <strong>${nombre}</strong>! Registramos tu interés en <strong>"${servicio}"</strong>. Nos comunicaremos contigo en breve por WhatsApp o llamada para darte una propuesta personalizada y sin compromiso.`;
        }

        if (alertaExitoFormulario) {
          alertaExitoFormulario.hidden = false;
          alertaExitoFormulario.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        formularioContacto.reset();

        if (botonEnviar) {
          botonEnviar.disabled = false;
          botonEnviar.innerHTML = `
            <span>Enviar mi Solicitud</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          `;
        }
      }, 500);
    });
  }

  // ---------------------------------------------------------------------------
  // 7. Filtros Interactivos de Soluciones por Categoría
  // ---------------------------------------------------------------------------
  const filtrosPills = document.querySelectorAll('.filtroPill');
  const tarjetasServicios = document.querySelectorAll('.tarjetaServicio');

  if (filtrosPills.length > 0 && tarjetasServicios.length > 0) {
    filtrosPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const categoria = pill.getAttribute('data-filtro');

        filtrosPills.forEach((p) => p.classList.remove('activo'));
        pill.classList.add('activo');

        tarjetasServicios.forEach((tarjeta) => {
          const catTarjeta = tarjeta.getAttribute('data-categoria');
          if (categoria === 'todos' || catTarjeta === categoria) {
            tarjeta.classList.remove('ocultaPorFiltro');
            tarjeta.style.animation = 'sutilEntrada 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
          } else {
            tarjeta.classList.add('ocultaPorFiltro');
          }
        });
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 8. Barra de Progreso de Lectura Scroll Superior
  // ---------------------------------------------------------------------------
  const barraProgresoLectura = document.getElementById('barraProgresoLectura');
  if (barraProgresoLectura) {
    window.addEventListener('scroll', () => {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollTotal > 0) {
        const porcentaje = (window.scrollY / scrollTotal) * 100;
        barraProgresoLectura.style.width = `${Math.min(100, Math.max(0, porcentaje))}%`;
      }
    }, { passive: true });
  }
});

