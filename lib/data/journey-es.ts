// Spanish translations for Journey content (levels, tasks, hints)
// Used by getLocalizedJourneyLevels() in journey.ts

export const journeyLevelsEs: Record<number, { title: string; subtitle: string; description: string; badgeName: string }> = {
  1: {
    title: 'Define tu Misión',
    subtitle: 'Nivel 1',
    description: 'Todo gran negocio comienza con una misión clara. Define la tuya y sienta las bases de todo lo que viene.',
    badgeName: 'Misionero',
  },
  2: {
    title: 'Valida tu Idea',
    subtitle: 'Nivel 2',
    description: 'Antes de invertir tiempo y dinero, valida que personas reales quieren lo que estás construyendo.',
    badgeName: 'Validador',
  },
  3: {
    title: 'Construye tu Marca',
    subtitle: 'Nivel 3',
    description: 'Crea la identidad visual y verbal que hará que tu negocio destaque y sea recordado.',
    badgeName: 'Constructor de Marca',
  },
  4: {
    title: 'Bases Legales y de Negocio',
    subtitle: 'Nivel 4',
    description: 'Establece correctamente la base legal y estructural. Esto te protege a ti y a tu negocio desde el primer día.',
    badgeName: 'Legalmente Legítimo',
  },
  5: {
    title: 'Construye tu MVP',
    subtitle: 'Nivel 5',
    description: 'Es hora de construir el producto mínimo viable. Lanza rápido, aprende más rápido. Hecho es mejor que perfecto.',
    badgeName: 'Constructor',
  },
  6: {
    title: 'Marketing y Crecimiento',
    subtitle: 'Nivel 6',
    description: 'Construye el motor que trae clientes a tu producto. El marketing comienza antes del lanzamiento.',
    badgeName: 'Growth Hacker',
  },
  7: {
    title: 'Ventas y Recaudación',
    subtitle: 'Nivel 7',
    description: 'Aprende a vender tu visión — a clientes e inversores. Las ventas son el alma de cualquier negocio.',
    badgeName: 'Cerrador',
  },
  8: {
    title: 'Escala tus Operaciones',
    subtitle: 'Nivel 8',
    description: 'Construye sistemas, contrata ayuda y crea procesos que permitan que tu negocio funcione sin ti.',
    badgeName: 'Operador',
  },
  9: {
    title: 'Product-Market Fit',
    subtitle: 'Nivel 9',
    description: 'Encuentra el punto ideal donde tu producto satisface una necesidad masiva del mercado. Aquí es donde las startups despegan.',
    badgeName: 'PMF Logrado',
  },
  10: {
    title: 'Lanza y Escala',
    subtitle: 'Nivel 10',
    description: 'Has validado, construido e iterado. Ahora es momento de lanzar públicamente y escalar tu crecimiento.',
    badgeName: 'Lanzado',
  },
};

export const journeyTasksEs: Record<string, { title: string; description: string; hint?: string }> = {
  // Level 1
  '1-1': {
    title: 'Escribe tu declaración de misión',
    description: 'En 1-2 oraciones, describe qué hace tu negocio, a quién sirve y por qué existe. Mantenlo claro e inspirador.',
    hint: 'Piensa: "[Empresa] ayuda a [audiencia objetivo] a lograr [meta] mediante [enfoque único]."',
  },
  '1-2': {
    title: 'Identifica tu audiencia objetivo',
    description: 'Define el grupo específico de personas que más se beneficiarán de tu producto o servicio.',
    hint: 'Sé específico — demografía, intereses, puntos de dolor. Evita "todos".',
  },
  '1-3': {
    title: 'Nombra tu negocio',
    description: 'Elige un nombre que refleje tu misión y sea memorable. Escríbelo y explica por qué lo elegiste.',
  },
  '1-4': {
    title: 'Crea un boceto simple de logo',
    description: 'Dibuja o diseña un concepto de logo simple para tu negocio. Sube una foto o captura de tu boceto.',
  },
  '1-5': {
    title: 'Comparte tu misión con una persona',
    description: 'Cuéntale a al menos una persona sobre tu idea de negocio y escribe su retroalimentación.',
    hint: '¿A quién se lo contaste? ¿Cuál fue su reacción? ¿Qué preguntas hicieron?',
  },
  // Level 2
  '2-1': {
    title: 'Identifica los 3 principales problemas del cliente',
    description: 'Enumera los 3 principales problemas que enfrentan tus clientes objetivo y que tu producto resuelve.',
    hint: 'Deben ser puntos de dolor específicos, no vagos como "necesitan X".',
  },
  '2-2': {
    title: 'Entrevista a 3 clientes potenciales',
    description: 'Habla con 3 personas reales de tu mercado objetivo. Sube notas o grabaciones de tus conversaciones.',
    hint: 'Haz preguntas abiertas. Escucha más de lo que hablas. Documenta sus palabras exactas.',
  },
  '2-3': {
    title: 'Analiza 3 competidores',
    description: 'Identifica 3 competidores (directos o indirectos). Escribe qué hacen bien y en qué fallan.',
  },
  '2-4': {
    title: 'Define tu propuesta de valor única',
    description: 'Basado en tu investigación, escribe una PVU clara: ¿Por qué los clientes deberían elegirte a ti sobre las alternativas?',
    hint: 'Tu PVU debe ser lo suficientemente específica para que un cliente pueda repetírsela a un amigo.',
  },
  '2-5': {
    title: 'Crea una maqueta de landing page',
    description: 'Diseña una maqueta simple de sitio web de una página que explique tu propuesta de valor. Sube una captura o boceto.',
  },
  // Level 3
  '3-1': {
    title: 'Elige los colores de tu marca',
    description: 'Selecciona 2-3 colores principales de marca. Sube una paleta de colores o códigos hexadecimales.',
    hint: 'Usa herramientas como Coolors.co para encontrar combinaciones de colores armoniosas.',
  },
  '3-2': {
    title: 'Elige las fuentes de tu marca',
    description: 'Elige una fuente para títulos y otra para el cuerpo. Escribe por qué estas fuentes coinciden con la personalidad de tu marca.',
  },
  '3-3': {
    title: 'Escribe la historia de tu marca',
    description: 'Crea una historia de origen convincente: ¿Por qué comenzaste este negocio? ¿Qué te motiva? (200-300 palabras)',
  },
  '3-4': {
    title: 'Diseña tu logo',
    description: 'Crea una versión final de tu logo. Sube el archivo de imagen (PNG, SVG o captura).',
  },
  '3-5': {
    title: 'Crea perfiles en redes sociales',
    description: 'Reserva el nombre de tu negocio en Instagram, Twitter/X, LinkedIn. Marca cada uno que hayas asegurado.',
  },
  // Level 4
  '4-1': {
    title: 'Elige tu estructura legal',
    description: 'Decide entre LLC, Empresario Individual, S-Corp o C-Corp. Escribe tu elección y por qué.',
    hint: 'LLC suele ser lo más simple para fundadores primerizos. Consulta a un abogado si no estás seguro.',
  },
  '4-2': {
    title: 'Registra el nombre de tu negocio',
    description: 'Verifica si el nombre de tu negocio está disponible y regístralo. Sube la confirmación o captura.',
  },
  '4-3': {
    title: 'Obtén un EIN (EE.UU.) o ID fiscal',
    description: 'Solicita un Número de Identificación de Empleador si estás en EE.UU., o el equivalente en tu país.',
  },
  '4-4': {
    title: 'Abre una cuenta bancaria de negocio',
    description: 'Separa las finanzas personales de las del negocio. Sube una captura de la confirmación de tu nueva cuenta.',
  },
  '4-5': {
    title: 'Redacta términos de servicio básicos',
    description: 'Escribe términos de servicio o condiciones de uso simples para tu sitio web/producto.',
    hint: 'Usa plantillas en línea como punto de partida, pero personalízalas para tu negocio.',
  },
  // Level 5
  '5-1': {
    title: 'Define las funcionalidades del MVP',
    description: 'Enumera las funcionalidades mínimas absolutas necesarias para el lanzamiento. Elimina todo lo demás. Sé implacable.',
    hint: 'Tu MVP debe resolver UN problema central realmente bien. Lánzalo en semanas, no meses.',
  },
  '5-2': {
    title: 'Crea wireframes',
    description: 'Dibuja o diseña wireframes de las pantallas clave de tu producto. Sube tus wireframes.',
  },
  '5-3': {
    title: 'Configura tu stack tecnológico',
    description: 'Decide tu stack tecnológico (no-code, desarrollo a medida, plataformas) y escribe tus elecciones.',
    hint: 'Considera: Webflow/Bubble para no-code, Next.js/Django para desarrollo a medida, Shopify para e-commerce.',
  },
  '5-4': {
    title: 'Construye un prototipo funcional',
    description: 'Crea un prototipo cliqueable o demo funcional. Sube un video de demostración o enlace.',
  },
  '5-5': {
    title: 'Prueba con 5 usuarios',
    description: 'Haz que 5 personas usen tu prototipo. Escribe sus comentarios y lo que vas a corregir.',
  },
  // Level 6
  '6-1': {
    title: 'Crea un plan de salida al mercado',
    description: 'Escribe un plan de 1 página describiendo cómo adquirirás tus primeros 100 clientes.',
    hint: 'Sé específico sobre canales (redes sociales, SEO, anuncios, alianzas) y cronograma.',
  },
  '6-2': {
    title: 'Configura perfiles en redes sociales',
    description: 'Crea y optimiza perfiles en 3 plataformas sociales relevantes para tu audiencia. Sube capturas.',
  },
  '6-3': {
    title: 'Escribe tu primer artículo o contenido',
    description: 'Crea una pieza de contenido valioso para tu audiencia objetivo. Pega el texto o súbelo.',
  },
  '6-4': {
    title: 'Crea una lista de espera por email',
    description: 'Configura una página simple de captura de correos. Sube una captura de tu formulario de registro.',
  },
  '6-5': {
    title: 'Crea un calendario de contenido de 30 días',
    description: 'Planifica 30 días de publicaciones en redes sociales, correos o contenido. Sube tu calendario.',
  },
  // Level 7
  '7-1': {
    title: 'Crea un esquema de pitch deck',
    description: 'Esquematiza un pitch deck de 10-12 diapositivas. Escribe el mensaje clave para cada diapositiva.',
    hint: 'Diapositivas: Problema, Solución, Mercado, Modelo de Negocio, Tracción, Equipo, Competencia, Finanzas, Solicitud.',
  },
  '7-2': {
    title: 'Construye tu modelo financiero',
    description: 'Crea una proyección básica de ingresos y costos para 12 meses. Sube tu hoja de cálculo.',
  },
  '7-3': {
    title: 'Practica tu elevator pitch',
    description: 'Graba un video de pitch de 60 segundos o escribe tu guion de pitch exacto.',
  },
  '7-4': {
    title: 'Haz tu primera venta',
    description: 'Vende tu producto a un cliente que pague. Escribe sobre la experiencia — qué funcionó, qué no.',
    hint: 'Incluso $1 cuenta. El objetivo es validación, no ingresos (todavía).',
  },
  '7-5': {
    title: 'Enumera 10 inversores o subvenciones potenciales',
    description: 'Investiga y enumera 10 inversores, aceleradoras o subvenciones relevantes para tu etapa.',
  },
  // Level 8
  '8-1': {
    title: 'Documenta tus procesos principales',
    description: 'Escribe el proceso paso a paso de tus 3 tareas repetibles más importantes.',
    hint: 'Si no puedes documentarlo, no puedes delegarlo. Sé detallado.',
  },
  '8-2': {
    title: 'Configura un sistema de atención al cliente',
    description: 'Elige una herramienta de soporte (email, chat, help desk) y configúrala. Sube una captura.',
  },
  '8-3': {
    title: 'Crea onboarding para nuevos clientes',
    description: 'Diseña un flujo de onboarding para clientes. Escribe el correo de bienvenida y la primera experiencia.',
  },
  '8-4': {
    title: 'Contrata a tu primer freelancer o asistente virtual',
    description: 'Delega una tarea recurrente a un freelancer o asistente virtual. Escribe qué delegaste y el resultado.',
    hint: 'Empieza pequeño — 5 horas/semana es suficiente para aprender a gestionar ayuda.',
  },
  '8-5': {
    title: 'Configura analíticas básicas',
    description: 'Instala analíticas (Google Analytics, Mixpanel o similar) y sube una captura del panel.',
  },
  // Level 9
  '9-1': {
    title: 'Mide tu tasa de retención',
    description: 'Calcula tu tasa de retención mensual de clientes. Escribe el número y cómo lo calculaste.',
    hint: 'Para SaaS: ¿qué % de clientes del mes pasado siguen activos? Objetivo: >80% para señal de PMF.',
  },
  '9-2': {
    title: 'Ejecuta una encuesta NPS',
    description: 'Encuesta a tus clientes con "¿Qué tan probable es que nos recomiendes?" Sube los resultados.',
  },
  '9-3': {
    title: 'Identifica a tus power users',
    description: 'Encuentra el 20% de usuarios que obtienen el 80% del valor. Escribe qué los hace diferentes.',
  },
  '9-4': {
    title: 'Ejecuta un experimento de precios',
    description: 'Prueba un precio o modelo de precios diferente. Documenta qué probaste y los resultados.',
  },
  '9-5': {
    title: 'Crea un sistema de solicitud de funcionalidades',
    description: 'Configura una forma para que los usuarios soliciten y voten funcionalidades. Sube una captura.',
  },
  // Level 10
  '10-1': {
    title: 'Planifica tu evento de lanzamiento',
    description: 'Escribe tu estrategia de lanzamiento: fecha, canales, audiencia objetivo, plan de PR y métricas de éxito.',
  },
  '10-2': {
    title: 'Construye un kit de prensa',
    description: 'Crea un kit de prensa con logos, capturas, biografías de fundadores y datos clave. Sube como PDF o enlace.',
  },
  '10-3': {
    title: 'Contacta a 10 periodistas o bloggers',
    description: 'Encuentra y contacta a 10 periodistas o bloggers relevantes. Escribe un correo de pitch de ejemplo.',
  },
  '10-4': {
    title: 'Lanza en Product Hunt o equivalente',
    description: 'Envía tu producto a Product Hunt, Hacker News o una plataforma de lanzamiento relevante.',
  },
  '10-5': {
    title: 'Escribe una retrospectiva post-lanzamiento',
    description: 'Después del lanzamiento, escribe una reflexión: ¿Qué salió bien? ¿Qué te sorprendió? ¿Qué harías diferente?',
    hint: 'Esto se convierte en un artefacto valioso para tu próximo emprendimiento — y gran contenido para tu audiencia.',
  },
};
