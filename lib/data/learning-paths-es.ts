// Spanish translations for learning paths content
// Used by getLearningPathLocale() in learning-paths.ts

export interface PathTranslations {
  title: string;
  tagline: string;
  description: string;
  authorBio: string;
}

export interface InsightTranslations {
  title: string;
  insight: string;
}

export interface LessonTranslations {
  title: string;
  content: string;
  insights?: InsightTranslations[];
}

export interface ModuleTranslations {
  title: string;
  lessons: Record<string, LessonTranslations>;
}

export interface LearningPathTranslations {
  path: PathTranslations;
  keyInsights: InsightTranslations[];
  modules: Record<string, ModuleTranslations>;
}

export const learningPathsES: Record<string, LearningPathTranslations> = {
  'fundraising-101': {
    path: {
      title: 'Fundraising 101',
      tagline: 'Del pitch deck al term sheet',
      description: 'Domina el arte de recaudar capital para startups. Aprende a crear un pitch convincente, identificar a los inversores correctos, ejecutar un proceso ajustado y negociar términos favorables — todo de la mano de fundadores que han recaudado más de $500M colectivamente.',
      authorBio: 'Ex-fundador convertido en inversor. Lideró rondas seed para más de 40 startups por un total de $120M+.',
    },
    keyInsights: [
      { title: 'Los inversores apuestan por historias', insight: 'Tu narrativa importa más que tus números en la primera reunión. Perfecciona tu historia de origen.' },
      { title: 'Apunta a los VC correctos', insight: 'No todo el dinero es buen dinero. Investiga qué fondos invierten en tu etapa, sector y geografía.' },
      { title: 'Ejecuta un proceso ajustado', insight: 'Agrupa reuniones en un lapso de 2 semanas. Crea FOMO con una fecha límite clara. Deja que los inversores compitan.' },
      { title: 'Conoce tus números al dedillo', insight: 'CAC, LTV, burn rate, runway — prepárate para responder cualquier pregunta de métricas sin dudar.' },
      { title: 'Las presentaciones cálidas ganan', insight: 'Los correos fríos tienen un 1% de respuesta. Las presentaciones de fundadores del portafolio obtienen 80%+ de respuesta.' },
    ],
    modules: {
      m1: {
        title: 'Construyendo tu Narrativa',
        lessons: {
          'intro-to-fundraising': {
            title: 'Introducción al Fundraising',
            content: `## Por qué importa el fundraising

Recaudar fondos no es solo obtener dinero — es encontrar socios que crean en tu visión.

### Puntos clave:
- Alinea tu ronda con tus hitos de negocio
- Comprende las diferentes etapas de financiamiento (Pre-seed, Seed, Serie A)
- Construye relaciones antes de necesitar dinero

> "El mejor momento para recaudar dinero es cuando no lo necesitas." — Todo fundador`,
            insights: [
              { title: 'El dinero sigue a los hitos', insight: 'Recauda cuando tengas impulso, no cuando estés desesperado. Alinea cada ronda con logros de negocio claros.' },
              { title: 'La etapa importa', insight: 'Pre-seed es sobre el equipo. Seed es sobre tracción inicial. Serie A es sobre economía unitaria escalable.' },
              { title: 'Construye relaciones temprano', insight: 'Empieza a hablar con inversores 6 meses antes de necesitar recaudar. Cafés ahora = term sheets después.' },
            ],
          },
          'crafting-your-story': {
            title: 'Creando tu Historia',
            content: `## El arte de contar historias

Los inversores escuchan cientos de pitches. Tu historia es lo que los hace inclinarse hacia adelante.

### Frameworks a usar:
1. **Problema → Solución → Por Qué Ahora**
2. **Founder-Market Fit**
3. **Visión vs. Tracción**`,
          },
          'building-the-deck': {
            title: 'Construyendo el Deck de 12 Slides',
            content: `## El framework de 12 slides

Una estructura probada usada por fundadores que recaudaron $40M+ en nuestra comunidad.

1. Título
2. Problema
3. Solución
4. ¿Por Qué Ahora?
5. Tamaño del Mercado
6. Producto
7. Tracción
8. Modelo de Negocio
9. Competencia
10. Equipo
11. Finanzas
12. La Pregunta`,
          },
          'pitch-practice': {
            title: 'Práctica de Pitch y Retroalimentación',
            content: `## La práctica hace al maestro

Grábate. Mírate. Itera.

### Errores comunes:
- Demasiado texto en las diapositivas
- Sin una petición clara
- Respuestas divagantes a las preguntas`,
          },
        },
      },
      m2: {
        title: 'Encontrando Inversores',
        lessons: {
          'investor-research': {
            title: 'Investigación y Segmentación de Inversores',
            content: `## Construye tu lista objetivo

No todo el dinero es buen dinero. Encuentra inversores que aporten valor.`,
          },
          'warm-intros': {
            title: 'Consiguiendo Presentaciones Cálidas',
            content: `## El poder de las presentaciones cálidas

Los correos fríos tienen un 1% de respuesta. Presentaciones cálidas: 80%.`,
          },
          'first-meeting': {
            title: 'Dominando la Primera Reunión',
            content: `## Las primeras impresiones importan

Llega preparado. Lidera con tracción. Termina con un siguiente paso claro.`,
          },
        },
      },
      m3: {
        title: 'Ejecutando el Proceso',
        lessons: {
          'data-room': {
            title: 'Configurando tu Data Room',
            content: `## Qué incluir en tu data room

Organiza todo lo que los inversores necesitan para hacer due diligence rápidamente.`,
          },
          'creating-fomo': {
            title: 'Creando FOMO y Gestionando Cronogramas',
            content: `## Construye urgencia

Agrupa tus reuniones. Crea una fecha límite. Deja que los inversores compitan.`,
          },
          'term-sheets': {
            title: 'Entendiendo los Term Sheets',
            content: `## Cada cláusula, explicada

Valoración, preferencia de liquidación, anti-dilución, puestos en el board — sabe lo que importa.`,
          },
        },
      },
    },
  },

  'growth-marketing': {
    path: {
      title: 'Growth Marketing',
      tagline: 'De presupuesto cero a $10K MRR',
      description: 'Aprende los playbooks de crecimiento exactos usados por más de 200 fundadores para conseguir sus primeros 1,000 usuarios. Cubre estrategias de marketing de contenido, SEO, redes sociales y adquisición pagada que funcionan con presupuesto bootstrap.',
      authorBio: 'Escaló 3 startups de 0 a más de 100K usuarios. Especialista en crecimiento orgánico y adquisición liderada por la comunidad.',
    },
    keyInsights: [
      { title: 'El crecimiento es sistemático', insight: 'El crecimiento sostenible viene del proceso, no de trucos. Construye ciclos de adquisición repetibles.' },
      { title: 'Encuentra tu Estrella Norte', insight: 'Identifica la métrica que mejor captura la entrega de valor central. Todo fluye de ella.' },
      { title: 'El contenido se acumula', insight: 'Un gran artículo de blog puede generar tráfico durante años. Construye un motor de contenido que escale.' },
      { title: 'SEO para bootstrappers', insight: 'No necesitas presupuesto para rankear. Apunta a palabras clave de cola larga que tus competidores ignoran.' },
      { title: 'La comunidad es tu foso', insight: 'Convierte a los primeros usuarios en evangelistas. El boca a boca supera a los anuncios pagados 10 a 1 en ROI.' },
    ],
    modules: {
      m1: {
        title: 'Fundamentos de Crecimiento',
        lessons: {
          'growth-mindset': {
            title: 'La Mentalidad de Crecimiento',
            content: `## El crecimiento es un sistema, no un truco

El crecimiento sostenible viene del proceso, no de tácticas aisladas.`,
          },
          'defining-metrics': {
            title: 'Definiendo tu Métrica Estrella Norte',
            content: `## Encuentra la métrica que importa

Para Airbnb son las noches reservadas. ¿Para ti?`,
          },
          'acquisition-channels': {
            title: 'Mapeando Canales de Adquisición',
            content: `## 19 canales de tracción

El framework de Brian Balfour para encontrar tu motor de crecimiento.`,
          },
        },
      },
      m2: {
        title: 'Contenido y SEO',
        lessons: {
          'content-strategy': {
            title: 'Construyendo un Motor de Contenido',
            content: `## Contenido que convierte

Escribe para tu cliente, optimiza para búsquedas.`,
          },
          'seo-basics': {
            title: 'SEO para Fundadores',
            content: `## Rankea sin presupuesto

SEO técnico, optimización on-page y link building para bootstrappers.`,
          },
        },
      },
      m3: {
        title: 'Social y Comunidad',
        lessons: {
          'social-media-engine': {
            title: 'El Motor de Redes Sociales',
            content: `## Construye en público

Cómo los fundadores usan Twitter, LinkedIn y TikTok para hacer crecer sus startups.`,
          },
          'community-led-growth': {
            title: 'Crecimiento Liderado por la Comunidad',
            content: `## Tus usuarios son tus mejores vendedores

Convierte clientes en evangelistas.`,
          },
        },
      },
    },
  },

  'product-led-growth': {
    path: {
      title: 'Product-Led Growth',
      tagline: 'Deja que tu producto venda por ti',
      description: 'Transiciona de un crecimiento liderado por ventas a uno liderado por el producto. Aprende a diseñar flujos de onboarding, modelos freemium y ciclos virales que conviertan tu producto en tu canal de adquisición #1.',
      authorBio: 'Construyó y vendió dos empresas PLG. Asesora a startups de YC en estrategia product-led.',
    },
    keyInsights: [
      { title: 'Tu producto ES tu equipo de ventas', insight: 'Cuando los usuarios pueden probar antes de comprar, la adopción se dispara. Diseña para descubrimiento autoservicio.' },
      { title: 'El momento "Aha" lo es todo', insight: 'Mapea el camino más corto desde el registro hasta el momento en que los usuarios experimentan tu valor central por primera vez.' },
      { title: 'El onboarding es tu embudo de conversión', insight: 'La revelación progresiva supera a los volcados de funcionalidades. Muestra solo lo que los usuarios necesitan en cada paso.' },
      { title: 'Viralidad por diseño', insight: 'Construye mecanismos de compartir directamente en la experiencia del producto — no añadidos como idea tardía.' },
      { title: 'Freemium que convierte', insight: 'Da suficiente valor gratis para crear hábito, luego cobra por funcionalidades power, equipo y enterprise.' },
    ],
    modules: {
      m1: {
        title: 'Fundamentos PLG',
        lessons: {
          'what-is-plg': {
            title: '¿Qué es Product-Led Growth?',
            content: `## El fin de la demo de ventas

Cuando tu producto se vende solo, todo cambia.`,
          },
          'plg-vs-slg': {
            title: 'PLG vs. Sales-Led: Cuándo Cambiar',
            content: `## No todas las empresas deberían ser PLG

Comprende cuándo el modelo product-led tiene sentido para tu negocio.`,
          },
          'plg-metrics': {
            title: 'Métricas PLG que Importan',
            content: `## TTV, PQL, NPS y más

Las métricas clave para una organización product-led.`,
          },
        },
      },
      m2: {
        title: 'Onboarding y Activación',
        lessons: {
          'aha-moment': {
            title: 'Encontrando tu Momento "Aha"',
            content: `## El momento en que los usuarios "lo entienden"

Mapea el camino más corto desde el registro hasta el valor.`,
          },
          'onboarding-flows': {
            title: 'Diseñando un Onboarding Increíble',
            content: `## Revelación progresiva

Muestra solo lo suficiente para llevar a los usuarios al momento aha.`,
          },
        },
      },
      m3: {
        title: 'Viralidad y Ciclos',
        lessons: {
          'viral-loops': {
            title: 'Ingeniería de Ciclos Virales',
            content: `## Construye el compartir dentro del producto

El mejor crecimiento viene desde adentro.`,
          },
          'freemium-models': {
            title: 'Freemium y Estrategia de Precios',
            content: `## Cuándo cobrar y cuánto

Encuentra el punto óptimo de precio que maximiza la conversión.`,
          },
        },
      },
    },
  },

  'leadership-foundations': {
    path: {
      title: 'Fundamentos de Liderazgo',
      tagline: 'Lidera tu startup con confianza',
      description: 'Transiciona de constructor a líder. Domina el arte de contratar, gestionar y escalar un equipo mientras mantienes la cultura y velocidad de tu startup.',
      authorBio: 'Escaló equipos de ingeniería en Google, Stripe y dos startups de YC. Autora de "The Founder\'s Guide to Leadership".',
    },
    keyInsights: [
      { title: 'La cultura es estrategia', insight: 'El equipo que construyes ES la empresa que construyes. Contrata por valores primero, habilidades después.' },
      { title: 'La comunicación lo escala todo', insight: 'Sobre-comunica por 10x. Tu equipo no puede leer tu mente, especialmente cuando creces más allá de 20 personas.' },
      { title: 'La retroalimentación es un regalo', insight: 'Construye una cultura de sinceridad radical. Los fundadores más exitosos dan y reciben feedback a diario.' },
      { title: 'Delega o muere', insight: 'Tu trabajo como CEO es volverte innecesario en cada puesto. Empodera a tu equipo para decidir sin ti.' },
      { title: 'Crece tú primero', insight: 'Tu startup solo puede crecer tan rápido como tú. Invierte en coaching, terapia y grupos de pares.' },
    ],
    modules: {
      m1: {
        title: 'La Transición de Fundador a Líder',
        lessons: {
          'from-builder-to-leader': {
            title: 'De Constructor a Líder',
            content: `## La transición más difícil en las startups
Pasar de hacerlo todo tú mismo a liderar a otros que lo hacen por ti es el momento decisivo para los fundadores.
### Cambios clave:
- De hacedor a multiplicador
- De producción individual a producción de equipo
- De tácticas a estrategia`,
          },
          'defining-your-culture': {
            title: 'Definiendo la Cultura de tu Startup',
            content: `## La cultura ocurre con o sin ti
Si no la moldeas intencionalmente, se moldea sola — y generalmente no como quisieras.
### Frameworks de cultura:
1. Define 3-5 valores centrales que sean realmente ejecutables
2. Crea rituales que refuercen esos valores
3. Contrata y despide basado en alineación cultural`,
          },
          'self-awareness': {
            title: 'Autoconocimiento de Liderazgo',
            content: `## Conócete para liderar a otros
Los mejores líderes son implacablemente autoconscientes. Conocen sus fortalezas, puntos ciegos y disparadores emocionales.`,
          },
        },
      },
      m2: {
        title: 'Contratación y Construcción de Equipo',
        lessons: {
          'hiring-your-first-10': {
            title: 'Contratando tus Primeros 10 Empleados',
            content: `## Tus primeras contrataciones definen tu empresa
Cada una de tus primeras 10 contrataciones aporta el 10% de tu cultura. Elegir mal hace que la recuperación sea costosa.`,
          },
          'interviewing-like-a-pro': {
            title: 'Entrevistando Como un Profesional',
            content: `## Las entrevistas estructuradas reducen el sesgo
Crea un proceso de entrevista consistente con scorecards claros. Enfócate en habilidad demostrada sobre pedigrí.`,
          },
          'compensation-and-equity': {
            title: 'Compensación y Equity',
            content: `## Paga justamente, incentiva inteligentemente
Comprende la compensación de mercado, los cronogramas de vesting de equity y cómo usar ambos para atraer y retener talento.`,
          },
        },
      },
      m3: {
        title: 'Gestionando y Escalando Equipos',
        lessons: {
          'one-on-ones': {
            title: 'Dominando el 1:1',
            content: `## Los 30 minutos más poderosos de tu semana
Un gran 1:1 no es una actualización de estatus. Es una sesión de coaching, un constructor de confianza y tu sistema de alerta temprana.`,
          },
          'performance-reviews': {
            title: 'Evaluaciones de Desempeño que Funcionan',
            content: `## Las evaluaciones no deberían ser una sorpresa
Construye una cultura de feedback continuo para que la evaluación anual sea solo un resumen de conversaciones que ya has tenido.`,
          },
          'scaling-beyond-50': {
            title: 'Escalando Más Allá de 50 Personas',
            content: `## Las reglas cambian en cada orden de magnitud
Lo que funciona en 10 se rompe en 50. Lo que funciona en 50 se rompe en 200. Aprende a evolucionar tu estilo de liderazgo.`,
          },
        },
      },
    },
  },
};
