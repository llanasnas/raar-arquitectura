// Copy de la web en español. Estructura preparada para ca/en más adelante.
// Regla: nada inventado. Cifras, nombres y testimonios solo cuando RAAR los confirme.

export const copy = {
  nav: {
    cta: "Primera visita",
    ctaLong: "Pide tu primera visita gratuita",
    menu: "Menú",
    close: "Cerrar",
  },

  hero: {
    h1: "Casas en Barcelona pensadas para durar.",
    h1Lines: ["Casas en Barcelona", "pensadas para durar."],
    sub: "Reforma integral y obra nueva. Tres arquitectos, un proyecto a la vez.",
    ctaPrimary: "Pide tu primera visita gratuita",
    ctaSecondary: "Ver proyectos",
    scrollHint: "Desliza para entrar",
    // Las cuatro palabras con las que el estudio quiere que se le lea, dentro de una frase y
    // no sueltas. Cada palabra marcada (`key`) cambia la imagen de la portada al pasar por
    // encima: ver components/site/CoverBody.tsx.
    statement: [
      { t: "Arquitectura", key: true },
      { t: " y " },
      { t: "diseño", key: true },
      { t: " que buscan la " },
      { t: "atemporalidad", key: true },
      { t: " sin salirse del " },
      { t: "contexto", key: true },
      { t: "." },
    ],
    skip: "Saltar el recorrido",
    // Beats sobre el vídeo, en orden de scroll. Máximo dos líneas cada uno.
    beats: [
      { code: "IM_10 · Sarrià, Barcelona", text: "Una casa de tres plantas que daba la espalda a su jardín." },
      { code: "Planta baja · +0.00", text: "Ampliamos la planta baja hacia el jardín. Ahora la luz entra, y el salón se abre." },
      { code: "Cocina · comedor · salón", text: "Un solo espacio continuo. Cocinar, comer y estar sin paredes en medio." },
      { code: "Dormitorio principal", text: "Madera, piedra y luz. Materiales que respetan el origen de la casa." },
      { code: "", text: "¿Y tu casa? Primera visita gratuita, sin compromiso. Barcelona y alrededores." },
    ],
    projectLink: "Ver el proyecto IM10",
    videoNote: "",
  },

  context: {
    line: "Estudio de arquitectura en Barcelona. Proyectos en",
  },

  featured: {
    title: "Tres maneras de empezar una casa.",
    lead: "Reformas entre medianeras, casas nuevas en el Vallès y el Gironès, naves convertidas en vivienda. Todas empezaron con una visita.",
    all: "Ver los 12 proyectos",
  },

  services: {
    title: "Lo que hacemos",
    items: [
      {
        id: "reforma-integral",
        title: "Reforma integral",
        who: "Para quien quiere conservar lo bueno de su casa y arreglar el resto.",
        text: "Pisos y casas con carácter: bóveda catalana, patios, medianeras, techos altos. Reorganizamos, abrimos y damos luz sin borrar lo que hace única la vivienda.",
        examples: ["pe17", "vi02", "im10"],
      },
      {
        id: "obra-nueva",
        title: "Obra nueva",
        who: "Para quien tiene un terreno y quiere una casa que envejezca bien.",
        text: "Casas unifamiliares en el Vallès y Girona, adaptadas a la topografía, la orientación y la luz. Materiales nobles y gestos sencillos que no pasan de moda.",
        examples: ["ar07", "gg01"],
      },
      {
        id: "rehabilitacion",
        title: "Rehabilitación de naves y talleres",
        who: "Para quien tiene un espacio raro y quiere vivir o trabajar en él.",
        text: "Naves industriales, antiguos talleres y edificios centenarios convertidos en vivienda, coliving o espacios híbridos, manteniendo su estructura y su memoria.",
        examples: ["mo07", "to39", "co38"],
      },
    ],
    more: "Cómo lo hacemos",
  },

  process: {
    title: "Cómo trabajamos",
    lead: "Cuatro pasos. El primero es gratis y no te compromete a nada.",
    steps: [
      {
        n: "01",
        title: "Primera visita",
        text: "Vamos a tu casa o al solar. Escuchamos, medimos y te decimos con sinceridad qué se puede hacer.",
        free: true,
      },
      {
        n: "02",
        title: "Estudio previo",
        text: "Opciones dibujadas, presupuesto orientativo y un calendario realista antes de decidir nada.",
      },
      {
        n: "03",
        title: "Proyecto",
        text: "Proyecto básico y de ejecución, licencias, materiales y detalles. Todo lo necesario para construir bien.",
      },
      {
        n: "04",
        title: "Obra",
        text: "Dirección de obra y control de costes hasta la entrega. Estamos en la obra, no solo en el despacho.",
      },
    ],
    cta: "Empieza por la visita",
    note: "Las fases y su alcance se confirman en la primera visita según el tipo de proyecto.",
  },

  testimonials: {
    title: "Lo que dicen quienes ya viven en una casa de RAAR",
    // Vacío hasta que RAAR aporte testimonios reales (nombre, municipio, proyecto, permiso).
    items: [] as { quote: string; name: string; place: string; project?: string }[],
  },

  studio: {
    title: "Tres miradas, un estudio",
    text: [
      "RAAR nace del encuentro de tres arquitectos formados en Barcelona, unidos por una intuición común: la arquitectura puede ser una fuerza transformadora, consciente y libre, que encuentra su expresión en lo atemporal.",
      "Creemos en una arquitectura de gestos sutiles, integrada en su entorno y construida con la nobleza de los materiales que da la naturaleza. Una arquitectura que no necesita ostentación para tener presencia.",
    ],
    cta: "Conoce al estudio",
    photoAlt: "Los tres socios de RAAR caminando juntos, vistos desde arriba",
  },

  faq: {
    title: "Preguntas antes de llamar",
    items: [
      {
        q: "¿Qué pasa en la primera visita?",
        a: "Vamos a tu casa o al solar, escuchamos qué necesitas, tomamos medidas y fotos, y te decimos con sinceridad qué se puede hacer y qué no. Es gratuita y no te compromete a nada.",
      },
      {
        q: "¿Cuánto cuesta un proyecto de arquitectura?",
        a: "Depende del tipo de intervención, la superficie y el alcance. Tras la primera visita te damos una propuesta de honorarios cerrada, con lo que incluye cada fase.",
      },
      {
        q: "¿Cuánto tarda una reforma integral? ¿Y una obra nueva?",
        a: "Los plazos dependen de licencias, alcance y constructora. En el estudio previo te damos un calendario realista por fases para que puedas planificar.",
      },
      {
        q: "¿Os encargáis de las licencias?",
        a: "Sí. Preparamos y tramitamos la documentación necesaria con el ayuntamiento y el colegio de arquitectos como parte del proyecto.",
      },
      {
        q: "¿Trabajáis fuera de Barcelona?",
        a: "Sí. Tenemos proyectos en Barcelona, el Vallès y el Gironès. Si tu casa está más lejos, cuéntanoslo y lo valoramos.",
      },
      {
        q: "Ya tengo constructor. ¿Puedo trabajar con vosotros?",
        a: "Sí. Podemos hacer el proyecto y la dirección de obra coordinándonos con tu constructora, o ayudarte a elegir una si aún no la tienes.",
      },
    ],
  },

  contactCta: {
    title: "Empecemos por una visita.",
    lead: "Gratuita y sin compromiso. Te decimos con sinceridad qué se puede hacer con tu casa.",
  },

  form: {
    name: "Nombre",
    email: "Email",
    phone: "Teléfono",
    place: "Municipio o barrio",
    type: "Tipo de proyecto",
    typeOptions: [
      { value: "reforma", label: "Reforma integral" },
      { value: "obra-nueva", label: "Obra nueva" },
      { value: "rehabilitacion", label: "Rehabilitación de nave o local" },
      { value: "no-se", label: "Todavía no lo sé" },
    ],
    message: "Cuéntanos un poco (opcional)",
    messagePlaceholder: "Qué casa es, qué te gustaría cambiar, cuándo querrías empezar…",
    consent: "He leído la política de privacidad y acepto que RAAR me contacte sobre mi proyecto.",
    submit: "Pedir mi primera visita",
    sending: "Enviando…",
    successTitle: "Recibido.",
    successText: "Te escribimos o llamamos en uno o dos días laborables para concretar la visita.",
    errorTitle: "No se ha podido enviar.",
    errorText: "Prueba de nuevo o escríbenos directamente a",
    required: "Obligatorio",
    invalidEmail: "Escribe un email válido",
    invalidPhone: "Escribe un teléfono válido",
    consentRequired: "Necesitamos tu consentimiento para contactarte",
    or: "O si lo prefieres",
  },

  whatsapp: {
    cta: "Escríbenos por WhatsApp",
    message: "Hola, me gustaría pedir una primera visita gratuita.",
  },

  footer: {
    tagline: "Estudio de arquitectura en Barcelona.",
    contact: "Contacto",
    follow: "Síguenos",
    legal: "Legal",
    rights: "Todos los derechos reservados.",
    langs: [
      { code: "es", label: "ES", active: true },
      { code: "ca", label: "CA", active: false },
      { code: "en", label: "EN", active: false },
    ],
  },

  projects: {
    title: "Proyectos",
    lead: "Doce proyectos entre Barcelona, el Vallès y el Gironès. Reformas, obra nueva y rehabilitaciones.",
    all: "Todos",
    processing: "En proceso",
    filterType: "Tipo",
    filterPlace: "Lugar",
    empty: "No hay proyectos con ese filtro.",
    prev: "Proyecto anterior",
    next: "Proyecto siguiente",
    back: "Todos los proyectos",
    sheet: "Ficha",
    location: "Lugar",
    typeLabel: "Tipo",
    typology: "Programa",
    surface: "Superficie",
    year: "Año",
    plans: "Planos",
    renders: "Imágenes",
    concept: "Diagrama de proyecto",
    conceptNote: "Del emplazamiento a la planta: cómo se ordena la casa.",
    inProcessTitle: "Proyecto en proceso",
    inProcessText: "Estamos en obra. Publicaremos la ficha cuando esté terminada.",
    ctaTitle: "¿Tienes una casa parecida?",
    ctaText: "Cuéntanos qué te gustaría hacer. La primera visita es gratuita.",
    langNote: "Texto original en inglés; traducción en curso.",
    lightbox: {
      open: "Ver a tamaño completo",
      close: "Cerrar",
      prev: "Imagen anterior",
      next: "Imagen siguiente",
      of: "de",
    },
  },
} as const;

export const servicesPage = {
  title: "Servicios",
  lead: "Hacemos casas: nuevas, reformadas o recuperadas de un espacio que no lo era. Siempre con el mismo método y la misma atención.",
  includes: "Qué incluye",
  examples: "Proyectos de ejemplo",
  scope: [
    "Estudio previo y anteproyecto",
    "Proyecto básico y de ejecución",
    "Licencias y tramitación",
    "Dirección de obra y control de costes",
    "Interiorismo y definición de materiales",
  ],
  scopeNote: "El alcance concreto se ajusta a cada encargo y se cierra por escrito tras la primera visita.",
} as const;

export const studioPage = {
  title: "El estudio",
  manifesto: [
    "RAAR nace del encuentro de tres miradas apasionadas, forjadas en Barcelona, unidas por una intuición común: la arquitectura puede ser una fuerza transformadora, consciente y libre, que encuentra su expresión en lo atemporal. Desde Barcelona, este proyecto explora la materia, la luz y el espacio con el objetivo de crear proyectos que respeten su entorno.",
    "Creemos firmemente en una arquitectura que se construye con gestos sutiles, con integración y con la nobleza de los materiales que nos da la naturaleza. Una arquitectura que no necesita ostentación para tener presencia, que se manifiesta en su esencia y no en el exceso. Cada proyecto es una oportunidad para repensar cómo vivimos, cómo nos movemos y cómo convivimos con lo que nos rodea.",
    "Entendemos la creación como un proceso en evolución constante, donde técnica e intuición se complementan. Trabajamos con un compromiso firme con una arquitectura más responsable, que responda a las necesidades reales de las personas y del entorno. Construir es un proceso largo y complejo que nos invita, cada vez, a repensar cómo nos relacionamos con los espacios.",
  ],
  teamTitle: "Quiénes somos",
  teamNote: "Tres arquitectos formados en Barcelona.", // nombres y credenciales pendientes de confirmación
  // Rótulos editoriales de los tres párrafos del manifiesto (propuesta B de la home): de qué
  // habla cada uno. No son datos, son títulos de columna; el cliente puede cambiarlos.
  themes: ["Origen", "Materia", "Proceso"],
  // La frase del manifiesto que se destaca en grande (propuesta C). Es del segundo párrafo.
  quote: "Una arquitectura que no necesita ostentación para tener presencia, que se manifiesta en su esencia y no en el exceso.",
  whereTitle: "Dónde estamos",
  howTitle: "Cómo trabajamos",
} as const;

export const legalCopy = {
  pending: "Este texto se completará con los datos registrales de RAAR arquitectura (razón social, NIF, colegiación) antes de la publicación.",
} as const;
