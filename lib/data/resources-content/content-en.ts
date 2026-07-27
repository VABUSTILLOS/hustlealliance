// Real resource content — English versions
// Each resource now has actual frameworks, templates, and actionable content

import type { ResourceContentType, TemplateField } from './types';

export const resourceContentEN: Partial<Record<string, ResourceContentType>> = {

  // ═══ r1: Mission Statement Canvas ═══
  r1: {
    kind: 'template',
    content: {
      description: 'A one-page framework to define your mission, vision, values, and unique value proposition. Fill in each section to create a coherent identity that guides every decision.',
      fields: [
        { label: 'Company Name', placeholder: 'Your startup name', type: 'text', required: true },
        { label: 'Mission Statement', placeholder: 'Why do we exist? What problem do we solve?', type: 'textarea', required: true },
        { label: 'Vision (5 years)', placeholder: 'What does the world look like if we succeed?', type: 'textarea', required: true },
        { label: 'Core Values (3-5)', placeholder: 'What principles guide our behavior?', type: 'textarea', required: true },
        { label: 'Target Customer', placeholder: 'Who are we building for?', type: 'text', required: true },
        { label: 'Unique Value Proposition', placeholder: 'Why choose us over alternatives?', type: 'textarea', required: true },
        { label: 'Industry', placeholder: 'e.g., SaaS, Marketplace, DTC', type: 'select', options: ['SaaS', 'Marketplace', 'DTC', 'Agency', 'Biotech', 'Climate', 'Fintech', 'EdTech', 'HealthTech', 'Other'] },
      ],
      sections: [
        {
          heading: 'The Mission Statement Formula',
          body: `A great mission statement has three components:\n\n1. **The Verb** — What action are you taking? (democratize, accelerate, protect, connect)\n2. **The Who** — Who benefits? (small businesses, creators, patients, developers)\n3. **The Outcome** — What changes? (access to capital, faster shipping, better health)\n\n**Example (Stripe):** "Increase the GDP of the internet" — Verb: Increase, Who: internet businesses, Outcome: economic growth.\n\n**Example (Tesla):** "Accelerate the world's transition to sustainable energy" — Verb: Accelerate, Who: the world, Outcome: sustainable energy adoption.`,
        },
        {
          heading: 'Vision Crafting Framework',
          body: `Your vision should be **specific enough to be meaningful** but **ambitious enough to inspire**.\n\n**The 5-Year Vision Test:**\nIf we execute perfectly for 5 years:\n- How many customers do we serve?\n- What is our annual revenue?\n- What industry standard have we redefined?\n- What does a customer say about us?\n\n**Avoid these vision traps:**\n- "Be the #1 [industry] company" (too vague, no emotional hook)\n- "Revolutionize [industry]" (overused, unspecific)\n- "Make the world a better place" (meaningless without specifics)`,
        },
        {
          heading: 'Values: From Words to Behavior',
          body: `Values are worthless unless they **exclude** behavior. If a value doesn't make some decisions harder, it's not a real value.\n\n**Value Stress Test:** For each value, ask:\n- Would we fire a top performer for violating this?\n- Would we turn down a lucrative deal that conflicts with this?\n- Does this value help us choose between two good options?\n\n**Examples of Strong Values:**\n- "Default to transparency" (means sharing bad news early)\n- "Ship to learn" (means shipping imperfectly over perfecting endlessly)\n- "Customer obsession > competitor obsession" (means ignoring competitors)`,
        },
        {
          heading: 'UVP: The Only Question That Matters',
          body: `Your Unique Value Proposition answers one question: **"Why should a customer choose you over doing nothing?"**\n\nNote: The competitor is NOT the other startup. The competitor is **the status quo** — the spreadsheet, the manual process, the "we'll deal with it later."\n\n**UVP Formula:**\n"We help [target customer] achieve [specific outcome] by [unique mechanism], unlike [status quo alternative]."\n\n**Example (Notion):** "We help teams organize knowledge by connecting docs, wikis, and projects in one tool, unlike the chaos of scattered Google Docs and spreadsheets."`,
        },
      ],
    },
    contentEs: {
      description: 'Un marco de una página para definir tu misión, visión, valores y propuesta de valor única. Completa cada sección para crear una identidad coherente que guíe cada decisión.',
      fields: [
        { label: 'Nombre de la Empresa', placeholder: 'Nombre de tu startup', type: 'text', required: true },
        { label: 'Misión', placeholder: '¿Por qué existimos? ¿Qué problema resolvemos?', type: 'textarea', required: true },
        { label: 'Visión (5 años)', placeholder: '¿Cómo se ve el mundo si tenemos éxito?', type: 'textarea', required: true },
        { label: 'Valores Centrales (3-5)', placeholder: '¿Qué principios guían nuestro comportamiento?', type: 'textarea', required: true },
        { label: 'Cliente Objetivo', placeholder: '¿Para quién construimos?', type: 'text', required: true },
        { label: 'Propuesta de Valor Única', placeholder: '¿Por qué elegirnos sobre las alternativas?', type: 'textarea', required: true },
        { label: 'Industria', placeholder: 'Ej: SaaS, Marketplace, DTC', type: 'select', options: ['SaaS', 'Marketplace', 'DTC', 'Agencia', 'Biotecnología', 'Clima', 'Fintech', 'EdTech', 'HealthTech', 'Otro'] },
      ],
      sections: [
        {
          heading: 'La Fórmula de la Misión',
          body: `Una gran misión tiene tres componentes:\n\n1. **El Verbo** — ¿Qué acción tomas? (democratizar, acelerar, proteger, conectar)\n2. **El Quién** — ¿Quién se beneficia? (pequeños negocios, creadores, pacientes, desarrolladores)\n3. **El Resultado** — ¿Qué cambia? (acceso al capital, envíos más rápidos, mejor salud)\n\n**Ejemplo (Stripe):** "Aumentar el PIB del internet" — Verbo: Aumentar, Quién: negocios en internet, Resultado: crecimiento económico.`,
        },
        {
          heading: 'Marco para Crear la Visión',
          body: `Tu visión debe ser **lo suficientemente específica para ser significativa** pero **lo suficientemente ambiciosa para inspirar**.\n\n**La Prueba de los 5 Años:**\nSi ejecutamos perfectamente durante 5 años:\n- ¿A cuántos clientes servimos?\n- ¿Cuál es nuestro ingreso anual?\n- ¿Qué estándar de la industria hemos redefinido?\n- ¿Qué dice un cliente sobre nosotros?`,
        },
        {
          heading: 'Valores: De Palabras a Comportamiento',
          body: `Los valores no sirven si no **excluyen** comportamientos. Si un valor no hace que algunas decisiones sean más difíciles, no es un valor real.\n\n**Prueba de Estrés de Valores:** Para cada valor, pregunta:\n- ¿Despediríamos a un alto rendimiento por violar esto?\n- ¿Rechazaríamos un negocio lucrativo que entre en conflicto con esto?\n- ¿Este valor nos ayuda a elegir entre dos buenas opciones?`,
        },
        {
          heading: 'PVU: La Única Pregunta Que Importa',
          body: `Tu Propuesta de Valor Única responde una pregunta: **"¿Por qué un cliente debería elegirte a ti en lugar de no hacer nada?"**\n\nEl competidor NO es la otra startup. El competidor es **el status quo** — la hoja de cálculo, el proceso manual, el "lo resolveremos después".\n\n**Fórmula PVU:**\n"Ayudamos a [cliente objetivo] a lograr [resultado específico] mediante [mecanismo único], a diferencia de [alternativa del status quo]."`,
        },
      ],
    },
  },

  // ═══ r6: 1-Sentence Pitch Formula ═══
  r6: {
    kind: 'cheatsheet',
    content: {
      intro: 'The 4 pitch formulas used by Y Combinator, Sequoia, and a16z. Fill in the blanks for your startup.',
      items: [
        {
          term: 'YC Formula',
          definition: '"[Company] helps [target customer] [solve problem] by [unique mechanism]."',
          example: '"**Stripe** helps **developers** **accept payments online** by **providing a simple API**."',
        },
        {
          term: 'Sequoia Formula',
          definition: '"[Company] is the [well-known analogy] for [new market/segment]."',
          example: '"**Airbnb** is the **eBay** for **accommodations**." / "**Uber** is the **Amazon** for **transportation**."',
        },
        {
          term: 'a16z Formula',
          definition: '"[Shift/trend] is happening. [Company] is the only one that [unique capability]."',
          example: '"**Remote work is permanent. Deel** is the only platform that **handles compliance, payroll, and hiring in 150+ countries in minutes**."',
        },
        {
          term: 'Problem-Solution Formula',
          definition: '"[Pain point] costs [market] [$X billion/year]. [Company] fixes this by [solution]."',
          example: '"**Food waste costs restaurants $25B/year. Too Good To Go** fixes this by **connecting restaurants with consumers for surplus food at discounted prices**."',
        },
        {
          term: 'The X-for-Y Formula',
          definition: '"[Company] is [famous product] for [different audience/use case]."',
          example: '"**Robinhood** is **TurboTax** for **stock trading**." / "**Canva** is **Photoshop** for **non-designers**."',
        },
        {
          term: 'The Contrarian Formula',
          definition: '"Everyone thinks [common belief]. But [insight]. [Company] proves this by [evidence]."',
          example: '"**Everyone thinks you need a college degree to get a great tech job. But skills matter more than credentials. Lambda School proves this by charging zero tuition until you\'re hired.**"',
        },
        {
          term: 'The "Why Now" Formula',
          definition: '"[Technology/trend] just became possible. [Company] is the first to [application]."',
          example: '"**AI video generation just crossed the quality threshold. Synthesia** is the first to **let anyone create professional video with AI avatars in 40+ languages**."',
        },
        {
          term: 'The Numbers Formula',
          definition: '"[Company] helps [N] [customers] achieve [X% improvement] in [metric]."',
          example: '"**Calendly** helps **10M+ professionals** achieve **40% fewer emails** in **scheduling meetings**."',
        },
      ],
      tip: 'Test your pitch on 10 strangers. If they can\'t repeat it back to you in their own words, simplify it.',
    },
    contentEs: {
      intro: 'Las 4 fórmulas de pitch usadas por Y Combinator, Sequoia y a16z. Completa los espacios para tu startup.',
      items: [
        {
          term: 'Fórmula YC',
          definition: '"[Empresa] ayuda a [cliente objetivo] a [resolver problema] mediante [mecanismo único]."',
          example: '"**Stripe** ayuda a **desarrolladores** a **aceptar pagos en línea** mediante **una API simple**."',
        },
        {
          term: 'Fórmula Sequoia',
          definition: '"[Empresa] es el [analogía conocida] para [nuevo mercado/segmento]."',
          example: '"**Airbnb** es el **eBay** de los **alojamientos**." / "**Uber** es el **Amazon** del **transporte**."',
        },
        {
          term: 'Fórmula a16z',
          definition: '"[Cambio/tendencia] está ocurriendo. [Empresa] es la única que [capacidad única]."',
          example: '"**El trabajo remoto llegó para quedarse. Deel** es la única plataforma que **gestiona cumplimiento, nómina y contratación en 150+ países en minutos**."',
        },
        {
          term: 'Fórmula Problema-Solución',
          definition: '"[Dolor] le cuesta a [mercado] [$X mil millones/año]. [Empresa] lo resuelve con [solución]."',
          example: '"**El desperdicio de alimentos cuesta a los restaurantes $25MM/año. Too Good To Go** lo resuelve **conectando restaurantes con consumidores para comida excedente a precios reducidos**."',
        },
        {
          term: 'Fórmula X-para-Y',
          definition: '"[Empresa] es [producto famoso] para [audiencia/caso de uso diferente]."',
          example: '"**Robinhood** es **TurboTax** para **invertir en bolsa**." / "**Canva** es **Photoshop** para **no-diseñadores**."',
        },
        {
          term: 'Fórmula Contraria',
          definition: '"Todos piensan [creencia común]. Pero [idea]. [Empresa] lo demuestra con [evidencia]."',
          example: '"**Todos piensan que necesitas un título universitario para un gran trabajo tech. Pero las habilidades importan más. Lambda School lo demuestra cobrando cero matrícula hasta que consigues empleo.**"',
        },
        {
          term: 'Fórmula "Por Qué Ahora"',
          definition: '"[Tecnología/tendencia] acaba de hacerse posible. [Empresa] es la primera en [aplicación]."',
          example: '"**El video con IA acaba de cruzar el umbral de calidad. Synthesia** es la primera en **permitir que cualquiera cree videos profesionales con avatares IA en 40+ idiomas**."',
        },
        {
          term: 'Fórmula de Números',
          definition: '"[Empresa] ayuda a [N] [clientes] a lograr [X% de mejora] en [métrica]."',
          example: '"**Calendly** ayuda a **10M+ profesionales** a lograr **40% menos correos** en **agendar reuniones**."',
        },
      ],
      tip: 'Prueba tu pitch con 10 desconocidos. Si no pueden repetirlo con sus propias palabras, simplifícalo.',
    },
  },

  // ═══ r4: Unit Economics Napkin Calculator ═══
  r4: {
    kind: 'spreadsheet',
    content: {
      description: 'Quick CAC, LTV, gross margin, and payback period calculator. The one spreadsheet every founder needs before spending a dollar on growth.',
      columns: [
        { key: 'metric', label: 'Metric', type: 'text', width: 200 },
        { key: 'value', label: 'Your Value', type: 'number', width: 120 },
        { key: 'benchmark', label: 'SaaS Benchmark', type: 'text', width: 150 },
        { key: 'status', label: 'Status', type: 'text', width: 100 },
      ],
      rows: [
        { metric: 'Average Revenue Per User (ARPU)/mo', value: '', benchmark: '$50-$500', status: '' },
        { metric: 'Gross Margin %', value: '', benchmark: '>70%', status: '' },
        { metric: 'Customer Acquisition Cost (CAC)', value: '', benchmark: '<$1,000', status: '' },
        { metric: 'LTV (ARPU × Avg Lifetime Months)', value: '', benchmark: '', status: '' },
        { metric: 'LTV:CAC Ratio', value: '', benchmark: '>3:1', status: '' },
        { metric: 'CAC Payback Period (months)', value: '', benchmark: '<12 months', status: '' },
        { metric: 'Monthly Churn %', value: '', benchmark: '<5%', status: '' },
        { metric: 'Annual Churn %', value: '', benchmark: '<45%', status: '' },
        { metric: 'Avg Customer Lifetime (months)', value: '', benchmark: '>20', status: '' },
        { metric: 'Viral Coefficient (K)', value: '', benchmark: '>0.5', status: '' },
        { metric: 'Monthly Recurring Revenue (MRR)', value: '', benchmark: '', status: '' },
        { metric: 'Annual Recurring Revenue (ARR)', value: '', benchmark: '', status: '' },
      ],
      formulas: {
        ltv: 'ARPU × Avg Customer Lifetime Months',
        ltvCac: 'LTV ÷ CAC (must be >3 for VC-scale)',
        payback: 'CAC ÷ (ARPU × Gross Margin %)',
        churnAnnual: '1 - (1 - Monthly Churn)^12',
      },
    },
    contentEs: {
      description: 'Calculadora rápida de CAC, LTV, margen bruto y período de recuperación. La hoja de cálculo que todo fundador necesita antes de gastar un dólar en crecimiento.',
      columns: [
        { key: 'metric', label: 'Métrica', type: 'text', width: 200 },
        { key: 'value', label: 'Tu Valor', type: 'number', width: 120 },
        { key: 'benchmark', label: 'Benchmark SaaS', type: 'text', width: 150 },
        { key: 'status', label: 'Estado', type: 'text', width: 100 },
      ],
      rows: [
        { metric: 'Ingreso Promedio Por Usuario (ARPU)/mes', value: '', benchmark: '$50-$500', status: '' },
        { metric: 'Margen Bruto %', value: '', benchmark: '>70%', status: '' },
        { metric: 'Costo de Adquisición de Cliente (CAC)', value: '', benchmark: '<$1,000', status: '' },
        { metric: 'LTV (ARPU × Meses Promedio de Vida)', value: '', benchmark: '', status: '' },
        { metric: 'Ratio LTV:CAC', value: '', benchmark: '>3:1', status: '' },
        { metric: 'Período de Recuperación CAC (meses)', value: '', benchmark: '<12 meses', status: '' },
        { metric: 'Churn Mensual %', value: '', benchmark: '<5%', status: '' },
        { metric: 'Churn Anual %', value: '', benchmark: '<45%', status: '' },
        { metric: 'Vida Promedio del Cliente (meses)', value: '', benchmark: '>20', status: '' },
        { metric: 'Coeficiente Viral (K)', value: '', benchmark: '>0.5', status: '' },
        { metric: 'Ingreso Recurrente Mensual (MRR)', value: '', benchmark: '', status: '' },
        { metric: 'Ingreso Recurrente Anual (ARR)', value: '', benchmark: '', status: '' },
      ],
      formulas: {
        ltv: 'ARPU × Meses Promedio de Vida del Cliente',
        ltvCac: 'LTV ÷ CAC (debe ser >3 para escala VC)',
        payback: 'CAC ÷ (ARPU × % Margen Bruto)',
        churnAnnual: '1 - (1 - Churn Mensual)^12',
      },
    },
  },

  // ═══ r16: Product Hunt Launch Checklist ═══
  r16: {
    kind: 'cheatsheet',
    content: {
      intro: 'Complete Product Hunt launch checklist — 30 days out to launch day. Used by startups that reached #1 Product of the Day.',
      items: [
        { term: '30 Days Before', definition: '• Create maker profile with real photo and bio\n• Join relevant PH communities and start engaging\n• Research top hunters in your category\n• Prepare all assets: logo (240x240), tagline (60 chars), description, first comment\n• Build a list of 50+ supporters who will upvote on launch day', example: '' },
        { term: '14 Days Before', definition: '• Schedule your launch (Tuesday-Thursday, 12:01 AM PST)\n• Write your "first comment" — tell the authentic story behind the product\n• Prepare 5+ screenshots/GIFs showing the product in action\n• Create a demo video (under 2 minutes)\n• Set up social media posts for launch day across Twitter, LinkedIn, Reddit', example: '' },
        { term: '7 Days Before', definition: '• Finalize your maker intro\n• Test all links (website, signup, demo)\n• Prepare thank-you messages for supporters\n• Check your server capacity (launch traffic spike)\n• Run through the full submission flow as a test', example: '' },
        { term: 'Launch Day', definition: '• Post at 12:01 AM PST sharp\n• Drop your first comment immediately\n• Message your supporter list with direct PH link\n• Engage with EVERY comment within 15 minutes\n• Share on Twitter, LinkedIn, Reddit, Hacker News\n• Send newsletter to your email list\n• Post in Slack/Discord communities you\'re active in', example: '' },
        { term: 'Post-Launch', definition: '• Thank all commenters personally\n• Analyze traffic sources in your analytics\n• Follow up with people who showed interest\n• Write a "lessons learned" post for transparency\n• Add PH badge to your website\n• Plan your next feature launch', example: '' },
      ],
      tip: 'The #1 predictor of PH success: how many genuine relationships you built BEFORE launch day. Transactions don\'t win — community does.',
    },
    contentEs: {
      intro: 'Checklist completa de lanzamiento en Product Hunt — desde 30 días antes hasta el día del lanzamiento. Usada por startups que alcanzaron #1 Producto del Día.',
      items: [
        { term: '30 Días Antes', definition: '• Crea perfil de maker con foto real y biografía\n• Únete a comunidades relevantes de PH y empieza a participar\n• Investiga los mejores hunters en tu categoría\n• Prepara todos los assets: logo (240x240), eslogan (60 caracteres), descripción, primer comentario\n• Construye una lista de 50+ personas que darán upvote el día del lanzamiento', example: '' },
        { term: '14 Días Antes', definition: '• Programa tu lanzamiento (martes-jueves, 12:01 AM PST)\n• Escribe tu "primer comentario" — cuenta la historia auténtica detrás del producto\n• Prepara 5+ capturas de pantalla/GIFs mostrando el producto en acción\n• Crea un video demo (menos de 2 minutos)\n• Prepara publicaciones para redes sociales: Twitter, LinkedIn, Reddit', example: '' },
        { term: '7 Días Antes', definition: '• Finaliza tu introducción de maker\n• Prueba todos los enlaces (web, registro, demo)\n• Prepara mensajes de agradecimiento para tus seguidores\n• Verifica la capacidad de tu servidor (pico de tráfico)\n• Haz una prueba completa del flujo de envío', example: '' },
        { term: 'Día del Lanzamiento', definition: '• Publica a las 12:01 AM PST en punto\n• Publica tu primer comentario inmediatamente\n• Envía mensaje a tu lista de apoyo con enlace directo\n• Responde a CADA comentario en menos de 15 minutos\n• Comparte en Twitter, LinkedIn, Reddit, Hacker News\n• Envía newsletter a tu lista de correo\n• Publica en comunidades de Slack/Discord donde participas', example: '' },
        { term: 'Post-Lanzamiento', definition: '• Agradece a todos los comentaristas personalmente\n• Analiza las fuentes de tráfico en tu analytics\n• Haz seguimiento con personas que mostraron interés\n• Escribe un post de "lecciones aprendidas"\n• Añade la insignia de PH a tu sitio web\n• Planifica tu próximo lanzamiento de funcionalidad', example: '' },
      ],
      tip: 'El predictor #1 de éxito en PH: cuántas relaciones genuinas construiste ANTES del día de lanzamiento. Las transacciones no ganan — la comunidad sí.',
    },
  },

  // ═══ r15: Guerrilla Marketing — 50 Low-Budget Tactics ═══
  r15: {
    kind: 'infographic',
    content: {
      description: '50 guerrilla marketing tactics under $100. Tested by bootstrapped startups that reached $1M+ ARR without paid ads.',
      sections: [
        {
          title: '📱 Social & Community (Cost: $0)',
          points: [
            'Answer relevant questions on Quora and Reddit with genuine value (link to your product only when truly relevant)',
            'Create a "building in public" thread on X/Twitter documenting your journey daily',
            'Join 5 niche Slack/Discord communities where your customers hang out — help without selling for 2 weeks first',
            'Create a free tool or calculator related to your space and share it everywhere',
            'DM 10 ideal customers per day on LinkedIn with personalized value (not a pitch)',
          ],
        },
        {
          title: '🎯 Content Hacks (Cost: $0-$50)',
          points: [
            'Turn one blog post into: Twitter thread, LinkedIn carousel, Instagram Reel script, YouTube Short, and newsletter',
            'Write "how to [solve problem] without [your product]" — counterintuitive content builds massive trust',
            'Record a Loom video answering the #1 question your customers ask and send it to every new signup',
            'Create comparison pages: "[Your Product] vs [Competitor]" — capture high-intent search traffic',
            'Host a free 30-minute workshop on Zoom about a specific problem — record it and turn it into 10 content pieces',
          ],
        },
        {
          title: '🚀 Launch & PR (Cost: $0-$100)',
          points: [
            'Launch on Product Hunt (free) — see separate PH Launch Checklist',
            'Submit to BetaList, AlternativeTo, SaaSHub, and G2 (free listings)',
            'Write a "data study" using your own product data — journalists love original data',
            'Offer to be a podcast guest — there are 1,000+ business podcasts hungry for founder stories',
            'HARO (Help a Reporter Out): respond to 3 journalist queries per day — free PR in major publications',
          ],
        },
        {
          title: '💡 Creative & Guerrilla (Cost: $0-$100)',
          points: [
            'Sticker campaigns: design a clever sticker related to your niche, drop them at co-working spaces and events',
            'Send handwritten thank-you notes to your first 100 customers — 10x higher retention than email',
            'Create a "swag for tweets" program: send free merch to anyone who tweets about your product',
            'Sponsor a niche newsletter for $50-100 instead of $5K+ podcast ads',
            'Build in public and share revenue numbers — transparency is the best marketing in 2026',
          ],
        },
      ],
      keyTakeaway: 'The best guerrilla marketing doesn\'t feel like marketing. It feels like a friend recommending something genuinely useful.',
    },
    contentEs: {
      description: '50 tácticas de marketing de guerrilla por menos de $100. Probadas por startups bootstrap que alcanzaron $1M+ ARR sin anuncios pagados.',
      sections: [
        {
          title: '📱 Social y Comunidad (Costo: $0)',
          points: [
            'Responde preguntas relevantes en Quora y Reddit con valor genuino (enlaza tu producto solo cuando sea realmente relevante)',
            'Crea un hilo de "construyendo en público" en X/Twitter documentando tu viaje diariamente',
            'Únete a 5 comunidades niche de Slack/Discord donde están tus clientes — ayuda sin vender durante 2 semanas primero',
            'Crea una herramienta o calculadora gratuita relacionada con tu espacio y compártela en todas partes',
            'Envía MD a 10 clientes ideales por día en LinkedIn con valor personalizado (no un pitch)',
          ],
        },
        {
          title: '🎯 Hacks de Contenido (Costo: $0-$50)',
          points: [
            'Convierte un artículo de blog en: hilo de Twitter, carrusel de LinkedIn, guión de Reel de Instagram, YouTube Short, y newsletter',
            'Escribe "cómo [resolver problema] sin [tu producto]" — el contenido contraintuitivo construye confianza masiva',
            'Graba un video de Loom respondiendo la pregunta #1 de tus clientes y envíalo a cada nuevo registro',
            'Crea páginas de comparación: "[Tu Producto] vs [Competidor]" — captura tráfico de búsqueda de alta intención',
            'Organiza un taller gratuito de 30 minutos en Zoom sobre un problema específico — grábalo y conviértelo en 10 piezas de contenido',
          ],
        },
        {
          title: '🚀 Lanzamiento y PR (Costo: $0-$100)',
          points: [
            'Lanza en Product Hunt (gratis) — consulta la Checklist de Lanzamiento PH separada',
            'Envía a BetaList, AlternativeTo, SaaSHub y G2 (listados gratuitos)',
            'Escribe un "estudio de datos" usando datos de tu propio producto — los periodistas aman datos originales',
            'Ofrécete como invitado de podcast — hay 1,000+ podcasts de negocios buscando historias de fundadores',
            'HARO (Help a Reporter Out): responde a 3 consultas de periodistas por día — PR gratuito en publicaciones importantes',
          ],
        },
        {
          title: '💡 Creativo y Guerrilla (Costo: $0-$100)',
          points: [
            'Campañas de stickers: diseña un sticker inteligente relacionado con tu nicho, déjalos en espacios de coworking y eventos',
            'Envía notas de agradecimiento escritas a mano a tus primeros 100 clientes — retención 10x mayor que el email',
            'Crea un programa de "merch por tweets": envía merch gratis a cualquiera que tuitee sobre tu producto',
            'Patrocina un newsletter de nicho por $50-100 en lugar de anuncios en podcasts de $5K+',
            'Construye en público y comparte números de ingresos — la transparencia es el mejor marketing en 2026',
          ],
        },
      ],
      keyTakeaway: 'El mejor marketing de guerrilla no se siente como marketing. Se siente como un amigo recomendando algo genuinamente útil.',
    },
  },

  // ═══ r7: The Mom Test — Interview Cheatsheet ═══
  r7: {
    kind: 'cheatsheet',
    content: {
      intro: '10 questions that never lie. Based on Rob Fitzpatrick\'s "The Mom Test" framework. Avoid false positives and get real signal from customer conversations.',
      items: [
        { term: 'Q1: "Talk me through the last time you dealt with [problem]."', definition: 'Anchors them in specific past behavior, not hypothetical future behavior. You want stories, not predictions.', example: 'Bad: "Would you use a product that..." Good: "When was the last time you [specific situation]?"' },
        { term: 'Q2: "How do you solve this problem today?"', definition: 'Reveals their current workaround. If the answer is "nothing," they don\'t have the problem badly enough to pay.', example: 'Listen for: spreadsheets, VAs, manual processes, duct-tape solutions. These signal willingness to spend money or time.' },
        { term: 'Q3: "How much time/money does this problem cost you per month?"', definition: 'Quantifies the pain. If they can\'t put a number on it, it\'s not a real problem — it\'s an annoyance.', example: 'Follow up: "So if I\'m doing the math, that\'s roughly $X/month. Does that sound right?"' },
        { term: 'Q4: "Who else on your team deals with this?"', definition: 'Maps the buying committee. A single-user problem is harder to sell than a team-wide problem.', example: 'If only one person complains, you might have a feature, not a product. If the whole team suffers, you have a business.' },
        { term: 'Q5: "Have you tried to solve this before? What happened?"', definition: 'Reveals past willingness to pay and why previous solutions failed. Goldmine of competitive intelligence.', example: 'Dig into: "What made you stop using [previous solution]?" and "What did you like about it?"' },
        { term: 'Q6: "What would need to be true for you to pay $[price] for a solution?"', definition: 'Tests price sensitivity without asking "would you pay?" (which always gets a yes). Forces them to name conditions.', example: 'If they name impossible conditions, the price is too high. If they name reasonable ones, you found a buyer.' },
        { term: 'Q7: "Can you show me how you do this today?"', definition: 'Screen-share or in-person observation reveals 10x more than verbal descriptions. Watch their workflow, not their words.', example: 'Look for: repeated copy-paste, multiple tabs open, manual data entry, frustrated sighs. These are your features.' },
        { term: 'Q8: "What\'s the hardest part about [workflow/process]?"', definition: 'Identifies the biggest pain point in their workflow. Build for the hardest part first.', example: 'Don\'t ask "what features do you want?" Ask "what\'s the worst part of your day?" Features are proxies for pain.' },
        { term: 'Q9: "If you had a magic wand, what would the ideal solution look like?"', definition: 'Bypasses their limited imagination of what\'s possible. They might describe your v3 while you\'re building v1.', example: 'Take notes on their language, not their feature list. The words they use become your marketing copy.' },
        { term: 'Q10: "Who else should I talk to about this?"', definition: 'The ultimate signal question. If they refer you to others, the problem is real. If they don\'t, it wasn\'t painful enough.', example: 'Every interview should end with this. It\'s both validation and your next lead. 3 referrals = strong signal.' },
      ],
      tip: 'The Mom Test rule: Never ask "would you use this?" Your mom would say yes because she loves you. Strangers will also say yes to avoid awkwardness. Ask about their PAST behavior, not their FUTURE intentions.',
    },
    contentEs: {
      intro: '10 preguntas que nunca mienten. Basado en el marco "The Mom Test" de Rob Fitzpatrick. Evita falsos positivos y obtén señal real de las conversaciones con clientes.',
      items: [
        { term: 'P1: "Cuéntame de la última vez que lidiaste con [problema]."', definition: 'Los ancla en comportamiento pasado específico, no en comportamiento futuro hipotético. Quieres historias, no predicciones.', example: 'Mal: "¿Usarías un producto que..." Bien: "¿Cuándo fue la última vez que [situación específica]?"' },
        { term: 'P2: "¿Cómo resuelves este problema hoy?"', definition: 'Revela su solución actual. Si la respuesta es "nada", no tienen el problema lo suficientemente grave para pagar.', example: 'Escucha: hojas de cálculo, asistentes virtuales, procesos manuales, soluciones caseras. Estos señalan disposición a gastar dinero o tiempo.' },
        { term: 'P3: "¿Cuánto tiempo/dinero te cuesta este problema al mes?"', definition: 'Cuantifica el dolor. Si no pueden ponerle un número, no es un problema real — es una molestia.', example: 'Seguimiento: "Entonces, si hago los cálculos, eso es aproximadamente $X/mes. ¿Te parece correcto?"' },
        { term: 'P4: "¿Quién más en tu equipo lidia con esto?"', definition: 'Mapea el comité de compra. Un problema de un solo usuario es más difícil de vender que un problema de todo el equipo.', example: 'Si solo una persona se queja, podrías tener una funcionalidad, no un producto. Si todo el equipo sufre, tienes un negocio.' },
        { term: 'P5: "¿Has intentado resolver esto antes? ¿Qué pasó?"', definition: 'Revela disposición pasada a pagar y por qué fallaron las soluciones anteriores. Mina de oro de inteligencia competitiva.', example: 'Profundiza: "¿Qué te hizo dejar de usar [solución anterior]?" y "¿Qué te gustó de ella?"' },
        { term: 'P6: "¿Qué tendría que ser verdad para que pagaras $[precio] por una solución?"', definition: 'Prueba la sensibilidad al precio sin preguntar "¿pagarías?" (que siempre obtiene un sí). Los obliga a nombrar condiciones.', example: 'Si nombran condiciones imposibles, el precio es demasiado alto. Si nombran condiciones razonables, encontraste un comprador.' },
        { term: 'P7: "¿Puedes mostrarme cómo haces esto hoy?"', definition: 'Compartir pantalla u observación en persona revela 10x más que las descripciones verbales. Observa su flujo de trabajo, no sus palabras.', example: 'Busca: copiar-pegar repetido, múltiples pestañas abiertas, entrada manual de datos, suspiros de frustración. Estas son tus funcionalidades.' },
        { term: 'P8: "¿Qué es lo más difícil de [flujo/proceso]?"', definition: 'Identifica el mayor punto de dolor en su flujo de trabajo. Construye para la parte más difícil primero.', example: 'No preguntes "¿qué funcionalidades quieres?" Pregunta "¿cuál es la peor parte de tu día?" Las funcionalidades son proxies del dolor.' },
        { term: 'P9: "Si tuvieras una varita mágica, ¿cómo sería la solución ideal?"', definition: 'Evita su imaginación limitada de lo que es posible. Podrían describir tu v3 mientras construyes la v1.', example: 'Toma notas de su lenguaje, no de su lista de funcionalidades. Las palabras que usan se convierten en tu copia de marketing.' },
        { term: 'P10: "¿Con quién más debería hablar sobre esto?"', definition: 'La pregunta de señal definitiva. Si te refieren a otros, el problema es real. Si no, no era lo suficientemente doloroso.', example: 'Cada entrevista debe terminar con esto. Es tanto validación como tu próximo contacto. 3 referencias = señal fuerte.' },
      ],
      tip: 'La regla del Mom Test: Nunca preguntes "¿usarías esto?" Tu mamá diría que sí porque te quiere. Los desconocidos también dirán que sí para evitar incomodidad. Pregunta sobre su comportamiento PASADO, no sus intenciones FUTURAS.',
    },
  },

  // ═══ r11: Pre-Sales & Waitlist Playbook ═══
  r11: {
    kind: 'guide',
    content: {
      sections: [
        {
          heading: 'The Pre-Sales Philosophy',
          body: `Pre-sales is the art of selling your product before it exists. It\'s the single strongest validation signal because it proves willingness-to-pay — not just willingness-to-say-they-like-it.\n\n**The Rule:** If you can\'t get 10 strangers to give you money before you build, you shouldn\'t build.\n\n**Why Pre-Sell:**\n- Validates demand with real money, not survey responses\n- Funds your MVP development with customer cash\n- Creates early adopters who are invested in your success\n- Forces you to articulate value before writing code`,
        },
        {
          heading: 'The Pre-Sales Funnel Architecture',
          body: `**Stage 1: The Signal (Free)**\n- Landing page with clear value proposition\n- Email waitlist with "launch discount" CTA\n- Track: signup conversion rate (target: >5% of visitors)\n\n**Stage 2: The Deposit ($1-$50)**\n- "Reserve your spot" with a small refundable deposit\n- This filters tire-kickers from serious prospects\n- Track: deposit conversion rate (target: >10% of waitlist)\n\n**Stage 3: The Pre-Order ($50-$500)**\n- Lifetime deal, founder\'s plan, or early adopter pricing\n- Clear timeline: "Product ships in 8 weeks or full refund"\n- Track: pre-order conversion rate (target: >20% of depositors)\n\n**Stage 4: The Concierge (Custom Pricing)**\n- White-glove onboarding for high-value early customers\n- Manual service delivery before automation\n- Track: MRR, NPS, churn rate`,
        },
        {
          heading: 'Waitlist Strategy: The Tiered Approach',
          body: `**Tier 1: The Free Waitlist**\n- Join with email only\n- Receive: product updates + 10% launch discount\n\n**Tier 2: The Paid Waitlist ($29-$99)**\n- Lifetime discount (30-50% off forever)\n- Early access (7 days before public)\n- Founder community access (Slack/Discord)\n- Name in product credits\n\n**Tier 3: The Founder\'s Tier ($199-$999)**\n- Everything in Tier 2\n- 1:1 onboarding call with founder\n- Influence product roadmap (vote on features)\n- Lifetime access to all future features\n- Limited to first 50-100 customers`,
        },
        {
          heading: 'The Waitlist Page That Converts',
          body: `**Above the fold:**\n- Headline: The transformation, not the product\n- Subheadline: Who it\'s for and what they get\n- Hero visual: Product mockup or demo video\n- CTA: "Get Early Access" with email field\n\n**Social proof section:**\n- "Join X founders who\'ve already reserved their spot"\n- Live counter of waitlist signups\n- Testimonials from beta users or advisors\n\n**Objection handlers (below the fold):**\n- "When does it launch?" → Specific date or "Q2 2026"\n- "What if I don\'t like it?" → Money-back guarantee\n- "Why pre-order?" → Limited founding member pricing\n\n**The Fear-of-Missing-Out:**\n- "Only 50 founder spots available"\n- Countdown timer or "X spots remaining"`,
        },
        {
          heading: 'Smoke Tests: Validate Before You Build',
          body: `**The Fake Door Test**\n1. Create a landing page describing your product\n2. Add a "Sign Up" or "Buy Now" button\n3. When clicked: "We\'re in early access. Join the waitlist."\n4. Measure: % of visitors who click the button\n5. If >5% click, you have demand signal\n\n**The Concierge MVP**\n1. Manually deliver the service yourself\n2. Use spreadsheets, email, and Zoom — no code\n3. Charge full price from day one\n4. Automate only when manual delivery breaks\n\n**The Wizard of Oz MVP**\n1. Build a frontend that looks like a working product\n2. The "backend" is you manually doing the work\n3. Customers think it\'s automated\n4. Example: Zappos founder bought shoes at stores and shipped them`,
        },
      ],
    },
    contentEs: {
      sections: [
        {
          heading: 'La Filosofía de la Pre-Venta',
          body: `La pre-venta es el arte de vender tu producto antes de que exista. Es la señal de validación más fuerte porque demuestra disposición a pagar — no solo disposición a decir que les gusta.\n\n**La Regla:** Si no puedes conseguir que 10 desconocidos te den dinero antes de construir, no deberías construir.\n\n**Por Qué Pre-Vender:**\n- Valida la demanda con dinero real, no con respuestas de encuestas\n- Financia tu desarrollo MVP con dinero de clientes\n- Crea early adopters que están invertidos en tu éxito\n- Te obliga a articular valor antes de escribir código`,
        },
        {
          heading: 'Arquitectura del Embudo de Pre-Ventas',
          body: `**Etapa 1: La Señal (Gratis)**\n- Landing page con propuesta de valor clara\n- Lista de espera por email con CTA de "descuento de lanzamiento"\n- Seguimiento: tasa de conversión de registro (objetivo: >5% de visitantes)\n\n**Etapa 2: El Depósito ($1-$50)**\n- "Reserva tu lugar" con un pequeño depósito reembolsable\n- Esto filtra a los curiosos de los prospectos serios\n- Seguimiento: tasa de conversión de depósito (objetivo: >10% de la lista de espera)\n\n**Etapa 3: La Pre-Orden ($50-$500)**\n- Oferta de por vida, plan fundador o precio de early adopter\n- Cronograma claro: "Producto se entrega en 8 semanas o reembolso total"\n- Seguimiento: tasa de conversión de pre-orden (objetivo: >20% de depositantes)\n\n**Etapa 4: El Conserje (Precio Personalizado)**\n- Onboarding premium para clientes tempranos de alto valor\n- Entrega de servicio manual antes de la automatización\n- Seguimiento: MRR, NPS, tasa de churn`,
        },
        {
          heading: 'Estrategia de Lista de Espera: El Enfoque por Niveles',
          body: `**Nivel 1: Lista de Espera Gratuita**\n- Unirse solo con email\n- Recibir: actualizaciones del producto + 10% de descuento de lanzamiento\n\n**Nivel 2: Lista de Espera Pagada ($29-$99)**\n- Descuento de por vida (30-50% de descuento para siempre)\n- Acceso anticipado (7 días antes del público)\n- Acceso a comunidad de fundadores (Slack/Discord)\n- Nombre en los créditos del producto\n\n**Nivel 3: Nivel Fundador ($199-$999)**\n- Todo en el Nivel 2\n- Llamada de onboarding 1:1 con el fundador\n- Influencia en el roadmap del producto (votar funcionalidades)\n- Acceso de por vida a todas las funcionalidades futuras\n- Limitado a los primeros 50-100 clientes`,
        },
        {
          heading: 'La Página de Lista de Espera Que Convierte',
          body: `**Sobre el pliegue:**\n- Titular: La transformación, no el producto\n- Subtítulo: Para quién es y qué obtienen\n- Visual principal: Mockup del producto o video demo\n- CTA: "Obtén Acceso Anticipado" con campo de email\n\n**Sección de prueba social:**\n- "Únete a X fundadores que ya reservaron su lugar"\n- Contador en vivo de inscripciones a la lista de espera\n- Testimonios de usuarios beta o asesores\n\n**Manejadores de objeciones (debajo del pliegue):**\n- "¿Cuándo se lanza?" → Fecha específica o "Q2 2026"\n- "¿Y si no me gusta?" → Garantía de reembolso\n- "¿Por qué pre-ordenar?" → Precio limitado de miembro fundador`,
        },
        {
          heading: 'Pruebas de Humo: Valida Antes de Construir',
          body: `**La Prueba de la Puerta Falsa**\n1. Crea una landing page describiendo tu producto\n2. Agrega un botón de "Registrarse" o "Comprar Ahora"\n3. Al hacer clic: "Estamos en acceso anticipado. Únete a la lista de espera."\n4. Mide: % de visitantes que hacen clic en el botón\n5. Si >5% hacen clic, tienes señal de demanda\n\n**El MVP Conserje**\n1. Entrega manualmente el servicio tú mismo\n2. Usa hojas de cálculo, email y Zoom — sin código\n3. Cobra precio completo desde el primer día\n4. Automatiza solo cuando la entrega manual se rompa\n\n**El MVP Mago de Oz**\n1. Construye un frontend que parece un producto funcional\n2. El "backend" eres tú haciendo el trabajo manualmente\n3. Los clientes piensan que está automatizado\n4. Ejemplo: El fundador de Zappos compraba zapatos en tiendas y los enviaba`,
        },
      ],
    },
  },

  // ═══ r19: Objection Handling Script Bank ═══
  r19: {
    kind: 'cheatsheet',
    content: {
      intro: '25 common objections with 3 responses each. Categorized by root cause: Budget, Authority, Need, Timeline, Trust (BANTT framework).',
      items: [
        { term: '"It\'s too expensive" [Budget]', definition: 'R1: "Compared to what? If you do nothing, what does this problem cost you per month?"\nR2: "I understand. Let\'s look at the ROI — if this saves you 5 hours/week at your hourly rate, it pays for itself in [X] days."\nR3: "What price would make this a no-brainer? Let me see if I can adjust the scope to hit that."', example: 'Never defend the price. Reframe to cost of inaction or ROI.' },
        { term: '"Send me more info" [Timeline — stall]', definition: 'R1: "Happy to. To make sure I send the right info: what specifically would you like to know more about?"\nR2: "I can send that. Quick question first — on a scale of 1-10, how likely are you to move forward if the info checks out?"\nR3: "I\'ll send a one-pager. Can we put 15 minutes on the calendar next week to discuss?"', example: 'This is usually a polite "no." Qualify before investing time.' },
        { term: '"I need to think about it" [Timeline — stall]', definition: 'R1: "Of course. What specific factors are you weighing? Maybe I can help think through them with you now."\nR2: "Totally fair. Most people who say that are concerned about [common concern]. Is that the case here?"\nR3: "Take your time. One thing that might help — here\'s what happened when [similar customer] implemented this..."', example: 'Uncover the hidden objection. "I need to think" usually masks another concern.' },
        { term: '"I need to talk to my [boss/partner/team]" [Authority]', definition: 'R1: "Makes sense. Would it help if I put together a one-page summary for them? What would they care about most — cost, ROI, or ease of implementation?"\nR2: "Great. Can we schedule a quick call with them? It\'s usually faster if I can answer their questions directly."\nR3: "What would need to be true for them to say yes? Let\'s make sure we address those points."', example: 'Offer to sell to the decision-maker directly. Arm your champion.' },
        { term: '"We\'re already using [competitor]" [Need — switching cost]', definition: 'R1: "Nice, they\'re a solid tool. What made you choose them? And what\'s one thing you wish they did better?"\nR2: "Many of our customers used [competitor] before switching. The #1 reason they switched was [key differentiator]."\nR3: "You don\'t have to switch. Some teams use both — [your product] for [use case] and [competitor] for [other use case]."', example: 'Don\'t bash competitors. Find the gap they\'re not filling.' },
        { term: '"We don\'t have budget right now" [Budget]', definition: 'R1: "I hear you. When does your next budget cycle start? Let\'s plan for that."\nR2: "Understood. Some teams use discretionary budgets or professional development funds for this — would that apply here?"\nR3: "What if we could show ROI within 30 days? Would that change the budget conversation?"', example: 'Budget = priority, not money. They have money for things they prioritize.' },
        { term: '"Just not a priority right now" [Need]', definition: 'R1: "I appreciate the honesty. What is the top priority right now?"\nR2: "That\'s fair. Can I check back in [3 months]? Things might look different then."\nR3: "What would need to change for this to become a priority?"', example: 'Don\'t force it. Set a follow-up and nurture until timing aligns.' },
        { term: '"Your competitor is cheaper" [Budget]', definition: 'R1: "They are. And they\'re good at [competitor strength]. Where we differentiate is [your unique strength]. Which matters more for your situation?"\nR2: "You\'re right on price. But our customers tell us the total cost of ownership is lower because [reason]. Can I walk you through that?"\nR3: "What\'s the cost of their solution not working? Our customers tell us [specific outcome] is worth [value]."', example: 'Price is only one variable in the value equation.' },
      ],
      tip: 'The best objection handler is a question, not a statement. Ask to understand before you respond to convince.',
    },
    contentEs: {
      intro: '25 objeciones comunes con 3 respuestas cada una. Categorizadas por causa raíz: Presupuesto, Autoridad, Necesidad, Tiempo, Confianza (marco PANTC).',
      items: [
        { term: '"Es demasiado caro" [Presupuesto]', definition: 'R1: "¿Comparado con qué? Si no haces nada, ¿cuánto te cuesta este problema al mes?"\nR2: "Entiendo. Veamos el ROI — si esto te ahorra 5 horas/semana a tu tarifa por hora, se paga solo en [X] días."\nR3: "¿Qué precio haría que esto fuera obvio? Déjame ver si puedo ajustar el alcance para llegar a eso."', example: 'Nunca defiendas el precio. Replantea hacia el costo de la inacción o el ROI.' },
        { term: '"Envíame más información" [Tiempo — evasiva]', definition: 'R1: "Con gusto. Para asegurarme de enviar la información correcta: ¿sobre qué específicamente te gustaría saber más?"\nR2: "Te lo envío. Una pregunta rápida primero — en una escala del 1-10, ¿qué tan probable es que avances si la información es correcta?"\nR3: "Te envío un resumen de una página. ¿Podemos agendar 15 minutos la próxima semana para discutirlo?"', example: 'Esto suele ser un "no" educado. Califica antes de invertir tiempo.' },
        { term: '"Necesito pensarlo" [Tiempo — evasiva]', definition: 'R1: "Por supuesto. ¿Qué factores específicos estás evaluando? Quizás pueda ayudarte a analizarlos ahora."\nR2: "Totalmente justo. La mayoría de las personas que dicen eso están preocupadas por [preocupación común]. ¿Es el caso aquí?"\nR3: "Tómate tu tiempo. Algo que podría ayudar — esto es lo que pasó cuando [cliente similar] implementó esto..."', example: 'Descubre la objeción oculta. "Necesito pensarlo" generalmente oculta otra preocupación.' },
        { term: '"Necesito hablar con mi [jefe/socio/equipo]" [Autoridad]', definition: 'R1: "Tiene sentido. ¿Ayudaría si preparo un resumen de una página para ellos? ¿Qué les importaría más — costo, ROI o facilidad de implementación?"\nR2: "Genial. ¿Podemos agendar una llamada rápida con ellos? Suele ser más rápido si puedo responder sus preguntas directamente."\nR3: "¿Qué tendría que ser verdad para que dijeran que sí? Asegurémonos de abordar esos puntos."', example: 'Ofrece venderle al tomador de decisiones directamente. Arma a tu campeón.' },
        { term: '"Ya estamos usando [competidor]" [Necesidad — costo de cambio]', definition: 'R1: "Bien, es una herramienta sólida. ¿Qué te hizo elegirlos? ¿Y qué es algo que desearías que hicieran mejor?"\nR2: "Muchos de nuestros clientes usaban [competidor] antes de cambiarse. La razón #1 por la que se cambiaron fue [diferenciador clave]."\nR3: "No tienes que cambiar. Algunos equipos usan ambos — [tu producto] para [caso de uso] y [competidor] para [otro caso de uso]."', example: 'No ataques a los competidores. Encuentra el vacío que no están llenando.' },
        { term: '"No tenemos presupuesto ahora" [Presupuesto]', definition: 'R1: "Te escucho. ¿Cuándo comienza tu próximo ciclo de presupuesto? Planifiquemos para entonces."\nR2: "Entendido. Algunos equipos usan presupuestos discrecionales o fondos de desarrollo profesional para esto — ¿aplicaría aquí?"\nR3: "¿Y si pudiéramos mostrar ROI en 30 días? ¿Cambiaría eso la conversación de presupuesto?"', example: 'Presupuesto = prioridad, no dinero. Tienen dinero para cosas que priorizan.' },
      ],
      tip: 'El mejor manejador de objeciones es una pregunta, no una declaración. Pregunta para entender antes de responder para convencer.',
    },
  },

  // ═══ r20: Investor & Partner CRM Tracker ═══
  r20: {
    kind: 'spreadsheet',
    content: {
      description: 'Track every investor and strategic partner relationship in one place. Log contact stage, last touch, and next action so no warm lead goes cold.',
      columns: [
        { key: 'name', label: 'Name', type: 'text', width: 180 },
        { key: 'type', label: 'Type', type: 'text', width: 120 },
        { key: 'source', label: 'Source', type: 'text', width: 130 },
        { key: 'stage', label: 'Stage', type: 'text', width: 140 },
        { key: 'lastContact', label: 'Last Contact', type: 'date', width: 120 },
        { key: 'nextStep', label: 'Next Step', type: 'text', width: 220 },
        { key: 'score', label: 'Fit Score (1-10)', type: 'number', width: 130 },
      ],
      rows: [
        { name: 'Sarah Chen', type: 'Angel', source: 'YC Network', stage: 'Intro Call Done', lastContact: '2025-01-10', nextStep: 'Send deck + financials by Friday', score: 8 },
        { name: 'Benchmark Capital', type: 'VC Series A', source: 'Warm intro from advisor', stage: 'Deck Sent', lastContact: '2025-01-08', nextStep: 'Follow up if no reply in 5 days', score: 9 },
        { name: 'Marcus Rivera', type: 'Strategic Partner', source: 'SaaStr Conference', stage: 'Exploring Pilot', lastContact: '2025-01-05', nextStep: 'Draft pilot proposal', score: 7 },
        { name: 'First Round Capital', type: 'VC Seed', source: 'Cold outreach', stage: 'No Response', lastContact: '2024-12-20', nextStep: 'Try a different partner intro route', score: 6 },
        { name: 'Priya Patel', type: 'Angel', source: 'LinkedIn', stage: 'Committed $25K', lastContact: '2025-01-12', nextStep: 'Send wire instructions + SAFE doc', score: 10 },
      ],
    },
    contentEs: {
      description: 'Rastrea cada relación con inversores y socios estratégicos en un solo lugar. Registra la etapa de contacto, último toque y próxima acción para que ningún contacto cálido se enfríe.',
      columns: [
        { key: 'name', label: 'Nombre', type: 'text', width: 180 },
        { key: 'type', label: 'Tipo', type: 'text', width: 120 },
        { key: 'source', label: 'Fuente', type: 'text', width: 130 },
        { key: 'stage', label: 'Etapa', type: 'text', width: 140 },
        { key: 'lastContact', label: 'Último Contacto', type: 'date', width: 120 },
        { key: 'nextStep', label: 'Próximo Paso', type: 'text', width: 220 },
        { key: 'score', label: 'Puntuación de Ajuste (1-10)', type: 'number', width: 130 },
      ],
      rows: [
        { name: 'Sarah Chen', type: 'Ángel', source: 'Red YC', stage: 'Llamada Introductoria Realizada', lastContact: '2025-01-10', nextStep: 'Enviar deck + financieros el viernes', score: 8 },
        { name: 'Benchmark Capital', type: 'VC Serie A', source: 'Intro cálida de asesor', stage: 'Deck Enviado', lastContact: '2025-01-08', nextStep: 'Seguimiento si no hay respuesta en 5 días', score: 9 },
        { name: 'Marcus Rivera', type: 'Socio Estratégico', source: 'Conferencia SaaStr', stage: 'Explorando Piloto', lastContact: '2025-01-05', nextStep: 'Redactar propuesta de piloto', score: 7 },
        { name: 'First Round Capital', type: 'VC Semilla', source: 'Contacto frío', stage: 'Sin Respuesta', lastContact: '2024-12-20', nextStep: 'Buscar intro a través de otro socio', score: 6 },
        { name: 'Priya Patel', type: 'Ángel', source: 'LinkedIn', stage: 'Comprometida $25K', lastContact: '2025-01-12', nextStep: 'Enviar instrucciones de transferencia + doc SAFE', score: 10 },
      ],
    },
  },

  // ═══ r21: The Demo That Converts ═══
  r21: {
    kind: 'guide',
    content: {
      sections: [
        {
          heading: 'The Hook (0:00–1:30): Lead with the Pain',
          body: `Never open a demo with "Let me show you our dashboard." Open with the pain.\n\n**Formula:** "You know how [persona] spends [painful time/cost] doing [frustrating task]? Today I'll show you how [Company] eliminates that in [timeframe]."\n\n**Example:** "You know how your sales team spends 45 minutes updating Salesforce after every call? I'm going to show you how reps do it in 90 seconds — while they're still on the call."\n\n**Rule:** The first 90 seconds should make the prospect nod and think "that's exactly my problem."`,
        },
        {
          heading: 'Pain Agitate: Make the Status Quo Feel Expensive',
          body: `Before showing your solution, make the current pain vivid and quantified.\n\n**Agitate framework:**\n1. **Frequency:** "This happens every single day for every rep"\n2. **Cost:** "At 45 min/day × 250 work days × $60/hour = $6,750/year per rep"\n3. **Downstream impact:** "And that's before counting the data errors that cause bad forecasts"\n\n**Show the painful workflow:** Walk through what they do TODAY in 3-4 clicks. Let them feel the friction before you show the fix.\n\n**Proof point:** Have a real customer quote ready: "Before [your tool], I was spending my Sunday nights doing [painful task]."`,
        },
        {
          heading: 'The Aha Moment: One Feature, Undeniable Value',
          body: `Your demo should build to one single "wow" moment — not a feature tour.\n\n**The 1-Feature Rule:** Pick the single feature that delivers your core value, and make it the climax of the demo. Everything else supports this moment.\n\n**Structure of the Aha Moment:**\n1. Set up the before state (painful, slow, manual)\n2. Click one button / perform one action\n3. Show the after state (instant, automated, accurate)\n4. Quantify: "What took 45 minutes now takes 8 seconds"\n\n**After the Aha:** Pause. Let them react. Do NOT immediately move to the next feature. Ask: "How does that compare to what you're doing today?"`,
        },
        {
          heading: 'Pricing Anchor & CTA: Close While They\'re Hot',
          body: `The worst time to introduce pricing is cold. The best time is immediately after the Aha moment.\n\n**Pricing Anchor Sequence:**\n1. State the value delivered: "At $6,750/year in rep time saved, per rep..."\n2. Introduce pricing: "Our plan for a 10-person team is $1,200/month"\n3. Implicit math: "That's $14,400/year for $67,500 in time savings — 4.7x ROI"\n\n**The Close:**\n- "What would need to be true for you to move forward this week?"\n- "We have 3 onboarding slots in January. Would you like to hold one?"\n- "Let's start a 14-day trial — zero setup, I'll handle onboarding personally"\n\n**Never end without a specific next step with a date.**`,
        },
      ],
    },
    contentEs: {
      sections: [
        {
          heading: 'El Gancho (0:00–1:30): Empieza con el Dolor',
          body: `Nunca abras una demo con "Déjame mostrarte nuestro panel." Abre con el dolor.\n\n**Fórmula:** "¿Sabes cómo [persona] pasa [tiempo/costo doloroso] haciendo [tarea frustrante]? Hoy te mostraré cómo [Empresa] elimina eso en [plazo]."\n\n**Ejemplo:** "¿Sabes cómo tu equipo de ventas pasa 45 minutos actualizando Salesforce después de cada llamada? Voy a mostrarte cómo los representantes lo hacen en 90 segundos — mientras aún están en la llamada."\n\n**Regla:** Los primeros 90 segundos deben hacer que el prospecto asienta y piense "ese es exactamente mi problema."`,
        },
        {
          heading: 'Agitar el Dolor: Haz que el Status Quo Se Sienta Costoso',
          body: `Antes de mostrar tu solución, vuelve el dolor actual vívido y cuantificado.\n\n**Marco para agitar:**\n1. **Frecuencia:** "Esto sucede todos los días para cada representante"\n2. **Costo:** "A 45 min/día × 250 días laborables × $60/hora = $6,750/año por representante"\n3. **Impacto aguas abajo:** "Y eso antes de contar errores de datos que causan malas previsiones"\n\n**Muestra el flujo de trabajo doloroso:** Recorre lo que hacen HOY en 3-4 clics. Deja que sientan la fricción antes de mostrar la solución.`,
        },
        {
          heading: 'El Momento Ajá: Una Función, Valor Innegable',
          body: `Tu demo debe construirse hacia un único momento "wow" — no un tour de funciones.\n\n**La Regla de 1 Función:** Elige la función que entrega tu valor central y hazla el clímax de la demo.\n\n**Estructura del Momento Ajá:**\n1. Establece el estado anterior (doloroso, lento, manual)\n2. Haz clic en un botón / realiza una acción\n3. Muestra el estado posterior (instantáneo, automatizado, preciso)\n4. Cuantifica: "Lo que tomaba 45 minutos ahora toma 8 segundos"\n\n**Después del Ajá:** Pausa. Deja que reaccionen. Pregunta: "¿Cómo se compara eso con lo que haces hoy?"`,
        },
        {
          heading: 'Ancla de Precio y CTA: Cierra Mientras Están Calientes',
          body: `El mejor momento para introducir precios es inmediatamente después del momento Ajá.\n\n**Secuencia de Ancla de Precio:**\n1. Declara el valor entregado: "Con $6,750/año en tiempo de representante ahorrado..."\n2. Introduce el precio: "Nuestro plan para un equipo de 10 personas es $1,200/mes"\n3. Matemática implícita: "$14,400/año por $67,500 en ahorro de tiempo — 4.7x ROI"\n\n**El Cierre:**\n- "¿Qué tendría que ser verdad para que avances esta semana?"\n- "Tenemos 3 slots de incorporación en enero. ¿Te gustaría reservar uno?"\n- "Empecemos un ensayo de 14 días — sin configuración, me encargo personalmente"\n\n**Nunca termines sin un próximo paso específico con una fecha.**`,
        },
      ],
    },
  },

  // ═══ r44: The Ultimate Pitch Deck Template ═══
  r44: {
    kind: 'guide',
    content: {
      sections: [
        {
          heading: 'Slide 1: Title Slide',
          body: `**Content:** Company name, logo, tagline (one sentence), presenter name, contact info.\n\n**What investors think:** "Do I know this company? Is this my space?"\n\n**Pro tip:** Your tagline should make an investor lean forward. Test it on 5 people — if 3 ask "what does that mean?", rewrite it.\n\n**Example:** "Stripe: Payments infrastructure for the internet" (crystal clear in 5 words).`,
        },
        {
          heading: 'Slide 2: The Problem',
          body: `**Content:** The pain point you solve. Use a real customer story or data point. Make it visceral.\n\n**What investors think:** "Is this a real problem or a made-up one? How big is the pain?"\n\n**Framework:** State the problem. Show who suffers. Quantify the cost.\n\n**Bad:** "Managing tasks is hard."\n**Good:** "Sarah spends 12 hours/week copying data between 7 tools. She\'s a marketing manager at a 50-person company. There are 500,000 Sarahs in the US alone. That\'s $15B in lost productivity."`,
        },
        {
          heading: 'Slide 3: The Solution',
          body: `**Content:** How you solve the problem. Show, don\'t tell. Screenshots > words.\n\n**What investors think:** "Is this solution 10x better than the status quo? Or just incrementally better?"\n\n**The 10x Rule:** Investors fund 10x improvements, not 10% improvements. If your solution isn\'t 10x cheaper, faster, or better, it won\'t overcome switching costs.\n\n**Formula:** "Unlike [current solution], our [product] [unique mechanism] so that [outcome]."`,
        },
        {
          heading: 'Slide 4: Market Size',
          body: `**Content:** TAM, SAM, SOM with bottom-up calculation, not top-down fantasy.\n\n**What investors think:** "Can this be a billion-dollar company? Is their market math credible?"\n\n**Bottom-up TAM formula:** (Number of potential customers) × (Annual contract value) = TAM\n\n**Example:** "500,000 US marketing managers × $5,000/year ACV = $2.5B TAM. Our initial SOM is the 50,000 using competitor tools = $250M."\n\n**Never say:** "The market is $100B and we just need 1%." This is the fastest way to lose credibility.`,
        },
        {
          heading: 'Slide 5: Why Now?',
          body: `**Content:** The trend, technology shift, or regulatory change that makes this the right moment.\n\n**What investors think:** "Why hasn\'t this been done before? What changed?"\n\n**Framework:** Technology trigger → Market readiness → Your timing.\n\n**Example:** "Three things make this possible now: (1) AI video generation crossed the quality threshold in 2025, (2) 73% of marketers now prefer video over text, (3) TikTok\'s rise created demand for rapid video production that existing tools can\'t meet."`,
        },
        {
          heading: 'Slide 6: Traction',
          body: `**Content:** Your best metrics. Revenue, users, growth rate, retention, key partnerships.\n\n**What investors think:** "Is there proof people want this? Is the growth rate fundable?"\n\n**Show the best graph you have. If you have revenue, show MRR growth. If not, show user growth or LOIs.**\n\n**Seed-stage traction signals:**\n- Paying customers (>10 is strong)\n- LOIs from enterprise (>3 with logos)\n- Waitlist (>1,000 with 30%+ week-over-week growth)\n- Pilots (3+ with clear conversion criteria)\n\n**If you have no traction:** Show what you\'ve built and the customer discovery you\'ve done. Be honest.`,
        },
        {
          heading: 'Slide 7: Business Model',
          body: `**Content:** How you make money. Pricing, unit economics, sales motion.\n\n**What investors think:** "Do the unit economics work at scale? Is this a real business or a feature?"\n\n**Show:**\n- Pricing tiers (include actual numbers)\n- Customer acquisition cost (CAC)\n- Lifetime value (LTV)\n- Gross margin\n- LTV:CAC ratio\n\n**The 3:1 Rule:** Investors want to see LTV:CAC > 3:1. If your ratio is below this, explain how it improves at scale.`,
        },
        {
          heading: 'Slide 8: Competition',
          body: `**Content:** Competitive landscape with your unfair advantage clearly shown.\n\n**What investors think:** "Do they understand their competition? What is their moat?"\n\n**Use a 2×2 matrix or feature comparison table.** Never say "we have no competitors." That means either (a) you haven\'t done research, or (b) there\'s no market.\n\n**Your competitor is the status quo.** The spreadsheet. The manual process. The "we\'ll deal with it later." Position against that first, then against direct competitors.`,
        },
        {
          heading: 'Slide 9: Team',
          body: `**Content:** Founders, key hires, relevant experience, and why this team wins.\n\n**What investors think:** "Is this the right team to solve this problem? Do they have unfair advantage?"\n\n**Show:**\n- Founder photos (professional but human)\n- 1-2 relevant accomplishments per person (not full resumes)\n- Domain expertise (why you understand this problem better than anyone)\n- Founder-market fit (why YOU specifically should solve THIS problem)\n\n**If your team is weak:** Address it head-on. "We\'re hiring a CTO — here\'s our ideal profile and who we\'re talking to."`,
        },
        {
          heading: 'Slide 10: Financial Projections',
          body: `**Content:** 3-year revenue projection with key assumptions clearly stated.\n\n**What investors think:** "Are their assumptions realistic? Do they understand what drives their business?"\n\n**Show:**\n- Revenue projection (bottom-up, not "1% of market")\n- Headcount plan\n- Key assumptions (CAC, churn, ARPU growth)\n- Burn rate and runway\n\n**The Assumption Test:** Investors care more about your assumptions than your projections. Show your work.`,
        },
        {
          heading: 'Slide 11: The Ask',
          body: `**Content:** How much you\'re raising, instrument (priced round vs SAFE), use of funds, and milestones you\'ll hit.\n\n**What investors think:** "Is this the right amount? Will it get them to the next milestone?"\n\n**Formula:** "We\'re raising $[X] on a [SAFE/priced round] to achieve [milestone] in [timeline], which will position us for [next round/breakeven]."\n\n**Milestone examples:**\n- "Reach $50K MRR in 12 months"\n- "Launch in 3 new markets and reach 1,000 paying customers"\n- "Achieve breakeven within 18 months"`,
        },
        {
          heading: 'Slide 12: The Closing',
          body: `**Content:** Your vision, contact info, and a clear call to action.\n\n**What investors think:** "Do I want to be part of this story?"\n\n**End with your mission statement and a specific ask:**\n- "We\'re closing our round in 4 weeks. Let\'s schedule a follow-up this week."\n- "We\'re looking for a lead investor who understands [space]. Is that you?"\n\n**Never end with "Thank you" or "Questions?"** Your last slide is prime real estate. Use it.`,
        },
      ],
    },
    contentEs: {
      sections: [
        {
          heading: 'Diapositiva 1: Título',
          body: `**Contenido:** Nombre de la empresa, logo, eslogan (una oración), nombre del presentador, información de contacto.\n\n**Lo que piensan los inversores:** "¿Conozco esta empresa? ¿Es este mi espacio?"\n\n**Tip profesional:** Tu eslogan debe hacer que un inversor se incline hacia adelante. Pruébalo con 5 personas — si 3 preguntan "¿qué significa?", reescríbelo.`,
        },
        {
          heading: 'Diapositiva 2: El Problema',
          body: `**Contenido:** El punto de dolor que resuelves. Usa una historia real de cliente o un dato. Hazlo visceral.\n\n**Lo que piensan los inversores:** "¿Es un problema real o inventado? ¿Qué tan grande es el dolor?"\n\n**Marco:** Declara el problema. Muestra quién sufre. Cuantifica el costo.\n\n**Mal:** "Gestionar tareas es difícil."\n**Bien:** "Sara pasa 12 horas/semana copiando datos entre 7 herramientas. Es gerente de marketing en una empresa de 50 personas. Hay 500,000 Saras solo en EE.UU. Eso son $15MM en productividad perdida."`,
        },
        {
          heading: 'Diapositiva 3: La Solución',
          body: '**Contenido:** Cómo resuelves el problema. Muestra, no cuentes. Capturas de pantalla > palabras.\n\n**Lo que piensan los inversores:** "¿Es esta solución 10x mejor que el status quo? ¿O solo incrementalmente mejor?"\n\n**La Regla 10x:** Los inversores financian mejoras 10x, no mejoras del 10%. Si tu solución no es 10x más barata, rápida o mejor, no superará los costos de cambio.',
        },
        {
          heading: 'Diapositiva 4: Tamaño del Mercado',
          body: '**Contenido:** TAM, SAM, SOM con cálculo ascendente, no fantasía descendente.\n\n**Fórmula TAM ascendente:** (Número de clientes potenciales) × (Valor de contrato anual) = TAM\n\n**Nunca digas:** "El mercado es de $100MM y solo necesitamos el 1%." Esta es la forma más rápida de perder credibilidad.',
        },
        {
          heading: 'Diapositiva 5: ¿Por Qué Ahora?',
          body: '**Contenido:** La tendencia, cambio tecnológico o cambio regulatorio que hace que este sea el momento adecuado.\n\n**Marco:** Disparador tecnológico → Preparación del mercado → Tu timing.\n\n**Ejemplo:** "Tres cosas hacen esto posible ahora: (1) El video con IA cruzó el umbral de calidad en 2025, (2) El 73% de los mercadólogos ahora prefieren video sobre texto, (3) El auge de TikTok creó demanda de producción rápida de video que las herramientas existentes no pueden satisfacer."',
        },
        {
          heading: 'Diapositiva 6: Tracción',
          body: '**Contenido:** Tus mejores métricas. Ingresos, usuarios, tasa de crecimiento, retención, alianzas clave.\n\n**Señales de tracción en etapa semilla:**\n- Clientes que pagan (>10 es fuerte)\n- Cartas de intención de empresas (>3 con logos)\n- Lista de espera (>1,000 con crecimiento semanal del 30%+)\n- Pilotos (3+ con criterios claros de conversión)',
        },
        {
          heading: 'Diapositiva 7: Modelo de Negocio',
          body: '**Contenido:** Cómo generas dinero. Precios, economía unitaria, movimiento de ventas.\n\n**La Regla 3:1:** Los inversores quieren ver LTV:CAC > 3:1. Si tu ratio está por debajo, explica cómo mejora a escala.',
        },
        {
          heading: 'Diapositiva 8: Competencia',
          body: '**Contenido:** Panorama competitivo con tu ventaja injusta claramente mostrada.\n\n**Tu competidor es el status quo.** La hoja de cálculo. El proceso manual. El "lo resolveremos después". Posiciónate contra eso primero, luego contra competidores directos.',
        },
        {
          heading: 'Diapositiva 9: Equipo',
          body: '**Contenido:** Fundadores, contrataciones clave, experiencia relevante y por qué este equipo gana.\n\n**Muestra:** Fotos de fundadores (profesionales pero humanas), 1-2 logros relevantes por persona, experiencia en el dominio, ajuste fundador-mercado.',
        },
        {
          heading: 'Diapositiva 10: Proyecciones Financieras',
          body: '**Contenido:** Proyección de ingresos a 3 años con supuestos clave claramente declarados.\n\n**La Prueba de Supuestos:** A los inversores les importan más tus supuestos que tus proyecciones. Muestra tu trabajo.',
        },
        {
          heading: 'Diapositiva 11: La Pregunta',
          body: '**Contenido:** Cuánto estás recaudando, instrumento (ronda valorada vs SAFE), uso de fondos e hitos que alcanzarás.\n\n**Fórmula:** "Estamos recaudando $[X] en un [SAFE/ronda valorada] para lograr [hito] en [plazo], lo que nos posicionará para [próxima ronda/punto de equilibrio]."',
        },
        {
          heading: 'Diapositiva 12: El Cierre',
          body: '**Contenido:** Tu visión, información de contacto y un claro llamado a la acción.\n\n**Nunca termines con "Gracias" o "¿Preguntas?"** Tu última diapositiva es espacio publicitario principal. Úsalo.',
        },
      ],
    },
  },

  // ═══ r2: Target Audience Persona Builder ═══
  r2: {
    kind: 'template',
    content: {
      description: 'Build detailed customer personas with demographics, psychographics, pain points, and jobs-to-be-done. Create 3-5 personas that guide all product and marketing decisions.',
      fields: [
        { label: 'Persona Name', placeholder: 'e.g., "Sarah, the Bootstrapped Founder"', type: 'text', required: true },
        { label: 'Age & Location', placeholder: 'e.g., 28, San Francisco Bay Area', type: 'text' },
        { label: 'Job Title & Industry', placeholder: 'e.g., Founder, B2B SaaS', type: 'text' },
        { label: 'Annual Income', placeholder: '$50k - $150k', type: 'text' },
        { label: 'Primary Pain Point', placeholder: 'What keeps them up at night?', type: 'textarea', required: true },
        { label: 'Urgent Need (Jobs-to-be-Done)', placeholder: 'Progress they want to make', type: 'textarea', required: true },
        { label: 'How They Make Decisions', placeholder: 'What influences them?', type: 'textarea' },
      ],
      sections: [
        {
          heading: 'Psychographics & Motivations',
          body: 'Beyond demographics: Aspirations ("Build $10M business"), Fears ("Run out of cash"), Frustrations ("20 hours on payroll"), Worldview ("Scrappy builder"), Decision Drivers ("Founder recommendation, community proof")',
        },
        {
          heading: 'Jobs-to-be-Done',
          body: 'Functional Job: "Track customer feedback systematically"\nEmotional Job: "Feel like I\'m building the right thing"\nSocial Job: "Be seen as customer-centric"\n\nEmotional and social jobs often matter more than functional ones.',
        },
        {
          heading: 'Information & Trust Channels',
          body: 'Where do they learn? Blogs, podcasts, Twitter, newsletters. Who do they trust? (founders, influencers, communities)\n\nWhat content convinces them? Case studies, founder recommendations, free trials that show immediate value.',
        },
      ],
    },
    contentEs: {
      description: 'Construye personas de clientes con demografía, psicografía, puntos de dolor y trabajos a realizar. Crea 3-5 personas que guíen todas las decisiones de producto y marketing.',
      fields: [
        { label: 'Nombre de la Persona', placeholder: 'Ej: "Sarah, la Fundadora Bootstrapped"', type: 'text', required: true },
        { label: 'Edad y Ubicación', placeholder: 'Ej: 28, Área de la Bahía', type: 'text' },
        { label: 'Cargo e Industria', placeholder: 'Ej: Fundadora, SaaS B2B', type: 'text' },
        { label: 'Ingreso Anual', placeholder: '$50k - $150k', type: 'text' },
        { label: 'Punto de Dolor Principal', placeholder: '¿Qué los mantiene despiertos?', type: 'textarea', required: true },
        { label: 'Necesidad Urgente', placeholder: 'Progreso que quieren hacer', type: 'textarea', required: true },
        { label: 'Cómo Toman Decisiones', placeholder: '¿Qué los influencia?', type: 'textarea' },
      ],
      sections: [
        {
          heading: 'Psicografía y Motivaciones',
          body: 'Más allá de demografía: Aspiraciones ("Construir negocio de $10M"), Miedos ("Quedarse sin dinero"), Frustraciones ("20 horas en nómina"), Cosmovisión ("Constructor audaz"), Impulsores ("Recomendación del fundador")',
        },
        {
          heading: 'Trabajos a Realizar',
          body: 'Trabajo Funcional: "Rastrear comentarios sistemáticamente"\nTrabajo Emocional: "Sentir que construyo lo correcto"\nTrabajo Social: "Ser visto como centrado en clientes"\n\nLos trabajos emocionales y sociales a menudo importan más.',
        },
        {
          heading: 'Canales de Información y Confianza',
          body: '¿Dónde aprenden? Blogs, podcasts, Twitter, newsletters. ¿En quién confían? (fundadores, influencers, comunidades)\n\n¿Qué contenido los convence? Casos de estudio, recomendaciones, pruebas gratis que muestren valor inmediato.',
        },
      ],
    },
  },

  // ═══ r3: Competitor Matrix & Blue Ocean Map ═══
  r3: {
    kind: 'spreadsheet',
    content: {
      description: 'Map competitors on 10+ dimensions (price, features, ease-of-use, speed, customization, support, integrations, etc.). Identify gaps—your Blue Ocean opportunity.',
      columns: [
        { key: 'competitor', label: 'Competitor', type: 'text' },
        { key: 'price', label: 'Price Point ($)', type: 'currency' },
        { key: 'ease', label: 'Ease of Use (1-5)', type: 'number' },
        { key: 'features', label: 'Core Features', type: 'text' },
        { key: 'speed', label: 'Speed/Performance (1-5)', type: 'number' },
        { key: 'support', label: 'Support Quality (1-5)', type: 'number' },
        { key: 'integrations', label: 'Key Integrations', type: 'text' },
        { key: 'gap', label: 'Your Gap (What\'s Missing?)', type: 'text' },
      ],
      rows: [
        { competitor: 'Status Quo (Manual/Spreadsheet)', price: 0, ease: 2, features: 'Custom but tedious', speed: 1, support: 0, integrations: 'None', gap: 'Time-consuming, error-prone' },
        { competitor: 'Competitor A (Market Leader)', price: 2000, ease: 3, features: 'Full-featured', speed: 3, support: 4, integrations: 'Slack, Zapier, Salesforce', gap: 'Overkill for SMBs, hard to learn' },
        { competitor: 'Competitor B (Budget Option)', price: 500, ease: 4, features: 'Core only, limited', speed: 4, support: 2, integrations: 'Email, Slack', gap: 'Missing customization, no reporting' },
        { competitor: 'YOUR SOLUTION', price: 800, ease: 5, features: 'Core + customization', speed: 5, support: 5, integrations: 'Slack, Salesforce, HubSpot, Zapier, Make', gap: 'Perfect balance: easy, affordable, extensible' },
      ],
    },
    contentEs: {
      description: 'Mapea competidores en 10+ dimensiones (precio, características, facilidad de uso, velocidad, personalización, soporte, integraciones, etc.). Identifica brechas—tu oportunidad de Océano Azul.',
      columns: [
        { key: 'competitor', label: 'Competidor', type: 'text' },
        { key: 'price', label: 'Punto de Precio ($)', type: 'currency' },
        { key: 'ease', label: 'Facilidad de Uso (1-5)', type: 'number' },
        { key: 'features', label: 'Características Principales', type: 'text' },
        { key: 'speed', label: 'Velocidad/Rendimiento (1-5)', type: 'number' },
        { key: 'support', label: 'Calidad de Soporte (1-5)', type: 'number' },
        { key: 'integrations', label: 'Integraciones Clave', type: 'text' },
        { key: 'gap', label: 'Tu Brecha (¿Qué Falta?)', type: 'text' },
      ],
      rows: [
        { competitor: 'Status Quo (Manual/Hoja de Cálculo)', price: 0, ease: 2, features: 'Personalizado pero tedioso', speed: 1, support: 0, integrations: 'Ninguno', gap: 'Consume tiempo, propenso a errores' },
        { competitor: 'Competidor A (Líder del Mercado)', price: 2000, ease: 3, features: 'Con todas las funciones', speed: 3, support: 4, integrations: 'Slack, Zapier, Salesforce', gap: 'Excesivo para PYMEs, difícil de aprender' },
        { competitor: 'Competidor B (Opción Económica)', price: 500, ease: 4, features: 'Solo núcleo, limitado', speed: 4, support: 2, integrations: 'Email, Slack', gap: 'Falta personalización, sin reportes' },
        { competitor: 'TU SOLUCIÓN', price: 800, ease: 5, features: 'Núcleo + personalización', speed: 5, support: 5, integrations: 'Slack, Salesforce, HubSpot, Zapier, Make', gap: 'Balance perfecto: fácil, asequible, extensible' },
      ],
    },
  },

  // ═══ r5: Co-Founder Agreement & Vesting Schedule ═══
  r5: {
    kind: 'template',
    content: {
      description: 'Foundational co-founder agreement with equity split, vesting schedule (standard 4-year with 1-year cliff), roles & responsibilities, IP assignment, and dispute resolution.',
      fields: [
        { label: 'Founder 1 Name', placeholder: 'Full legal name', type: 'text', required: true },
        { label: 'Founder 1 Role', placeholder: 'e.g., CEO/Product', type: 'text', required: true },
        { label: 'Founder 1 Equity %', placeholder: 'e.g., 40%', type: 'number', required: true },
        { label: 'Founder 2 Name', placeholder: 'Full legal name', type: 'text', required: true },
        { label: 'Founder 2 Role', placeholder: 'e.g., CTO/Engineering', type: 'text', required: true },
        { label: 'Founder 2 Equity %', placeholder: 'e.g., 40%', type: 'number', required: true },
        { label: 'Additional Equity (Employee Pool)', placeholder: 'e.g., 20%', type: 'number' },
      ],
      sections: [
        {
          heading: 'Vesting Schedule (Standard)',
          body: '**Total Vesting Period:** 4 years\n**Cliff:** 1 year (founder must stay 1 year to vest ANY equity)\n**Vesting Schedule:** Equity vests monthly over 48 months\n\nExample: Founder with 1M share grant\n- At 12 months: 250K shares vested (cliff)\n- At 24 months: 500K shares vested\n- At 48 months: 1M shares vested\n\n**If founder leaves before cliff:** They keep 0 shares. If they leave after cliff, they keep vested shares and have 90 days to exercise.',
        },
        {
          heading: 'Roles, Responsibilities & Time Commitment',
          body: '**CEO/Founder 1:**\n- Board updates, investor relations, fundraising\n- Strategic direction, hiring decisions\n- Business model and go-to-market\n- Expected 60+ hours/week\n\n**CTO/Founder 2:**\n- Product architecture, tech hiring, engineering culture\n- Product roadmap implementation, technical decisions\n- Expected 60+ hours/week\n\n**Mutual Commitment:** All founders commit full-time, cannot have other employment without unanimous written consent.',
        },
        {
          heading: 'Intellectual Property Assignment',
          body: '**All IP created while employed belongs to the company.** This includes:\n- Code, designs, documentation\n- Business processes, customer lists\n- Marketing materials, brand assets\n- Inventions and patents\n\n**Pre-existing IP:** Founders list any pre-existing intellectual property on Exhibit A. The company grants a royalty-free license for founders to use pre-existing IP in the business.',
        },
        {
          heading: 'Dispute Resolution & Exit Clauses',
          body: '**Founder Departure:**\n- Voluntary departure: Vesting stops immediately. Founder loses all future equity. Exercisable for 90 days.\n- Termination for cause: Vesting stops, no severance, 30-day notice.\n- Termination without cause: 2 weeks severance, vesting continues 3 additional months.\n\n**Deadlock Resolution:** If 2 co-founders are deadlocked, the 3rd party (if exists) or investor board seat breaks the tie.\n\n**Non-Compete:** 12-month non-compete in same market. 18-month non-solicitation of employees and customers.',
        },
      ],
    },
    contentEs: {
      description: 'Acuerdo fundamental de cofundadores con distribución de capital, cronograma de vesting (estándar 4 años con acantilado de 1 año), funciones y responsabilidades, asignación de PI y resolución de disputas.',
      fields: [
        { label: 'Nombre Cofundador 1', placeholder: 'Nombre legal completo', type: 'text', required: true },
        { label: 'Rol Cofundador 1', placeholder: 'Ej: CEO/Producto', type: 'text', required: true },
        { label: 'Capital Cofundador 1 %', placeholder: 'Ej: 40%', type: 'number', required: true },
        { label: 'Nombre Cofundador 2', placeholder: 'Nombre legal completo', type: 'text', required: true },
        { label: 'Rol Cofundador 2', placeholder: 'Ej: CTO/Ingeniería', type: 'text', required: true },
        { label: 'Capital Cofundador 2 %', placeholder: 'Ej: 40%', type: 'number', required: true },
        { label: 'Capital Adicional (Pool de Empleados)', placeholder: 'Ej: 20%', type: 'number' },
      ],
      sections: [
        {
          heading: 'Cronograma de Vesting (Estándar)',
          body: '**Período Total de Vesting:** 4 años\n**Acantilado:** 1 año (cofundador debe quedarse 1 año para adquirir CUALQUIER capital)\n**Cronograma:** El capital se adquiere mensualmente durante 48 meses\n\nEjemplo: Cofundador con concesión de 1M de acciones\n- A los 12 meses: 250K acciones adquiridas (acantilado)\n- A los 24 meses: 500K acciones adquiridas\n- A los 48 meses: 1M acciones adquiridas\n\n**Si cofundador se va antes del acantilado:** Mantiene 0 acciones. Si se va después del acantilado, mantiene acciones adquiridas y tiene 90 días para ejercer.',
        },
        {
          heading: 'Funciones, Responsabilidades y Dedicación',
          body: '**CEO/Cofundador 1:**\n- Actualizaciones de junta, relaciones con inversores, recaudación de fondos\n- Dirección estratégica, decisiones de contratación\n- Modelo de negocio y estrategia de mercado\n- Esperado 60+ horas/semana\n\n**CTO/Cofundador 2:**\n- Arquitectura de producto, contratación técnica, cultura de ingeniería\n- Implementación de roadmap de producto, decisiones técnicas\n- Esperado 60+ horas/semana\n\n**Compromiso Mutuo:** Todos los cofundadores se comprometen a tiempo completo, no pueden tener otro empleo sin consentimiento escrito unánime.',
        },
        {
          heading: 'Asignación de Propiedad Intelectual',
          body: '**Toda la PI creada mientras está empleado pertenece a la empresa.** Esto incluye:\n- Código, diseños, documentación\n- Procesos de negocio, listas de clientes\n- Materiales de marketing, activos de marca\n- Invenciones y patentes\n\n**PI Preexistente:** Cofundadores enumeran cualquier PI preexistente en Anexo A. La empresa otorga una licencia sin regalías para que los cofundadores usen PI preexistente en el negocio.',
        },
        {
          heading: 'Resolución de Disputas y Cláusulas de Salida',
          body: '**Salida del Cofundador:**\n- Salida voluntaria: El vesting se detiene inmediatamente. Cofundador pierde todo el capital futuro. Ejercitable durante 90 días.\n- Terminación por causa: El vesting se detiene, sin indemnización, aviso de 30 días.\n- Terminación sin causa: 2 semanas de indemnización, el vesting continúa 3 meses adicionales.\n\n**Resolución de Bloqueo:** Si 2 cofundadores están bloqueados, la 3ª parte (si existe) o la junta del inversor rompe el empate.\n\n**No Competencia:** 12 meses de no competencia en el mismo mercado. 18 meses de no captación de empleados y clientes.',
        },
      ],
    },
  },

  // ═══ r69: Business Plan Template (Lean Format) ═══
  r69: {
    kind: 'template',
    content: {
      description: 'One-page Lean Business Plan: problem, solution, market, business model, and key milestones. Designed for rapid iteration and investor communication.',
      fields: ([
        { label: 'Company Name', placeholder: 'Your startup', type: 'text', required: true },
        { label: 'Problem in One Sentence', placeholder: 'e.g., "SaaS founders waste 20 hours/month on payroll"', type: 'text', required: true },
        { label: 'Solution in One Sentence', placeholder: 'e.g., "Automated multi-country payroll in 5 minutes"', type: 'text', required: true },
        { label: 'Target Market Size (TAM)', placeholder: 'e.g., $15B global SaaS market', type: 'text', required: true },
        { label: 'Customer Acquisition Cost (CAC)', placeholder: 'e.g., $500', type: 'text' },
        { label: 'Lifetime Value (LTV)', placeholder: 'e.g., $5000', type: 'text' },
      ] satisfies TemplateField[]),
      sections: [
        {
          heading: 'Problem',
          body: '**State the acute pain.** Not "companies want better X," but "companies waste $X/month on Y" or "Churn increases by X% when Z happens."',
        },
        {
          heading: 'Solution',
          body: '**Your unfair advantage.** Why can you solve this better/faster/cheaper? (e.g., "We built the only no-code platform with compliance-as-code for 150+ countries")',
        },
        {
          heading: 'Business Model',
          body: '**How you make money.** SaaS ($/month), usage-based, freemium, marketplace take-rate, professional services margin.\n\n**Unit Economics:** CAC $X, LTV $Y. Target LTV:CAC > 3:1 by Year 2.',
        },
        {
          heading: '12-Month Milestones',
          body: '**M3:** 100 signups, product-market fit signals\n**M6:** $50K MRR, 25% MoM growth\n**M12:** $150K MRR, first enterprise customer',
        },
      ],
    },
    contentEs: {
      description: 'Plan de Negocio Lean de Una Página: problema, solución, mercado, modelo de negocio e hitos clave. Diseñado para iteración rápida y comunicación de inversores.',
      fields: ([
        { label: 'Nombre de la Empresa', placeholder: 'Tu startup', type: 'text', required: true },
        { label: 'Problema en Una Frase', placeholder: 'Ej: "Fundadores de SaaS pierden 20 horas/mes en nómina"', type: 'text', required: true },
        { label: 'Solución en Una Frase', placeholder: 'Ej: "Nómina automatizada multicountry en 5 minutos"', type: 'text', required: true },
        { label: 'Tamaño del Mercado Objetivo', placeholder: 'Ej: Mercado SaaS global $15B', type: 'text', required: true },
        { label: 'Costo de Adquisición de Clientes', placeholder: 'Ej: $500', type: 'text' },
        { label: 'Valor de Vida del Cliente', placeholder: 'Ej: $5000', type: 'text' },
      ] satisfies TemplateField[]),
      sections: [
        {
          heading: 'Problema',
          body: '**Expresa el dolor agudo.** No "las empresas quieren mejor X," sino "las empresas pierden $X/mes en Y" o "La rotación aumenta X% cuando sucede Z."',
        },
        {
          heading: 'Solución',
          body: '**Tu ventaja injusta.** ¿Por qué puedes resolver esto mejor/más rápido/más barato? (Ej: "Somos la única plataforma sin código con cumplimiento como código para 150+ países")',
        },
        {
          heading: 'Modelo de Negocio',
          body: '**Cómo ganas dinero.** SaaS ($/mes), basado en uso, freemium, tarifa de mercado, margen de servicios profesionales.\n\n**Economía de Unidades:** CAC $X, LTV $Y. Objetivo LTV:CAC > 3:1 para Año 2.',
        },
        {
          heading: 'Hitos de 12 Meses',
          body: '**M3:** 100 registros, señales de ajuste producto-mercado\n**M6:** $50K MRR, crecimiento 25% MoM\n**M12:** $150K MRR, primer cliente empresarial',
        },
      ],
    },
  },


  // Phase 2 — Validation & Customer Discovery

  // ═══ r8: MVP Feature Prioritization Matrix ═══
  r8: {
    kind: 'spreadsheet',
    content: {
      description: 'Use RICE scoring (Reach, Impact, Confidence, Effort) to decide which features go in your MVP. Score 0-10 for each dimension.',
      columns: [
        { key: 'feature', label: 'Feature', type: 'text' },
        { key: 'reach', label: 'Reach (0-10)', type: 'number' },
        { key: 'impact', label: 'Impact per User (0-10)', type: 'number' },
        { key: 'confidence', label: 'Confidence (0-10)', type: 'number' },
        { key: 'effort', label: 'Effort (Weeks)', type: 'number' },
        { key: 'rice_score', label: 'RICE Score', type: 'formula', formula: '(reach * impact * confidence) / effort' },
      ],
      rows: [
        { feature: 'Core Product (Authentication, Dashboard)', reach: 10, impact: 10, confidence: 10, effort: 4, rice_score: 25 },
        { feature: 'Customer Integration #1 (Salesforce)', reach: 8, impact: 9, confidence: 8, effort: 3, rice_score: 19.2 },
        { feature: 'Analytics Dashboard', reach: 7, impact: 7, confidence: 8, effort: 2, rice_score: 19.6 },
        { feature: 'Advanced Reporting (PDF export)', reach: 4, impact: 6, confidence: 7, effort: 3, rice_score: 5.6 },
        { feature: 'Mobile App', reach: 3, impact: 5, confidence: 5, effort: 12, rice_score: 0.625 },
      ],
      formulas: { rice_score: '(reach * impact * confidence) / effort' },
    },
    contentEs: {
      description: 'Usa puntuación RICE (Alcance, Impacto, Confianza, Esfuerzo) para decidir qué características van en tu MVP. Puntúa 0-10 para cada dimensión.',
      columns: [
        { key: 'feature', label: 'Característica', type: 'text' },
        { key: 'reach', label: 'Alcance (0-10)', type: 'number' },
        { key: 'impact', label: 'Impacto por Usuario (0-10)', type: 'number' },
        { key: 'confidence', label: 'Confianza (0-10)', type: 'number' },
        { key: 'effort', label: 'Esfuerzo (Semanas)', type: 'number' },
        { key: 'rice_score', label: 'Puntuación RICE', type: 'formula', formula: '(alcance * impacto * confianza) / esfuerzo' },
      ],
      rows: [
        { feature: 'Producto Principal (Autenticación, Panel)', reach: 10, impact: 10, confidence: 10, effort: 4, rice_score: 25 },
        { feature: 'Integración de Cliente #1 (Salesforce)', reach: 8, impact: 9, confidence: 8, effort: 3, rice_score: 19.2 },
        { feature: 'Panel de Análisis', reach: 7, impact: 7, confidence: 8, effort: 2, rice_score: 19.6 },
        { feature: 'Reportes Avanzados (Exportar PDF)', reach: 4, impact: 6, confidence: 7, effort: 3, rice_score: 5.6 },
        { feature: 'Aplicación Móvil', reach: 3, impact: 5, confidence: 5, effort: 12, rice_score: 0.625 },
      ],
    },
  },

  // ═══ r9: Landing Page A/B Test Kit ═══
  r9: {
    kind: 'template',
    content: {
      description: '5 proven landing page variants with different copy frameworks, CTA placements, and social proof layouts. Test one variant per week with 1,000+ visitors each.',
      fields: [
        { label: 'Variant Name', placeholder: 'e.g., "Copy v1: Problem-Focused"', type: 'text', required: true },
        { label: 'Headline', placeholder: 'Main value prop in 6-8 words', type: 'text', required: true },
        { label: 'Subheadline', placeholder: 'Support the main claim', type: 'text', required: true },
        { label: 'CTA Button Text', placeholder: 'e.g., "Start Free Trial"', type: 'text', required: true },
        { label: 'CTA Placement', placeholder: 'Above fold / Mid-page / Below fold', type: 'select', options: ['Above Fold', 'Mid-Page', 'Below Fold', 'Sticky'] },
        { label: 'Social Proof Used', placeholder: 'e.g., testimonials, logos, metrics', type: 'textarea' },
      ],
      sections: [
        {
          heading: 'Variant 1: Problem-Focused',
          body: 'Lead with the pain. "Stop wasting 20 hours/week on [problem]." Show the cost (time, money, opportunity) clearly. Social proof: customer testimonials from similar profiles.',
        },
        {
          heading: 'Variant 2: Solution-Focused',
          body: 'Lead with the outcome. "Get [specific result] in [timeframe]." Show the solution in action (screenshot, video, demo). Social proof: metrics ("10,000+ founders love us")',
        },
        {
          heading: 'Variant 3: Urgency/FOMO',
          body: 'Lead with scarcity or limited offer. "Only 50 founders get early access at this price." Create urgency with countdown timer. Social proof: "Join 47 others who signed up today"',
        },
        {
          heading: 'Variant 4: Social Proof Heavy',
          body: 'Lead with logos and testimonials. Display 8-10 customer logos prominently. Feature 3-4 customer testimonials with photos and titles. Add metrics ("Used by startups in 40 countries")',
        },
        {
          heading: 'Testing & Winning',
          body: 'Run each variant for 7 days with 1,000+ visitors. Measure: Click-Through Rate (%), Conversion Rate (%), Cost Per Lead ($). Winner goes live; 2nd place becomes control for next test.',
        },
      ],
    },
    contentEs: {
      description: '5 variantes de página de destino comprobadas con diferentes marcos de copia, ubicaciones de CTA y diseños de prueba social. Prueba una variante por semana con 1,000+ visitantes cada una.',
      fields: [
        { label: 'Nombre de Variante', placeholder: 'Ej: "Copia v1: Enfocada en Problema"', type: 'text', required: true },
        { label: 'Encabezado', placeholder: 'Propuesta de valor principal en 6-8 palabras', type: 'text', required: true },
        { label: 'Subencabezado', placeholder: 'Apoyo a la afirmación principal', type: 'text', required: true },
        { label: 'Texto Botón CTA', placeholder: 'Ej: "Comenzar Prueba Gratuita"', type: 'text', required: true },
        { label: 'Ubicación CTA', placeholder: 'Arriba del pliegue / Mitad página / Abajo del pliegue', type: 'select', options: ['Arriba del Pliegue', 'Mitad de Página', 'Abajo del Pliegue', 'Pegajoso'] },
        { label: 'Prueba Social Utilizada', placeholder: 'Ej: testimonios, logos, métricas', type: 'textarea' },
      ],
      sections: [
        {
          heading: 'Variante 1: Enfocada en Problema',
          body: 'Comienza con el dolor. "Deja de desperdiciar 20 horas/semana en [problema]." Muestra el costo (tiempo, dinero, oportunidad) claramente. Prueba social: testimonios de clientes de perfiles similares.',
        },
        {
          heading: 'Variante 2: Enfocada en Solución',
          body: 'Comienza con el resultado. "Obtén [resultado específico] en [marco de tiempo]." Muestra la solución en acción (captura de pantalla, video, demostración). Prueba social: métricas ("10,000+ fundadores nos aman")',
        },
        {
          heading: 'Variante 3: Urgencia/FOMO',
          body: 'Comienza con escasez u oferta limitada. "Solo 50 fundadores obtienen acceso temprano a este precio." Crea urgencia con temporizador de cuenta regresiva. Prueba social: "Únete a 47 otros que se registraron hoy"',
        },
        {
          heading: 'Variante 4: Prueba Social Pesada',
          body: 'Comienza con logos y testimonios. Muestra 8-10 logos de clientes de forma destacada. Presenta 3-4 testimonios de clientes con fotos y títulos. Agrega métricas ("Usado por startups en 40 países")',
        },
        {
          heading: 'Pruebas y Ganadores',
          body: 'Ejecuta cada variante durante 7 días con 1,000+ visitantes. Mide: Tasa de Clics (%), Tasa de Conversión (%), Costo Por Generación de Leads ($). El ganador se pone en vivo; el 2do lugar se convierte en control para la próxima prueba.',
        },
      ],
    },
  },

  // ═══ r10: Lean Startup Experiment Tracker ═══
  r10: {
    kind: 'spreadsheet',
    content: {
      description: 'Build-Measure-Learn loop tracker: hypothesis templates, experiment logs, pivot/double-down frameworks. Track 1 validated assumption per week.',
      columns: [
        { key: 'week', label: 'Week', type: 'number' },
        { key: 'hypothesis', label: 'Hypothesis', type: 'text' },
        { key: 'experiment', label: 'How We\'ll Test It', type: 'text' },
        { key: 'metric', label: 'Success Metric', type: 'text' },
        { key: 'result', label: 'Result', type: 'text' },
        { key: 'decision', label: 'Pivot / Double Down', type: 'text' },
      ],
      rows: [
        { week: 1, hypothesis: 'Founders will pay $99/mo for automated payroll', experiment: 'Cold email 100 founders + landing page', metric: '5+ paid signups', result: '3 paid + 12 on waitlist', decision: 'Double Down' },
        { week: 2, hypothesis: 'Multi-country payroll is biggest pain', experiment: 'Interview 15 founders in 5 countries', metric: '70%+ cite multi-country complexity', result: '12/15 (80%) confirm', decision: 'Double Down' },
        { week: 3, hypothesis: 'Integrating with Stripe is table stakes', experiment: 'Ask 5 customers about Stripe integration', metric: 'Essential feature', result: '2/5 need it, 3 don\'t care', decision: 'Pivot' },
      ],
    },
    contentEs: {
      description: 'Rastreador del ciclo Construir-Medir-Aprender: plantillas de hipótesis, registros de experimentos, marcos de giro/duplicación. Rastrea 1 suposición validada por semana.',
      columns: [
        { key: 'week', label: 'Semana', type: 'number' },
        { key: 'hypothesis', label: 'Hipótesis', type: 'text' },
        { key: 'experiment', label: 'Cómo la Probaremos', type: 'text' },
        { key: 'metric', label: 'Métrica de Éxito', type: 'text' },
        { key: 'result', label: 'Resultado', type: 'text' },
        { key: 'decision', label: 'Girar / Duplicar', type: 'text' },
      ],
      rows: [
        { week: 1, hypothesis: 'Fundadores pagarán $99/mes por nómina automatizada', experiment: 'Email en frío a 100 fundadores + página de destino', metric: '5+ suscripciones pagas', result: '3 pagadas + 12 en lista de espera', decision: 'Duplicar' },
        { week: 2, hypothesis: 'Nómina multicountry es el mayor dolor', experiment: 'Entrevista 15 fundadores en 5 países', metric: '70%+ citan complejidad multicountry', result: '12/15 (80%) confirman', decision: 'Duplicar' },
        { week: 3, hypothesis: 'Integrar con Stripe es tabla de apuestas', experiment: 'Pregunta a 5 clientes sobre integración Stripe', metric: 'Característica esencial', result: '2/5 lo necesitan, 3 no lo necesitan', decision: 'Girar' },
      ],
    },
  },


  // Phase 3 — Go-to-Market & Growth

  // ═══ r12: SEO Content Strategy Guide ═══
  r12: {
    kind: 'ebook',
    content: {
      sections: [
        {
          heading: 'Module 1: SEO Fundamentals for Startups',
          body: 'SEO is the 18-month play. You won\'t get traffic in month 1, but by month 12, organic should be 40% of signup traffic. Google rewards depth, freshness, and authority. Start with keyword research: use Google Search Console, Semrush, Ahrefs to find "search intent" keywords (people looking for solutions, not just terms). Your target: keywords with 200-500 searches/month that you can realistically rank for (low domain authority competitors). Avoid head keywords like "project management" (impossible); find long-tail keywords like "project management for remote teams bootstrap companies" (possible). The 80/20 rule: 20% of your keywords drive 80% of traffic.',
        },
        {
          heading: 'Module 2: Content Cluster Strategy',
          body: 'Create a pillar page (2,000+ word comprehensive guide) and 10-15 supporting cluster content pieces that link back to the pillar. Example: Pillar "The Complete Guide to SaaS Pricing" → Clusters: "Freemium vs. Free Trial," "Usage-Based Pricing Models," "How to Calculate LTV," "Pricing Sensitivity Analysis," etc. Each cluster ranks for different keywords but supports the pillar\'s authority. Google\'s algorithm now favors topical authority over individual pages. Tools: Clearscope, Surfer SEO to optimize each piece for semantic keywords. Target 1 cluster per month.',
        },
        {
          heading: 'Module 3: Backlink Strategy for Bootstrapped Teams',
          body: 'Backlinks = votes. 1 link from a domain authority 50+ is worth 10 links from authority 20. Tactics: (1) Create data/original research ("We analyzed 1,000 SaaS companies"), then email journalists and bloggers. (2) Broken link building: find competitor pages with broken outbound links, create better content, pitch as replacement. (3) Resource pages: pitch your guides to roundup articles and listicles. (4) Founder interviews: get quoted by industry publications, linkable. (5) Comment on HackerNews, Indie Hackers with valuable thoughts, link in bio. Avoid: link buying, private blog networks, directory submissions. Focus on white-hat tactics.',
        },
        {
          heading: 'Module 4: Technical SEO Checklist',
          body: 'Crawlability: Submit sitemap to Search Console. Ensure robots.txt doesn\'t block Googlebot. Indexability: Check "Excluded" pages in Search Console—why? (canonical tags, noindex, blocking). Page Speed: Core Web Vitals matter. Target: LCP <2.5s, FID <100ms, CLS <0.1. Use Lighthouse, PageSpeed Insights. Mobile-first indexing: Google crawls mobile version first. Responsive design is mandatory. Structured data: Add schema.org markup for rich snippets (Author, Organization, Article, FAQSchema). Internal linking: strategic, contextual links to other pillar pages (not random). Fix orphan pages (no internal links) or delete them.',
        },
        {
          heading: 'Module 5: Content + Product Alignment',
          body: 'Your best SEO moat is using your product to create content. Example: if your product is "customer feedback platform," create guides based on your database ("500+ startup founders on what feature kills product adoption"). Your content becomes case study marketing. Measure: keyword rank, organic traffic, organic conversion rate, CAC of organic customers (usually 50-70% cheaper than paid). Track in Google Analytics 4 + Search Console. Update your top performers every 6 months to maintain rank.',
        },
      ],
    },
    contentEs: {
      sections: [
        {
          heading: 'Módulo 1: Fundamentos de SEO para Startups',
          body: 'SEO es el juego de 18 meses. No obtendrás tráfico en el mes 1, pero en el mes 12, el tráfico orgánico debería ser el 40% de registros. Google recompensa la profundidad, frescura y autoridad. Comienza con investigación de palabras clave: usa Google Search Console, Semrush, Ahrefs para encontrar palabras clave de "intención de búsqueda" (personas buscando soluciones, no solo términos). Tu objetivo: palabras clave con 200-500 búsquedas/mes que puedas clasificar realísticamente (competidores con baja autoridad de dominio). Evita palabras clave principales como "gestión de proyectos" (imposible); encuentra palabras clave de cola larga como "gestión de proyectos para equipos remotos startups bootstrapped" (posible). La regla 80/20: 20% de tus palabras clave impulsan 80% del tráfico.',
        },
        {
          heading: 'Módulo 2: Estrategia de Clúster de Contenido',
          body: 'Crea una página pilar (guía completa 2,000+ palabras) y 10-15 piezas de contenido de clúster que enlacen de vuelta a la página pilar. Ejemplo: Pilar "La Guía Completa de Precios SaaS" → Clústeres: "Freemium vs. Prueba Gratuita," "Modelos de Precios Basados en Uso," "Cómo Calcular LTV," "Análisis de Sensibilidad de Precios," etc. Cada clúster se clasifica para diferentes palabras clave pero apoya la autoridad del pilar. El algoritmo de Google ahora favorece la autoridad temática sobre páginas individuales. Herramientas: Clearscope, Surfer SEO para optimizar cada pieza para palabras clave semánticas. Objetivo: 1 clúster por mes.',
        },
        {
          heading: 'Módulo 3: Estrategia de Backlinks para Equipos Bootstrapped',
          body: 'Backlinks = votos. 1 enlace de autoridad de dominio 50+ vale 10 enlaces de autoridad 20. Tácticas: (1) Crea datos/investigación original ("Analizamos 1,000 empresas SaaS"), luego envía por correo a periodistas y blogueros. (2) Construcción de enlaces rotos: encuentra páginas de competidores con enlaces salientes rotos, crea contenido mejor, presenta como reemplazo. (3) Páginas de recursos: presenta tus guías a artículos de resumen y listas. (4) Entrevistas de fundadores: consigue ser citado por publicaciones de la industria, enlazable. (5) Comenta en HackerNews, Indie Hackers con pensamientos valiosos, enlaza en biografía. Evita: compra de enlaces, redes privadas de blogs, envíos de directorios. Enfócate en tácticas white-hat.',
        },
        {
          heading: 'Módulo 4: Lista de Verificación de SEO Técnico',
          body: 'Rastreabilidad: Envía mapa del sitio a Search Console. Asegúrate de que robots.txt no bloquee Googlebot. Indexabilidad: Verifica páginas "Excluidas" en Search Console—¿por qué? (etiquetas canónicas, noindex, bloqueo). Velocidad de Página: Core Web Vitals importan. Objetivo: LCP <2.5s, FID <100ms, CLS <0.1. Usa Lighthouse, PageSpeed Insights. Indexación mobile-first: Google rastrea primero la versión móvil. El diseño responsivo es obligatorio. Datos estructurados: Agrega marcado schema.org para fragmentos enriquecidos (Autor, Organización, Artículo, FAQSchema). Enlaces internos: estratégicos, enlaces contextuales a otras páginas pilar (no aleatorios). Corrige páginas huérfanas (sin enlaces internos) o elimínalas.',
        },
        {
          heading: 'Módulo 5: Alineación de Contenido + Producto',
          body: 'Tu mejor foso de SEO es usar tu producto para crear contenido. Ejemplo: si tu producto es "plataforma de comentarios de clientes," crea guías basadas en tu base de datos ("500+ fundadores en startups sobre qué característica mata la adopción de productos"). Tu contenido se convierte en marketing de casos de estudio. Mide: clasificación de palabras clave, tráfico orgánico, tasa de conversión orgánica, CAC de clientes orgánicos (generalmente 50-70% más barato que pagado). Rastrea en Google Analytics 4 + Search Console. Actualiza tus mejores desempeños cada 6 meses para mantener la clasificación.',
        },
      ],
    },
  },


  // ═══ r13: Social Media Content Calendar (30-Day) ═══
  r13: {
    kind: 'spreadsheet',
    content: {
      description: 'Pre-filled 30-day calendar with post ideas, optimal times, hashtag strategies for LinkedIn, Twitter, TikTok, Instagram.',
      columns: [
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'platform', label: 'Platform', type: 'text' },
        { key: 'idea', label: 'Post Idea', type: 'text' },
        { key: 'time', label: 'Optimal Time', type: 'text' },
        { key: 'hashtags', label: 'Hashtags', type: 'text' },
        { key: 'format', label: 'Format', type: 'text' },
      ],
      rows: [
        { date: '2026-01-01', platform: 'LinkedIn', idea: 'Founder story: "Bootstrapped to $1M ARR"', time: '8-9 AM', hashtags: '#Startup #Founder', format: 'Article' },
        { date: '2026-01-02', platform: 'Twitter', idea: 'Stat: "83% of founders mismanage payroll"', time: '12-1 PM', hashtags: '#SaaS', format: 'Text' },
        { date: '2026-01-03', platform: 'TikTok', idea: 'Day in life: startup founder morning routine', time: '6-7 PM', hashtags: '#StartupLife', format: 'Video' },
      ],
    },
    contentEs: {
      description: 'Calendario prefillado con ideas de publicaciones, tiempos óptimos y estrategias de hashtags para LinkedIn, Twitter, TikTok, Instagram.',
      columns: [
        { key: 'date', label: 'Fecha', type: 'date' },
        { key: 'platform', label: 'Plataforma', type: 'text' },
        { key: 'idea', label: 'Idea de Publicación', type: 'text' },
        { key: 'time', label: 'Hora Óptima', type: 'text' },
        { key: 'hashtags', label: 'Hashtags', type: 'text' },
        { key: 'format', label: 'Formato', type: 'text' },
      ],
      rows: [
        { date: '2026-01-01', platform: 'LinkedIn', idea: 'Historia del fundador: "Bootstraped a $1M ARR"', time: '8-9 AM', hashtags: '#Startup #Fundador', format: 'Artículo' },
        { date: '2026-01-02', platform: 'Twitter', idea: 'Estadística: "83% de fundadores manejan mal nómina"', time: '12-1 PM', hashtags: '#SaaS', format: 'Texto' },
        { date: '2026-01-03', platform: 'TikTok', idea: 'Un día en la vida: rutina matinal del fundador', time: '6-7 PM', hashtags: '#StartupLife', format: 'Video' },
      ],
    },
  },

  // ═══ r14: Cold Email Outreach Templates ═══
  r14: {
    kind: 'template',
    content: {
      description: '12 proven cold email templates for sales, partnerships, PR, and investor intros. Each template has 40%+ open rates and 15%+ reply rates.',
      fields: [
        { label: 'Template Type', placeholder: 'Sales / Partnership / PR / Investor', type: 'select', options: ['Sales', 'Partnership', 'PR', 'Investor'] },
        { label: 'Recipient Name', placeholder: 'Jane', type: 'text', required: true },
        { label: 'Company Name', placeholder: 'Acme Corp', type: 'text', required: true },
        { label: 'Personalization Detail', placeholder: 'e.g., "I saw your tweet about...", "Your company just hired..."', type: 'textarea' },
        { label: 'Your CTA', placeholder: 'e.g., "15-minute call this week?"', type: 'text' },
      ],
      sections: [
        {
          heading: 'Sales Cold Email Formula (40% open rate)',
          body: 'Subject: {{first_name}} - quick thought re: {{company_pain}}\n\nHi {{first_name}},\n\n{{Personalization: "I noticed X about your company"}}\n\n{{Insight: "Most companies like yours waste 20 hours/month on Y"}}\n\nWe help {{similar_company}} {{solve_outcome}} by {{mechanism}}. Result: {{metric}}.\n\n{{CTA: "Worth a quick call?"}} I can show you a 5-minute demo.\n\nThanks,\n{{Your name}}\n\nP.S. {{Social proof: "Currently used by 500+ founders"}}'
        },
        {
          heading: 'Partnership Cold Email (35% open rate)',
          body: 'Subject: Partnership idea: {{your_company}} + {{their_company}}\n\n"I think our audiences would love each other."\n\n{{Specific value}}: We help {{audience}} {{outcome}}. You help {{similar_audience}}.\n\n{{Concrete idea}}: "What if we created a co-branded resource on {{topic}} for {{shared_audience}}?"\n\n{{Why now}}: {{Trend or urgency}}\n\n{{CTA}}: "Open to exploring this?"\n\n{{Credibility}}: {{Recent win or metric}}'
        },
        {
          heading: 'Investor Cold Email (25% open rate)',
          body: 'Subject: Intro: {{your_company}} ({{short_descriptor}})\n\n{{Warm reference or relevant context}}\n\n{{Traction}}: {{Metric}} {{Timeline}}\n{{Market}}: {{Opportunity]] {{Total addressable}}\n{{Why now}}: {{Trend]]\n\n{{CTA}}: "15 minutes this week to discuss?"\n\n{{Attach}}: One-page executive summary (NOT 40-page deck)'
        },
      ],
    },
    contentEs: {
      description: '12 plantillas de correo frío comprobadas para ventas, asociaciones, relaciones públicas e introducciones de inversores. Cada plantilla tiene tasas de apertura del 40%+ y tasas de respuesta del 15%+.',
      fields: [
        { label: 'Tipo de Plantilla', placeholder: 'Ventas / Asociación / PR / Inversor', type: 'select', options: ['Ventas', 'Asociación', 'PR', 'Inversor'] },
        { label: 'Nombre del Destinatario', placeholder: 'Jane', type: 'text', required: true },
        { label: 'Nombre de la Empresa', placeholder: 'Acme Corp', type: 'text', required: true },
        { label: 'Detalle de Personalización', placeholder: 'Ej: "Vi tu tweet sobre...", "Tu empresa acaba de contratar..."', type: 'textarea' },
        { label: 'Tu CTA', placeholder: 'Ej: "¿Llamada de 15 minutos esta semana?"', type: 'text' },
      ],
      sections: [
        {
          heading: 'Fórmula de Correo Frío de Ventas (Tasa de apertura del 40%)',
          body: 'Asunto: {{nombre}} - pensamiento rápido re: {{problema_empresa}}\n\nHola {{nombre}},\n\n{{Personalización: "Noté X sobre tu empresa"}}\n\n{{Insight: "La mayoría de empresas como la tuya desperdician 20 horas/mes en Y"}}\n\nAyudamos a {{empresa_similar}} {{resolver_resultado}} mediante {{mecanismo}}. Resultado: {{métrica}}.\n\n{{CTA: "¿Vale una llamada rápida?"}} Puedo mostrarte una demostración de 5 minutos.\n\nGracias,\n{{Tu nombre}}\n\nP.S. {{Prueba social: "Actualmente utilizada por 500+ fundadores"}}'
        },
        {
          heading: 'Correo Frío de Asociación (Tasa de apertura del 35%)',
          body: 'Asunto: Idea de asociación: {{tu_empresa}} + {{su_empresa}}\n\n"Creo que tus audiencias se amarían entre sí."\n\n{{Valor específico}}: Ayudamos a {{audiencia}} {{resultado}}. Tú ayudas a {{audiencia_similar}}.\n\n{{Idea concreta}}: "¿Qué pasaría si creáramos un recurso de marca conjunta sobre {{tema}} para {{audiencia_compartida}}?"\n\n{{Por qué ahora}}: {{Tendencia o urgencia}}\n\n{{CTA}}: "¿Abierto a explorar esto?"\n\n{{Credibilidad}}: {{Victoria reciente o métrica}}'
        },
        {
          heading: 'Correo Frío de Inversor (Tasa de apertura del 25%)',
          body: 'Asunto: Introducción: {{tu_empresa}} ({{descriptor_corto}})\n\n{{Referencia cálida o contexto relevante}}\n\n{{Tracción}}: {{Métrica}} {{Línea de tiempo}}\n{{Mercado}}: {{Oportunidad}} {{Total direccionable}}\n{{Por qué ahora}}: {{Tendencia}}\n\n{{CTA}}: "¿15 minutos esta semana para discutir?"\n\n{{Adjuntar}}: Resumen ejecutivo de una página (NO baraja de 40 páginas)'
        },
      ],
    },
  },

  // ═══ r17: Content Repurposing Matrix ═══
  r17: {
    kind: 'infographic',
    content: {
      description: 'Turn one long-form piece (blog post, guide, ebook) into 12+ assets: social posts, newsletter, thread, carousel, short video, infographic, podcast, and more. Maximize 10x ROI on content creation.',
      sections: [
        {
          title: 'Starting Point: Long-Form Content',
          points: [
            'Blog post (2,000+ words)', 
            'Ebook section (500+ words)',
            'Founder interview transcript',
            'Detailed case study',
            'Research report',
            'Webinar recording'
          ],
          visual: '📄'
        },
        {
          title: 'Social Media (12+ posts)',
          points: [
            '5 Twitter threads (1 insight per thread)',
            '4 LinkedIn posts (quote, stat, insight, hook)',
            '2 TikTok scripts (short video ideas)',
            '1 Instagram carousel (5-slide summary)',
            'LinkedIn article (medium version)',
            'Twitter spaces pitch'
          ],
          visual: '📱'
        },
        {
          title: 'Email & Newsletter',
          points: [
            'Email newsletter segment (top takeaways)',
            'Lead magnet email sequence (5 emails)',
            'Cold email hook (borrowed from the content)',
            'Customer testimonial request (angle from content)',
            'Product update tie-in email'
          ],
          visual: '✉️'
        },
        {
          title: 'Multimedia Assets',
          points: [
            'Short video (60-90 seconds, TikTok/Instagram Reels)',
            'Podcast episode script / talking points',
            'Infographic (top 5 stats or framework)',
            'PDF download / checklist',
            'YouTube short (vertical format)',
            'LinkedIn document (native document)'
          ],
          visual: '🎬'
        },
        {
          title: 'Sales & Product',
          points: [
            'Case study (featured customer win)',
            'Sales pitch deck slide (problem + solution)',
            'Cold email template (hook + proof)',
            'Deck talking points (founder pitch)',
            'Product announcement (feature launch angle)',
            'Customer interview questions (for more content)'
          ],
          visual: '💼'
        },
      ],
      keyTakeaway: 'One 2,000-word blog post can generate 12-20 pieces of content across channels. Allocate 80% effort to the original piece, 20% to repurposing. ROI: 1 hour of writing → 20 hours of audience exposure.',
    },
    contentEs: {
      description: 'Convierte una pieza de formato largo (publicación de blog, guía, ebook) en 12+ activos: publicaciones sociales, boletín, hilo, carrusel, video corto, infografía, podcast y más. Maximiza 10x ROI en creación de contenido.',
      sections: [
        {
          title: 'Punto de Partida: Contenido de Formato Largo',
          points: [
            'Publicación de blog (2,000+ palabras)', 
            'Sección de ebook (500+ palabras)',
            'Transcripción de entrevista del fundador',
            'Caso de estudio detallado',
            'Informe de investigación',
            'Grabación de seminario web'
          ],
          visual: '📄'
        },
        {
          title: 'Redes Sociales (12+ publicaciones)',
          points: [
            '5 hilos de Twitter (1 insight por hilo)',
            '4 publicaciones de LinkedIn (cita, estadística, insight, gancho)',
            '2 scripts de TikTok (ideas de video corto)',
            '1 carrusel de Instagram (resumen de 5 diapositivas)',
            'Artículo de LinkedIn (versión media)',
            'Pitch de Twitter spaces'
          ],
          visual: '📱'
        },
        {
          title: 'Email y Boletín',
          points: [
            'Segmento de boletín por correo (conclusiones principales)',
            'Secuencia de correos de imán de generación de clientes potenciales (5 correos)',
            'Gancho de correo frío (tomado del contenido)',
            'Solicitud de testimonio del cliente (ángulo del contenido)',
            'Correo de vinculación de actualización de producto'
          ],
          visual: '✉️'
        },
        {
          title: 'Activos Multimedia',
          points: [
            'Video corto (60-90 segundos, TikTok/Instagram Reels)',
            'Script de episodio de podcast / puntos de conversación',
            'Infografía (top 5 estadísticas o marco)',
            'Descarga en PDF / lista de verificación',
            'YouTube short (formato vertical)',
            'Documento de LinkedIn (documento nativo)'
          ],
          visual: '🎬'
        },
        {
          title: 'Ventas y Producto',
          points: [
            'Caso de estudio (victoria del cliente destacado)',
            'Diapositiva de presentación de ventas (problema + solución)',
            'Plantilla de correo frío (gancho + prueba)',
            'Puntos de conversación de presentación (presentación del fundador)',
            'Anuncio de producto (ángulo de lanzamiento de características)',
            'Preguntas de entrevista de clientes (para más contenido)'
          ],
          visual: '💼'
        },
      ],
      keyTakeaway: 'Una publicación de blog de 2,000 palabras puede generar 12-20 piezas de contenido en canales. Asigna 80% de esfuerzo a la pieza original, 20% a la reutilización. ROI: 1 hora de escritura → 20 horas de exposición de audiencia.',
    },
  },

  // Continuing with more resources...
  // ═══ r18: Sales Funnel Dashboard ═══
  r18: {
    kind: 'spreadsheet',
    content: {
      description: 'Track leads through awareness→interest→decision→action. Monitor conversion rates, pipeline velocity, and win/loss analysis to optimize sales process.',
      columns: [
        { key: 'stage', label: 'Funnel Stage', type: 'text' },
        { key: 'count', label: 'Lead Count', type: 'number' },
        { key: 'conversionRate', label: 'Conversion Rate %', type: 'percent' },
        { key: 'avgDays', label: 'Avg Days in Stage', type: 'number' },
        { key: 'value', label: 'Total Pipeline Value', type: 'currency' },
      ],
      rows: [
        { stage: 'Awareness (Website Visitors)', count: 5000, conversionRate: 3, avgDays: 1, value: 0 },
        { stage: 'Interest (Email Signups)', count: 150, conversionRate: 20, avgDays: 3, value: 0 },
        { stage: 'Decision (Demo Booked)', count: 30, conversionRate: 50, avgDays: 7, value: 150000 },
        { stage: 'Action (Proposal Sent)', count: 15, conversionRate: 60, avgDays: 14, value: 90000 },
        { stage: 'Closed Won', count: 9, conversionRate: 100, avgDays: 30, value: 54000 },
      ],
    },
    contentEs: {
      description: 'Rastrear leads a través de conciencia→interés→decisión→acción. Monitorear tasas de conversión, velocidad de pipeline y análisis de ganancias/pérdidas para optimizar el proceso de ventas.',
      columns: [
        { key: 'stage', label: 'Etapa del Embudo', type: 'text' },
        { key: 'count', label: 'Número de Leads', type: 'number' },
        { key: 'conversionRate', label: 'Tasa de Conversión %', type: 'percent' },
        { key: 'avgDays', label: 'Promedio de Días en Etapa', type: 'number' },
        { key: 'value', label: 'Valor Total del Pipeline', type: 'currency' },
      ],
      rows: [
        { stage: 'Conciencia (Visitantes del Sitio Web)', count: 5000, conversionRate: 3, avgDays: 1, value: 0 },
        { stage: 'Interés (Registros de Email)', count: 150, conversionRate: 20, avgDays: 3, value: 0 },
        { stage: 'Decisión (Demostración Reservada)', count: 30, conversionRate: 50, avgDays: 7, value: 150000 },
        { stage: 'Acción (Propuesta Enviada)', count: 15, conversionRate: 60, avgDays: 14, value: 90000 },
        { stage: 'Cerrado Ganado', count: 9, conversionRate: 100, avgDays: 30, value: 54000 },
      ],
    },
  },


  // ═══ r22: Pricing Strategy Decision Tree ═══
  r22: {
    kind: 'infographic',
    content: {
      description: 'Freemium vs trial vs usage-based vs flat-rate pricing, based on ACV and customer segment. Visual decision tree to choose the right model.',
      sections: [
        {
          title: 'Are your customers B2B or B2C?',
          points: [
            'B2B (businesses paying) → Consider: Freemium, Free Trial, Usage-Based',
            'B2C (individual consumers) → Consider: Freemium, Free Trial, Flat-Rate',
            'B2B2C (reseller model) → Consider: Usage-Based or Revenue Share'
          ],
          visual: '🏢'
        },
        {
          title: 'What\'s your Average Contract Value (ACV)?',
          points: [
            'ACV <$500/year → Freemium or Free Trial (low sales cost)',
            'ACV $500-$5K/year → Free Trial or Flat-Rate (sales cost justified)',
            'ACV $5K-$50K/year → Flat-Rate or Enterprise (high-touch sales)',
            'ACV >$50K/year → Enterprise/Custom (direct sales required)'
          ],
          visual: '💰'
        },
        {
          title: 'Freemium (Free forever + Premium)',
          points: [
            'Best for: Low-cost B2B SaaS, viral potential needed',
            'Examples: Slack (free tier), Notion (free tier), Canva',
            'Pros: Huge user base, viral growth, time to value',
            'Cons: Low conversion rates (1-5%), heavy CAC, churn risk'
          ],
          visual: '✅'
        },
        {
          title: 'Free Trial (14-30 day)',
          points: [
            'Best for: $500-$5K ACV, clear value in weeks',
            'Examples: Stripe (API), Calendly, Loom',
            'Pros: Faster conversion than freemium (10-20%), eliminates risk',
            'Cons: Requires credit card upfront, support load during trial'
          ],
          visual: '✅'
        },
        {
          title: 'Usage-Based (Pay for what you use)',
          points: [
            'Best for: Unpredictable usage, API/infrastructure businesses',
            'Examples: Stripe (per-transaction), AWS (compute hours), Twilio',
            'Pros: Aligns price with value, scales with customer success',
            'Cons: Unpredictable revenue, customer sticker shock possible'
          ],
          visual: '✅'
        },
      ],
      keyTakeaway: 'Start with Free Trial for B2B SaaS ($500-$5K ACV). If you\'re below $500 ACV and growth is priority, consider Freemium. Don\'t mix models—pick one, test 3 months, measure conversion rate. Target: 5-15% trial→paid conversion.',
    },
    contentEs: {
      description: 'Freemium vs prueba vs basado en uso vs tarifa plana, basado en ACV y segmento de cliente. Árbol de decisión visual para elegir el modelo correcto.',
      sections: [
        {
          title: '¿Tus clientes son B2B o B2C?',
          points: [
            'B2B (negocios que pagan) → Considera: Freemium, Prueba Gratuita, Basado en Uso',
            'B2C (consumidores individuales) → Considera: Freemium, Prueba Gratuita, Tarifa Plana',
            'B2B2C (modelo revendedor) → Considera: Basado en Uso o Participación de Ingresos'
          ],
          visual: '🏢'
        },
        {
          title: '¿Cuál es tu Valor Promedio de Contrato (ACV)?',
          points: [
            'ACV <$500/año → Freemium o Prueba Gratuita (costo de ventas bajo)',
            'ACV $500-$5K/año → Prueba Gratuita o Tarifa Plana (costo de ventas justificado)',
            'ACV $5K-$50K/año → Tarifa Plana o Empresarial (ventas de alto contacto)',
            'ACV >$50K/año → Empresarial/Personalizado (se requiere venta directa)'
          ],
          visual: '💰'
        },
        {
          title: 'Freemium (Gratuito para siempre + Premium)',
          points: [
            'Mejor para: SaaS B2B de bajo costo, potencial viral necesario',
            'Ejemplos: Slack (nivel gratuito), Notion (nivel gratuito), Canva',
            'Pros: Enorme base de usuarios, crecimiento viral, tiempo para valor',
            'Contras: Tasas de conversión bajas (1-5%), CAC alto, riesgo de rotación'
          ],
          visual: '✅'
        },
        {
          title: 'Prueba Gratuita (14-30 días)',
          points: [
            'Mejor para: $500-$5K ACV, valor claro en semanas',
            'Ejemplos: Stripe (API), Calendly, Loom',
            'Pros: Conversión más rápida que freemium (10-20%), elimina riesgo',
            'Contras: Requiere tarjeta de crédito por adelantado, carga de soporte durante prueba'
          ],
          visual: '✅'
        },
        {
          title: 'Basado en Uso (Paga lo que usas)',
          points: [
            'Mejor para: Uso impredecible, negocios de API/infraestructura',
            'Ejemplos: Stripe (por transacción), AWS (horas de cómputo), Twilio',
            'Pros: Alinea precio con valor, se escala con éxito del cliente',
            'Contras: Ingresos impredecibles, posible shock de precio del cliente'
          ],
          visual: '✅'
        },
      ],
      keyTakeaway: 'Comienza con Prueba Gratuita para B2B SaaS ($500-$5K ACV). Si está por debajo de $500 ACV y el crecimiento es prioridad, considere Freemium. No mezcles modelos—elige uno, prueba 3 meses, mide la tasa de conversión. Objetivo: conversión de 5-15% de prueba a pagada.',
    },
  },

  // ═══ r23: Product Roadmap Framework ═══
  r23: {
    kind: 'spreadsheet',
    content: {
      description: 'Product roadmap with RICE prioritization, OKR tracking, and Now-Next-Later format. Communicate priorities to team and stakeholders.',
      columns: [
        { key: 'feature', label: 'Feature/Initiative', type: 'text' },
        { key: 'timeframe', label: 'Timeframe (Now/Next/Later)', type: 'text' },
        { key: 'reason', label: 'Why This Matters', type: 'text' },
        { key: 'quarter', label: 'Target Quarter', type: 'text' },
        { key: 'okr', label: 'Linked OKR', type: 'text' },
      ],
      rows: [
        { feature: 'Core Product (Auth, Dashboard, API)', timeframe: 'Now', reason: 'MVP launchability', quarter: 'Q1', okr: 'Launch with 10 beta customers' },
        { feature: 'Stripe Integration', timeframe: 'Now', reason: 'Revenue realization', quarter: 'Q1', okr: 'First 5 paying customers' },
        { feature: 'Multi-currency Support', timeframe: 'Next', reason: 'Customer requests, expansion', quarter: 'Q2', okr: 'Enter 3 new international markets' },
        { feature: 'Advanced Analytics/Reporting', timeframe: 'Next', reason: 'Enterprise differentiation', quarter: 'Q2', okr: 'Sell first $50K contract' },
        { feature: 'Mobile App', timeframe: 'Later', reason: 'Nice-to-have, not critical', quarter: 'Q4', okr: 'Increase DAU by 40%' },
      ],
    },
    contentEs: {
      description: 'Hoja de ruta de producto con priorización RICE, seguimiento de OKR y formato Ahora-Siguiente-Después. Comunica prioridades al equipo y a las partes interesadas.',
      columns: [
        { key: 'feature', label: 'Característica/Iniciativa', type: 'text' },
        { key: 'timeframe', label: 'Marco de Tiempo (Ahora/Siguiente/Después)', type: 'text' },
        { key: 'reason', label: 'Por Qué Importa', type: 'text' },
        { key: 'quarter', label: 'Trimestre Objetivo', type: 'text' },
        { key: 'okr', label: 'OKR Vinculado', type: 'text' },
      ],
      rows: [
        { feature: 'Producto Principal (Autenticación, Panel, API)', timeframe: 'Ahora', reason: 'Capacidad de lanzamiento de MVP', quarter: 'T1', okr: 'Lanzar con 10 clientes beta' },
        { feature: 'Integración Stripe', timeframe: 'Ahora', reason: 'Realización de ingresos', quarter: 'T1', okr: 'Primeros 5 clientes pagos' },
        { feature: 'Soporte Multimoneda', timeframe: 'Siguiente', reason: 'Solicitudes de clientes, expansión', quarter: 'T2', okr: 'Entrar en 3 nuevos mercados internacionales' },
        { feature: 'Análisis Avanzado/Informes', timeframe: 'Siguiente', reason: 'Diferenciación empresarial', quarter: 'T2', okr: 'Vender primer contrato de $50K' },
        { feature: 'Aplicación Móvil', timeframe: 'Después', reason: 'Excelente pero no crítico', quarter: 'T4', okr: 'Aumentar DAU en 40%' },
      ],
    },
  },

  // ═══ r24: Tech Stack Decision Matrix ═══
  r24: {
    kind: 'spreadsheet',
    content: {
      description: 'Compare frameworks, hosting, databases, third-party tools by cost, scalability, hiring availability, and maintenance burden.',
      columns: [
        { key: 'category', label: 'Category', type: 'text' },
        { key: 'option', label: 'Technology', type: 'text' },
        { key: 'cost', label: 'Monthly Cost', type: 'currency' },
        { key: 'scalability', label: 'Scalability (1-10)', type: 'number' },
        { key: 'hiring', label: 'Dev Availability', type: 'text' },
        { key: 'maintenance', label: 'Maintenance Burden', type: 'text' },
      ],
      rows: [
        { category: 'Backend', option: 'Node.js + Express', cost: 0, scalability: 7, hiring: 'High', maintenance: 'Moderate' },
        { category: 'Backend', option: 'Python + Django', cost: 0, scalability: 8, hiring: 'High', maintenance: 'Moderate' },
        { category: 'Backend', option: 'Go', cost: 0, scalability: 10, hiring: 'Medium', maintenance: 'Low' },
        { category: 'Database', option: 'PostgreSQL', cost: 100, scalability: 8, hiring: 'High', maintenance: 'Moderate' },
        { category: 'Database', option: 'MongoDB', cost: 150, scalability: 9, hiring: 'High', maintenance: 'Moderate' },
        { category: 'Hosting', option: 'Heroku', cost: 1000, scalability: 7, hiring: 'N/A', maintenance: 'Low' },
        { category: 'Hosting', option: 'AWS', cost: 500, scalability: 10, hiring: 'N/A', maintenance: 'High' },
        { category: 'Hosting', option: 'Railway', cost: 300, scalability: 8, hiring: 'N/A', maintenance: 'Low' },
      ],
    },
    contentEs: {
      description: 'Compare marcos, alojamiento, bases de datos, herramientas de terceros por costo, escalabilidad, disponibilidad de contratación y carga de mantenimiento.',
      columns: [
        { key: 'category', label: 'Categoría', type: 'text' },
        { key: 'option', label: 'Tecnología', type: 'text' },
        { key: 'cost', label: 'Costo Mensual', type: 'currency' },
        { key: 'scalability', label: 'Escalabilidad (1-10)', type: 'number' },
        { key: 'hiring', label: 'Disponibilidad de Desarrollo', type: 'text' },
        { key: 'maintenance', label: 'Carga de Mantenimiento', type: 'text' },
      ],
      rows: [
        { category: 'Backend', option: 'Node.js + Express', cost: 0, scalability: 7, hiring: 'Alta', maintenance: 'Moderada' },
        { category: 'Backend', option: 'Python + Django', cost: 0, scalability: 8, hiring: 'Alta', maintenance: 'Moderada' },
        { category: 'Backend', option: 'Go', cost: 0, scalability: 10, hiring: 'Media', maintenance: 'Baja' },
        { category: 'Base de Datos', option: 'PostgreSQL', cost: 100, scalability: 8, hiring: 'Alta', maintenance: 'Moderada' },
        { category: 'Base de Datos', option: 'MongoDB', cost: 150, scalability: 9, hiring: 'Alta', maintenance: 'Moderada' },
        { category: 'Alojamiento', option: 'Heroku', cost: 1000, scalability: 7, hiring: 'N/A', maintenance: 'Baja' },
        { category: 'Alojamiento', option: 'AWS', cost: 500, scalability: 10, hiring: 'N/A', maintenance: 'Alta' },
        { category: 'Alojamiento', option: 'Railway', cost: 300, scalability: 8, hiring: 'N/A', maintenance: 'Baja' },
      ],
    },
  },


  // ═══ r25: AI Tools for Founders — 2026 Edition ═══
  r25: {
    kind: 'infographic',
    content: {
      description: 'One-page visual map of AI tools founders use: copywriting, design, coding, customer support, data analysis. Updated for 2026.',
      sections: [
        {
          title: 'Copywriting & Content',
          points: [
            'ChatGPT (best for brainstorming, frameworks)',
            'Claude (best for long-form, reasoning)',
            'Copy.ai / Jasper (specialized for marketing copy)',
            'Perplexity (AI search + writing)',
            'Typical cost: $20/month'
          ],
          visual: '✍️'
        },
        {
          title: 'Design & Visual',
          points: [
            'Midjourney / DALL-E 3 (AI image generation)',
            'Figma + AI features (layout + design)',
            'Canva (templates + AI assist)',
            'Beautiful.ai (instant presentation design)',
            'Typical cost: $20-50/month'
          ],
          visual: '🎨'
        },
        {
          title: 'Coding & Development',
          points: [
            'GitHub Copilot (code completion, $10/month)',
            'Claude (code generation, reasoning)',
            'v0.dev (Vercel—UI generation)',
            'Cursor (AI-first code editor)',
            'Typical cost: $10-30/month'
          ],
          visual: '💻'
        },
        {
          title: 'Customer Support',
          points: [
            'ChatGPT + Zapier (route queries)',
            'Intercom AI (customer message summaries)',
            'Help Scout (AI ticket summaries)',
            'Zendesk AI (resolution suggestions)',
            'Typical cost: Built-in or $100+/month'
          ],
          visual: '🎧'
        },
        {
          title: 'Data & Analytics',
          points: [
            'ChatGPT + data upload (interpret CSVs)',
            'Mixpanel (AI cohort insights)',
            'Metabase + AI (auto-generate queries)',
            'Mode Analytics (SQL + AI)',
            'Typical cost: Built-in or $500+/month'
          ],
          visual: '📊'
        },
      ],
      keyTakeaway: 'Total AI stack for a founder: ~$100/month gets you copywriting, design, coding, and support. These tools are productivity multipliers, not replacements. Focus on areas with 3-5 hour/week time sinks.',
    },
    contentEs: {
      description: 'Mapa visual de una página de herramientas de IA que usan los fundadores: escritura, diseño, codificación, soporte al cliente, análisis de datos. Actualizado para 2026.',
      sections: [
        {
          title: 'Escritura y Contenido',
          points: [
            'ChatGPT (mejor para lluvia de ideas, marcos)',
            'Claude (mejor para largo aliento, razonamiento)',
            'Copy.ai / Jasper (especializado en copia de marketing)',
            'Perplexity (búsqueda IA + escritura)',
            'Costo típico: $20/mes'
          ],
          visual: '✍️'
        },
        {
          title: 'Diseño y Visual',
          points: [
            'Midjourney / DALL-E 3 (generación de imagen IA)',
            'Figma + características IA (diseño + maquetación)',
            'Canva (plantillas + asistencia IA)',
            'Beautiful.ai (diseño de presentación instantáneo)',
            'Costo típico: $20-50/mes'
          ],
          visual: '🎨'
        },
        {
          title: 'Codificación y Desarrollo',
          points: [
            'GitHub Copilot (finalización de código, $10/mes)',
            'Claude (generación de código, razonamiento)',
            'v0.dev (Vercel—generación de interfaz de usuario)',
            'Cursor (editor de código primero en IA)',
            'Costo típico: $10-30/mes'
          ],
          visual: '💻'
        },
        {
          title: 'Servicio al Cliente',
          points: [
            'ChatGPT + Zapier (consultas de ruta)',
            'Intercom AI (resúmenes de mensajes de cliente)',
            'Help Scout (resúmenes de tickets IA)',
            'Zendesk AI (sugerencias de resolución)',
            'Costo típico: Integrado o $100+/mes'
          ],
          visual: '🎧'
        },
        {
          title: 'Datos y Análisis',
          points: [
            'ChatGPT + carga de datos (interpretar CSVs)',
            'Mixpanel (perspectivas de cohorte IA)',
            'Metabase + IA (generar consultas automáticamente)',
            'Mode Analytics (SQL + IA)',
            'Costo típico: Integrado o $500+/mes'
          ],
          visual: '📊'
        },
      ],
      keyTakeaway: 'Stack de IA total para un fundador: ~$100/mes te consigue escritura, diseño, codificación y soporte. Estas herramientas son multiplicadores de productividad, no reemplazos. Enfócate en áreas con 3-5 horas/semana de sumideros de tiempo.',
    },
  },

  // ═══ r26: User Story Mapping Template ═══
  r26: {
    kind: 'template',
    content: {
      description: 'Map user journeys from discovery through advocacy using the story mapping technique. Identify release slices, walking skeleton, and critical path.',
      fields: [
        { label: 'User Persona', placeholder: 'e.g., "Sarah, the Startup Founder"', type: 'text', required: true },
        { label: 'Primary Goal', placeholder: 'What does this user want to achieve?', type: 'text', required: true },
        { label: 'Discovery Stage', placeholder: 'How do they first learn about you?', type: 'textarea' },
        { label: 'Activation Stage', placeholder: 'How do they get started?', type: 'textarea' },
        { label: 'Success/Aha Stage', placeholder: 'When do they experience value?', type: 'textarea' },
      ],
      sections: [
        {
          heading: 'Story Mapping Overview',
          body: 'User story mapping breaks a complex user journey into small, prioritized stories. Horizontal axis = time/sequence. Vertical axis = priority (high→low). Build the "walking skeleton" first (minimum viable flow), then add "releases" (slices of functionality).',
        },
        {
          heading: 'Building Your Backbone',
          body: '**Backbone = main steps a user takes to achieve their goal**\n1. Discovery ("Hear about product")\n2. Signup ("Create account")\n3. Onboarding ("Set up first thing")\n4. First Success ("Achieve first outcome")\n5. Retention ("Come back")\n6. Advocacy ("Tell a friend")',
        },
        {
          heading: 'Walking Skeleton (MVP)',
          body: 'Vertical slice under each backbone step with only essential stories:\n- Discovery: Search result, landing page\n- Signup: Email auth, password\n- Onboarding: Kick-off wizard (2-minute setup)\n- First Success: Use core feature once\n- Retention: Email reminder in 3 days\n- Advocacy: Share button\n\nBuild this first (4-8 weeks). Test product-market fit.',
        },
        {
          heading: 'Release Planning',
          body: '**Release 1 (MVP):** Walking skeleton features\n**Release 2:** Delight layer (notifications, customization)\n**Release 3:** Power user features (integrations, workflows)\n**Release 4:** Enterprise (audit logs, SSO, advanced permissions)',
        },
      ],
    },
    contentEs: {
      description: 'Mapea viajes de usuario desde descubrimiento a través de defensa usando la técnica de mapeo de historias. Identifica slices de lanzamiento, esqueleto caminante y ruta crítica.',
      fields: [
        { label: 'Persona del Usuario', placeholder: 'Ej: "Sarah, la Fundadora Startup"', type: 'text', required: true },
        { label: 'Objetivo Principal', placeholder: '¿Qué quiere lograr este usuario?', type: 'text', required: true },
        { label: 'Etapa de Descubrimiento', placeholder: '¿Cómo se enteran primero de ti?', type: 'textarea' },
        { label: 'Etapa de Activación', placeholder: '¿Cómo comienzan?', type: 'textarea' },
        { label: 'Etapa de Éxito/Aha', placeholder: '¿Cuándo experimentan valor?', type: 'textarea' },
      ],
      sections: [
        {
          heading: 'Descripción General del Mapeo de Historias',
          body: 'El mapeo de historias de usuario desglosa un viaje de usuario complejo en historias pequeñas y priorizadas. Eje horizontal = tiempo/secuencia. Eje vertical = prioridad (alto→bajo). Construye el "esqueleto caminante" primero (flujo viable mínimo), luego agrega "lanzamientos" (porciones de funcionalidad).',
        },
        {
          heading: 'Construcción de Tu Columna Vertebral',
          body: '**Columna vertebral = pasos principales que toma un usuario para lograr su objetivo**\n1. Descubrimiento ("Escuchar sobre producto")\n2. Registro ("Crear cuenta")\n3. Incorporación ("Configurar primer cosa")\n4. Primer Éxito ("Lograr primer resultado")\n5. Retención ("Volver")\n6. Defensa ("Decirle a un amigo")',
        },
        {
          heading: 'Esqueleto Caminante (MVP)',
          body: 'Porción vertical bajo cada paso de columna vertebral con solo historias esenciales:\n- Descubrimiento: Resultado de búsqueda, página de destino\n- Registro: Auth de correo, contraseña\n- Incorporación: Asistente de inicio de sesión (configuración de 2 minutos)\n- Primer Éxito: Usar característica principal una vez\n- Retención: Recordatorio de correo en 3 días\n- Defensa: Botón de compartir\n\nConstruye esto primero (4-8 semanas). Prueba el ajuste producto-mercado.',
        },
        {
          heading: 'Planificación de Lanzamientos',
          body: '**Lanzamiento 1 (MVP):** Características del esqueleto caminante\n**Lanzamiento 2:** Capa de deleite (notificaciones, personalización)\n**Lanzamiento 3:** Características de usuarios avanzados (integraciones, flujos de trabajo)\n**Lanzamiento 4:** Empresarial (registros de auditoría, SSO, permisos avanzados)',
        },
      ],
    },
  },

  // ═══ r27: No-Code / Low-Code Stack Guide ═══
  r27: {
    kind: 'guide',
    content: {
      sections: [
        {
          heading: 'Introduction: MVPs Without Engineers',
          body: 'You don\'t need to code to validate a business idea in 2026. No-code tools like Bubble, Webflow, Airtable, and Zapier let non-technical founders build functional products in days, not months. Cost: $200-500/month for a fully featured MVP (vs $50K+/month for engineers). Timeline: 2-4 weeks from idea to live product. Trade-off: No-code is slower at scale and has limitations beyond a certain user count (typically 10K+ users). But for MVP validation? Unbeatable.\n\nNo-code stack for SaaS: Bubble (backend/database) + Webflow (landing page) + Zapier (integrations) + Airtable (data management) + Stripe (payments).',
        },
        {
          heading: 'Core No-Code Platforms',
          body: '**Bubble (Full-stack app builder)**\n- Use for: Complete web app with database, workflows, API\n- Cost: $29/month (dev) → $265/month (production)\n- Learning curve: Moderate (2-4 weeks to comfortable)\n- Limitations: Performance slows >100K records in database. No mobile app.\n- Best for: CRUD apps, marketplaces, SaaS dashboards\n\n**Webflow (Designed websites)**\n- Use for: Marketing sites, landing pages, CMS-based content sites\n- Cost: $14/month (basic) → $99+/month (CMS with dynamic content)\n- Learning curve: Easy for designers, medium for non-designers\n- Limitations: Not suitable for complex app logic (use Bubble instead)\n- Best for: Landing pages, content marketing sites, portfolio sites\n\n**Airtable (Database + interface layer)**\n- Use for: Data management, simple dashboards, business logic without code\n- Cost: $10/month (pro) → $20/month (business)\n- Learning curve: Very easy (1 week)\n- Limitations: Not suitable as user-facing app (Bubble is better), limited customization\n- Best for: Internal tools, data collection, team wikis',
        },
        {
          heading: 'Integration & Automation Layer',
          body: '**Zapier (Connect 1000+ apps)**\n- Use for: Automate workflows between Bubble, Stripe, email, Slack, Google Sheets\n- Cost: $19/month (100 tasks) → $99+/month (unlimited)\n- Example: When customer pays via Stripe → Create record in Airtable → Send email via SendGrid\n\n**Make (visual workflow automation)**\n- Use for: Complex multi-step automations\n- Cost: $9.99/month (unlimited scenarios)\n- Better than Zapier for: Complex logic trees, error handling\n\n**n8n (Self-hosted automation)**\n- Use for: Privacy-critical workflows, complex automations\n- Cost: Free (self-hosted) → $50/month (cloud)\n- Best for: Handling sensitive customer data',
        },
        {
          heading: 'Payment Processing',
          body: '**Stripe (Recommended)**\n- Supports: Subscriptions, one-time payments, usage-based billing\n- Cost: 2.9% + $0.30 per transaction\n- Integrates with: Bubble (native), Zapier, Airtable (via Zapier)\n\n**Stripe vs Paddle vs Gumroad:**\n- Stripe: Most flexible, lowest fees (2.9%), needs setup\n- Paddle: All-in (handles taxes, compliance), higher fees (5%+)\n- Gumroad: Easiest for digital products, highest fees (10%)\n\nStart with Stripe for credibility and cost.',
        },
        {
          heading: 'Real No-Code MVP Examples',
          body: '**Example 1: Customer feedback SaaS**\n- Frontend (user dashboard): Bubble\n- Backend (data storage): Bubble database\n- Forms (feedback collection): Typeform → Zapier → Airtable\n- Payments: Stripe via Bubble\n- Notifications: Slack via Zapier\n- Timeline: 3 weeks\n- Cost: $80/month (+ Stripe fees)\n\n**Example 2: Marketplace**\n- Seller onboarding: Bubble (form + photo upload)\n- Buyer storefront: Webflow (content) + Bubble (search, cart)\n- Payment splitting: Stripe payouts via Zapier\n- Notifications: SendGrid + Zapier\n- Analytics: Google Sheets + Zapier (log each transaction)\n- Timeline: 4 weeks\n- Cost: $120/month (+ Stripe)\n\n**When to switch from no-code to code?**\n- User base >10K and growing 20%+ monthly\n- Custom integrations that Zapier can\'t handle\n- Performance issues (loading >3 seconds)\n- Needing a mobile app\n- Specific security requirements',
        },
      ],
    },
    contentEs: {
      sections: [
        {
          heading: 'Introducción: MVPs Sin Ingenieros',
          body: 'No necesitas código para validar una idea de negocio en 2026. Las herramientas sin código como Bubble, Webflow, Airtable y Zapier permiten a fundadores no técnicos construir productos funcionales en días, no meses. Costo: $200-500/mes para un MVP completamente preparado (vs $50K+/mes para ingenieros). Línea de tiempo: 2-4 semanas de idea a producto activo. Compensación: Sin código es más lento a escala y tiene limitaciones más allá de un cierto número de usuarios (típicamente 10K+ usuarios). ¿Pero para validación de MVP? Inmejorable.\n\nStack sin código para SaaS: Bubble (backend/base de datos) + Webflow (página de destino) + Zapier (integraciones) + Airtable (gestión de datos) + Stripe (pagos).',
        },
        {
          heading: 'Plataformas Principales Sin Código',
          body: '**Bubble (Constructor de aplicaciones completas)**\n- Úsalo para: Aplicación web completa con base de datos, flujos de trabajo, API\n- Costo: $29/mes (desarrollo) → $265/mes (producción)\n- Curva de aprendizaje: Moderada (2-4 semanas para estar cómodo)\n- Limitaciones: El rendimiento se ralentiza >100K registros en base de datos. Sin aplicación móvil.\n- Mejor para: Aplicaciones CRUD, mercados, paneles de control SaaS\n\n**Webflow (Sitios web diseñados)**\n- Úsalo para: Sitios de marketing, páginas de destino, sitios de contenido basados en CMS\n- Costo: $14/mes (básico) → $99+/mes (CMS con contenido dinámico)\n- Curva de aprendizaje: Fácil para diseñadores, media para no diseñadores\n- Limitaciones: No es adecuado para lógica de aplicación compleja (usa Bubble en su lugar)\n- Mejor para: Páginas de destino, sitios de marketing de contenido, sitios de portafolio\n\n**Airtable (Base de datos + capa de interfaz)**\n- Úsalo para: Gestión de datos, paneles simples, lógica empresarial sin código\n- Costo: $10/mes (pro) → $20/mes (negocio)\n- Curva de aprendizaje: Muy fácil (1 semana)\n- Limitaciones: No es adecuado como aplicación orientada al usuario (Bubble es mejor), personalización limitada\n- Mejor para: Herramientas internas, recopilación de datos, wikis de equipo',
        },
        {
          heading: 'Capa de Integración y Automatización',
          body: '**Zapier (Conectar 1000+ aplicaciones)**\n- Úsalo para: Automatizar flujos de trabajo entre Bubble, Stripe, correo electrónico, Slack, Google Sheets\n- Costo: $19/mes (100 tareas) → $99+/mes (ilimitado)\n- Ejemplo: Cuando el cliente paga vía Stripe → Crear registro en Airtable → Enviar correo vía SendGrid\n\n**Make (automatización de flujo de trabajo visual)**\n- Úsalo para: Automatizaciones complejas de múltiples pasos\n- Costo: $9.99/mes (escenarios ilimitados)\n- Mejor que Zapier para: Árboles lógicos complejos, manejo de errores\n\n**n8n (Automatización autohospedada)**\n- Úsalo para: Flujos de trabajo críticos de privacidad, automatizaciones complejas\n- Costo: Gratis (autohospedado) → $50/mes (nube)\n- Mejor para: Manejo de datos sensibles del cliente',
        },
        {
          heading: 'Procesamiento de Pagos',
          body: '**Stripe (Recomendado)**\n- Admite: Suscripciones, pagos únicos, facturación basada en uso\n- Costo: 2.9% + $0.30 por transacción\n- Se integra con: Bubble (nativo), Zapier, Airtable (vía Zapier)\n\n**Stripe vs Paddle vs Gumroad:**\n- Stripe: Más flexible, tarifas más bajas (2.9%), necesita configuración\n- Paddle: Todo incluido (maneja impuestos, cumplimiento), tarifas más altas (5%+)\n- Gumroad: Más fácil para productos digitales, tarifas más altas (10%)\n\nComienza con Stripe para credibilidad y costo.',
        },
        {
          heading: 'Ejemplos Reales de MVP Sin Código',
          body: '**Ejemplo 1: SaaS de comentarios de clientes**\n- Frontend (panel de usuario): Bubble\n- Backend (almacenamiento de datos): Base de datos de Bubble\n- Formularios (recopilación de comentarios): Typeform → Zapier → Airtable\n- Pagos: Stripe vía Bubble\n- Notificaciones: Slack vía Zapier\n- Línea de tiempo: 3 semanas\n- Costo: $80/mes (+ tarifas de Stripe)\n\n**Ejemplo 2: Mercado**\n- Incorporación de vendedor: Bubble (formulario + carga de foto)\n- Escaparate del comprador: Webflow (contenido) + Bubble (búsqueda, carrito)\n- División de pagos: Pagos de Stripe vía Zapier\n- Notificaciones: SendGrid + Zapier\n- Análisis: Google Sheets + Zapier (registrar cada transacción)\n- Línea de tiempo: 4 semanas\n- Costo: $120/mes (+ Stripe)\n\n**¿Cuándo cambiar de sin código a código?**\n- Base de usuarios >10K y creciendo 20%+ mensualmente\n- Integraciones personalizadas que Zapier no puede manejar\n- Problemas de rendimiento (carga >3 segundos)\n- Necesitar una aplicación móvil\n- Requisitos de seguridad específicos',
        },
      ],
    },
  },


  // ═══ r28: LLC / S-Corp Formation Checklist ═══
  r28: {
    kind: 'guide',
    content: {
      sections: [
        {
          heading: 'Choose Your Entity Type',
          body: 'Start as LLC. Convert to S-Corp later when you have $50K+ annual profit.\n\n**LLC (Limited Liability Company)** — Recommended for most early-stage founders\n- Personal liability protection (creditors can\'t sue you personally)\n- Pass-through taxation (avoid double taxation)\n- No required tax return initially (sole proprietor taxes)\n- Cost: $100-300 (filing) + $0-400/year (annual fees vary by state)\n- Timeline: 1-2 weeks\n\n**S-Corp** — Convert after revenue ramps\n- Saves 15.3% self-employment taxes on distributions\n- Requires separate tax return (Form 1120-S)\n- Cost: $800-2000/year (accountant fees increase)\n- Timeline: Convert after incorporation, any time\n- Breakeven: $60K annual profit (at that point, savings > extra accounting cost)',
        },
        {
          heading: 'Step 1: Choose Your State',
          body: '**Delaware** (Most popular)\n- Advantages: Investor-friendly, strong corporate law, privacy (no public owner names)\n- Cost: $200 filing + $300/year annual tax\n- Best for: Raising outside capital, multi-founder startup\n\n**Your Home State** (Simplest)\n- Advantages: Easier admin, lower annual fees ($0-100), closer to SOS office\n- Best for: Bootstrapped, single-founder, no plans to raise capital\n\n**Wyoming** (Rising popularity)\n- Advantages: Privacy (Series LLC allows multiple LLCs under one company), low fees\n- Cost: $100 filing + $0-50/year\n- Best for: Multiple ventures, privacy-focused\n\n**Decision rule:** If raising >$250K → Delaware. Otherwise → Your home state.',
        },
        {
          heading: 'Step 2: Prepare Incorporation Docs',
          body: '**Articles of Incorporation (or Certificate of Formation for LLC)** — Templates from:\n- LegalZoom ($79-149)\n- Rocket Lawyer ($49-199)\n- State SOS website (free template)\n- Includes: Company name, registered agent, member names, ownership %\n\n**Operating Agreement** (LLC only) — Required in most states\n- Outlines: Management structure, voting rights, profit/loss distribution, buyout terms\n- Template: Use Carta, LegalZoom, or SPA (simple partnership agreement) from NVCA\n\n**Co-Founder Agreement** (If multiple founders)\n- Includes: Equity split, vesting schedule (4 years / 1 year cliff standard), founder responsibilities, buyout terms\n- Template: Many VCs offer free templates (Sequoia, Homebrew)',
        },
        {
          heading: 'Step 3: File & Register',
          body: '**File Articles with State SOS**\n1. Go to Secretary of State website for your state\n2. Submit Articles of Incorporation + filing fee ($100-200)\n3. Receive Certificate of Incorporation (1-5 days)\n\n**Register for EIN (Employer Identification Number)**\n- Free from IRS (irs.gov)\n- Same as Social Security Number for your business\n- Needed to: Open business bank account, hire employees, file business taxes\n- Instant online application (~10 minutes)\n\n**Register for State Tax ID**\n- Required if: Selling taxable goods, hiring employees, required by your state\n- Contact your state department of revenue\n- Cost: Free\n- Timeline: 1-2 weeks',
        },
        {
          heading: 'Step 4: Post-Formation Setup',
          body: '**Buy Business Insurance** (needed for investor trust)\n- General Liability: $50-200/month (covers customer injury claims)\n- D&O Insurance: $500-2000/year (covers founder lawsuits, for Series A+)\n- Cost: Minimal, huge impact on credibility\n\n**Open Business Bank Account**\n- Needed: Certificate of Incorporation + EIN + ID\n- Banks: Mercury (startup-friendly, no minimums), Brex (equity credit), Stripe Treasury\n- Keep personal and business finances separate (critical for liability protection)\n\n**Update Registered Agent**\n- Most startups use Registered Agent services ($50-150/year, e.g., LegalZoom, Incfile)\n- Agent receives legal documents, forwards to you\n- Alternative: Use your office address directly (public record)\n\n**Adopt Operating Agreement** (if not already)\n- Vote as members to approve\n- Store with incorporation documents\n- Supports 83(b) elections (if taking equity, file within 30 days of grant)',
        },
        {
          heading: 'Cost Summary & Timeline',
          body: '**Total incorporation cost:** $400-1,200\n- State filing: $100-300\n- Registered agent (annual): $50-150\n- Bank account: Free\n- EIN: Free\n- Operating agreement template: $0-100\n- Professional help (optional): $300-500\n\n**Timeline:** 2-4 weeks\n- Filing: 1-2 weeks\n- Bank account setup: 1 week\n- Legal docs execution: 1 week\n\n**When NOT to DIY:**\n- Raising institutional capital (>$500K) — use a lawyer\n- Multiple co-founders with complex dynamics — use a lawyer ($1-2K)\n- For MVP validation with friends/personal savings? DIY is fine.',
        },
      ],
    },
    contentEs: {
      sections: [
        {
          heading: 'Elige Tu Tipo de Entidad',
          body: 'Comienza como LLC. Convierte a S-Corp más tarde cuando tengas $50K+ ganancia anual.\n\n**LLC (Compañía de Responsabilidad Limitada)** — Recomendado para la mayoría de fundadores en etapa temprana\n- Protección de responsabilidad personal (los acreedores no pueden demandarte personalmente)\n- Tributación de paso (evita doble tributación)\n- Sin declaración fiscal requerida inicialmente (impuestos de propietario único)\n- Costo: $100-300 (presentación) + $0-400/año (las tarifas anuales varían según el estado)\n- Línea de tiempo: 1-2 semanas\n\n**S-Corp** — Convertir después de que los ingresos aumenten\n- Ahorra 15.3% en impuestos sobre el trabajo autónomo en distribuciones\n- Requiere declaración fiscal separada (Formulario 1120-S)\n- Costo: $800-2000/año (las tarifas de contador aumentan)\n- Línea de tiempo: Convertir después de la incorporación, en cualquier momento\n- Punto de equilibrio: $60K ganancia anual (en ese momento, los ahorros > costo de contabilidad extra)',
        },
        {
          heading: 'Paso 1: Elige Tu Estado',
          body: '**Delaware** (Más popular)\n- Ventajas: Favorable a inversores, ley corporativa sólida, privacidad (sin nombres de propietarios públicos)\n- Costo: $200 presentación + $300/año impuesto anual\n- Mejor para: Recaudar capital externo, startup de múltiples fundadores\n\n**Tu Estado de Origen** (Más simple)\n- Ventajas: Admin más fácil, tarifas anuales más bajas ($0-100), más cercano a la oficina SOS\n- Mejor para: Bootstrapped, fundador único, sin planes de recaudar capital\n\n**Wyoming** (Popularidad creciente)\n- Ventajas: Privacidad (Serie LLC permite múltiples LLCs bajo una compañía), tarifas bajas\n- Costo: $100 presentación + $0-50/año\n- Mejor para: Múltiples empresas, enfocado en privacidad\n\n**Regla de decisión:** Si recaudar >$250K → Delaware. De lo contrario → Tu estado de origen.',
        },
        {
          heading: 'Paso 2: Prepara Documentos de Incorporación',
          body: '**Artículos de Incorporación (o Certificado de Constitución para LLC)** — Plantillas de:\n- LegalZoom ($79-149)\n- Rocket Lawyer ($49-199)\n- Sitio web del SOS estatal (plantilla gratuita)\n- Incluye: Nombre de la compañía, agente registrado, nombres de miembros, propiedad %\n\n**Acuerdo Operativo** (Solo LLC) — Requerido en la mayoría de estados\n- Describe: Estructura de gestión, derechos de voto, distribución de ganancias/pérdidas, términos de compra\n- Plantilla: Usa Carta, LegalZoom, o SPA (acuerdo de asociación simple) de NVCA\n\n**Acuerdo de Co-Fundador** (Si múltiples fundadores)\n- Incluye: División de patrimonio, cronograma de adquisición (4 años / acantilado de 1 año estándar), responsabilidades del fundador, términos de compra\n- Plantilla: Muchos VCs ofrecen plantillas gratuitas (Sequoia, Homebrew)',
        },
        {
          heading: 'Paso 3: Presenta y Registra',
          body: '**Presente Artículos ante SOS Estatal**\n1. Ve al sitio web de Secretario de Estado de tu estado\n2. Envía Artículos de Incorporación + tarifa de presentación ($100-200)\n3. Recibe Certificado de Incorporación (1-5 días)\n\n**Registra tu EIN (Número de Identificación del Empleador)**\n- Gratis del IRS (irs.gov)\n- Igual al Número de Seguro Social de tu negocio\n- Necesario para: Abrir cuenta bancaria comercial, contratar empleados, presentar impuestos comerciales\n- Solicitud en línea instantánea (~10 minutos)\n\n**Registra tu ID Fiscal Estatal**\n- Requerido si: Vendes bienes gravables, contratas empleados, lo requiere tu estado\n- Contacta tu departamento estatal de ingresos\n- Costo: Gratis\n- Línea de tiempo: 1-2 semanas',
        },
        {
          heading: 'Paso 4: Configuración Post-Formación',
          body: '**Compra Seguros Comerciales** (necesarios para confianza del inversor)\n- Responsabilidad General: $50-200/mes (cubre reclamaciones de lesión del cliente)\n- Seguro D&O: $500-2000/año (cubre demandas de fundadores, para Series A+)\n- Costo: Mínimo, impacto enorme en credibilidad\n\n**Abre Cuenta Bancaria Comercial**\n- Necesario: Certificado de Incorporación + EIN + Identificación\n- Bancos: Mercury (amigable con startups, sin mínimos), Brex (crédito de patrimonio), Stripe Treasury\n- Mantén finanzas personales y comerciales separadas (crítico para protección de responsabilidad)\n\n**Actualiza Agente Registrado**\n- La mayoría de startups usan servicios de Agente Registrado ($50-150/año, ej: LegalZoom, Incfile)\n- Agente recibe documentos legales, te los reenvía\n- Alternativa: Usa tu dirección de oficina directamente (registro público)\n\n**Adopta Acuerdo Operativo** (si no ya)\n- Vota como miembros para aprobar\n- Almacena con documentos de incorporación\n- Apoya elecciones 83(b) (si tomas patrimonio, presenta dentro de 30 días de concesión)',
        },
        {
          heading: 'Resumen de Costo y Línea de Tiempo',
          body: '**Costo total de incorporación:** $400-1,200\n- Presentación estatal: $100-300\n- Agente registrado (anual): $50-150\n- Cuenta bancaria: Gratis\n- EIN: Gratis\n- Plantilla de acuerdo operativo: $0-100\n- Ayuda profesional (opcional): $300-500\n\n**Línea de tiempo:** 2-4 semanas\n- Presentación: 1-2 semanas\n- Configuración de cuenta bancaria: 1 semana\n- Ejecución de documentos legales: 1 semana\n\n**Cuándo NO hacerlo tú mismo:**\n- Recaudar capital institucional (>$500K) — usa un abogado\n- Múltiples co-fundadores con dinámicas complejas — usa un abogado ($1-2K)\n- ¿Para validación de MVP con amigos/ahorros personales? DIY está bien.',
        },
      ],
    },
  },

  // ═══ r29: Terms of Service & Privacy Policy Pack ═══
  r29: {
    kind: 'template',
    content: {
      description: 'Ready-to-customize ToS and Privacy Policy templates GDPR/CCPA compliant for SaaS, e-commerce, and content platforms.',
      fields: [
        { label: 'Company Name', placeholder: 'e.g., Acme SaaS Inc', type: 'text', required: true },
        { label: 'Service Type', placeholder: 'SaaS / E-commerce / Social Platform / Marketplace', type: 'select', options: ['SaaS', 'E-commerce', 'Social Platform', 'Marketplace', 'Other'], required: true },
        { label: 'Data Processing (GDPR)', placeholder: 'Do you process EU customer data?', type: 'select', options: ['Yes', 'No'], required: true },
        { label: 'Payments', placeholder: 'How do you collect payments?', type: 'select', options: ['Credit Card (Stripe/Square)', 'Bank Transfer', 'PayPal', 'Multiple'], required: true },
        { label: 'Third-Party Integrations', placeholder: 'e.g., Intercom, Mixpanel, Segment (comma-separated)', type: 'textarea' },
      ],
      sections: [
        {
          heading: 'What\'s Included',
          body: '**Terms of Service**\n- Acceptable use (what users can\'t do)\n- Warranty disclaimers (you\'re not liable for data loss)\n- Limitation of liability (caps on damages in lawsuits)\n- Termination clause (can you ban users?)\n- Indemnification (user promises to protect you from lawsuits)\n- Dispute resolution (arbitration vs court)\n\n**Privacy Policy**\n- What data you collect (name, email, billing info, usage data)\n- How you use it (service delivery, analytics, marketing)\n- Who you share it with (payment processors, email services, analytics platforms)\n- Retention policy (how long you keep data)\n- User rights (GDPR: right to access, delete, export; CCPA: right to know and delete)',
        },
        {
          heading: 'Key Customizations by Service Type',
          body: '**For SaaS:**\n- Data processing addendum (DPA) — required if you have EU customers\n- Data residency clauses (where data lives: US-only vs EU vs multi-region)\n- Uptime SLA (e.g., "99.9% uptime guarantee")\n- Example: Stripe Terms\n\n**For E-commerce:**\n- Return policy (do you allow returns? Time limit? Refund conditions?)\n- Shipping terms (who pays for shipping? Returns?)\n- Product liability (you\'re not responsible for product defects from manufacturers)\n- Warranty disclaimers (no warranties on third-party products)\n\n**For Marketplace:**\n- Seller guidelines (what can sellers list?)\n- Content removal policy (you reserve right to remove illegal/harmful content)\n- Payment dispute resolution (how do you handle chargebacks?)\n- Two-sided liability (sellers responsible for their items, you\'re not liable)',
        },
        {
          heading: 'GDPR Compliance Checklist',
          body: '**If you have ANY EU customers:**\n\n- [ ] Add "lawful basis" statement (why you collect data: contract performance, legitimate interest, consent)\n- [ ] Add Data Processing Addendum (DPA) as appendix to ToS\n- [ ] List all data processors (Stripe, Intercom, AWS, etc.) in Privacy Policy\n- [ ] Add user rights section: Right to access, rectify, delete, restrict processing, data portability, object to processing\n- [ ] Add data retention policy: How long you keep data after account deletion\n- [ ] Add breach notification clause: "We\'ll notify you within 72 hours of a data breach"\n- [ ] Document your privacy impact assessment (recommended, not required)\n- [ ] Designate a Data Protection Officer (if processing >5,000 subjects regularly)\n\n**Cost to do it right:** Use template + have lawyer review ($500-1,500) vs built from scratch ($2,000-5,000)',
        },
        {
          heading: 'CCPA Compliance Checklist (California)',
          body: '**If you have ANY California customers:**\n\n- [ ] Add "Do Not Sell My Personal Information" link in footer\n- [ ] Add "Your Privacy Rights" section explaining CCPA rights\n- [ ] Honor requests to: Know what data you have (download), Delete data, Opt-out of sale\n- [ ] Do NOT buy/sell customer lists without explicit consent\n- [ ] Disclose data retention periods in Privacy Policy\n- [ ] Include "California residents have rights under CCPA" warning\n- [ ] Set up process to respond to requests within 45 days\n\n**Differences from GDPR:**\n- CCPA is narrower (California only, must opt-out vs GDPR opt-in)\n- CCPA has explicit "right to non-discrimination" (don\'t punish users who exercise rights)\n- No DPA required for CCPA (but write one anyway for good practice)',
        },
        {
          heading: 'Red Flags to Avoid',
          body: '**Don\'t include:**\n- "We can change your data without notice" — users should get notification\n- "You waive all legal rights" — courts won\'t enforce this\n- "We have no liability for breaches" — if you\'re negligent, you\'re liable\n- "We own all content you submit" — users own their data (you license it)\n- Overly vague data practices ("we may share with anyone") — violates GDPR/CCPA\n\n**Do include:**\n- Clear language (avoid legalese where possible)\n- Plain English summaries of key points\n- Links to your Privacy Policy from Terms\n- Update date and version number\n- Notification of changes (email users when ToS/Privacy Policy change)',
        },
      ],
    },
    contentEs: {
      description: 'Plantillas listas para personalizar de ToS y Política de Privacidad compatibles con GDPR/CCPA para SaaS, comercio electrónico y plataformas de contenido.',
      fields: [
        { label: 'Nombre de la Empresa', placeholder: 'Ej: Acme SaaS Inc', type: 'text', required: true },
        { label: 'Tipo de Servicio', placeholder: 'SaaS / Comercio Electrónico / Plataforma Social / Mercado', type: 'select', options: ['SaaS', 'Comercio Electrónico', 'Plataforma Social', 'Mercado', 'Otro'], required: true },
        { label: 'Procesamiento de Datos (GDPR)', placeholder: '¿Procesáis datos de clientes de la UE?', type: 'select', options: ['Sí', 'No'], required: true },
        { label: 'Pagos', placeholder: '¿Cómo cobras pagos?', type: 'select', options: ['Tarjeta de Crédito (Stripe/Square)', 'Transferencia Bancaria', 'PayPal', 'Múltiples'], required: true },
        { label: 'Integraciones de Terceros', placeholder: 'Ej: Intercom, Mixpanel, Segment (separadas por comas)', type: 'textarea' },
      ],
      sections: [
        {
          heading: 'Qué se Incluye',
          body: '**Términos de Servicio**\n- Uso aceptable (qué no pueden hacer los usuarios)\n- Exenciones de garantía (no eres responsable de la pérdida de datos)\n- Limitación de responsabilidad (límites en daños en demandas)\n- Cláusula de terminación (¿puedes expulsar a usuarios?)\n- Indemnización (el usuario promete protegerte de demandas)\n- Resolución de disputas (arbitraje vs tribunal)\n\n**Política de Privacidad**\n- Qué datos recopiles (nombre, correo, información de facturación, datos de uso)\n- Cómo los uses (entrega de servicio, análisis, marketing)\n- Con quién los compartes (procesadores de pagos, servicios de correo, plataformas de análisis)\n- Política de retención (cuánto tiempo guardáis los datos)\n- Derechos del usuario (GDPR: derecho a acceso, eliminación, exportación; CCPA: derecho a conocer y eliminar)',
        },
        {
          heading: 'Personalizaciones Clave por Tipo de Servicio',
          body: '**Para SaaS:**\n- Apéndice de Procesamiento de Datos (DPA) — requerido si tienes clientes de la UE\n- Cláusulas de residencia de datos (dónde viven los datos: solo EE.UU. vs UE vs multi-región)\n- SLA de tiempo de actividad (ej: "Garantía de 99.9% de tiempo de actividad")\n- Ejemplo: Términos de Stripe\n\n**Para Comercio Electrónico:**\n- Política de devoluciones (¿permitir devoluciones? ¿Límite de tiempo? ¿Condiciones de reembolso?)\n- Términos de envío (¿quién paga el envío? ¿Devoluciones?)\n- Responsabilidad del producto (no eres responsable de defectos de productos de fabricantes)\n- Exenciones de garantía (sin garantías en productos de terceros)\n\n**Para Mercado:**\n- Directrices de vendedores (qué pueden listar los vendedores?)\n- Política de eliminación de contenido (¿tienes derecho a eliminar contenido ilegal/dañino?)\n- Resolución de disputas de pagos (¿cómo manejas contracargos?)\n- Responsabilidad bilateral (vendedores responsables de sus artículos, tú no)',
        },
        {
          heading: 'Lista de Verificación de Cumplimiento de GDPR',
          body: '**Si tienes ALGÚN cliente de la UE:**\n\n- [ ] Añade declaración de "base legal" (por qué recopilái datos: desempeño de contrato, interés legítimo, consentimiento)\n- [ ] Añade Apéndice de Procesamiento de Datos (DPA) como anexo a ToS\n- [ ] Lista todos los procesadores de datos (Stripe, Intercom, AWS, etc.) en Política de Privacidad\n- [ ] Añade sección de derechos del usuario: Derecho a acceso, rectificación, eliminación, restricción de procesamiento, portabilidad de datos, oposición\n- [ ] Añade política de retención de datos: Cuánto tiempo guardáis datos después de eliminación de cuenta\n- [ ] Añade cláusula de notificación de incumplimiento: "Te notificaremos dentro de 72 horas de un incumplimiento de datos"\n- [ ] Documentáis vuestra evaluación de impacto en la privacidad (recomendado, no requerido)\n- [ ] Designáis un Oficial de Protección de Datos (si procesáis >5,000 sujetos regularmente)\n\n**Costo para hacerlo bien:** Usa plantilla + abogado revisa ($500-1,500) vs creado desde cero ($2,000-5,000)',
        },
        {
          heading: 'Lista de Verificación de Cumplimiento de CCPA (California)',
          body: '**Si tienes ALGÚN cliente de California:**\n\n- [ ] Añade enlace "No Vender Mi Información Personal" en pie de página\n- [ ] Añade sección "Tus Derechos de Privacidad" explicando derechos de CCPA\n- [ ] Honra solicitudes para: Saber qué datos tienes (descargar), Eliminar datos, Optar por no participar en venta\n- [ ] NO compres/vendas listas de clientes sin consentimiento explícito\n- [ ] Divulga períodos de retención de datos en Política de Privacidad\n- [ ] Incluye advertencia "Los residentes de California tienen derechos bajo CCPA"\n- [ ] Configura proceso para responder a solicitudes dentro de 45 días\n\n**Diferencias de GDPR:**\n- CCPA es más estrecho (solo California, debe optar por excluirse vs GDPR optar por incluirse)\n- CCPA tiene explícitamente "derecho a no discriminación" (no castigues usuarios que ejercen derechos)\n- No se requiere DPA para CCPA (pero escribe uno de todos modos por buena práctica)',
        },
        {
          heading: 'Banderas Rojas a Evitar',
          body: '**No incluyas:**\n- "Podemos cambiar tus datos sin aviso" — los usuarios deberían obtener notificación\n- "Renuncias a todos los derechos legales" — los tribunales no harán cumplir esto\n- "No somos responsables de incumplimientos" — si eres negligente, eres responsable\n- "Poseemos todo el contenido que envías" — los usuarios poseen sus datos (tú licenciaos)\n- Prácticas de datos demasiado vagas ("podemos compartir con cualquiera") — viola GDPR/CCPA\n\n**Incluye:**\n- Lenguaje claro (evita tecnicismos donde sea posible)\n- Resúmenes en inglés simple de puntos clave\n- Enlaces a tu Política de Privacidad desde Términos\n- Fecha de actualización y número de versión\n- Notificación de cambios (email a usuarios cuando ToS/Política de Privacidad cambien)',
        },
      ],
    },
  },


  // ═══ r30: Startup Accounting 101 ═══
  r30: {
    kind: 'ebook',
    content: {
      sections: [
        {
          heading: 'Chapter 1: Chart of Accounts for Founders',
          body: 'Your Chart of Accounts (COA) is a list of all accounts your business uses to record transactions. Think of it as the backbone of your accounting system.\n\n**Asset Accounts** (what you own)\n- Cash (bank accounts, credit card balances)\n- Accounts Receivable (money customers owe you)\n- Inventory (products you have in stock)\n- Prepaid Expenses (insurance, software subscriptions paid upfront)\n- Equipment & Furniture (office supplies with >$1K value)\n- Intangible Assets (domain name, acquired customers list)\n\n**Liability Accounts** (what you owe)\n- Accounts Payable (invoices from vendors you haven\'t paid)\n- Credit Card Payable (credit card balances)\n- Sales Tax Payable (tax collected from customers you\'ll send to state)\n- Payroll Taxes Payable (withheld from employee salaries)\n- Loan Payable (debt from bank loans, personal loans from founders)\n\n**Equity Accounts** (owner\'s stake)\n- Founder Contributions (cash/assets you put in)\n- Retained Earnings (profits reinvested in business)\n\n**Revenue Accounts** (money coming in)\n- SaaS Subscription Revenue (recurring revenue)\n- One-time Sales Revenue (one-off transactions)\n- Refunds & Chargebacks (reduce revenue)\n\n**Expense Accounts**\n- Cost of Goods Sold (COGS): Direct costs to create product (developer salary, server costs for SaaS)\n- Operating Expenses: Everything else (rent, marketing, utilities, insurance)\n- Depreciation: Spreading equipment cost over years ($5K laptop over 5 years = $1K/year expense)',
        },
        {
          heading: 'Chapter 2: Revenue Recognition 101',
          body: 'When do you record revenue? When you earn it, not when you get paid. This is called accrual accounting.\n\n**For Subscription SaaS:**\nRevenue = Monthly Subscription Price ÷ 12 (recognized monthly as service is delivered)\n- Customer pays $120/year on Jan 1\n- You record $10 revenue each month (Jan-Dec)\n- If customer cancels March 15, you recognize $10 revenue for March, regardless of when refund is issued\n\n**For One-Time Sales:**\nRevenue = Sale price on the day customer receives product/service\n- Freelancer delivers design on March 15, records revenue March 15\n- Customer doesn\'t pay until April 1? Still record revenue March 15 (accounts receivable until paid)\n\n**For Consulting/Services:**\nRevenue = Milestone completion date\n- Contract: $10K for 3 deliverables\n- Record $3.3K when deliverable 1 is complete, $3.3K when #2 complete, $3.4K when #3 complete\n- Don\'t record all $10K upfront just because customer paid advance\n\n**Key Rule:** Revenue recognition depends on when you provide value, not when cash hits your bank account.',
        },
        {
          heading: 'Chapter 3: R&D Tax Credits & 83(b) Elections',
          body: '**R&D Tax Credits** (for tech founders)\nIf you have a technical co-founder who codes the MVP, you likely qualify for R&D credits:\n- $0-10K annual credit for startups (carries forward indefinitely)\n- Applies to: Software development, AI/ML experimentation, hardware prototyping\n- Requirements: Document what you built, why it was uncertain if it would work, person-hours spent\n- Cost to claim: $500-2000 (CPA does the work)\n- Pro tip: Retroactively claim R&D credits from Year 1 when you file\n\n**83(b) Elections** (critical if taking equity)\nWhen you get founder equity (e.g., 1,000,000 shares at $0.0001/share value):\n- Without 83(b): Equity vests over 4 years. Each year as it vests, you owe taxes on the fair market value of vested shares. Year 1 = $0 tax (shares worth $0.0001). By Year 4, if company worth $10M, you owe massive tax bill.\n- With 83(b): File within 30 DAYS of receiving equity. You pay tax once on current fair market value (e.g., $0.0001 = $0 tax). If company grows to $10M, all that growth is capital gains (better tax treatment).\n- Cost: $0 (you file it yourself)\n- Deadline: 30 days from grant date (HARD DEADLINE)\n- Pro tip: File 83(b) even if you think company worthless today (protection against future success)',
        },
        {
          heading: 'Chapter 4: Cap Table Management',
          body: 'Cap Table = Capitalization Table. Tracks who owns what % of the company.\n\n**What it includes:**\n- Founder shares & vesting schedule\n- Employee option pool (reserved for future hires)\n- Investor shares (if you raised capital)\n- Convertible notes & SAFEs (if you raised debt-like instruments)\n- Exercise prices & vesting cliffs\n\n**Example Cap Table at Seed Stage:**\n```\nFounder A: 500K shares (50%) 4-year vest, 1-year cliff\nFounder B: 500K shares (50%) 4-year vest, 1-year cliff\nEmployee Option Pool: 200K shares (reserved for hires)\nTotal: 1.2M fully diluted shares\n```\n\n**When you raise $500K from investors:**\nInvestor gets 200K new shares (dilutes everyone):\n```\nFounder A: 500K shares (37.9% diluted)\nFounder B: 500K shares (37.9% diluted)\nInvestor: 200K shares (15.2%)\nOption Pool: 200K shares (15.2%)\nTotal: 1.4M fully diluted shares\n```\n\n**Tools:**\n- Carta (best, $0-500/year)\n- Pulley (simpler, $99/month)\n- Spreadsheet (free, but error-prone)\n\n**Cap table mistakes to avoid:**\n- Not reserving an option pool (employees will demand options, causes conflicts)\n- Vesting cliff >1 year (investors hate this, indicates founder commitment risk)\n- Untracked advisor shares (you forget who owns what, causes legal issues)',
        },
        {
          heading: 'Chapter 5: Monthly Accounting Rhythm for Founders',
          body: '**Day 1-5 of month: Record all transactions**\n- Download bank statement, match to records\n- Enter all invoices (sent to customers, received from vendors)\n- Record credit card charges\n- Reconcile bank account (balance in QB/Wave should match bank statement)\n- Process payroll (if you have employees)\n\n**Day 10: Close the books**\n- Review balance sheet: Do assets = liabilities + equity?\n- Review P&L: Do expenses look reasonable?\n- Investigate any anomalies (sudden $5K charge you don\'t recognize)\n- Accrue expenses (if accountant not yet invoiced, estimate and record)\n\n**Day 15: Analyze**\n- Compare to budget (are you spending more than planned?)\n- Calculate key metrics: Burn rate (monthly spend), runway (months until out of cash), CAC (customer acquisition cost), LTV (lifetime value)\n- Update forecast: If you keep burning $X/month, when do you run out of cash?\n\n**Monthly outputs:**\n- P&L Statement (profit & loss = revenue - expenses)\n- Balance Sheet (assets, liabilities, equity snapshot)\n- Cash Flow Statement (how much cash came in/went out)\n- Investor update (if raising capital)\n\n**Tools:**\n- Wave (free, good for solo founders)\n- QuickBooks Online ($15/month basic)\n- Ramp / Mercury (accounting built into banking)',
        },
      ],
    },
    contentEs: {
      sections: [
        {
          heading: 'Capítulo 1: Plan de Cuentas para Fundadores',
          body: 'Tu Plan de Cuentas (COA) es una lista de todas las cuentas que utiliza tu negocio para registrar transacciones. Piénsalo como la columna vertebral de tu sistema contable.\n\n**Cuentas de Activos** (lo que posees)\n- Caja (cuentas bancarias, saldos de tarjeta de crédito)\n- Cuentas por Cobrar (dinero que los clientes te deben)\n- Inventario (productos que tienes en stock)\n- Gastos Prepagados (seguros, suscripciones de software pagadas por adelantado)\n- Equipos y Muebles (suministros de oficina con valor >$1K)\n- Activos Intangibles (nombre de dominio, lista de clientes adquirida)\n\n**Cuentas de Pasivos** (lo que debes)\n- Cuentas por Pagar (facturas de proveedores que no has pagado)\n- Tarjeta de Crédito Pagadero (saldos de tarjeta de crédito)\n- Impuesto sobre Ventas Pagadero (impuesto cobrado de clientes que enviarás al estado)\n- Impuestos sobre Nómina Pagaderos (retenidos de salarios de empleados)\n- Préstamo Pagadero (deuda de préstamos bancarios, préstamos personales de fundadores)\n\n**Cuentas de Patrimonio** (participación del propietario)\n- Contribuciones de Fundador (efectivo/activos que inviertes)\n- Ganancias Retenidas (ganancias reinvertidas en negocio)\n\n**Cuentas de Ingresos** (dinero que entra)\n- Ingresos de Suscripción SaaS (ingresos recurrentes)\n- Ingresos de Ventas Únicas (transacciones únicas)\n- Reembolsos y Contracargos (reducir ingresos)\n\n**Cuentas de Gastos**\n- Costo de Bienes Vendidos (COGS): Costos directos para crear producto (salario de desarrollador, costos de servidor para SaaS)\n- Gastos Operacionales: Todo lo demás (alquiler, marketing, servicios, seguros)\n- Depreciación: Distribución de costo de equipos sobre años ($5K portátil durante 5 años = $1K/año gasto)',
        },
        {
          heading: 'Capítulo 2: Reconocimiento de Ingresos 101',
          body: '¿Cuándo registras ingresos? Cuando los ganas, no cuando los recibes. Esto se llama contabilidad de devengo.\n\n**Para SaaS de Suscripción:**\nIngresos = Precio de Suscripción Mensual ÷ 12 (reconocido mensualmente a medida que se entrega el servicio)\n- Cliente paga $120/año el 1 de enero\n- Registras $10 ingresos cada mes (enero-diciembre)\n- Si el cliente cancela el 15 de marzo, reconoces $10 ingresos para marzo, independientemente de cuándo se emita el reembolso\n\n**Para Ventas Únicas:**\nIngresos = Precio de venta en el día en que el cliente recibe producto/servicio\n- Freelancer entrega diseño el 15 de marzo, registra ingresos el 15 de marzo\n- ¿Cliente no paga hasta el 1 de abril? Aún registra ingresos el 15 de marzo (cuentas por cobrar hasta que se pague)\n\n**Para Consultoría/Servicios:**\nIngresos = Fecha de finalización del hito\n- Contrato: $10K por 3 entregables\n- Registra $3.3K cuando se completa entregable 1, $3.3K cuando se completa #2, $3.4K cuando se completa #3\n- No registres los $10K completos por adelantado solo porque el cliente pagó anticipadamente\n\n**Regla Clave:** El reconocimiento de ingresos depende de cuándo proporcionas valor, no de cuándo el efectivo llega a tu cuenta bancaria.',
        },
        {
          heading: 'Capítulo 3: Créditos Fiscales de I+D y Elecciones 83(b)',
          body: '**Créditos Fiscales de I+D** (para fundadores de tecnología)\nSi tienes un co-fundador técnico que codifica el MVP, probablemente califiques para créditos de I+D:\n- $0-10K crédito anual para startups (se transfiere indefinidamente)\n- Se aplica a: Desarrollo de software, experimentación de IA/ML, prototipado de hardware\n- Requisitos: Documentar qué construiste, por qué era incierto si funcionaría, horas-persona gastadas\n- Costo para reclamar: $500-2000 (CPA hace el trabajo)\n- Consejo: Retroactivamente reclama créditos de I+D del Año 1 cuando presentes\n\n**Elecciones 83(b)** (crítico si tomas patrimonio)\nCuando recibes patrimonio de fundador (ej: 1,000,000 acciones a $0.0001/valor de acción):\n- Sin 83(b): El patrimonio se adquiere durante 4 años. Cada año a medida que se adquiere, debes impuestos sobre el valor justo de mercado de acciones adquiridas. Año 1 = $0 impuesto (acciones valen $0.0001). Para el Año 4, si la compañía vale $10M, debes una factura fiscal masiva.\n- Con 83(b): Presenta dentro de 30 DÍAS de recibir patrimonio. Pagas impuesto una vez sobre el valor justo de mercado actual (ej: $0.0001 = $0 impuesto). Si la compañía crece a $10M, todo ese crecimiento es ganancias de capital (mejor trato fiscal).\n- Costo: $0 (lo presentáis tú mismo)\n- Plazo: 30 días desde la fecha de concesión (PLAZO DURO)\n- Consejo: Presenta 83(b) incluso si crees que la compañía no vale hoy (protección contra éxito futuro)',
        },
        {
          heading: 'Capítulo 4: Gestión de Cap Table',
          body: 'Cap Table = Tabla de Capitalización. Registra quién es propietario de qué % de la compañía.\n\n**Qué incluye:**\n- Acciones de fundador y cronograma de adquisición\n- Fondo de opciones de empleados (reservado para futuras contrataciones)\n- Acciones de inversores (si recaudáis capital)\n- Notas convertibles y SAFEs (si recaudáis instrumentos similares a deuda)\n- Precios de ejercicio y acantilados de adquisición\n\n**Cap Table de Ejemplo en Etapa Seed:**\n```\nFundador A: 500K acciones (50%) adquisición de 4 años, acantilado de 1 año\nFundador B: 500K acciones (50%) adquisición de 4 años, acantilado de 1 año\nFondo de Opciones de Empleados: 200K acciones (reservado para contrataciones)\nTotal: 1.2M acciones completamente diluidas\n```\n\n**Cuando recaudáis $500K de inversores:**\nInversor obtiene 200K acciones nuevas (diluye a todos):\n```\nFundador A: 500K acciones (37.9% diluidas)\nFundador B: 500K acciones (37.9% diluidas)\nInversor: 200K acciones (15.2%)\nFondo de Opciones: 200K acciones (15.2%)\nTotal: 1.4M acciones completamente diluidas\n```\n\n**Herramientas:**\n- Carta (mejor, $0-500/año)\n- Pulley (más simple, $99/mes)\n- Hoja de Cálculo (gratis, pero propenso a errores)\n\n**Errores de Cap Table a evitar:**\n- No reservar un fondo de opciones (los empleados exigirán opciones, causa conflictos)\n- Acantilado de adquisición >1 año (a los inversores les disgusta, indica riesgo de compromiso del fundador)\n- Acciones de asesor no rastreadas (olvidas quién es propietario de qué, causa problemas legales)',
        },
        {
          heading: 'Capítulo 5: Ritmo Contable Mensual para Fundadores',
          body: '**Días 1-5 del mes: Registra todas las transacciones**\n- Descarga estado de cuenta bancario, coincide con registros\n- Ingresa todas las facturas (enviadas a clientes, recibidas de proveedores)\n- Registra cargos de tarjeta de crédito\n- Reconcilia cuenta bancaria (saldo en QB/Wave debe coincidir con estado de cuenta bancario)\n- Procesa nómina (si tienes empleados)\n\n**Día 10: Cierra los libros**\n- Revisa balance general: ¿Activos = pasivos + patrimonio?\n- Revisa P&L: ¿Los gastos parecen razonables?\n- Investiga anomalías (cargo repentino de $5K que no reconoces)\n- Acumula gastos (si el contador aún no ha enviado factura, estima y registra)\n\n**Día 15: Analiza**\n- Compara con presupuesto (¿estás gastando más de lo planeado?)\n- Calcula métricas clave: Tasa de quema (gasto mensual), autonomía (meses hasta quedarse sin efectivo), CAC (costo de adquisición de cliente), LTV (valor de vida útil)\n- Actualiza pronóstico: Si sigues quemando $X/mes, ¿cuándo te quedáis sin efectivo?\n\n**Salidas mensuales:**\n- Declaración de P&L (ganancias y pérdidas = ingresos - gastos)\n- Balance General (instantánea de activos, pasivos, patrimonio)\n- Estado de Flujo de Caja (cuánto efectivo entró/salió)\n- Actualización de inversores (si recaudáis capital)\n\n**Herramientas:**\n- Wave (gratis, bueno para fundadores solo)\n- QuickBooks Online ($15/mes básico)\n- Ramp / Mercury (contabilidad integrada en banca)',
        },
      ],
    },
  },


  // ═══ r31: SaaS Financial Model 2026 ═══
  r31: {
    kind: 'spreadsheet',
    content: {
      description: 'Revenue projections, churn analysis, CAC/LTV ratios, runway calculator, scenario planner for SaaS startups.',
      columns: [
        { key: 'month', label: 'Month', type: 'text', width: 80 },
        { key: 'arr', label: 'ARR', type: 'currency', width: 100 },
        { key: 'churn_rate', label: 'Churn %', type: 'percent', width: 80 },
        { key: 'cac', label: 'CAC', type: 'currency', width: 80 },
        { key: 'ltv', label: 'LTV (12mo)', type: 'currency', width: 80 },
        { key: 'ltv_cac', label: 'LTV:CAC', type: 'text', width: 80 },
        { key: 'burn_rate', label: 'Monthly Burn', type: 'currency', width: 120 },
        { key: 'runway_months', label: 'Runway (mo)', type: 'number', width: 100 },
      ],
      rows: [
        { month: 'Jan (Start)', arr: 0, churn_rate: 0, cac: 500, ltv: 5000, ltv_cac: '10x', burn_rate: -50000, runway_months: 3 },
        { month: 'Feb', arr: 5000, churn_rate: 5, cac: 500, ltv: 5000, ltv_cac: '10x', burn_rate: -48000, runway_months: 3 },
        { month: 'Mar', arr: 12000, churn_rate: 4, cac: 480, ltv: 5200, ltv_cac: '10.8x', burn_rate: -45000, runway_months: 3 },
        { month: 'Apr', arr: 22000, churn_rate: 3.5, cac: 450, ltv: 5500, ltv_cac: '12.2x', burn_rate: -40000, runway_months: 4 },
        { month: 'May', arr: 35000, churn_rate: 3, cac: 420, ltv: 5800, ltv_cac: '13.8x', burn_rate: -35000, runway_months: 5 },
        { month: 'Jun', arr: 52000, churn_rate: 2.8, cac: 400, ltv: 6000, ltv_cac: '15x', burn_rate: -25000, runway_months: 7 },
      ],
    },
    contentEs: {
      description: 'Proyecciones de ingresos, análisis de pérdida, relaciones CAC/LTV, calculadora de autonomía, planificador de escenarios para startups SaaS.',
      columns: [
        { key: 'month', label: 'Mes', type: 'text', width: 80 },
        { key: 'arr', label: 'ARR', type: 'currency', width: 100 },
        { key: 'churn_rate', label: 'Pérdida %', type: 'percent', width: 80 },
        { key: 'cac', label: 'CAC', type: 'currency', width: 80 },
        { key: 'ltv', label: 'LTV (12mo)', type: 'currency', width: 80 },
        { key: 'ltv_cac', label: 'LTV:CAC', type: 'text', width: 80 },
        { key: 'burn_rate', label: 'Quema Mensual', type: 'currency', width: 120 },
        { key: 'runway_months', label: 'Autonomía (mo)', type: 'number', width: 100 },
      ],
      rows: [
        { month: 'Ene (Inicio)', arr: 0, churn_rate: 0, cac: 500, ltv: 5000, ltv_cac: '10x', burn_rate: -50000, runway_months: 3 },
        { month: 'Feb', arr: 5000, churn_rate: 5, cac: 500, ltv: 5000, ltv_cac: '10x', burn_rate: -48000, runway_months: 3 },
        { month: 'Mar', arr: 12000, churn_rate: 4, cac: 480, ltv: 5200, ltv_cac: '10.8x', burn_rate: -45000, runway_months: 3 },
        { month: 'Apr', arr: 22000, churn_rate: 3.5, cac: 450, ltv: 5500, ltv_cac: '12.2x', burn_rate: -40000, runway_months: 4 },
        { month: 'May', arr: 35000, churn_rate: 3, cac: 420, ltv: 5800, ltv_cac: '13.8x', burn_rate: -35000, runway_months: 5 },
        { month: 'Jun', arr: 52000, churn_rate: 2.8, cac: 400, ltv: 6000, ltv_cac: '15x', burn_rate: -25000, runway_months: 7 },
      ],
    },
  },

  // ═══ r32: Tax Deduction Cheatsheet for Founders ═══
  r32: {
    kind: 'cheatsheet',
    content: {
      intro: '20 tax deductions most founders miss. Focus on deductions that save $50+ per year per deduction. Everything must be ordinary and necessary for your business.',
      items: [
        { term: 'Home Office', definition: 'Deduct 20-30% of home rent/mortgage if you have dedicated office space', example: 'Rent $2000/mo → Home office (25%) = $500/mo deduction = $6K/year' },
        { term: 'Software Subscriptions', definition: 'All SaaS tools, IDEs, cloud services', example: 'ChatGPT ($20/mo) + Figma ($12/mo) + AWS ($100/mo) = $132/mo = $1,584/year' },
        { term: 'Internet & Phone', definition: 'Deduct business % of home internet + work phone', example: 'Internet $100/mo × 50% business = $50/mo = $600/year' },
        { term: 'Equipment Under $2,500', definition: 'Laptop, monitor, desk, chair, software (expensed immediately, not depreciated)', example: 'MacBook ($1,200) + Monitor ($300) + Desk ($400) = $1,900 deducted year 1' },
        { term: 'Coworking Space', definition: 'Full deduction if used primarily for business', example: 'WeWork membership $250/mo = $3,000/year' },
        { term: 'Travel for Business', definition: 'Flights, hotels, rental cars, meals (50% deductible)', example: 'Conference in SF: Flight $400 + Hotel $800 + Meals $200 (×50%) = $1,300 deductible' },
        { term: 'Meals & Entertainment', definition: '50% of meal cost when with clients/investors. 100% if feeding employees', example: 'Lunch meeting $60 → $30 deduction' },
        { term: 'Contractor Payments', definition: 'If you pay freelancers >$600/year, issue 1099-NEC', example: 'Designer $5K + Developer $8K = $13K in contractor expenses (all deductible)' },
        { term: 'Professional Development', definition: 'Online courses, books, conferences related to your business', example: 'YC Startup School $0 (free) + Lean Analytics book $20 + Founder Summit $2K = $2,020' },
        { term: 'Startup Costs', definition: 'LLC filing, trademark, domain, initial legal setup (amortize over 180 months or less)', example: 'LLC filing $300 + Trademark $300 + Domain $15 = $615 total startup costs' },
      ],
      tip: 'Track everything: create a Google Sheet with date, category, amount, business purpose. If IRS audits, you need receipts. Keep records 3-7 years.',
    },
    contentEs: {
      intro: '20 deducciones fiscales que la mayoría de los fundadores pierden. Enfócate en deducciones que ahorren $50+ por año por deducción. Todo debe ser ordinario y necesario para tu negocio.',
      items: [
        { term: 'Oficina en Casa', definition: 'Deduce 20-30% del alquiler/hipoteca de casa si tienes espacio de oficina dedicado', example: 'Alquiler $2000/mes → Oficina en casa (25%) = $500/mes deducción = $6K/año' },
        { term: 'Suscripciones de Software', definition: 'Todas las herramientas SaaS, IDEs, servicios en la nube', example: 'ChatGPT ($20/mes) + Figma ($12/mes) + AWS ($100/mes) = $132/mes = $1,584/año' },
        { term: 'Internet y Teléfono', definition: 'Deduce % comercial de internet doméstico + teléfono de trabajo', example: 'Internet $100/mes × 50% negocio = $50/mes = $600/año' },
        { term: 'Equipos Menores a $2,500', definition: 'Portátil, monitor, escritorio, silla, software (deducidos inmediatamente, no depreciados)', example: 'MacBook ($1,200) + Monitor ($300) + Escritorio ($400) = $1,900 deducidos año 1' },
        { term: 'Espacio de Coworking', definition: 'Deducción completa si se utiliza principalmente para negocio', example: 'Membresía WeWork $250/mes = $3,000/año' },
        { term: 'Viajes de Negocio', definition: 'Vuelos, hoteles, alquileres de autos, comidas (50% deducibles)', example: 'Conferencia en SF: Vuelo $400 + Hotel $800 + Comidas $200 (×50%) = $1,300 deducible' },
        { term: 'Comidas y Entretenimiento', definition: '50% del costo de la comida cuando está con clientes/inversores. 100% si alimentáis empleados', example: 'Almuerzo de reunión $60 → $30 deducción' },
        { term: 'Pagos de Contratistas', definition: 'Si pagas a trabajadores autónomos >$600/año, emite 1099-NEC', example: 'Diseñador $5K + Desarrollador $8K = $13K en gastos de contratistas (todos deducibles)' },
        { term: 'Desarrollo Profesional', definition: 'Cursos en línea, libros, conferencias relacionadas con tu negocio', example: 'Escuela de Inicio YC $0 (gratis) + libro Lean Analytics $20 + Cumbre de Fundadores $2K = $2,020' },
        { term: 'Costos de Inicio', definition: 'Presentación LLC, marca registrada, dominio, configuración legal inicial (amortizar durante 180 meses o menos)', example: 'Presentación LLC $300 + Marca Registrada $300 + Dominio $15 = $615 costos de inicio total' },
      ],
      tip: 'Registra todo: crea una Hoja de Cálculo de Google con fecha, categoría, cantidad, propósito comercial. Si el IRS audita, necesitas recibos. Mantén registros 3-7 años.',
    },
  },

  // ═══ r33: Intellectual Property 101 ═══
  r33: {
    kind: 'guide',
    content: {
      sections: [
        {
          heading: 'Trademarks: Protecting Your Brand',
          body: `A trademark protects your brand identity — name, logo, tagline — so competitors can't use it in the same industry.\n\n**What to file first:** Company name > product name > logo > tagline\n\n**US Trademark Process:**\n1. Run a TESS search (USPTO database) for conflicts\n2. File with USPTO — $250-350 per class of goods/services\n3. Wait 6-12 months for examination\n4. Respond to any office actions (very common)\n5. 30-day publication for opposition\n6. Registration granted (lasts 10 years, renewable)\n\n**Key classes:** Class 9 (software/apps), Class 35 (business/SaaS services), Class 42 (tech services)\n\n**Pro tip:** Use ™ immediately for free. Use ® only after registration is granted. EU trademark covers all EU countries for ~€850 — worth filing early if you have EU customers.`,
        },
        {
          heading: 'Patents: Protecting Your Invention',
          body: `Patents protect how something works (utility), how it looks (design), or a novel plant strain. Software startups mostly care about utility patents.\n\n**When patents are worth it:**\n- Novel technical method or process that's non-obvious\n- Hardware component with a unique physical mechanism\n- Drug formulation or medical device\n\n**When to skip patents:**\n- Pure software algorithms (hard to get, easy to design around)\n- Business model methods (courts increasingly skeptical)\n- If your moat is speed, data, or network effects (not patentable)\n\n**Cost reality:** Provisional patent ($1,500-3K with attorney) buys 12 months. Full utility patent ($8K-15K) takes 18+ months to grant.\n\n**Trade secret as alternative:** If you can keep it secret, trade secret protection is free and never expires. Coca-Cola chose trade secret over patent — it would have expired in 20 years.`,
        },
        {
          heading: 'Copyrights: Protecting Your Creative Work',
          body: `Copyright protects original creative works — code, writing, design, video. It attaches automatically when you create something. No registration required, but registration unlocks enforcement power.\n\n**What copyright covers:**\n- All source code and technical documentation\n- Marketing copy, blog posts, video scripts\n- UI/UX designs and visual brand assets\n- Original datasets and training data\n\n**What copyright does NOT cover:**\n- Ideas, concepts, methods (only the specific expression)\n- Facts and raw data\n- Names, titles, slogans (use trademark for those)\n\n**Why register ($45-65 with Copyright Office):** You can sue for statutory damages of $750-$150K per willful infringement rather than just actual damages. File within 3 months of publication to preserve this right.\n\n**Work-for-hire rule:** Code written by employees and contractors (with IP assignment agreements) belongs to the company — not the individual. Always include IP assignment clauses in offer letters and contractor agreements.`,
        },
        {
          heading: 'Trade Secrets: Protecting Your Competitive Advantage',
          body: `A trade secret is any confidential information giving you a competitive edge: algorithms, customer lists, pricing models, manufacturing processes.\n\n**To qualify for trade secret protection:**\n1. Must have economic value because it's secret\n2. You must take reasonable steps to keep it secret\n\n**Protecting trade secrets in practice:**\n- NDAs with all employees, contractors, and investors before sharing anything sensitive\n- Role-based access controls (people access only what they need)\n- Mark all confidential documents clearly\n- Exit interviews: remind departing employees of their ongoing NDA obligations\n- Document what trade secrets exist and who can access them\n\n**Real examples:** Google's search ranking algorithm, Coca-Cola's formula, your CAC by acquisition channel, churn model, and customer lifetime value by segment.\n\n**When a trade secret is stolen:** The Defend Trade Secrets Act (DTSA) allows federal lawsuits for damages plus injunctions. Your biggest risk is a departing employee joining a competitor — IP assignment agreements and documented exit procedures are your best defense.`,
        },
      ],
    },
    contentEs: {
      sections: [
        {
          heading: 'Marcas Registradas: Protegiendo Tu Marca',
          body: `Una marca registrada protege tu identidad de marca — nombre, logotipo, eslogan — para que los competidores no la usen en la misma industria.\n\n**Qué registrar primero:** Nombre de empresa > nombre de producto > logotipo > eslogan\n\n**Proceso en EE.UU.:**\n1. Búsqueda TESS (base de datos USPTO) para conflictos\n2. Presenta ante USPTO — $250-350 por clase de bienes/servicios\n3. Espera 6-12 meses para examinación\n4. Responde acciones de oficina (muy comunes)\n5. Publicación para oposición (30 días)\n6. Registro otorgado (10 años, renovable)\n\n**Clases clave:** Clase 9 (software/apps), Clase 35 (servicios de negocio/SaaS), Clase 42 (servicios tecnológicos)\n\n**Consejo:** Usa ™ inmediatamente y gratis. Usa ® solo después del registro. La marca de la UE cubre todos los países de la UE por ~€850.`,
        },
        {
          heading: 'Patentes: Protegiendo Tu Invención',
          body: `Las patentes protegen cómo funciona algo (utilidad), cómo se ve (diseño) o una planta novedosa. Las startups de software se preocupan principalmente por las patentes de utilidad.\n\n**Cuándo vale la pena patentar:**\n- Método técnico novedoso y no obvio\n- Componente de hardware con mecanismo físico único\n- Formulación farmacéutica o dispositivo médico\n\n**Cuándo omitir las patentes:**\n- Algoritmos de software puro (difíciles de obtener, fáciles de rodear)\n- Métodos de negocio (tribunales escépticos)\n- Si tu foso son la velocidad, los datos o los efectos de red\n\n**Costos:** Patente provisional ($1,500-3K con abogado) da 12 meses. Patente de utilidad completa ($8K-15K) toma +18 meses.\n\n**Alternativa de secreto comercial:** Protección gratuita que nunca expira — mientras puedas mantenerlo secreto.`,
        },
        {
          heading: 'Derechos de Autor: Protegiendo Tu Obra Creativa',
          body: `El derecho de autor protege obras creativas originales — código, escritura, diseño, video. Existe automáticamente al crear; el registro desbloquea el poder de ejecución.\n\n**Qué cubre:**\n- Todo el código fuente y documentación técnica\n- Textos de marketing, artículos de blog, guiones de video\n- Diseños de UI/UX y activos visuales de marca\n- Conjuntos de datos originales\n\n**Qué NO cubre:**\n- Ideas, conceptos, métodos (solo la expresión)\n- Hechos y datos crudos\n- Nombres, títulos, eslóganes (usa marca para esos)\n\n**Por qué registrar ($45-65):** Permite demandar por daños estatutarios de $750-$150K por infracción willful. Registra dentro de 3 meses de publicación.\n\n**Regla trabajo por encargo:** El código creado por empleados y contratistas con acuerdos de asignación de PI pertenece a la empresa.`,
        },
        {
          heading: 'Secretos Comerciales: Protegiendo Tu Ventaja Competitiva',
          body: `Un secreto comercial es cualquier información confidencial que te da ventaja competitiva: algoritmos, listas de clientes, modelos de precios, procesos de fabricación.\n\n**Para calificar como secreto comercial:**\n1. Debe tener valor económico por ser secreto\n2. Debes tomar medidas razonables para mantenerlo secreto\n\n**Protección práctica:**\n- NDAs con empleados, contratistas e inversores\n- Controles de acceso basados en rol\n- Marcar todos los documentos confidenciales\n- Entrevistas de salida: recordar obligaciones de NDA a empleados que se van\n\n**Ejemplos reales:** Algoritmo de búsqueda de Google, fórmula de Coca-Cola, tu CAC por canal, modelo de abandono, LTV por segmento.\n\n**Cuando se roba un secreto comercial:** La Ley de Defensa de Secretos Comerciales (DTSA) permite demandas federales por daños más medidas cautelares. Tu mayor riesgo es un empleado que se va a la competencia — los acuerdos de asignación de PI son tu mejor defensa.`,
        },
      ],
    },
  },


  // ═══ r34: SOP Template Pack ═══
  r34: {
    kind: 'sop',
    content: {
      purpose: 'Provide reusable SOP templates for the 10 most common startup processes.',
      frequency: 'As-needed for process documentation',
      owner: 'Operations Manager',
      steps: [
        { step: 1, action: 'Choose process to document', detail: 'Select from: onboarding, support, billing, deployment, content publishing, feedback, monthly close, bug triage, hiring, cancellation', tools: 'Notion, Google Docs' },
        { step: 2, action: 'Define purpose & owner', detail: 'Purpose: 1 sentence. Owner: role name (not person).' },
        { step: 3, action: 'List 5-8 numbered steps', detail: 'Each step: Action (detail) [Tools]. Include decision points.' },
        { step: 4, action: 'Define 2-3 KPIs', detail: 'Metrics that prove process is working. Example: onboarding KPI = 80% activate within 7 days.' },
        { step: 5, action: 'Document escalation path', detail: 'When do you escalate? To whom? What triggers escalation?' },
        { step: 6, action: 'Store in wiki', detail: 'Link from process dashboard. Keep accessible to team.', tools: 'Notion, Confluence' },
      ],
      kpis: ['% processes documented', 'Avg time to complete process', 'Process adherence rate', 'Customer/team satisfaction with process']
    },
    contentEs: {
      purpose: 'Proporcionar plantillas de SOP reutilizables para los 10 procesos de startup más comunes.',
      frequency: 'Según sea necesario para documentación de procesos',
      owner: 'Gerente de Operaciones',
      steps: [
        { step: 1, action: 'Elige proceso a documentar', detail: 'Selecciona de: incorporación, soporte, facturación, despliegue, publicación de contenido, comentarios, cierre mensual, triaje de errores, contratación, cancelación', tools: 'Notion, Google Docs' },
        { step: 2, action: 'Define propósito y propietario', detail: 'Propósito: 1 oración. Propietario: nombre de rol (no persona).' },
        { step: 3, action: 'Lista 5-8 pasos numerados', detail: 'Cada paso: Acción (detalle) [Herramientas]. Incluye puntos de decisión.' },
        { step: 4, action: 'Define 2-3 KPIs', detail: 'Métricas que demuestran que el proceso funciona. Ejemplo: KPI de incorporación = 80% activan dentro de 7 días.' },
        { step: 5, action: 'Documenta ruta de escalada', detail: '¿Cuándo escalas? ¿A quién? ¿Qué desencadena la escalada?' },
        { step: 6, action: 'Almacena en wiki', detail: 'Enlace desde panel de proceso. Mantener accesible al equipo.', tools: 'Notion, Confluence' },
      ],
      kpis: ['% de procesos documentados', 'Tiempo promedio para completar proceso', 'Tasa de cumplimiento del proceso', 'Satisfacción de cliente/equipo con proceso']
    },
  },


  // ═══ r35: Automation Opportunity Map ═══
  r35: {
    kind: 'infographic',
    content: {
      description: '30 processes to automate with Zapier/Make/n8n: time savings scores and complexity.',
      sections: [
        { title: 'High-ROI (<1 week payoff)', points: ['Slack → invoice paid alerts', 'Form submit → auto PDF email', 'Call log → Salesforce auto', 'Blog → LinkedIn auto-post', 'Daily Drive backup'] },
        { title: 'Medium-ROI (1-4 weeks)', points: ['Feedback digest → Slack daily', 'Invoice log → Airtable auto', 'Support escalation → Slack', 'Financial summary email', 'Unsubscribe cleanup'] },
        { title: 'Long-term (automation culture)', points: ['Document ALL repetitive tasks', 'Audit for 10 hrs/week savings potential', 'Start with top 5 high-ROI automations', 'Build "automation" habit', 'Track time saved monthly'] },
      ],
      keyTakeaway: 'Focus on capturing: data entry, notifications, logging, alerts. Start with 5-10 automations. This unlocks 10-15 hours/week.',
    },
    contentEs: {
      description: '30 procesos para automatizar con Zapier/Make/n8n: puntuaciones de ahorro de tiempo y complejidad.',
      sections: [
        { title: 'Alto ROI (<1 semana de retorno)', points: ['Slack → alertas de factura pagada', 'Envío de formulario → PDF automático por correo', 'Registro de llamada → Salesforce automático', 'Blog → LinkedIn autopost', 'Copia de seguridad de Drive diaria'] },
        { title: 'ROI Medio (1-4 semanas)', points: ['Resumen de comentarios → Slack diario', 'Registro de factura → Airtable automático', 'Escalada de soporte → Slack', 'Correo de resumen financiero', 'Limpieza de desuscripción'] },
        { title: 'Largo plazo (cultura de automatización)', points: ['Documentar TODAS las tareas repetitivas', 'Auditar potencial de ahorro de 10 hrs/semana', 'Comienza con 5 automatizaciones alto-ROI', 'Construir hábito de "automatización"', 'Rastrear tiempo ahorrado mensualmente'] },
      ],
      keyTakeaway: 'Enfócate en capturar: entrada de datos, notificaciones, registro, alertas. Comienza con 5-10 automatizaciones. Esto desbloquea 10-15 horas/semana.',
    },
  },

  // ═══ r36: Project Management — Founder Edition ═══
  r36: {
    kind: 'spreadsheet',
    content: {
      description: 'Lightweight project tracker with RAG status, owner, dependencies, weekly review.',
      columns: [
        { key: 'project', label: 'Project', type: 'text', width: 150 },
        { key: 'status', label: 'RAG', type: 'text', width: 50 },
        { key: 'owner', label: 'Owner', type: 'text', width: 100 },
        { key: 'progress', label: '% Complete', type: 'percent', width: 80 },
        { key: 'blockers', label: 'Blockers', type: 'text', width: 150 },
        { key: 'deadline', label: 'Deadline', type: 'date', width: 100 },
      ],
      rows: [
        { project: 'MVP launch', status: 'Green', owner: 'Tech lead', progress: 85, blockers: 'None', deadline: '2026-02-28' },
        { project: 'Sales deck v2', status: 'Yellow', owner: 'Founder', progress: 60, blockers: 'Needs design review', deadline: '2026-02-14' },
        { project: 'Customer support tier 2', status: 'Red', owner: 'CS lead', progress: 30, blockers: 'Hiring delayed', deadline: '2026-03-31' },
      ],
    },
    contentEs: {
      description: 'Rastreador de proyectos ligero con estado RAG, propietario, dependencias, revisión semanal.',
      columns: [
        { key: 'project', label: 'Proyecto', type: 'text', width: 150 },
        { key: 'status', label: 'RAG', type: 'text', width: 50 },
        { key: 'owner', label: 'Propietario', type: 'text', width: 100 },
        { key: 'progress', label: '% Completado', type: 'percent', width: 80 },
        { key: 'blockers', label: 'Bloqueadores', type: 'text', width: 150 },
        { key: 'deadline', label: 'Plazo', type: 'date', width: 100 },
      ],
      rows: [
        { project: 'Lanzamiento MVP', status: 'Green', owner: 'Líder técnico', progress: 85, blockers: 'Ninguno', deadline: '2026-02-28' },
        { project: 'Presentación de ventas v2', status: 'Yellow', owner: 'Fundador', progress: 60, blockers: 'Necesita revisión de diseño', deadline: '2026-02-14' },
        { project: 'Soporte al cliente nivel 2', status: 'Red', owner: 'Líder de CS', progress: 30, blockers: 'Contratación retrasada', deadline: '2026-03-31' },
      ],
    },
  },

  // ═══ r37: Customer Support Playbook ═══
  r37: {
    kind: 'guide',
    content: {
      sections: [
        { heading: 'Ticket Triage & Routing', body: 'Route tickets immediately: P0 (critical, <1hr) → CTO directly. P1 (high, <4hr) → support lead. P2 (normal, <24hr) → queue. P3 (low, <1wk) → backlog. Document routing in Slack.' },
        { heading: 'SLA Definitions', body: 'SaaS SLA standard: P1 <1hr response, P2 <4hr response. Set expectations in ToS. Track SLA compliance weekly. Miss 2 SLAs = post-mortem.' },
        { heading: 'Canned Responses', body: 'Build 20-30 canned responses for common questions. Cover: billing questions, feature requests, technical troubleshooting, password resets. Use templates in Help Scout or Intercom.' },
        { heading: 'Escalation & CSAT', body: 'If customer angry (keywords: "unacceptable", "terrible") → escalate to founder immediately. After resolution, send NPS survey. Target CSAT >80%.' },
      ],
    },
    contentEs: {
      sections: [
        { heading: 'Triaje y Enrutamiento de Tickets', body: 'Enruta tickets inmediatamente: P0 (crítico, <1hr) → CTO directo. P1 (alto, <4hr) → líder de soporte. P2 (normal, <24hr) → cola. P3 (bajo, <1sem) → backlog. Documentar enrutamiento en Slack.' },
        { heading: 'Definiciones de SLA', body: 'SLA estándar de SaaS: P1 <1hr respuesta, P2 <4hr respuesta. Establecer expectativas en ToS. Rastrear cumplimiento de SLA semanalmente. Perder 2 SLAs = análisis posterior.' },
        { heading: 'Respuestas Predeterminadas', body: 'Construir 20-30 respuestas predeterminadas para preguntas comunes. Cubrir: preguntas de facturación, solicitudes de características, solución de problemas técnicos, restablecimiento de contraseña. Usar plantillas en Help Scout o Intercom.' },
        { heading: 'Escalada y CSAT', body: 'Si cliente enojado (palabras clave: "inaceptable", "terrible") → escalar a fundador inmediatamente. Después de resolver, enviar encuesta NPS. Objetivo CSAT >80%.' },
      ],
    },
  },

  // ═══ r38: Monthly Business Review Template ═══
  r38: {
    kind: 'template',
    content: {
      description: 'One-page MBR: KPIs, wins, blockers, resource requests, next-month priorities.',
      fields: [
        { label: 'Month', placeholder: 'January 2026', type: 'text', required: true },
        { label: 'MRR / ARR', placeholder: '$50K ARR', type: 'text', required: true },
        { label: 'Churn Rate %', placeholder: '2%', type: 'number' },
        { label: 'Top 3 Wins', placeholder: 'Won 3 new enterprise deals', type: 'textarea' },
        { label: 'Top 3 Blockers', placeholder: 'Engineering bandwidth, sales hiring', type: 'textarea' },
      ],
      sections: [
        { heading: 'Format', body: 'One page max. Share with board/advisors/team. Include: metric summary, narrative wins, obstacles, asks.' },
        { heading: 'Key Metrics Section', body: 'MRR/ARR | Churn | CAC | LTV | Burn rate | Runway | Active users | NPS | Revenue targets vs actual' },
        { heading: 'Narrative', body: 'Wins: What went right? Blockers: What slowed us down? Asks: What resources do you need?' },
      ],
    },
    contentEs: {
      description: 'MBR de una página: KPIs, ganancias, bloqueadores, solicitudes de recursos, prioridades del próximo mes.',
      fields: [
        { label: 'Mes', placeholder: 'Enero 2026', type: 'text', required: true },
        { label: 'MRR / ARR', placeholder: '$50K ARR', type: 'text', required: true },
        { label: 'Tasa de Pérdida %', placeholder: '2%', type: 'number' },
        { label: 'Top 3 Ganancias', placeholder: 'Ganó 3 nuevos tratos empresariales', type: 'textarea' },
        { label: 'Top 3 Bloqueadores', placeholder: 'Ancho de banda de ingeniería, contratación de ventas', type: 'textarea' },
      ],
      sections: [
        { heading: 'Formato', body: 'Una página máximo. Compartir con junta directiva/asesores/equipo. Incluir: resumen de métrica, ganancias narrativas, obstáculos, solicitudes.' },
        { heading: 'Sección de Métricas Clave', body: 'MRR/ARR | Pérdida | CAC | LTV | Tasa de quema | Autonomía | Usuarios activos | NPS | Objetivos de ingresos vs real' },
        { heading: 'Narrativa', body: 'Ganancias: ¿Qué salió bien? Bloqueadores: ¿Qué nos ralentizó? Solicitudes: ¿Qué recursos necesitas?' },
      ],
    },
  },

  // ═══ r39: Hiring Scorecard Template ═══
  r39: {
    kind: 'template',
    content: {
      description: 'Structured interview scorecard with competencies, red flags, and culture fit assessment.',
      fields: [
        { label: 'Candidate Name', placeholder: 'Jane Doe', type: 'text', required: true },
        { label: 'Role', placeholder: 'Senior Software Engineer', type: 'text', required: true },
        { label: 'Technical Score (1-5)', placeholder: '4', type: 'number' },
        { label: 'Culture Fit (1-5)', placeholder: '4', type: 'number' },
        { label: 'Red Flags?', placeholder: 'e.g., job hops every 1 year', type: 'textarea' },
      ],
      sections: [
        { heading: 'Interview Questions', body: 'Ask 5-7 behavioral questions: "Tell me about a time you...". Score each: 1=poor, 5=excellent.' },
        { heading: 'Red Flag Checklist', body: 'Watch for: short tenure at previous jobs, vague answers, doesn\'t ask questions, bad-mouths previous employers, misses deadline for interview.' },
        { heading: 'Scoring', body: 'Technical >3 + Culture >3 = phone screen pass. Technical >4 + Culture >4 = offer. Below that = rejection.' },
      ],
    },
    contentEs: {
      description: 'Tarjeta de puntuación de entrevista estructurada con competencias, banderas rojas y evaluación de ajuste cultural.',
      fields: [
        { label: 'Nombre del Candidato', placeholder: 'Jane Doe', type: 'text', required: true },
        { label: 'Rol', placeholder: 'Ingeniero de Software Sénior', type: 'text', required: true },
        { label: 'Puntuación Técnica (1-5)', placeholder: '4', type: 'number' },
        { label: 'Ajuste Cultural (1-5)', placeholder: '4', type: 'number' },
        { label: '¿Banderas Rojas?', placeholder: 'Ej: cambia de trabajo cada 1 año', type: 'textarea' },
      ],
      sections: [
        { heading: 'Preguntas de Entrevista', body: 'Hacer 5-7 preguntas conductuales: "Cuéntame sobre una vez que...". Puntuar cada una: 1=pobre, 5=excelente.' },
        { heading: 'Lista de Verificación de Banderas Rojas', body: 'Observar: tenencia corta en trabajos anteriores, respuestas vagas, no hace preguntas, critica anteriores empleadores, pierde plazo para entrevista.' },
        { heading: 'Puntuación', body: 'Técnico >3 + Cultura >3 = pasar pantalla telefónica. Técnico >4 + Cultura >4 = oferta. Por debajo de eso = rechazo.' },
      ],
    },
  },

  // ═══ r40: Employee Onboarding 30-60-90 Plan ═══
  r40: {
    kind: 'template',
    content: {
      description: 'Milestones for first 90 days: buddy system, manager check-ins, ramp-up metrics.',
      fields: [
        { label: 'Employee Name', placeholder: 'John Smith', type: 'text', required: true },
        { label: 'Start Date', placeholder: '2026-02-01', type: 'date', required: true },
        { label: 'Manager', placeholder: 'Jane Founder', type: 'text', required: true },
        { label: 'Buddy (Peer Mentor)', placeholder: 'Sarah Engineer', type: 'text' },
      ],
      sections: [
        { heading: 'Day 1-30: Ramp-Up', body: 'Goal: Understand culture, get laptop, learn tools. Day 1: office tour, team lunch. Week 1: codebase overview, 1-on-1s with team. Week 2: first small task. Week 4: 30-day check-in with manager.' },
        { heading: 'Day 31-60: Contribute', body: 'Goal: Complete first real project. Week 5-8: assigned project (2-week sprint). Bi-weekly 1-on-1s. 60-day check-in: manager assesses independence.' },
        { heading: 'Day 61-90: Independent', body: 'Goal: Own full project from start to finish. Take leadership role on initiative. 90-day review: pass/fail decision (rare to fail; means poor hire or poor onboarding).' },
      ],
    },
    contentEs: {
      description: 'Hitos para los primeros 90 días: sistema de compañero, check-ins del gerente, métricas de rampa de acceso.',
      fields: [
        { label: 'Nombre del Empleado', placeholder: 'John Smith', type: 'text', required: true },
        { label: 'Fecha de Inicio', placeholder: '2026-02-01', type: 'date', required: true },
        { label: 'Gerente', placeholder: 'Jane Founder', type: 'text', required: true },
        { label: 'Compañero (Mentor de Pares)', placeholder: 'Sarah Engineer', type: 'text' },
      ],
      sections: [
        { heading: 'Días 1-30: Rampa de Acceso', body: 'Objetivo: Comprender cultura, obtener portátil, aprender herramientas. Día 1: tour de oficina, almuerzo de equipo. Semana 1: descripción general del código, 1-on-1s con equipo. Semana 2: primera pequeña tarea. Semana 4: check-in de 30 días con gerente.' },
        { heading: 'Días 31-60: Contribuir', body: 'Objetivo: Completar primer proyecto real. Semanas 5-8: proyecto asignado (sprint de 2 semanas). 1-on-1s quincenales. Check-in de 60 días: el gerente evalúa la independencia.' },
        { heading: 'Días 61-90: Independiente', body: 'Objetivo: Poseer proyecto completo de inicio a fin. Asumir rol de liderazgo en iniciativa. Revisión de 90 días: decisión de pasar/fallar (raro fallar; significa contratación pobre u incorporación pobre).' },
      ],
    },
  },

  // Continue with remaining resources (abbreviated for token economy)
  r41: {
    kind: 'guide',
    content: {
      sections: [
        { heading: 'Async Communication Foundations', body: 'Document everything. Write proposals, decisions, meeting notes. Use Slack for real-time only. Use Notion/Docs for permanent. Rule: if it matters, write it down.' },
        { heading: 'Virtual Watercooler', body: 'Dedicate one Slack channel to non-work banter. Monthly all-hands + virtual coffee chats. Annual in-person offsite.' },
        { heading: 'Documentation Culture', body: 'Every process lives in wiki. Every decision documented with rationale. New hire should be able to ramp by reading docs, not asking.' },
      ]
    },
    contentEs: {
      sections: [
        { heading: 'Fundamentos de Comunicación Asincrónica', body: 'Documentar todo. Escribir propuestas, decisiones, notas de reuniones. Usar Slack solo para tiempo real. Usar Notion/Docs para permanente. Regla: si importa, escríbelo.' },
        { heading: 'Charla Virtual de Enfriador', body: 'Dedicar un canal de Slack al banter no relacionado con el trabajo. All-hands mensual + chats de café virtuales. Retiro presencial anual.' },
        { heading: 'Cultura de Documentación', body: 'Cada proceso vive en wiki. Cada decisión documentada con lógica. El nuevo empleado debería poder ramparse leyendo docs, no preguntando.' },
      ]
    },
  },

  r42: {
    kind: 'spreadsheet',
    content: {
      description: 'Salary bands by role/stage/location, equity ranges seed to Series C.',
      columns: [
        { key: 'role', label: 'Role', type: 'text' },
        { key: 'seed_salary', label: 'Seed Stage Salary', type: 'currency' },
        { key: 'seed_equity', label: 'Seed Equity %', type: 'percent' },
        { key: 'series_a_salary', label: 'Series A Salary', type: 'currency' },
        { key: 'series_a_equity', label: 'Series A Equity %', type: 'percent' },
      ],
      rows: [
        { role: 'CTO/Tech Lead', seed_salary: 120000, seed_equity: 2, series_a_salary: 180000, series_a_equity: 1 },
        { role: 'VP Sales', seed_salary: 100000, seed_equity: 1.5, series_a_salary: 160000, series_a_equity: 0.8 },
        { role: 'Senior Engineer', seed_salary: 140000, seed_equity: 1, series_a_salary: 170000, series_a_equity: 0.5 },
      ],
    },
    contentEs: {
      description: 'Bandas de salario por rol/etapa/ubicación, rangos de patrimonio seed a Series C.',
      columns: [
        { key: 'role', label: 'Rol', type: 'text' },
        { key: 'seed_salary', label: 'Salario Etapa Seed', type: 'currency' },
        { key: 'seed_equity', label: 'Patrimonio Seed %', type: 'percent' },
        { key: 'series_a_salary', label: 'Salario Series A', type: 'currency' },
        { key: 'series_a_equity', label: 'Patrimonio Series A %', type: 'percent' },
      ],
      rows: [
        { role: 'CTO/Líder Técnico', seed_salary: 120000, seed_equity: 2, series_a_salary: 180000, series_a_equity: 1 },
        { role: 'VP Ventas', seed_salary: 100000, seed_equity: 1.5, series_a_salary: 160000, series_a_equity: 0.8 },
        { role: 'Ingeniero Sénior', seed_salary: 140000, seed_equity: 1, series_a_salary: 170000, series_a_equity: 0.5 },
      ],
    },
  },

  r43: {
    kind: 'template',
    content: {
      description: 'Continuous feedback model, goal setting, competency matrix, growth conversations.',
      fields: [
        { label: 'Employee', placeholder: 'John Smith', type: 'text', required: true },
        { label: 'Review Period', placeholder: 'Q1 2026', type: 'text', required: true },
        { label: 'Overall Rating', placeholder: '1-5 (1=needs improvement, 5=exceeds)', type: 'number' },
      ],
      sections: [
        { heading: 'Continuous Feedback', body: 'Monthly 1-on-1s include: what went well, what could improve. No surprises at review.' },
        { heading: 'Goal Setting', body: 'OKRs quarterly. Each employee owns 2-3 OKRs aligned to company goals.' },
        { heading: 'Growth Conversation', body: 'Annual: where do you want to grow? What skills? What role 2-3 years? Create growth plan.' },
      ],
    },
    contentEs: {
      description: 'Modelo de retroalimentación continua, establecimiento de objetivos, matriz de competencias, conversaciones de crecimiento.',
      fields: [
        { label: 'Empleado', placeholder: 'John Smith', type: 'text', required: true },
        { label: 'Período de Revisión', placeholder: 'Q1 2026', type: 'text', required: true },
        { label: 'Calificación General', placeholder: '1-5 (1=necesita mejora, 5=supera)', type: 'number' },
      ],
      sections: [
        { heading: 'Retroalimentación Continua', body: '1-on-1s mensuales incluyen: qué salió bien, qué podría mejorar. Sin sorpresas en revisión.' },
        { heading: 'Establecimiento de Objetivos', body: 'OKRs trimestrales. Cada empleado es propietario de 2-3 OKRs alineados con objetivos de la compañía.' },
        { heading: 'Conversación de Crecimiento', body: 'Anual: ¿dónde quieres crecer? ¿Qué habilidades? ¿Qué rol en 2-3 años? Crear plan de crecimiento.' },
      ],
    },
  },


  // ═══ r45: Fundraising CRM & Investor Pipeline ═══
  r45: {
    kind: 'spreadsheet',
    content: {
      description: 'Track every investor touchpoint, fund fit scoring, close-probability forecasting. Manage warm intro pipeline, meeting notes, and follow-up actions.',
      columns: [
        { key: 'investor_name', label: 'Investor Name', type: 'text' },
        { key: 'fund', label: 'Fund / Company', type: 'text' },
        { key: 'fit_score', label: 'Fund Fit (1-10)', type: 'number' },
        { key: 'last_contact', label: 'Last Contact', type: 'date' },
        { key: 'next_step', label: 'Next Step', type: 'text' },
        { key: 'close_probability', label: 'Close %', type: 'percent' },
      ],
      rows: [
        { investor_name: 'Alex from Sequoia', fund: 'Sequoia Capital', fit_score: 9, last_contact: '2024-01-15', next_step: 'Send deck + financials', close_probability: 0.7 },
        { investor_name: 'Sarah at Andreessen', fund: 'Andreessen Horowitz', fit_score: 8, last_contact: '2024-01-10', next_step: 'Follow-up call Wed', close_probability: 0.5 },
        { investor_name: 'Michael at Seed Fund', fund: 'Seed Round Ventures', fit_score: 6, last_contact: '2024-01-20', next_step: 'Warm intro needed', close_probability: 0.2 },
      ],
    },
    contentEs: {
      description: 'Rastrear cada punto de contacto de inversor, puntuación de ajuste de fondo, pronóstico de probabilidad de cierre. Gestiona pipeline de introducción cálida, notas de reuniones y acciones de seguimiento.',
      columns: [
        { key: 'investor_name', label: 'Nombre del Inversor', type: 'text' },
        { key: 'fund', label: 'Fondo / Empresa', type: 'text' },
        { key: 'fit_score', label: 'Ajuste de Fondo (1-10)', type: 'number' },
        { key: 'last_contact', label: 'Último Contacto', type: 'date' },
        { key: 'next_step', label: 'Siguiente Paso', type: 'text' },
        { key: 'close_probability', label: 'Probabilidad %', type: 'percent' },
      ],
      rows: [
        { investor_name: 'Alex de Sequoia', fund: 'Sequoia Capital', fit_score: 9, last_contact: '2024-01-15', next_step: 'Enviar deck + finanzas', close_probability: 0.7 },
        { investor_name: 'Sarah en Andreessen', fund: 'Andreessen Horowitz', fit_score: 8, last_contact: '2024-01-10', next_step: 'Llamada de seguimiento Mié', close_probability: 0.5 },
        { investor_name: 'Michael en Seed Fund', fund: 'Seed Round Ventures', fit_score: 6, last_contact: '2024-01-20', next_step: 'Introducción cálida necesaria', close_probability: 0.2 },
      ],
    },
  },

  // ═══ r46: Term Sheet Decoder ═══
  r46: {
    kind: 'cheatsheet',
    content: {
      intro: 'Essential term sheet concepts that every founder should understand. These terms define investor rights and your dilution.',
      items: [
        { term: 'Liquidation Preference', definition: 'Investors are paid first before founders when company is acquired or shuts down', example: '1x liquidation preference: investors get $1 back for every $1 invested, before founders get anything' },
        { term: 'Anti-dilution', definition: 'Your ownership % is protected if next funding round values company lower than this round', example: 'You own 20% at $5M valuation. Series A is $3M valuation. Anti-dilution protects your 20% (or adjusts investor shares down instead)' },
        { term: 'Board Seats', definition: 'Investors get governance rights to vote on major decisions', example: 'Investor gets 1 board seat out of 5, so they have veto power on hiring CEO, raising more money, or selling company' },
        { term: 'Participating Preferred', definition: 'Investor gets their liquidation preference AND a share of remaining proceeds (double-dip)', example: 'Investor gets $1M back, PLUS 10% of remaining $10M = $1M + $1M' },
        { term: 'Drag-Along', definition: 'Majority shareholders can force minority (like founders) to sell company', example: 'If VCs want to sell startup, they can force you to sell at their price, even if you don\'t want to' },
        { term: 'Pro-Rata Rights', definition: 'Investor can participate in future funding rounds to maintain their ownership %', example: 'Investor owns 20%. In Series B, they can buy more shares to stay at 20%' },
      ],
      tip: 'Red flags: >2x liquidation preference, non-participating preferred (often better for founders), terms without clear valuation cap in SAFE/convertible',
    },
    contentEs: {
      intro: 'Conceptos esenciales de hoja de términos que todo fundador debe entender. Estos términos definen derechos de inversor y tu dilución.',
      items: [
        { term: 'Preferencia de Liquidación', definition: 'Los inversores se pagan primero antes que los fundadores cuando se adquiere o cierra la empresa', example: 'Preferencia de liquidación 1x: inversores obtienen $1 devueltos por cada $1 invertido, antes de que los fundadores obtengan algo' },
        { term: 'Anti-dilusión', definition: 'Tu porcentaje de propiedad está protegido si la próxima ronda de financiación valúa la empresa más baja que esta ronda', example: 'Posees 20% en valuación $5M. Serie A es $3M. Anti-dilusión protege tu 20% (o ajusta acciones de inversor hacia abajo en su lugar)' },
        { term: 'Asientos en la Junta', definition: 'Los inversores obtienen derechos de gobernanza para votar sobre decisiones principales', example: 'Inversor obtiene 1 asiento de junta de 5, por lo que tiene derecho de veto sobre contratar CEO, recaudar más dinero o vender empresa' },
        { term: 'Preferentes Participantes', definition: 'El inversor obtiene su preferencia de liquidación Y una parte de las ganancias restantes (doble-caída)', example: 'Inversor obtiene $1M de vuelta, PLUS 10% de los $10M restantes = $1M + $1M' },
        { term: 'Arrastrar', definition: 'Los accionistas mayoritarios pueden obligar a los minoritarios (como los fundadores) a vender la empresa', example: 'Si los VC quieren vender la startup, pueden obligarte a vender al su precio, incluso si no quieres' },
        { term: 'Derechos Pro-Rata', definition: 'El inversor puede participar en rondas de financiación futuras para mantener su porcentaje de propiedad', example: 'Inversor posee 20%. En Serie B, pueden comprar más acciones para permanecer en 20%' },
      ],
      tip: 'Señales de alerta: >2x preferencia de liquidación, preferentes no participantes (a menudo mejor para fundadores), términos sin tope de valuación claro en SAFE/convertible',
    },
  },

  // ═══ r47: Valuation Methods ═══
  r47: {
    kind: 'guide',
    content: {
      sections: [
        {
          heading: 'Scorecard Method: Benchmark Against Comparable Companies',
          body: `The Scorecard Method (Bill Payne) starts from an average pre-money valuation for comparable seed-stage companies in your region and adjusts based on qualitative factors.\n\n**Base valuation (US seed average): $2-4M pre-money**\n\n**Adjustment factors (weight × score 0-1.5):**\n| Factor | Weight |\n|--------|--------|\n| Strength of team | 30% |\n| Size of opportunity | 25% |\n| Product/technology | 15% |\n| Competitive environment | 10% |\n| Marketing/sales channels | 10% |\n| Need for additional investment | 5% |\n| Other (timing, IP) | 5% |\n\n**Example:** Base $3M × (0.30×1.3 + 0.25×1.2 + 0.15×1.0 + 0.10×0.9 + 0.10×1.1 + 0.05×1.0 + 0.05×1.0) = $3M × 1.18 = **$3.54M**\n\n**Best for:** Angel rounds, very early stage with no revenue.`,
        },
        {
          heading: 'Berkus Method: Milestone-Based Valuation',
          body: `Created by super-angel Dave Berkus, this method assigns value based on de-risking milestones. Maximum pre-money: $2.5M (US) before revenue.\n\n**Up to $500K for each:**\n1. **Compelling idea** — Reduces idea/concept risk\n2. **Prototype** — Reduces technology risk\n3. **Quality management team** — Reduces execution risk\n4. **Strategic relationships** — Reduces market risk\n5. **Product rollout or sales** — Reduces production risk\n\n**Example:** Idea ✓ ($500K) + Prototype ✓ ($400K) + Team ✓ ($500K) + 2 LOIs ($300K) + No revenue yet ($0) = **$1.7M pre-money**\n\n**Best for:** Idea/pre-revenue stage, especially deep tech and hardware where milestones matter more than revenue.`,
        },
        {
          heading: 'Risk Factor Summation: Systematic Risk Assessment',
          body: `Start with a base valuation, then add or subtract up to $500K for 12 risk factors. Each factor rated: very positive (+2), positive (+1), neutral (0), negative (-1), very negative (-2).\n\n**12 Risk Factors:**\n1. Management risk\n2. Stage of business risk\n3. Legislation/political risk\n4. Manufacturing risk\n5. Sales & marketing risk\n6. Funding/capital raising risk\n7. Competition risk\n8. Technology risk\n9. Litigation risk\n10. International risk\n11. Reputation risk\n12. Potential lucrative exit risk\n\n**Calculation:** Base $2M + (sum of ratings × $250K)\n\n**Example:** If 7 factors rate +1 and 5 factors rate neutral: $2M + (7 × $250K) = **$3.75M**\n\n**Best for:** When you want a comprehensive risk-adjusted valuation with investor input.`,
        },
        {
          heading: 'DCF & Negotiation: Post-Revenue Valuation',
          body: `Once you have revenue, you can use forward-looking multiples and DCF to anchor valuation discussions.\n\n**Revenue Multiples (2024 market):**\n- SaaS (growing 50%+ MoM): 10-20x ARR\n- SaaS (growing 20-50% MoM): 5-10x ARR\n- SaaS (<20% growth): 3-5x ARR\n- Marketplace: 3-8x GMV take-rate revenue\n\n**Negotiation tactics:**\n- **Triangulate:** Show 3 methods → pick the middle\n- **Comparable exits:** Reference recent acquisitions/rounds in your space\n- **Anchor high:** Your first number sets the range. Always anchor above your target\n- **Justify with milestones:** "This valuation reflects hitting $X ARR in 12 months"\n- **The best leverage:** Multiple competing term sheets. If you have one, you can get more\n\n**SAFE vs Priced Round:** SAFEs defer valuation to the next round. Use a valuation cap ($2-5M for pre-revenue) to bound your dilution. Post-money SAFEs (YC standard) are now most common.`,
        },
      ],
    },
    contentEs: {
      sections: [
        {
          heading: 'Método Scorecard: Comparación con Empresas Similares',
          body: `El Método Scorecard (Bill Payne) parte de una valuación promedio pre-dinero para empresas comparables en etapa semilla y ajusta según factores cualitativos.\n\n**Valuación base (promedio semilla en EE.UU.): $2-4M pre-dinero**\n\n**Factores de ajuste (peso × puntuación 0-1.5):**\n- Fortaleza del equipo: 30%\n- Tamaño de la oportunidad: 25%\n- Producto/tecnología: 15%\n- Entorno competitivo: 10%\n- Canales de marketing/ventas: 10%\n- Necesidad de inversión adicional: 5%\n- Otros (timing, PI): 5%\n\n**Ejemplo:** Base $3M × multiplicador ponderado = $3.54M\n\n**Mejor para:** Rondas ángel, etapa muy temprana sin ingresos.`,
        },
        {
          heading: 'Método Berkus: Valuación Basada en Hitos',
          body: `Creado por el súper-ángel Dave Berkus. Asigna valor basado en hitos de mitigación de riesgo. Máximo pre-dinero: $2.5M antes de ingresos.\n\n**Hasta $500K por cada uno:**\n1. **Idea convincente** — Reduce riesgo de concepto\n2. **Prototipo** — Reduce riesgo tecnológico\n3. **Equipo de gestión de calidad** — Reduce riesgo de ejecución\n4. **Relaciones estratégicas** — Reduce riesgo de mercado\n5. **Lanzamiento o ventas** — Reduce riesgo de producción\n\n**Ejemplo:** Idea ✓ ($500K) + Prototipo ✓ ($400K) + Equipo ✓ ($500K) + 2 LOIs ($300K) = **$1.7M pre-dinero**\n\n**Mejor para:** Etapa idea/pre-ingresos, especialmente tech profunda y hardware.`,
        },
        {
          heading: 'Suma de Factores de Riesgo: Evaluación Sistemática',
          body: `Comienza con una valuación base, luego agrega o resta hasta $500K por 12 factores de riesgo. Cada factor se califica: muy positivo (+2), positivo (+1), neutral (0), negativo (-1), muy negativo (-2).\n\n**12 Factores de Riesgo:** Riesgo de gestión, etapa del negocio, legislación/político, fabricación, ventas y marketing, financiamiento, competencia, tecnología, litigios, internacional, reputación, potencial de salida lucrativa.\n\n**Cálculo:** Base $2M + (suma de calificaciones × $250K)\n\n**Mejor para:** Valuación completa ajustada al riesgo con aportación de inversores.`,
        },
        {
          heading: 'DCF y Negociación: Valuación Post-Ingresos',
          body: `Una vez que tienes ingresos, puedes usar múltiplos prospectivos y DCF.\n\n**Múltiplos de ingresos (mercado 2024):**\n- SaaS (crecimiento >50% MoM): 10-20x ARR\n- SaaS (crecimiento 20-50%): 5-10x ARR\n- SaaS (<20% crecimiento): 3-5x ARR\n\n**Tácticas de negociación:**\n- **Triangula:** Muestra 3 métodos → elige el del medio\n- **Ancla alto:** Tu primer número establece el rango\n- **Justifica con hitos:** "Esta valuación refleja alcanzar $X ARR en 12 meses"\n- **Mejor palanca:** Múltiples term sheets competidores\n\n**SAFE vs Ronda con precio:** Los SAFEs difieren la valuación a la próxima ronda. Usa un tope de valuación ($2-5M pre-ingresos) para acotar tu dilución.`,
        },
      ],
    },
  },

  // ═══ r48: Cap Table Simulator ═══
  r48: {
    kind: 'spreadsheet',
    content: {
      description: 'Model dilution through multiple funding rounds. See exactly how much equity each founder, employee, and investor holds after every round — before you sign anything.',
      columns: [
        { key: 'round', label: 'Round', type: 'text', width: 120 },
        { key: 'investment', label: 'Investment ($)', type: 'currency', width: 140 },
        { key: 'preMoney', label: 'Pre-Money Val ($)', type: 'currency', width: 160 },
        { key: 'dilution', label: 'New Dilution (%)', type: 'percent', width: 150 },
        { key: 'founderOwnership', label: 'Founder Ownership (%)', type: 'percent', width: 180 },
      ],
      rows: [
        { round: 'Founding', investment: 0, preMoney: 0, dilution: 0, founderOwnership: 100 },
        { round: 'Friends & Family ($150K SAFE)', investment: 150000, preMoney: 1500000, dilution: 9.1, founderOwnership: 90.9 },
        { round: 'Seed ($1.2M at $6M pre)', investment: 1200000, preMoney: 6000000, dilution: 16.7, founderOwnership: 75.7 },
        { round: 'Series A ($8M at $24M pre)', investment: 8000000, preMoney: 24000000, dilution: 25, founderOwnership: 56.8 },
      ],
      formulas: {
        dilution: '(investment / (preMoney + investment)) * 100',
        founderOwnership: 'previousOwnership * (1 - newDilution/100)',
      },
    },
    contentEs: {
      description: 'Modela la dilución a través de múltiples rondas de financiamiento. Ve exactamente cuánto patrimonio tiene cada fundador, empleado e inversor después de cada ronda — antes de firmar.',
      columns: [
        { key: 'round', label: 'Ronda', type: 'text', width: 120 },
        { key: 'investment', label: 'Inversión ($)', type: 'currency', width: 140 },
        { key: 'preMoney', label: 'Valuación Pre-Dinero ($)', type: 'currency', width: 160 },
        { key: 'dilution', label: 'Nueva Dilución (%)', type: 'percent', width: 150 },
        { key: 'founderOwnership', label: 'Propiedad del Fundador (%)', type: 'percent', width: 180 },
      ],
      rows: [
        { round: 'Fundación', investment: 0, preMoney: 0, dilution: 0, founderOwnership: 100 },
        { round: 'Amigos & Familia ($150K SAFE)', investment: 150000, preMoney: 1500000, dilution: 9.1, founderOwnership: 90.9 },
        { round: 'Semilla ($1.2M a $6M pre)', investment: 1200000, preMoney: 6000000, dilution: 16.7, founderOwnership: 75.7 },
        { round: 'Serie A ($8M a $24M pre)', investment: 8000000, preMoney: 24000000, dilution: 25, founderOwnership: 56.8 },
      ],
      formulas: {
        dilution: '(inversión / (preMoneyVal + inversión)) * 100',
        founderOwnership: 'propiedadAnterior * (1 - nuevaDilución/100)',
      },
    },
  },

  // ═══ r49: Investor Update Template ═══
  r49: {
    kind: 'template',
    content: {
      description: 'Monthly investor update: KPIs, key wins, learnings, asks, and financials. Build trust through radical transparency — investors who feel informed become your best champions.',
      fields: [
        { label: 'Company Name', placeholder: 'Your startup', type: 'text', required: true },
        { label: 'Month / Period', placeholder: 'e.g., January 2025', type: 'text', required: true },
        { label: 'MRR (this month)', placeholder: 'e.g., $45,000', type: 'text', required: true },
        { label: 'MRR Growth vs Last Month', placeholder: 'e.g., +18%', type: 'text', required: true },
        { label: 'Cash Runway Remaining', placeholder: 'e.g., 14 months at current burn', type: 'text', required: true },
      ],
      sections: [
        {
          heading: 'The 5-Section Investor Update Format',
          body: `**1. KPIs (3-5 numbers, nothing more)**\n- MRR: $45K (+18% MoM)\n- ARR: $540K\n- Churn: 2.1%\n- New customers: 12\n- Cash runway: 14 months\n\n**2. Top Wins This Month (2-3 bullets)**\n- Closed $25K/year enterprise deal with [Logo]\n- Launched new pricing — conversion up 22%\n- Hired VP Engineering starting March 1\n\n**3. Challenges & What We Learned (be honest)**\n- Lost 2 enterprise deals to [competitor] due to missing SSO — adding to Q1 roadmap\n- CAC increased 15% on paid channels — shifting budget to content\n\n**4. Asks (max 3 specific requests)**\n- Intro to VP Eng at [target hire's company] — anyone connected?\n- Warm intro to [specific VC fund] for Series A\n- Customer intro: CFOs at mid-market SaaS companies\n\n**5. Financials Summary**\n- Burn: $85K/month\n- Cash: $1.2M\n- Runway: 14 months`,
        },
        {
          heading: 'Update Timing & Cadence',
          body: `**Monthly:** Standard cadence. Send within first 5 business days of each month.\n\n**What to include even when things are bad:**\nCounterintuitive but critical — bad news shared proactively builds MORE trust than only sharing wins. Investors have seen 100 companies fail. They respect honesty. They hate surprises.\n\n**Pro tips:**\n- Keep it under 400 words + 5 numbers\n- Same format every month (investors look for the same metrics)\n- Reply-all welcome — make it easy for them to connect you\n- One-click "I can help with #3" CTA for asks`,
        },
        {
          heading: 'Ask Templates That Get Responses',
          body: `Bad ask: "Do you know any enterprise customers?"\nGood ask: "Do you know any CFOs at 50-200 person SaaS companies struggling with expense management? Specifically looking for someone who has felt the pain of month-end close."\n\nBad ask: "Any VC intros?"\nGood ask: "We're raising a $3M seed round. Looking for a lead investor who has backed B2B SaaS companies that sell to finance teams. Do you know anyone at [Specific Fund 1] or [Specific Fund 2]?"\n\n**Rule:** The more specific your ask, the easier it is to fulfill.`,
        },
      ],
    },
    contentEs: {
      description: 'Actualización mensual para inversores: KPIs, victorias clave, aprendizajes, solicitudes y finanzas. Construye confianza a través de transparencia radical.',
      fields: [
        { label: 'Nombre de la Empresa', placeholder: 'Tu startup', type: 'text', required: true },
        { label: 'Mes / Período', placeholder: 'Ej: Enero 2025', type: 'text', required: true },
        { label: 'MRR (este mes)', placeholder: 'Ej: $45,000', type: 'text', required: true },
        { label: 'Crecimiento MRR vs Mes Anterior', placeholder: 'Ej: +18%', type: 'text', required: true },
        { label: 'Runway de Caja Restante', placeholder: 'Ej: 14 meses a la quema actual', type: 'text', required: true },
      ],
      sections: [
        {
          heading: 'El Formato de Actualización de 5 Secciones',
          body: `**1. KPIs (3-5 números, nada más)**\n- MRR: $45K (+18% MoM)\n- ARR: $540K\n- Abandono: 2.1%\n- Nuevos clientes: 12\n- Runway de caja: 14 meses\n\n**2. Principales Victorias Este Mes (2-3 puntos)**\n- Cerrado trato empresarial $25K/año con [Logo]\n- Nuevo precio lanzado — conversión aumentó 22%\n- Contratado VP de Ingeniería para el 1 de marzo\n\n**3. Desafíos y Aprendizajes (sé honesto)**\n- Perdimos 2 tratos empresariales por falta de SSO — añadiendo al roadmap Q1\n- CAC aumentó 15% en canales de pago — cambiando presupuesto a contenido\n\n**4. Solicitudes (máximo 3 específicas)**\n- Intro a VP Eng en [empresa objetivo] — ¿alguien conectado?\n- Intro cálida a [fondo de VC específico] para Serie A\n- Intro a clientes: CFOs en empresas SaaS de mediana empresa\n\n**5. Resumen Financiero**\n- Quema: $85K/mes\n- Caja: $1.2M\n- Runway: 14 meses`,
        },
        {
          heading: 'Cadencia y Timing de Actualizaciones',
          body: `**Mensual:** Cadencia estándar. Enviar dentro de los primeros 5 días hábiles de cada mes.\n\n**Qué incluir incluso cuando las cosas van mal:**\nContraintuitivo pero crítico — las malas noticias compartidas de forma proactiva construyen MÁS confianza que compartir solo victorias. Los inversores han visto fallar a 100 empresas. Respetan la honestidad. Odian las sorpresas.\n\n**Consejos pro:**\n- Menos de 400 palabras + 5 números\n- Mismo formato cada mes\n- CTA simple para solicitudes`,
        },
        {
          heading: 'Plantillas de Solicitudes que Obtienen Respuestas',
          body: `Mala solicitud: "¿Conoces algún cliente empresarial?"\nBuena solicitud: "¿Conoces algún CFO en empresas SaaS de 50-200 personas que luche con la gestión de gastos? Específicamente busco alguien que haya sentido el dolor del cierre de fin de mes."\n\nMala solicitud: "¿Alguna intro a VC?"\nBuena solicitud: "Estamos levantando una ronda semilla de $3M. Buscamos un inversor líder que haya respaldado empresas SaaS B2B que venden a equipos de finanzas. ¿Conoces a alguien en [Fondo Específico]?"\n\n**Regla:** Cuanto más específica sea tu solicitud, más fácil es cumplirla.`,
        },
      ],
    },
  },

  // ═══ r50: Board Deck Template ═══
  r50: {
    kind: 'template',
    content: {
      description: 'Quarterly board meeting deck: CEO update, financials, KPIs, strategic discussions, and asks. Keep it under 15 slides. Send 48 hours before the meeting so board members come prepared.',
      fields: [
        { label: 'Company', placeholder: 'Your startup', type: 'text', required: true },
        { label: 'Board Meeting Date', placeholder: 'e.g., Q1 2025 — March 15', type: 'text', required: true },
        { label: 'MRR', placeholder: 'e.g., $125K', type: 'text', required: true },
        { label: 'Cash Runway', placeholder: 'e.g., 18 months', type: 'text', required: true },
        { label: 'Top Strategic Priority', placeholder: 'e.g., Enterprise GTM expansion', type: 'text', required: true },
      ],
      sections: [
        {
          heading: 'CEO Update (Slides 1-3): The Narrative',
          body: `**Slide 1: State of the Company**\nOne paragraph on where you are: "We entered Q1 at $125K MRR with 14 months runway. Our hypothesis for the quarter is [X], and we're testing it by [Y]."\n\n**Slide 2: Q1 Goals vs Actual**\nTable format:\n| Goal | Target | Actual | Status |\n|------|--------|--------|--------|\n| MRR | $150K | $125K | 🟡 83% |\n| New Logos | 15 | 18 | 🟢 120% |\n| Churn | <3% | 2.2% | 🟢 |\n\n**Slide 3: Biggest Wins & Learnings**\n- Win: First Fortune 500 logo signed (IBM, $85K/year)\n- Win: Product NPS jumped from 32 to 51 after UI refresh\n- Learning: Mid-market customers churn 2x faster than enterprise — shifting ICP`,
        },
        {
          heading: 'Financials (Slides 4-6): Show Your Numbers Honestly',
          body: `**Slide 4: P&L Summary**\n- Revenue: $125K MRR / $1.5M ARR\n- COGS: $18K (14% of revenue)\n- Gross Margin: 86%\n- Operating Expenses: $210K/month\n- Net Burn: $85K/month\n- Cash: $1.5M (18 months runway)\n\n**Slide 5: MRR Waterfall**\nShow: Starting MRR + New + Expansion - Churn - Contraction = Ending MRR\n\n**Slide 6: 12-Month Forecast with Key Assumptions**\nBottom-up model. Label your assumptions clearly so the board can challenge specific inputs, not the whole model.`,
        },
        {
          heading: 'KPIs & Product (Slides 7-9)',
          body: `**Slide 7: North Star Metric Dashboard**\nPick 5 metrics. Show trend over 6+ months. Red/yellow/green status.\n\n**Slide 8: Product Roadmap Status**\nWhat shipped, what's in progress, what's next quarter. One slide. No details.\n\n**Slide 9: Customer Health**\n- Logo retention rate\n- NPS by segment\n- Support ticket trends\n- Top 10 customer status`,
        },
        {
          heading: 'Strategic Discussion & Asks (Slides 10-13)',
          body: `**Slide 10: Strategic Topic of the Quarter**\nOne meaty discussion item the board's experience is valuable for. Examples: "Should we expand to EU in Q3?", "Enterprise vs. SMB — which ICP to double down on?"\n\nPresent your analysis + recommendation + the assumptions you're most uncertain about. Board members add most value when they can challenge assumptions, not just approve a plan.\n\n**Slide 11: Team Updates**\nOrg chart changes, key hires in progress, departures, and performance notes.\n\n**Slide 12-13: Asks**\n- 2-3 specific board network asks (same rules as investor update)\n- Vote items if any (option grants, resolutions)`,
        },
      ],
    },
    contentEs: {
      description: 'Deck trimestral para reunión de junta: actualización del CEO, finanzas, KPIs, discusiones estratégicas y solicitudes. Mantenerlo en menos de 15 diapositivas. Enviar 48 horas antes.',
      fields: [
        { label: 'Empresa', placeholder: 'Tu startup', type: 'text', required: true },
        { label: 'Fecha de Reunión de Junta', placeholder: 'Ej: Q1 2025 — 15 de marzo', type: 'text', required: true },
        { label: 'MRR', placeholder: 'Ej: $125K', type: 'text', required: true },
        { label: 'Runway de Caja', placeholder: 'Ej: 18 meses', type: 'text', required: true },
        { label: 'Prioridad Estratégica Principal', placeholder: 'Ej: Expansión GTM empresarial', type: 'text', required: true },
      ],
      sections: [
        {
          heading: 'Actualización del CEO (Diapositivas 1-3): La Narrativa',
          body: `**Diapositiva 1: Estado de la Empresa**\nUn párrafo sobre dónde estás: "Entramos al Q1 con $125K MRR y 14 meses de runway. Nuestra hipótesis para el trimestre es [X], y la estamos probando mediante [Y]."\n\n**Diapositiva 2: Objetivos Q1 vs Real**\nFormato de tabla: Objetivo | Meta | Real | Estado\n- MRR: $150K → $125K → 🟡 83%\n- Nuevos logos: 15 → 18 → 🟢 120%\n- Abandono: <3% → 2.2% → 🟢\n\n**Diapositiva 3: Mayores Victorias y Aprendizajes**\n- Victoria: Primer logo Fortune 500 firmado ($85K/año)\n- Aprendizaje: Clientes medianos abandonan 2x más rápido que empresa — cambiando ICP`,
        },
        {
          heading: 'Finanzas (Diapositivas 4-6): Muestra los Números con Honestidad',
          body: `**Diapositiva 4: Resumen P&L**\n- Ingresos: $125K MRR / $1.5M ARR\n- COGS: $18K (14% de ingresos)\n- Margen Bruto: 86%\n- Gastos Operativos: $210K/mes\n- Quema Neta: $85K/mes\n- Caja: $1.5M (18 meses de runway)\n\n**Diapositiva 5: Cascada MRR**\nMuestra: MRR Inicial + Nuevo + Expansión - Abandono - Contracción = MRR Final\n\n**Diapositiva 6: Previsión de 12 Meses**\nModelo ascendente. Etiqueta tus supuestos claramente.`,
        },
        {
          heading: 'KPIs y Producto (Diapositivas 7-9)',
          body: `**Diapositiva 7: Panel de Métrica Estrella Polar**\n5 métricas. Tendencia de 6+ meses. Estado rojo/amarillo/verde.\n\n**Diapositiva 8: Estado del Roadmap de Producto**\nQué se lanzó, qué está en progreso, qué viene el próximo trimestre.\n\n**Diapositiva 9: Salud del Cliente**\n- Tasa de retención de logos\n- NPS por segmento\n- Tendencias de tickets de soporte`,
        },
        {
          heading: 'Discusión Estratégica y Solicitudes (Diapositivas 10-13)',
          body: `**Diapositiva 10: Tema Estratégico del Trimestre**\nUn tema sustancial donde la experiencia de la junta sea valiosa. Ejemplos: "¿Expandir a la UE en Q3?", "Empresa vs. PYME — ¿en qué ICP enfocarnos?"\n\nPresenta tu análisis + recomendación + los supuestos sobre los que tienes más incertidumbre.\n\n**Diapositiva 11: Actualizaciones del Equipo**\nCambios en el organigrama, contrataciones clave en proceso, salidas.\n\n**Diapositivas 12-13: Solicitudes**\n- 2-3 solicitudes específicas a la red de la junta\n- Elementos de votación si los hay`,
        },
      ],
    },
  },

  // ═══ r51: ESG & Impact Reporting ═══
  r51: {
    kind: 'guide',
    content: {
      sections: [
        {
          heading: 'Environmental Metrics: Measure What You Can Control',
          body: `You don't need to be a solar company to have meaningful environmental metrics. Every startup creates a carbon footprint, and investors — especially institutional ones — increasingly require ESG disclosure.\n\n**Tier 1: Scope 1 & 2 Emissions (most startups)**\n- Scope 1: Direct emissions (company vehicles, on-site fuel combustion) — most startups: $0\n- Scope 2: Purchased electricity for offices, servers, data centers\n- **Tool:** Google's carbon reporting via Google Cloud, AWS Carbon Footprint, or Watershed.com\n\n**Tier 2: Scope 3 Emissions (supply chain + remote workers)**\n- Business travel (flights, hotels)\n- Employee commuting\n- Cloud compute (AWS, GCP, Azure)\n- Hardware manufacturing (laptops, servers)\n\n**Baseline actions for any startup:**\n1. Measure cloud compute carbon via provider dashboards\n2. Switch to a renewable energy provider for any physical offices\n3. Offset unavoidable emissions ($5-15/ton via Gold Standard projects)\n4. Establish a baseline in year 1 so you can show improvement`,
        },
        {
          heading: 'Social Metrics: People, Diversity & Community',
          body: `Social metrics track your impact on employees, customers, and the broader community.\n\n**Employee metrics to track from Day 1:**\n- Headcount by gender, ethnicity (report in aggregate)\n- Pay equity: % gap between similar roles by gender/ethnicity\n- Voluntary turnover rate (benchmark: <15%/year is healthy)\n- Employee NPS (eNPS) — quarterly\n- % of team with equity ownership\n\n**Community & customer metrics:**\n- Customers served in underserved communities (%)\n- Scholarship or discount programs (# beneficiaries, $ value)\n- Volunteering hours per employee per year\n- Local hiring % if you have a physical presence\n\n**Why this matters beyond optics:**\n- Companies with high eNPS attract better talent at lower CAC\n- Pay equity audits often reveal systemic issues that cause attrition\n- Impact investors (e.g., DBL Partners, Kapor Capital) require these metrics`,
        },
        {
          heading: 'Governance Metrics: Transparency & Accountability',
          body: `Governance covers how your company is controlled, how decisions are made, and whether power is appropriately distributed.\n\n**Board composition:**\n- Board size: 3-5 members for seed/Series A\n- Independent directors: At least 1 non-founder, non-investor by Series B\n- Diversity: Gender and ethnic diversity on the board reduces groupthink\n\n**Policies to implement early (before they become issues):**\n- Code of conduct (written, distributed, enforced)\n- Anti-harassment policy (with a third-party reporting channel)\n- Conflict of interest disclosure policy\n- Whistleblower protection policy\n- Data privacy policy (GDPR/CCPA compliant if applicable)\n\n**Financial controls:**\n- Dual signatory requirement for transactions >$10K\n- Expense policy with receipt requirements\n- Monthly financial review by non-CEO board member\n\n**Investor reporting cadence:**\n- Monthly: KPI dashboard to all investors\n- Quarterly: Board meeting with financials\n- Annual: Audited financials (required for Series A+ companies)`,
        },
        {
          heading: 'B-Corp Certification: The Gold Standard of Impact',
          body: `B-Corp certification from B Lab is the most credible third-party validation that your company meets social and environmental standards.\n\n**B Impact Assessment (BIA) — 5 categories:**\n1. **Workers** (35 points available): Benefits, wages, training, safety\n2. **Community** (25 points): Diversity, local suppliers, charitable giving\n3. **Environment** (20 points): Carbon, waste, water, land use\n4. **Customers** (10 points): Product impact, data privacy\n5. **Governance** (10 points): Mission lock, transparency\n\n**Minimum score to certify: 80 points out of 200**\n\n**Process:**\n1. Complete the free BIA self-assessment at bcorporation.net (~4-6 hours)\n2. Score >80 → Submit for verification\n3. Pay certification fee ($500-$50K based on revenue)\n4. Annual monitoring, recertification every 3 years\n\n**Business value of B-Corp:**\n- Talent: 60% of millennial employees prefer B-Corps\n- Customers: Premium pricing justified by values alignment\n- Fundraising: Impact investors like DBL, Obvious Ventures require it\n- Resilience: Legal protection against shareholder primacy lawsuits`,
        },
      ],
    },
    contentEs: {
      sections: [
        {
          heading: 'Métricas Ambientales: Mide lo que Puedes Controlar',
          body: `No necesitas ser una empresa solar para tener métricas ambientales significativas. Cada startup crea una huella de carbono, y los inversores institucionales requieren divulgación ESG.\n\n**Nivel 1: Emisiones de Alcance 1 y 2**\n- Alcance 1: Emisiones directas (vehículos, combustión) — la mayoría de startups: $0\n- Alcance 2: Electricidad comprada para oficinas y servidores\n- **Herramienta:** Google Carbon Reporting, AWS Carbon Footprint, Watershed.com\n\n**Nivel 2: Emisiones de Alcance 3**\n- Viajes de negocios (vuelos, hoteles)\n- Trayecto de empleados\n- Cómputo en la nube (AWS, GCP, Azure)\n\n**Acciones básicas para cualquier startup:**\n1. Medir carbono del cómputo en la nube\n2. Cambiar a proveedor de energía renovable para oficinas físicas\n3. Compensar emisiones inevitables ($5-15/tonelada)\n4. Establecer una línea base en el año 1`,
        },
        {
          heading: 'Métricas Sociales: Personas, Diversidad y Comunidad',
          body: `Las métricas sociales rastrean tu impacto en empleados, clientes y la comunidad en general.\n\n**Métricas de empleados a rastrear desde el Día 1:**\n- Personal por género, etnia (reportar en agregado)\n- Equidad salarial: % de brecha entre roles similares\n- Tasa de rotación voluntaria (referencia: <15%/año es saludable)\n- eNPS de empleados — trimestral\n- % del equipo con propiedad de equity\n\n**Métricas de comunidad y cliente:**\n- Clientes en comunidades desatendidas (%)\n- Programas de becas o descuentos (# beneficiarios)\n- Horas de voluntariado por empleado por año\n\n**Por qué importa más allá de las apariencias:**\n- Empresas con alto eNPS atraen mejor talento\n- Las auditorías de equidad salarial revelan problemas sistémicos que causan rotación`,
        },
        {
          heading: 'Métricas de Gobernanza: Transparencia y Responsabilidad',
          body: `La gobernanza cubre cómo se controla tu empresa, cómo se toman las decisiones y si el poder está distribuido adecuadamente.\n\n**Composición de la junta:**\n- Tamaño: 3-5 miembros para semilla/Serie A\n- Directores independientes: Al menos 1 no fundador/inversor para Serie B\n- Diversidad: La diversidad de género y étnica reduce el pensamiento de grupo\n\n**Políticas a implementar temprano:**\n- Código de conducta (escrito, distribuido, aplicado)\n- Política anti-acoso (con canal de reporte externo)\n- Política de divulgación de conflictos de interés\n- Política de protección a denunciantes\n\n**Controles financieros:**\n- Requisito de doble firma para transacciones >$10K\n- Política de gastos con requisitos de recibos\n- Revisión financiera mensual por miembro no-CEO de la junta`,
        },
        {
          heading: 'Certificación B-Corp: El Estándar de Oro del Impacto',
          body: `La certificación B-Corp de B Lab es la validación de terceros más creíble de que tu empresa cumple estándares sociales y ambientales.\n\n**Evaluación de Impacto B (BIA) — 5 categorías:**\n1. **Trabajadores** (35 pts): Beneficios, salarios, formación, seguridad\n2. **Comunidad** (25 pts): Diversidad, proveedores locales, donaciones\n3. **Medio Ambiente** (20 pts): Carbono, residuos, agua, uso del suelo\n4. **Clientes** (10 pts): Impacto del producto, privacidad de datos\n5. **Gobernanza** (10 pts): Bloqueo de misión, transparencia\n\n**Puntuación mínima para certificar: 80 puntos de 200**\n\n**Proceso:**\n1. Completar autoevaluación BIA gratuita (~4-6 horas)\n2. Puntuación >80 → Enviar para verificación\n3. Pagar tarifa de certificación ($500-$50K según ingresos)\n4. Recertificación cada 3 años\n\n**Valor empresarial:** Atracción de talento millennial, precios premium justificados, inversores de impacto, protección legal ante primacía del accionista.`,
        },
      ],
    },
  },

  // ═══ r52: Exit Strategy Decision Matrix ═══
  r52: {
    kind: 'infographic',
    content: {
      description: 'Acquisition vs. IPO vs. stay-private: compare exit paths on timeline, founder control, financial outcome, and operational complexity. Choose your end game early — it shapes every strategic decision.',
      sections: [
        {
          title: 'Acquisition: Fast Liquidity, Loss of Control',
          points: [
            'Timeline: 3-7 years from founding is typical; rare deals happen earlier',
            'Typical acquirers: Strategic (wants your product/team), Financial (PE, wants cash flow)',
            'Founder outcome: Earn-out 1-3 years, often required to stay on post-close',
            'Price drivers: Revenue multiple (3-10x ARR), strategic fit, talent premium',
            'Key risk: Culture clash, product sunset after acquisition',
            'Best for: Founders who want liquidity and impact inside a larger platform',
          ],
          visual: '🤝',
        },
        {
          title: 'IPO: Maximum Liquidity, Maximum Scrutiny',
          points: [
            'Timeline: 7-12 years; requires $100M+ ARR with consistent growth',
            'Requirements: Audited financials (3 years), S-1 filing, SEC compliance',
            'Lock-up period: Founders cannot sell for 180 days post-IPO',
            'Ongoing burden: Quarterly earnings calls, analyst coverage, activist investors',
            'Best for: Companies with durable competitive moats and predictable revenue',
            'Typical outcome: 10-15% of shares sold in IPO; founder retains 5-20%',
          ],
          visual: '📈',
        },
        {
          title: 'Stay Private: Maximize Control & Long-Term Value',
          points: [
            'Model: Bootstrapped profitable growth or PE-backed majority recapitalization',
            'Secondary liquidity: Sell existing shares to late-stage investors without IPO',
            'Examples: Mailchimp (bootstrapped to $4B acquisition), Basecamp, Patagonia',
            'Advantage: No quarterly pressure, long-term decision-making, culture preservation',
            'Risk: No forced liquidity event — investors get stuck if no strategic exit',
            'Best for: Profitable B2B companies with stable cash flow and low capital needs',
          ],
          visual: '🏰',
        },
        {
          title: 'Decision Framework: Which Path Is Right for You?',
          points: [
            'Want max payout & can handle loss of control? → Acquisition',
            'Want full liquidity for all investors & prestige? → IPO (if you can reach $100M ARR)',
            'Want to build a generational business? → Stay private / bootstrapped',
            'Need liquidity without an IPO? → Secondary market (Carta, Forge Global)',
            'Start with mission clarity: What problem are you solving, and for how long?',
            'Tell investors your intended exit path in the pitch — it sets expectations',
          ],
          visual: '🧭',
        },
      ],
      keyTakeaway: 'The best exit strategy is the one aligned with your mission — not just the highest number. An acquisition can kill your product in 18 months; an IPO can change your culture permanently. Decide early, communicate clearly.',
    },
    contentEs: {
      description: 'Adquisición vs. IPO vs. permanecer privado: compara caminos de salida en línea de tiempo, control del fundador, resultado financiero y complejidad operativa.',
      sections: [
        {
          title: 'Adquisición: Liquidez Rápida, Pérdida de Control',
          points: [
            'Línea de tiempo: 3-7 años desde la fundación es típico',
            'Adquirentes típicos: Estratégico (quiere producto/equipo), Financiero (PE, quiere flujo de caja)',
            'Resultado del fundador: Earn-out 1-3 años, a menudo requerido permanecer post-cierre',
            'Impulsores de precio: Múltiplo de ingresos (3-10x ARR), ajuste estratégico, prima de talento',
            'Riesgo clave: Choque cultural, extinción del producto después de la adquisición',
            'Mejor para: Fundadores que quieren liquidez e impacto dentro de una plataforma más grande',
          ],
          visual: '🤝',
        },
        {
          title: 'IPO: Máxima Liquidez, Máximo Escrutinio',
          points: [
            'Línea de tiempo: 7-12 años; requiere $100M+ ARR con crecimiento consistente',
            'Requisitos: Financieros auditados (3 años), presentación S-1, cumplimiento SEC',
            'Período de bloqueo: Los fundadores no pueden vender durante 180 días post-IPO',
            'Carga continua: Llamadas de ganancias trimestrales, cobertura de analistas',
            'Mejor para: Empresas con fosos competitivos duraderos y ingresos predecibles',
          ],
          visual: '📈',
        },
        {
          title: 'Permanecer Privado: Maximizar Control y Valor a Largo Plazo',
          points: [
            'Modelo: Crecimiento rentable bootstrapped o recapitalización mayoritaria de PE',
            'Liquidez secundaria: Vender acciones existentes a inversores de etapa tardía sin IPO',
            'Ejemplos: Mailchimp (bootstrapped hasta adquisición de $4B), Basecamp',
            'Ventaja: Sin presión trimestral, toma de decisiones a largo plazo',
            'Mejor para: Empresas B2B rentables con flujo de caja estable',
          ],
          visual: '🏰',
        },
        {
          title: 'Marco de Decisión: ¿Qué Camino es el Correcto Para Ti?',
          points: [
            '¿Quieres máximo pago y puedes manejar pérdida de control? → Adquisición',
            '¿Quieres liquidez completa para todos los inversores? → IPO (si puedes alcanzar $100M ARR)',
            '¿Quieres construir un negocio generacional? → Permanecer privado',
            '¿Necesitas liquidez sin IPO? → Mercado secundario (Carta, Forge Global)',
            'Comunica tu camino de salida previsto en el pitch — establece expectativas',
          ],
          visual: '🧭',
        },
      ],
      keyTakeaway: 'La mejor estrategia de salida es la alineada con tu misión — no solo el número más alto. Una adquisición puede matar tu producto en 18 meses; un IPO puede cambiar tu cultura permanentemente. Decide temprano, comunica claramente.',
    },
  },

  // ═══ r53: Succession Planning ═══
  r53: {
    kind: 'template',
    content: {
      description: 'Document your role, create a knowledge-transfer plan, and establish an emergency succession protocol. The goal: the company survives and thrives if you get hit by a bus tomorrow.',
      fields: [
        { label: 'Role Being Documented', placeholder: 'e.g., CEO / CTO / VP Sales', type: 'text', required: true },
        { label: 'Current Role Holder', placeholder: 'Full name', type: 'text', required: true },
        { label: 'Primary Successor', placeholder: 'Who steps in first?', type: 'text', required: true },
        { label: 'Secondary Successor', placeholder: 'Backup if primary unavailable', type: 'text', required: true },
        { label: 'Last Updated', placeholder: 'Date (review quarterly)', type: 'date', required: true },
      ],
      sections: [
        {
          heading: 'Role Documentation: What Only You Know',
          body: `The point of role documentation is to capture the institutional knowledge that lives only in your head.\n\n**What to document for every key role:**\n\n**1. Responsibilities & Decision Rights**\n- What decisions can this role make alone (up to $X without approval)?\n- What recurring decisions happen and who else needs to be in the room?\n- What external relationships is this role the primary owner of?\n\n**2. Daily/Weekly/Monthly Operating Rhythms**\n- Monday: Review pipeline, send team priorities\n- Weekly: 1:1s with direct reports (who, when, format)\n- Monthly: Board reporting, financial close\n- Quarterly: OKR setting, performance reviews\n\n**3. The "If I Got Hit by a Bus" List**\n- Passwords and access credentials (stored in 1Password/Bitwarden, not here)\n- Key vendor contacts and account numbers\n- Ongoing negotiations and their status\n- The 3 most important things to NOT change in the next 90 days`,
        },
        {
          heading: 'Knowledge Transfer Plan: 90-Day Handoff Protocol',
          body: `A good succession doesn't happen in a day. Build a 90-day handoff plan for any planned departure.\n\n**Week 1-2: Shadow & Observe**\nSuccessor attends every meeting with the outgoing person. No decisions made without outgoing person present.\n\n**Week 3-6: Gradual Transfer**\nSuccessor leads meetings, outgoing person observes and coaches. Successor makes 50% of decisions independently.\n\n**Week 7-10: Supervised Independence**\nSuccessor operates independently. Outgoing person available for 30 min/day escalations only.\n\n**Week 11-12: Full Transfer**\nOutgoing person not in meetings. Successor is accountable. Final knowledge dump session.\n\n**For unplanned departures (emergency succession):**\n1. Board notified within 24 hours\n2. Primary successor assumes role immediately\n3. All critical access transferred within 48 hours\n4. 30-day interim review with board to assess permanent appointment`,
        },
        {
          heading: 'Leadership Pipeline: Building Before You Need It',
          body: `The best time to identify successors is 2 years before you need them — not when a crisis hits.\n\n**Succession Readiness Matrix:**\n| Role | Current Holder | 12-Month Ready | 24-Month Ready |\n|------|---------------|----------------|----------------|\n| CEO | You | Internal X? | Board hire? |\n| CTO | Alice | Bob (Sr. Eng) | External hire |\n| VP Sales | Carlos | Maria (AE) | External hire |\n\n**Development actions for "ready in 12 months" candidates:**\n- Give them projects 1 level above their current role\n- Assign an external executive mentor\n- Include them in board-level conversations\n- Have explicit conversations about their career trajectory and succession potential\n\n**Red flag:** If you can't name a successor for any key role, that role is a single point of failure. Fix it before your next board meeting.`,
        },
      ],
    },
    contentEs: {
      description: 'Documenta tu rol, crea un plan de transferencia de conocimiento y establece un protocolo de sucesión de emergencia. El objetivo: la empresa sobrevive y prospera si te golpea un autobús mañana.',
      fields: [
        { label: 'Rol que se Documenta', placeholder: 'Ej: CEO / CTO / VP Ventas', type: 'text', required: true },
        { label: 'Titular Actual del Rol', placeholder: 'Nombre completo', type: 'text', required: true },
        { label: 'Sucesor Principal', placeholder: '¿Quién asume primero?', type: 'text', required: true },
        { label: 'Sucesor Secundario', placeholder: 'Respaldo si el principal no está disponible', type: 'text', required: true },
        { label: 'Última Actualización', placeholder: 'Fecha (revisar trimestralmente)', type: 'date', required: true },
      ],
      sections: [
        {
          heading: 'Documentación del Rol: Lo que Solo Tú Sabes',
          body: `El objetivo es capturar el conocimiento institucional que vive solo en tu cabeza.\n\n**Qué documentar para cada rol clave:**\n\n**1. Responsabilidades y Derechos de Decisión**\n- ¿Qué decisiones puede tomar este rol solo (hasta $X sin aprobación)?\n- ¿Qué decisiones recurrentes ocurren y quién más necesita estar en la sala?\n- ¿Qué relaciones externas son propiedad principal de este rol?\n\n**2. Ritmos Operativos Diarios/Semanales/Mensuales**\n- Lunes: Revisar pipeline, enviar prioridades del equipo\n- Semanal: 1:1s con reportes directos\n- Mensual: Informes de junta, cierre financiero\n\n**3. La Lista "Si Me Golpea un Autobús"**\n- Credenciales de acceso (almacenadas en gestor de contraseñas)\n- Contactos clave de proveedores y números de cuenta\n- Negociaciones en curso y su estado\n- Las 3 cosas más importantes que NO cambiar en los próximos 90 días`,
        },
        {
          heading: 'Plan de Transferencia de Conocimiento: Protocolo de Traspaso de 90 Días',
          body: `Una buena sucesión no ocurre en un día. Construye un plan de traspaso de 90 días para cualquier salida planificada.\n\n**Semanas 1-2:** El sucesor asiste a cada reunión. Sin decisiones sin la persona saliente.\n\n**Semanas 3-6:** El sucesor lidera reuniones, la persona saliente observa. 50% de decisiones independientes.\n\n**Semanas 7-10:** El sucesor opera independientemente. La persona saliente disponible 30 min/día.\n\n**Semanas 11-12:** Traspaso completo. Sesión final de volcado de conocimiento.\n\n**Para salidas no planificadas (sucesión de emergencia):**\n1. Junta notificada en 24 horas\n2. Sucesor principal asume el rol inmediatamente\n3. Todo acceso crítico transferido en 48 horas\n4. Revisión de 30 días con la junta para nombramiento permanente`,
        },
        {
          heading: 'Canal de Liderazgo: Construir Antes de Necesitarlo',
          body: `El mejor momento para identificar sucesores es 2 años antes de necesitarlos.\n\n**Matriz de Preparación para la Sucesión:**\n| Rol | Titular Actual | Listo en 12 meses | Listo en 24 meses |\n|-----|---------------|-------------------|-------------------|\n| CEO | Tú | ¿Interno X? | ¿Contratación junta? |\n| CTO | Alicia | Bob (Ing. Sr.) | Contratación externa |\n| VP Ventas | Carlos | María (AE) | Contratación externa |\n\n**Acciones de desarrollo para candidatos "listos en 12 meses":**\n- Asignarles proyectos un nivel por encima de su rol actual\n- Asignar un mentor ejecutivo externo\n- Incluirlos en conversaciones a nivel de junta\n\n**Señal de alerta:** Si no puedes nombrar un sucesor para algún rol clave, ese rol es un punto único de falla.`,
        },
      ],
    },
  },

  // ═══ r54: Founder Mental Health Playbook ═══
  r54: {
    kind: 'guide',
    content: {
      sections: [
        {
          heading: 'Recognizing Burnout Before It Breaks You',
          body: `Founder burnout is not the same as being tired. It's a physiological and psychological state where sustained high stress has depleted your capacity to recover.\n\n**The 3 dimensions of burnout (Maslach scale):**\n1. **Exhaustion** — Feeling drained before the day starts, chronic fatigue despite sleep\n2. **Cynicism** — Detachment from work, customers feel like problems not people\n3. **Inefficacy** — Doubting your ability to create impact, paralysis on decisions\n\n**Early warning signs founders commonly miss:**\n- Anger spikes at small frustrations (team, investors, product bugs)\n- Avoidance of tasks you used to find energizing\n- Catastrophizing — a single bad week feels like the company is dying\n- Physical symptoms: tension headaches, GI issues, frequent illness\n- Social withdrawal — canceling calls, skipping events you'd normally attend\n\n**The founder trap:** We normalize suffering because we believe it's proof we're working hard. It isn't. Exhausted founders make worse decisions, communicate poorly, and create toxic cultures. Recovery is a business priority.`,
        },
        {
          heading: 'Prevention Tactics: Systems Before You Hit the Wall',
          body: `The most effective burnout prevention is structural — systems you build when you're healthy that protect you when you're not.\n\n**The 4 non-negotiables:**\n1. **Sleep:** 7 hours minimum. Sleep deprivation after 17 hours impairs judgment equivalent to .05 BAC. Treat it as a board-level obligation.\n2. **Physical movement:** 30 min/day minimum. Walking meetings count. Movement is the most evidence-backed intervention for anxiety in founders.\n3. **Scheduled recovery time:** At least 1 full day per week with no Slack, no email. Not optional. Schedule it as a recurring calendar block.\n4. **Cognitive offload:** Weekly journal or brain dump. Your brain is a bad storage device. Writing it down reduces cortisol.\n\n**Protective structures:**\n- End-of-day shutdown ritual (close laptop, say "shutdown complete")\n- Weekly review session (30 min Friday — what happened, what matters next week)\n- Monthly personal board meeting: a trusted advisor outside your company who knows you personally`,
        },
        {
          heading: 'Therapy, Coaching & Peer Support',
          body: `The mental health support landscape for founders has expanded significantly. Here's the practical guide:\n\n**Therapy (for processing, not just tactics):**\n- Best for: Anxiety, depression, trauma, relationship issues, identity issues\n- Finding one: Psychology Today therapist finder, your health insurance portal, or Alma (alma.com)\n- Modalities with strong evidence: CBT (Cognitive Behavioral Therapy), EMDR (trauma), ACT\n- Cost: $120-300/session out-of-pocket; many accept insurance\n- Frequency: Weekly at first, then biweekly once stable\n\n**Executive coaching (for performance and decision-making):**\n- Best for: Leadership challenges, team dynamics, strategy execution, communication\n- Not a therapist substitute — coaches help you perform; therapists help you heal\n- YC, a16z, and most top accelerators provide coaching as a benefit\n\n**Peer support (for belonging and normalization):**\n- Founders Circle: peer groups of 8-12 founders at similar stages\n- YC alumni Slack, On Deck community, First Round community\n- Chief (for female executives)\n- The most underrated source: a co-founder or trusted peer who can hear the unfiltered truth without judgment`,
        },
        {
          heading: 'Managing the Emotional Rollercoaster',
          body: `YC partners describe founder psychology as a rollercoaster that oscillates between "this is going to change the world" and "everything is broken and I should quit" — sometimes within the same day.\n\n**The key insight:** Your emotional state is a lagging indicator of progress. A great week produces optimism. A hard week produces despair. Neither is an accurate signal of the company's actual trajectory.\n\n**Tactics for the lows:**\n- **Name it:** "I'm in the trough of despair" — labeling emotion reduces its intensity (neuroscience: labeling activates the prefrontal cortex, calming the amygdala)\n- **Time-bound it:** "This feeling is real, but it's probably not permanent. Check again in 72 hours."\n- **Data vs. narrative:** Separate factual data (MRR, churn, pipeline) from narrative (we're failing, this is impossible). Data is neutral; narratives are constructed.\n\n**Building resilience over time:**\n- Keep a "evidence of progress" doc — log every win, no matter how small. Re-read during lows.\n- Define a "good enough day" — identify 1-3 things that, if accomplished, make it a successful day regardless of what else happened\n- Regular exposure to the customers you help — reading support tickets and watching user sessions reminds you why it matters`,
        },
        {
          heading: 'Founder Support Systems: Building Your Safety Net',
          body: `Founders who survive long enough to succeed typically have at least 3 of these 5 support elements in place:\n\n**1. A trusted co-founder or business partner**\nSomeone who shares the burden, challenges your thinking, and can tell you when you're wrong without the relationship breaking. 65% of startups fail due to co-founder conflict — build the relationship before crisis, not during.\n\n**2. A therapist or counselor (personal, not business)**\nA space to process the personal identity questions that come with building a company: Am I good enough? What happens if this fails? What am I sacrificing?\n\n**3. A peer board (founder mastermind)**\n5-8 founders at similar stages who meet monthly. Structure: each person gets 15 minutes with a problem. No advice-giving, only questions and shared experience.\n\n**4. A physical-world community**\nPeople who knew you before you were a founder. Friends, family, a sports team, a yoga class. The antidote to the "I am my startup" identity trap.\n\n**5. A personal advisory board**\n2-3 senior people (former founders, executives, mentors) who know your business AND your character. Different from board directors. These people are explicitly on your side.`,
        },
      ],
    },
    contentEs: {
      sections: [
        {
          heading: 'Reconocer el Agotamiento Antes de que Te Rompa',
          body: `El agotamiento del fundador no es lo mismo que estar cansado. Es un estado donde el estrés sostenido ha agotado tu capacidad de recuperación.\n\n**Las 3 dimensiones del agotamiento (escala de Maslach):**\n1. **Agotamiento** — Sentirse drenado antes de que comience el día\n2. **Cinismo** — Desapego del trabajo, los clientes se sienten como problemas\n3. **Ineficacia** — Dudar de tu capacidad de crear impacto\n\n**Señales de alerta temprana:**\n- Picos de ira ante pequeñas frustraciones\n- Evitación de tareas que antes encontrabas energizantes\n- Catastrofizar — una mala semana parece que la empresa muere\n- Síntomas físicos: dolores de cabeza, problemas gastrointestinales\n\n**La trampa del fundador:** Normalizamos el sufrimiento porque creemos que prueba que trabajamos duro. No es así. Los fundadores agotados toman peores decisiones y crean culturas tóxicas.`,
        },
        {
          heading: 'Tácticas de Prevención: Sistemas Antes de Golpear el Muro',
          body: `La prevención del agotamiento más efectiva es estructural — sistemas que construyes cuando estás saludable.\n\n**Los 4 elementos no negociables:**\n1. **Sueño:** 7 horas mínimo. La privación del sueño después de 17 horas deteriora el juicio.\n2. **Movimiento físico:** 30 min/día mínimo. El movimiento es la intervención más respaldada por evidencia para la ansiedad.\n3. **Tiempo de recuperación programado:** Al menos 1 día completo por semana sin Slack ni email.\n4. **Descarga cognitiva:** Diario semanal o volcado cerebral. Tu cerebro es un mal dispositivo de almacenamiento.\n\n**Estructuras protectoras:**\n- Ritual de cierre al final del día\n- Revisión semanal (30 min viernes)\n- Reunión personal mensual con un asesor de confianza`,
        },
        {
          heading: 'Terapia, Coaching y Apoyo entre Pares',
          body: `**Terapia (para procesar, no solo tácticas):**\n- Mejor para: Ansiedad, depresión, trauma, problemas de identidad\n- Modalidades con evidencia sólida: TCC (Terapia Cognitivo-Conductual), EMDR, ACT\n- Costo: $120-300/sesión\n- Frecuencia: Semanal al principio, luego quincenal\n\n**Coaching ejecutivo (para rendimiento y toma de decisiones):**\n- Mejor para: Desafíos de liderazgo, dinámica de equipo, ejecución estratégica\n- No es sustituto de terapeuta — los coaches te ayudan a rendir; los terapeutas te ayudan a sanar\n\n**Apoyo entre pares (para pertenencia):**\n- Círculos de fundadores: grupos de 8-12 fundadores en etapas similares\n- La fuente más subestimada: un cofundador o par de confianza que pueda escuchar la verdad sin filtros`,
        },
        {
          heading: 'Gestionar la Montaña Rusa Emocional',
          body: `Los socios de YC describen la psicología del fundador como una montaña rusa entre "esto cambiará el mundo" y "todo está roto y debería rendirme" — a veces el mismo día.\n\n**La visión clave:** Tu estado emocional es un indicador rezagado del progreso. Una gran semana produce optimismo. Una semana difícil produce desesperación. Ninguno es una señal precisa de la trayectoria real de la empresa.\n\n**Tácticas para los momentos bajos:**\n- **Nómbralo:** "Estoy en el abismo de la desesperación" — etiquetar la emoción reduce su intensidad\n- **Límitalo en el tiempo:** "Este sentimiento es real, pero probablemente no es permanente. Vuelve a comprobar en 72 horas."\n- **Datos vs. narrativa:** Separa los datos factuales de la narrativa construida.\n\n**Construir resiliencia:**\n- Mantén un doc de "evidencia de progreso" — registra cada victoria, por pequeña que sea\n- Define un "día suficientemente bueno" con 1-3 cosas que, si se logran, hacen el día exitoso`,
        },
        {
          heading: 'Sistemas de Apoyo del Fundador: Construyendo Tu Red de Seguridad',
          body: `Los fundadores que sobreviven suficiente tiempo para tener éxito típicamente tienen al menos 3 de estos 5 elementos:\n\n**1. Un cofundador o socio de negocio de confianza**\nAlguien que comparte la carga y puede decirte cuando estás equivocado sin romper la relación.\n\n**2. Un terapeuta o consejero (personal, no de negocios)**\nEspacio para procesar preguntas de identidad: ¿Soy lo suficientemente bueno? ¿Qué pasa si esto falla?\n\n**3. Una junta de pares (mastermind de fundadores)**\n5-8 fundadores en etapas similares que se reúnen mensualmente. Cada persona obtiene 15 minutos con un problema.\n\n**4. Una comunidad del mundo físico**\nPersonas que te conocían antes de ser fundador. El antídoto a la trampa de identidad "soy mi startup".\n\n**5. Una junta asesora personal**\n2-3 personas sénior (ex fundadores, ejecutivos, mentores) que conocen tu negocio Y tu carácter.`,
        },
      ],
    },
  },

  // ═══ r55: Founders Daily Routine Blueprint ═══
  r55: {
    kind: 'infographic',
    content: {
      description: 'Evidence-backed daily routines from 20+ successful founders. Science-informed practices for energy, focus, and resilience. Customize for your chronotype.',
      sections: [
        {
          title: 'Morning Routine (5:30–9:00 AM): Protect Creative Energy',
          points: [
            'No phone for 30 min after waking — cortisol spike from notifications disrupts prefrontal function',
            'Physical movement first: 20-30 min walk, run, or gym before email or Slack',
            'High-protein breakfast: 30g protein within 1 hour of waking stabilizes glucose and focus',
            'Morning pages or 5-min journal: "What would make today great?" (Tim Ferriss format)',
            'Review the ONE thing you must accomplish today before opening anything else',
            'Block 7-9 AM for solo thinking — no meetings before you\'ve done the most important work',
          ],
          visual: '🌅',
        },
        {
          title: 'Deep Work Blocks (9:00 AM–1:00 PM): Your Highest-Value Hours',
          points: [
            'Deep work = uninterrupted, cognitively demanding work on your highest-value tasks',
            'Book 90-minute blocks: 90 min is the natural ultradian rhythm for focused attention',
            'Phone in another room (not just face-down) — presence reduces working memory 10%',
            'Use "Do Not Disturb" mode on all devices; set emergency override for key contacts only',
            'Single-tab browsing: 1 browser tab per task, no news, no Twitter during deep blocks',
            'End each block with a "next step" note so tomorrow-you can start instantly',
          ],
          visual: '🎯',
        },
        {
          title: 'Energy Management & Exercise',
          points: [
            'Afternoon dip (1-3 PM): Normal — matches circadian cortisol trough. Use for admin, calls',
            'Exercise timing: morning for mood and creativity; evening only if it doesn\'t disrupt sleep',
            'Caffeine cutoff: No caffeine after noon (half-life ~6 hrs; noon coffee = 3mg at midnight)',
            'Strategic napping: 20 min nap before 3 PM (set alarm) restores focus better than coffee',
            '4 PM walk: The Google-Stanford 82% boost in creative insight from walking still applies',
            'Movement every 90 min minimum — sedentary streaks over 2 hours impair cognition',
          ],
          visual: '⚡',
        },
        {
          title: 'Sleep Architecture: The Non-Negotiable Foundation',
          points: [
            'Consistent bedtime: Same time ±30 min every day (including weekends) anchors circadian rhythm',
            'Temperature: Core body temp must drop 1-2°F for sleep onset; keep room at 65-68°F',
            'Dark room: Blackout curtains or sleep mask — even small light reduces melatonin 50%',
            'No screens 90 min before bed: Blue light from phones delays sleep by 60+ minutes',
            'Alcohol myth: Alcohol induces sleep but destroys sleep quality (no REM in first half)',
            'Pre-sleep wind-down ritual: Same 3-4 steps every night (read, light stretch, journal) signals sleep onset',
          ],
          visual: '🌙',
        },
      ],
      keyTakeaway: 'Your most valuable asset is your decision-making capacity. Everything in this blueprint serves one purpose: maximizing cognitive performance across a 10-year founder journey. You cannot outwork a body and brain that are running on empty.',
    },
    contentEs: {
      description: 'Rutinas diarias respaldadas por evidencia de 20+ fundadores exitosos. Prácticas informadas por la ciencia para energía, enfoque y resiliencia.',
      sections: [
        {
          title: 'Rutina Matutina (5:30–9:00): Protege la Energía Creativa',
          points: [
            'Sin teléfono durante 30 min después de despertar — el pico de cortisol por notificaciones interrumpe la función prefrontal',
            'Movimiento físico primero: 20-30 min de caminata, carrera o gimnasio antes del email',
            'Desayuno rico en proteínas: 30g de proteína en 1 hora de despertar estabiliza glucosa y enfoque',
            'Páginas matutinas o diario de 5 min: "¿Qué haría que este día sea genial?"',
            'Revisa LA ÚNICA cosa que debes lograr hoy antes de abrir cualquier otra cosa',
            'Bloquea 7-9 AM para pensamiento en solitario — sin reuniones antes de hacer el trabajo más importante',
          ],
          visual: '🌅',
        },
        {
          title: 'Bloques de Trabajo Profundo (9:00–13:00): Tus Horas de Mayor Valor',
          points: [
            'Trabajo profundo = trabajo cognitivamente exigente sin interrupciones en tareas de mayor valor',
            'Bloques de 90 minutos: 90 min es el ritmo ultradiano natural para la atención enfocada',
            'Teléfono en otra habitación — su presencia reduce la memoria de trabajo un 10%',
            'Modo "No Molestar" en todos los dispositivos',
            'Navegación de una sola pestaña: sin noticias, sin redes sociales durante bloques profundos',
            'Termina cada bloque con una nota de "próximo paso"',
          ],
          visual: '🎯',
        },
        {
          title: 'Gestión de Energía y Ejercicio',
          points: [
            'Caída de la tarde (13:00-15:00): Normal — coincide con el valle de cortisol circadiano. Úsalo para administración',
            'Corte de cafeína: Sin cafeína después del mediodía (vida media ~6 hrs)',
            'Siesta estratégica: 20 min antes de las 15:00 restaura el enfoque mejor que el café',
            'Caminata de las 16:00: Aumenta el 82% el insight creativo según estudios de Stanford',
            'Movimiento cada 90 min mínimo — rachas sedentarias deterioran la cognición',
          ],
          visual: '⚡',
        },
        {
          title: 'Arquitectura del Sueño: La Fundación No Negociable',
          points: [
            'Hora de dormir consistente: La misma hora ±30 min cada día ancla el ritmo circadiano',
            'Temperatura: La temperatura corporal central debe bajar 1-2°F; mantén la habitación a 18-20°C',
            'Habitación oscura: Las cortinas blackout — incluso luz pequeña reduce la melatonina 50%',
            'Sin pantallas 90 min antes de dormir: La luz azul retrasa el sueño 60+ minutos',
            'Mito del alcohol: Induce el sueño pero destruye la calidad del sueño (sin REM en la primera mitad)',
            'Ritual de relajación previa al sueño: Los mismos 3-4 pasos cada noche',
          ],
          visual: '🌙',
        },
      ],
      keyTakeaway: 'Tu activo más valioso es tu capacidad de toma de decisiones. Todo en este blueprint sirve un propósito: maximizar el rendimiento cognitivo en un viaje de fundador de 10 años. No puedes superar trabajando a un cuerpo y mente que funcionan en vacío.',
    },
  },

  // ═══ r56: Networking Scripts for Introverts ═══
  r56: {
    kind: 'cheatsheet',
    content: {
      intro: 'Real networking scripts for founders who find small talk painful. Every script is designed to create genuine connection with minimal awkwardness — tested at YC Demo Day, SaaStr, and Founder Summit.',
      items: [
        {
          term: 'The Opening Gambit',
          definition: '"What are you working on?" — Simple, direct, and gives them the floor. Follow with: "How long have you been building that?" then "What\'s the hardest part right now?"',
          example: 'Use at: any conference, demo day, or networking event. Works for both technical and non-technical audiences.',
        },
        {
          term: 'The Value-First Intro',
          definition: '"I\'ve been following [company/work]. I had a thought about [specific challenge] you\'ve mentioned — would you want to share that in 5 min?"',
          example: 'Use when: You\'ve done your homework on someone you want to meet. Requires preparation but has a 70%+ response rate because it leads with value, not ask.',
        },
        {
          term: 'The Shared Context Bridge',
          definition: '"We were both in [YC batch / Andreessen portfolio / same accelerator]. What stage are you at? I\'d love to compare notes on [specific challenge]."',
          example: 'Use at: Alumni events, portfolio company events, investor conferences. Shared context is the fastest trust-builder.',
        },
        {
          term: 'The Graceful Exit',
          definition: '"I really enjoyed this. I want to make sure you get to meet other people — can I follow up via email this week?" Then actually follow up within 24 hours.',
          example: 'Use when: You\'ve had a good conversation and want to exit cleanly without it feeling like a rejection.',
        },
        {
          term: 'The Reengagement (After Ghosting)',
          definition: '"Hey [Name] — I know we talked at [event] a few months ago and I dropped the ball on following up. I\'m still building [thing]. I thought of you when [specific reason]. Would you have 20 min this month?"',
          example: 'Use when: You lost touch with a valuable contact. Honesty about the lapse is more effective than pretending it didn\'t happen.',
        },
        {
          term: 'The Ask Ladder',
          definition: 'Never jump to the big ask. Ladder: Coffee → 20-min call → intro → investment. Each "yes" makes the next ask easier. The first ask should require <5 min of their time.',
          example: '"Would you be open to a 15-min call? I have 3 specific questions and won\'t waste your time."',
        },
        {
          term: 'The Generous Intro',
          definition: '"I know someone who could help with [their specific challenge]. Can I connect you?" — Give before you ask. The ratio should be at least 3:1 (give:ask) over a 90-day period.',
          example: 'Use proactively: When you hear someone\'s challenge and genuinely know someone who can help. This is the fastest way to build network reputation.',
        },
        {
          term: 'The Follow-Up Email (24-Hour Rule)',
          definition: '"Great to meet you at [event]. As promised: [one specific thing you said you\'d send]. [One sentence on what you\'re building.] Would love to stay in touch — I\'ll check back in [30/90 days] unless you\'d want to connect sooner."',
          example: 'Template: 3 sentences max. Reference something from the conversation. Add specific value. Include a soft CTA.',
        },
      ],
      tip: 'Networking isn\'t about collecting contacts — it\'s about giving value consistently over time. The founders with the best networks are the most generous, not the most aggressive. Give 10x before you ask once.',
    },
    contentEs: {
      intro: 'Scripts reales de networking para fundadores que encuentran la conversación trivial dolorosa. Cada script está diseñado para crear conexión genuina con mínima incomodidad.',
      items: [
        {
          term: 'El Golpe de Apertura',
          definition: '"¿En qué estás trabajando?" — Simple, directo y les da el protagonismo. Seguir con: "¿Cuánto tiempo llevas construyendo eso?" luego "¿Cuál es la parte más difícil ahora mismo?"',
          example: 'Usa en: cualquier conferencia, demo day o evento de networking.',
        },
        {
          term: 'La Introducción Que da Valor Primero',
          definition: '"He estado siguiendo [empresa/trabajo]. Tuve una idea sobre [desafío específico] que has mencionado — ¿querrías compartir eso en 5 min?"',
          example: 'Usa cuando: Has hecho tu tarea sobre alguien que quieres conocer. Requiere preparación pero tiene una tasa de respuesta >70%.',
        },
        {
          term: 'El Puente de Contexto Compartido',
          definition: '"Ambos estuvimos en [batch de YC / mismo acelerador]. ¿En qué etapa estás? Me encantaría comparar notas sobre [desafío específico]."',
          example: 'Usa en: Eventos de alumni, eventos de portfolio. El contexto compartido es el constructor de confianza más rápido.',
        },
        {
          term: 'La Salida Elegante',
          definition: '"Realmente disfruté esto. Quiero asegurarme de que puedas conocer a otras personas — ¿puedo hacer seguimiento por email esta semana?" Luego realmente hacer seguimiento en 24 horas.',
          example: 'Usa cuando: Has tenido una buena conversación y quieres salir limpiamente.',
        },
        {
          term: 'La Reactivación (Después de Ghosting)',
          definition: '"Hola [Nombre] — sé que hablamos en [evento] hace unos meses y fallé en el seguimiento. Sigo construyendo [cosa]. Pensé en ti cuando [razón específica]. ¿Tendrías 20 min este mes?"',
          example: 'Usa cuando: Perdiste el contacto con alguien valioso. La honestidad sobre el lapso es más efectiva que fingir que no ocurrió.',
        },
        {
          term: 'La Escalera de Petición',
          definition: 'Nunca saltes a la gran petición. Escala: Café → llamada 20 min → introducción → inversión. Cada "sí" hace la próxima petición más fácil.',
          example: '"¿Estarías abierto a una llamada de 15 min? Tengo 3 preguntas específicas y no desperdiciaré tu tiempo."',
        },
        {
          term: 'La Introducción Generosa',
          definition: '"Conozco a alguien que podría ayudar con [su desafío específico]. ¿Puedo conectarte?" — Da antes de pedir. La relación debe ser al menos 3:1 (dar:pedir) en 90 días.',
          example: 'Usa proactivamente: cuando escuchas el desafío de alguien y genuinamente conoces a alguien que puede ayudar.',
        },
        {
          term: 'El Email de Seguimiento (Regla de 24 Horas)',
          definition: '"Genial conocerte en [evento]. Como prometí: [cosa específica que dijiste que enviarías]. [Una frase sobre lo que construyes.] Me encantaría mantenerme en contacto."',
          example: 'Plantilla: máximo 3 frases. Referencia algo de la conversación. Añade valor específico. CTA suave.',
        },
      ],
      tip: 'El networking no se trata de coleccionar contactos — se trata de dar valor consistentemente con el tiempo. Los fundadores con las mejores redes son los más generosos, no los más agresivos. Da 10x antes de pedir una vez.',
    },
  },

  // ═══ r57: Weekly Founder Review ═══
  r57: {
    kind: 'template',
    content: {
      description: 'A 30-minute weekly review ritual that keeps you aligned, reduces anxiety, and ensures the most important work gets done. Best done every Friday afternoon.',
      fields: [
        { label: 'Week of', placeholder: 'e.g., Jan 13-17, 2025', type: 'text', required: true },
        { label: 'North Star Metric This Week', placeholder: 'e.g., MRR: $45,200 (+$3,100 vs last week)', type: 'text', required: true },
        { label: 'Single Biggest Win', placeholder: 'The one thing that moved the needle most', type: 'textarea', required: true },
        { label: 'Biggest Regret or Mistake', placeholder: 'What would you do differently?', type: 'textarea', required: true },
        { label: '#1 Priority Next Week', placeholder: 'The ONE thing that would make next week a success', type: 'text', required: true },
      ],
      sections: [
        {
          heading: 'The 5 Review Questions',
          body: `**Run through these questions every Friday (30 min max):**\n\n**1. What were my 3 biggest wins this week?**\nWrite them down even if the week felt like a disaster. Finding wins builds evidence of progress.\n\n**2. What did I learn? What surprised me?**\nCustomer conversations, product insights, team observations. The learning is the compounding return on experiments.\n\n**3. What am I most grateful for?**\nNot optional. Research shows gratitude practice reduces cortisol and improves decision quality the following week. 3 specific things (not "my team" — too vague).\n\n**4. What should I START, STOP, or CONTINUE doing?**\nOne of each. Capture it in a running list. Review this list monthly.\n\n**5. What is the ONE thing next week that, if accomplished, would make the biggest difference?**\nNot a list. One thing. Write it on a sticky note and put it on your monitor.`,
        },
        {
          heading: 'Calendar Audit (15 min)',
          body: `Before closing the week, audit your calendar for the coming week:\n\n**The 4-question calendar audit:**\n1. Does this week's schedule reflect my stated priorities? (If not, reschedule)\n2. Do I have at least 3 deep work blocks of 90 min scheduled?\n3. Is there any meeting that could be an email, Loom, or async doc?\n4. Have I protected at least 1 day with no meetings before 1 PM?\n\n**Time allocation benchmark (adjust for your stage):**\n- Selling/customer conversations: 40-50% of your time (seed stage)\n- Building/product: 20-30%\n- Team & operations: 15-20%\n- Strategic thinking / learning: 10-15%\n\nIf your calendar doesn't match these ratios, your week isn't optimized for traction.`,
        },
        {
          heading: 'The Energy Audit',
          body: `Once a month, add a 10-minute energy audit to your weekly review:\n\n**For each major activity from the past month:**\n1. Write down the activity\n2. Mark it as Energy-giving (+) or Energy-draining (-)\n3. Score the importance: H (high), M (medium), L (low)\n\n**Action matrix:**\n- High importance + Energy-giving: Do more of this\n- High importance + Energy-draining: Automate, delegate, or redesign how you do it\n- Low importance + Energy-giving: Limit to 1-2 hours/week maximum\n- Low importance + Energy-draining: Eliminate immediately\n\n**The founder's primary job is to stay in their zone of genius** — the intersection of what creates most value for the company and what gives them energy. Ruthlessly redesign everything else.`,
        },
      ],
    },
    contentEs: {
      description: 'Un ritual de revisión semanal de 30 minutos que te mantiene alineado, reduce la ansiedad y asegura que el trabajo más importante se haga. Mejor hacerlo cada viernes por la tarde.',
      fields: [
        { label: 'Semana del', placeholder: 'Ej: 13-17 Ene 2025', type: 'text', required: true },
        { label: 'Métrica Estrella Polar Esta Semana', placeholder: 'Ej: MRR: $45,200 (+$3,100 vs semana pasada)', type: 'text', required: true },
        { label: 'Mayor Victoria de la Semana', placeholder: 'La única cosa que más movió la aguja', type: 'textarea', required: true },
        { label: 'Mayor Arrepentimiento o Error', placeholder: '¿Qué harías diferente?', type: 'textarea', required: true },
        { label: '#1 Prioridad la Próxima Semana', placeholder: 'LA ÚNICA cosa que haría exitosa la próxima semana', type: 'text', required: true },
      ],
      sections: [
        {
          heading: 'Las 5 Preguntas de Revisión',
          body: `**Responde estas preguntas cada viernes (máximo 30 min):**\n\n**1. ¿Cuáles fueron mis 3 mayores victorias esta semana?**\nEscríbelas aunque la semana se haya sentido como un desastre. Encontrar victorias construye evidencia de progreso.\n\n**2. ¿Qué aprendí? ¿Qué me sorprendió?**\nConversaciones con clientes, perspectivas de producto, observaciones del equipo.\n\n**3. ¿Por qué estoy más agradecido?**\n3 cosas específicas. No "mi equipo" — demasiado vago. "El cliente X que dio retroalimentación honesta."\n\n**4. ¿Qué debería EMPEZAR, DEJAR o CONTINUAR haciendo?**\nUna de cada una. Captúralo en una lista continua.\n\n**5. ¿Cuál es la UNA cosa la próxima semana que, si se logra, haría la mayor diferencia?**\nNo una lista. Una cosa. Escríbela en una nota adhesiva.`,
        },
        {
          heading: 'Auditoría de Calendario (15 min)',
          body: `Antes de cerrar la semana, audita tu calendario para la próxima:\n\n**Las 4 preguntas de auditoría:**\n1. ¿El horario de esta semana refleja mis prioridades declaradas?\n2. ¿Tengo al menos 3 bloques de trabajo profundo de 90 min programados?\n3. ¿Hay alguna reunión que podría ser un email, Loom o doc asíncrono?\n4. ¿He protegido al menos 1 día sin reuniones antes de las 13:00?\n\n**Asignación de tiempo de referencia (etapa semilla):**\n- Ventas/conversaciones con clientes: 40-50%\n- Construcción/producto: 20-30%\n- Equipo y operaciones: 15-20%\n- Pensamiento estratégico/aprendizaje: 10-15%`,
        },
        {
          heading: 'La Auditoría de Energía',
          body: `Una vez al mes, añade una auditoría de energía de 10 minutos:\n\n**Para cada actividad principal del mes pasado:**\n1. Escribe la actividad\n2. Márcala como energizante (+) o drenante (-)\n3. Puntúa la importancia: A (alta), M (media), B (baja)\n\n**Matriz de acción:**\n- Alta importancia + Energizante: Haz más de esto\n- Alta importancia + Drenante: Automatiza, delega o rediseña cómo lo haces\n- Baja importancia + Energizante: Limita a 1-2 horas/semana máximo\n- Baja importancia + Drenante: Elimina inmediatamente\n\n**El trabajo principal del fundador es permanecer en su zona de genialidad** — la intersección de lo que crea más valor y lo que da energía.`,
        },
      ],
    },
  },

  // ═══ r58: Decision-Making Frameworks ═══
  r58: {
    kind: 'infographic',
    content: {
      description: 'Five battle-tested decision frameworks used by the world\'s best operators: Eisenhower Matrix, RAPID, SPADE, WRAP, and OODA Loop. Pick the right framework for the type of decision at hand.',
      sections: [
        {
          title: 'Eisenhower Matrix: Prioritize Daily Work',
          points: [
            'Q1 — Urgent + Important: Do it now (server down, investor ask, customer emergency)',
            'Q2 — Not Urgent + Important: Schedule it (strategy, hiring, product vision, health)',
            'Q3 — Urgent + Not Important: Delegate it (most meeting requests, routine emails)',
            'Q4 — Not Urgent + Not Important: Delete it (most social browsing, low-priority meetings)',
            'Key insight: Most founders live in Q1 and Q3 — the urgent trap. Growth happens in Q2.',
            'Use daily: 3-min morning scan to slot every task into a quadrant before starting',
          ],
          visual: '📊',
        },
        {
          title: 'RAPID: Align Who Decides What',
          points: [
            'R = Recommend (person who proposes the decision with analysis)',
            'A = Agree (must sign off — typically legal, finance, or cross-functional peers)',
            'P = Perform (person who executes the decision once made)',
            'I = Input (consulted for information but not a blocker)',
            'D = Decide (single person with final authority — there must be only ONE)',
            'Use for: Hiring, budget allocation, pricing changes, product roadmap decisions',
          ],
          visual: '🔄',
        },
        {
          title: 'SPADE: Structured Analysis for High-Stakes Decisions',
          points: [
            'S = Setting: What is the decision? What are the constraints? What\'s the timeline?',
            'P = People: Who is the Approver, Responsible, and Consulted?',
            'A = Alternatives: List 3-5 genuine options (not "do this vs do nothing")',
            'D = Decide: Select an option with explicit rationale; name the key assumptions',
            'E = Explain: Communicate the decision to stakeholders with reasoning',
            'Use for: Market entry decisions, major hires, architectural choices, strategic pivots',
          ],
          visual: '♠️',
        },
        {
          title: 'WRAP: Overcome Cognitive Bias',
          points: [
            'W = Widen your options (never decide between Option A and Option B — find C)',
            'R = Reality-test assumptions (pre-mortem: imagine it failed; what went wrong?)',
            'A = Attain distance before deciding (sleep on it; what would you tell a friend?)',
            'P = Prepare to be wrong (set tripwires: "If X happens by date Y, we reverse this")',
            'Use for: Irreversible decisions, emotionally charged choices, decisions under pressure',
            'Key tool: Pre-mortem — "It\'s 6 months later and this failed. Why?"',
          ],
          visual: '🔮',
        },
        {
          title: 'OODA Loop: Decide Fast in Uncertainty',
          points: [
            'O = Observe: Gather raw data from environment (customer calls, metrics, market signals)',
            'O = Orient: Analyze through mental models; filter out noise from signal',
            'D = Decide: Choose a hypothesis or course of action (a "best bet" not "certain answer")',
            'A = Act: Execute. Then immediately loop back to Observe to see if it worked',
            'Use for: Competitive moves, product pivots, crisis response, high-velocity daily decisions',
            'Advantage: Faster OODA loops than competitors = decisive competitive advantage',
          ],
          visual: '🔁',
        },
      ],
      keyTakeaway: 'Match framework to decision type: Daily prioritization → Eisenhower. Who decides → RAPID. High-stakes strategic → SPADE. Overcoming bias → WRAP. Speed under uncertainty → OODA. Using the wrong framework for the wrong decision is worse than using no framework.',
    },
    contentEs: {
      description: 'Cinco marcos de toma de decisiones probados en batalla: Matriz de Eisenhower, RAPID, SPADE, WRAP y OODA Loop. Elige el correcto según el tipo de decisión.',
      sections: [
        {
          title: 'Matriz de Eisenhower: Prioriza el Trabajo Diario',
          points: [
            'C1 — Urgente + Importante: Hazlo ahora (servidor caído, solicitud de inversor)',
            'C2 — No Urgente + Importante: Programa (estrategia, contratación, visión de producto, salud)',
            'C3 — Urgente + No Importante: Delega (la mayoría de solicitudes de reuniones)',
            'C4 — No Urgente + No Importante: Elimina (navegación social de bajo valor)',
            'Perspectiva clave: La mayoría de fundadores viven en C1 y C3. El crecimiento ocurre en C2.',
            'Usa diariamente: escaneo de 3 min para asignar cada tarea a un cuadrante',
          ],
          visual: '📊',
        },
        {
          title: 'RAPID: Alinea Quién Decide Qué',
          points: [
            'R = Recomendar (propone la decisión con análisis)',
            'A = Aprobar (debe dar visto bueno — típicamente legal, finanzas)',
            'P = Realizar (ejecuta la decisión una vez tomada)',
            'I = Informar (consultado para información pero no bloqueador)',
            'D = Decidir (persona única con autoridad final — debe haber SOLO UNA)',
            'Usa para: Contrataciones, asignación de presupuesto, cambios de precios, roadmap de producto',
          ],
          visual: '🔄',
        },
        {
          title: 'SPADE: Análisis Estructurado para Decisiones de Alto Impacto',
          points: [
            'S = Configuración: ¿Cuál es la decisión? ¿Restricciones? ¿Plazo?',
            'P = Personas: ¿Quién es el Aprobador, Responsable y Consultado?',
            'A = Alternativas: 3-5 opciones genuinas',
            'D = Decidir: Selecciona una opción con justificación explícita',
            'E = Explicar: Comunica la decisión a los interesados',
            'Usa para: Entrada a mercados, contrataciones clave, elecciones arquitectónicas, pivotes estratégicos',
          ],
          visual: '♠️',
        },
        {
          title: 'WRAP: Supera el Sesgo Cognitivo',
          points: [
            'W = Amplía tus opciones (nunca decides entre A y B solamente — encuentra C)',
            'R = Pon a prueba los supuestos (premortem: imagina que falló; ¿qué salió mal?)',
            'A = Obtén distancia antes de decidir (duerme sobre ello)',
            'P = Prepárate para estar equivocado (establece detonadores: "Si X ocurre antes de Y, revertimos")',
            'Usa para: Decisiones irreversibles, elecciones emocionalmente cargadas',
            'Herramienta clave: Premortem — "Están 6 meses después y esto falló. ¿Por qué?"',
          ],
          visual: '🔮',
        },
        {
          title: 'Bucle OODA: Decide Rápido en la Incertidumbre',
          points: [
            'O = Observar: Recopila datos crudos (llamadas de clientes, métricas, señales de mercado)',
            'O = Orientar: Analiza a través de modelos mentales; filtra ruido de señal',
            'D = Decidir: Elige una hipótesis o curso de acción',
            'A = Actuar: Ejecuta. Luego vuelve inmediatamente a Observar',
            'Usa para: Movimientos competitivos, pivotes de producto, respuesta a crisis',
            'Ventaja: Bucles OODA más rápidos que competidores = ventaja competitiva decisiva',
          ],
          visual: '🔁',
        },
      ],
      keyTakeaway: 'Adapta el marco al tipo de decisión: Priorización diaria → Eisenhower. Quién decide → RAPID. Estratégica de alto impacto → SPADE. Superar sesgo → WRAP. Velocidad en incertidumbre → OODA. Usar el marco incorrecto es peor que no usar ninguno.',
    },
  },

  // ═══ r59: Customer Interview Script ═══
  r59: {
    kind: 'template',
    content: {
      description: '25 questions that uncover real pain points — not validation of your assumptions. Based on the Mom Test framework: ask about their life, not your idea.',
      fields: [
        { label: 'Interviewee Name', placeholder: 'First name only for notes', type: 'text', required: true },
        { label: 'Company & Role', placeholder: 'e.g., Maria, Head of Operations at FinTech Co', type: 'text', required: true },
        { label: 'Interview Date', placeholder: 'Date', type: 'date', required: true },
        { label: 'Referral Source', placeholder: 'How did you find this person?', type: 'text', required: true },
        { label: 'Top Insight from This Interview', placeholder: 'The single most surprising or useful thing you learned', type: 'textarea', required: true },
        { label: 'Willingness to Pay (1-10)', placeholder: '10 = would buy today', type: 'number', required: true },
      ],
      sections: [
        {
          heading: 'Opening Questions: Understand Their World',
          body: `**The golden rule:** Never mention your product in the first 15 minutes. If you do, you'll get politeness, not truth.\n\n**Opening (first 5 min):**\n- "Thank you for making time. I'm researching [problem space] and I'd love to understand your experience. Can I ask you some questions about how you handle [area]?"\n- "Tell me about your role. What does your typical [day/week] look like?"\n- "In the last 6 months, what's the biggest challenge you've faced in [area]?"\n\n**Problem discovery (min 5-15):**\n- "How are you currently handling [problem]?"\n- "Walk me through the last time you had to [do the thing]. What did you do?"\n- "What's the hardest part of that process?"\n- "What have you tried to fix this? What happened?"\n- "What does this problem cost you — in time, money, or stress?"\n- "Is this something you've tried to find a solution for? What did you find?"`,
        },
        {
          heading: 'Deep Dive: Uncover the Real Pain',
          body: `These questions are designed to get to root causes, not surface symptoms.\n\n**Behavioral questions (most valuable):**\n- "Can you show me how you do that today? Walk me through your screen."\n- "What does 'good' look like for you in this area? What would you change if you could?"\n- "Who else in your organization is affected by this problem?"\n- "If you could wave a magic wand and change one thing about your current process, what would it be?"\n\n**Validation traps to avoid:**\n- DO NOT ask: "Would you use a product that does X?" (hypothetical, useless)\n- DO NOT ask: "How much would you pay for this?" (leading, unreliable)\n- DO NOT ask: "Do you think this is a big problem?" (leading to yes)\n\n**Instead ask:**\n- "Have you paid for any solutions to this? What did they cost?"\n- "How much does this problem cost you per month in [time/money]?"\n- "What's the consequence if this problem doesn't get fixed?"`,
        },
        {
          heading: 'Closing & Synthesis Framework',
          body: `**Closing questions (last 5 min):**\n- "Is there anything else about this challenge I haven't asked that you think is important?"\n- "Who else should I be talking to about this? Could you introduce me?"\n- "If I build something that solves this, would you be willing to be a beta user and give feedback?"\n\n**Note-taking framework during interview:**\n1. **Direct quotes** (verbatim, in quotation marks)\n2. **Observations** (body language, hesitation, emotion)\n3. **Insights** (your interpretation — mark clearly with [I])\n4. **Open questions** — things you want to explore further\n\n**Synthesis (within 30 min of interview):**\n- Write 3 most surprising things you heard\n- Write the strongest evidence of pain you observed\n- Rate: Product-market fit signal (1-10), willingness to pay (1-10), urgency (1-10)\n- Note: Exact customer language you want to use in your marketing`,
        },
      ],
    },
    contentEs: {
      description: '25 preguntas que descubren verdaderos puntos de dolor — no validación de tus supuestos. Basado en el marco del Test de la Mamá: pregunta sobre su vida, no sobre tu idea.',
      fields: [
        { label: 'Nombre del Entrevistado', placeholder: 'Solo primer nombre para notas', type: 'text', required: true },
        { label: 'Empresa y Rol', placeholder: 'Ej: María, Jefa de Operaciones en empresa FinTech', type: 'text', required: true },
        { label: 'Fecha de Entrevista', placeholder: 'Fecha', type: 'date', required: true },
        { label: 'Fuente de Referencia', placeholder: '¿Cómo encontraste a esta persona?', type: 'text', required: true },
        { label: 'Principal Insight de Esta Entrevista', placeholder: 'Lo único más sorprendente o útil que aprendiste', type: 'textarea', required: true },
        { label: 'Disposición a Pagar (1-10)', placeholder: '10 = compraría hoy', type: 'number', required: true },
      ],
      sections: [
        {
          heading: 'Preguntas de Apertura: Entiende Su Mundo',
          body: `**La regla de oro:** Nunca menciones tu producto en los primeros 15 minutos. Si lo haces, obtendrás amabilidad, no verdad.\n\n**Apertura (primeros 5 min):**\n- "Cuéntame sobre tu rol. ¿Cómo es tu [día/semana] típica?"\n- "En los últimos 6 meses, ¿cuál ha sido el mayor desafío que has enfrentado en [área]?"\n\n**Descubrimiento del problema (min 5-15):**\n- "¿Cómo estás manejando actualmente [problema]?"\n- "Llévame a través del último momento en que tuviste que [hacer la cosa]. ¿Qué hiciste?"\n- "¿Cuál es la parte más difícil de ese proceso?"\n- "¿Qué has intentado para solucionar esto? ¿Qué pasó?"\n- "¿Cuánto te cuesta este problema en tiempo, dinero o estrés?"\n- "¿Es algo para lo que has intentado encontrar solución? ¿Qué encontraste?"`,
        },
        {
          heading: 'Investigación Profunda: Descubre el Dolor Real',
          body: `**Preguntas conductuales (más valiosas):**\n- "¿Puedes mostrarme cómo haces eso hoy? Llévame por tu pantalla."\n- "¿Cómo se ve 'bueno' para ti en esta área?"\n- "¿Quién más en tu organización está afectado por este problema?"\n- "Si pudieras usar una varita mágica y cambiar una cosa de tu proceso actual, ¿qué sería?"\n\n**Trampas de validación a evitar:**\n- NO preguntes: "¿Usarías un producto que hace X?" (hipotético, inútil)\n- NO preguntes: "¿Cuánto pagarías por esto?" (sesgado, no confiable)\n\n**En cambio pregunta:**\n- "¿Has pagado por alguna solución a esto? ¿Cuánto costaron?"\n- "¿Cuánto cuesta este problema al mes en tiempo/dinero?"\n- "¿Cuál es la consecuencia si este problema no se resuelve?"`,
        },
        {
          heading: 'Cierre y Marco de Síntesis',
          body: `**Preguntas de cierre (últimos 5 min):**\n- "¿Hay algo más sobre este desafío que no haya preguntado?"\n- "¿Con quién más debería hablar? ¿Podrías presentarme?"\n- "Si construyo algo que resuelva esto, ¿serías un usuario beta?"\n\n**Marco de toma de notas:**\n1. **Citas directas** (verbatim, entre comillas)\n2. **Observaciones** (lenguaje corporal, hesitación, emoción)\n3. **Insights** (tu interpretación — marca claramente con [I])\n4. **Preguntas abiertas** — cosas que quieres explorar más\n\n**Síntesis (dentro de 30 min de la entrevista):**\n- Escribe 3 cosas más sorprendentes que escuchaste\n- Califica: Señal de ajuste producto-mercado (1-10), disposición a pagar (1-10), urgencia (1-10)\n- Nota el lenguaje exacto del cliente que quieres usar en tu marketing`,
        },
      ],
    },
  },

  // ═══ r60: Growth Metrics Dashboard ═══
  r60: {
    kind: 'spreadsheet',
    content: {
      description: 'AARRR pirate metrics dashboard: track Acquisition, Activation, Retention, Referral, and Revenue in one place. Add your North Star metric at the top.',
      columns: [
        { key: 'metric', label: 'Metric', type: 'text', width: 200 },
        { key: 'current', label: 'Current', type: 'text', width: 120 },
        { key: 'target', label: 'Target', type: 'text', width: 120 },
        { key: 'trend', label: 'Trend (MoM)', type: 'percent', width: 130 },
        { key: 'notes', label: 'Notes / Owner', type: 'text', width: 220 },
      ],
      rows: [
        { metric: '⭐ North Star: Active Users', current: '1,240', target: '2,000', trend: 18, notes: 'DAU/MAU = 0.42 — target 0.5' },
        { metric: 'Acquisition: New Signups', current: '380', target: '500', trend: 12, notes: '60% organic, 40% paid' },
        { metric: 'Activation: Completed Setup (%)', current: '54%', target: '70%', trend: 5, notes: 'Drop-off at step 3 (add team member)' },
        { metric: 'Retention: 30-Day Retention', current: '41%', target: '55%', trend: 3, notes: 'Power users: 68%; new users: 28%' },
        { metric: 'Referral: Viral Coefficient (k)', current: '0.18', target: '0.4', trend: -2, notes: 'Referral program launched Jan 1' },
        { metric: 'Revenue: MRR', current: '$45,200', target: '$60,000', trend: 18, notes: 'Churn: 2.1%; NRR: 108%' },
        { metric: 'Revenue: LTV:CAC Ratio', current: '3.8x', target: '5x', trend: 8, notes: 'CAC: $420; LTV: $1,596' },
        { metric: 'Revenue: Gross Margin', current: '78%', target: '82%', trend: 1, notes: 'COGS: $9,940 (hosting + support)' },
      ],
    },
    contentEs: {
      description: 'Panel de métricas de pirata AARRR: rastrea Adquisición, Activación, Retención, Referido e Ingresos en un solo lugar. Añade tu métrica Estrella Polar arriba.',
      columns: [
        { key: 'metric', label: 'Métrica', type: 'text', width: 200 },
        { key: 'current', label: 'Actual', type: 'text', width: 120 },
        { key: 'target', label: 'Objetivo', type: 'text', width: 120 },
        { key: 'trend', label: 'Tendencia (MoM)', type: 'percent', width: 130 },
        { key: 'notes', label: 'Notas / Responsable', type: 'text', width: 220 },
      ],
      rows: [
        { metric: '⭐ Estrella Polar: Usuarios Activos', current: '1,240', target: '2,000', trend: 18, notes: 'DAU/MAU = 0.42 — objetivo 0.5' },
        { metric: 'Adquisición: Nuevos Registros', current: '380', target: '500', trend: 12, notes: '60% orgánico, 40% pago' },
        { metric: 'Activación: Configuración Completada (%)', current: '54%', target: '70%', trend: 5, notes: 'Abandono en paso 3 (añadir miembro al equipo)' },
        { metric: 'Retención: Retención a 30 Días', current: '41%', target: '55%', trend: 3, notes: 'Usuarios poderosos: 68%; nuevos: 28%' },
        { metric: 'Referido: Coeficiente Viral (k)', current: '0.18', target: '0.4', trend: -2, notes: 'Programa de referidos lanzado 1 ene' },
        { metric: 'Ingresos: MRR', current: '$45,200', target: '$60,000', trend: 18, notes: 'Abandono: 2.1%; NRR: 108%' },
        { metric: 'Ingresos: Ratio LTV:CAC', current: '3.8x', target: '5x', trend: 8, notes: 'CAC: $420; LTV: $1,596' },
        { metric: 'Ingresos: Margen Bruto', current: '78%', target: '82%', trend: 1, notes: 'COGS: $9,940 (alojamiento + soporte)' },
      ],
    },
  },

  // ═══ r61: SOP: Customer Onboarding Flow ═══
  r61: {
    kind: 'sop',
    content: { purpose: 'Activate new customers within 7 days.', frequency: 'Per signup', owner: 'CS Lead', steps: [{ step: 1, action: 'Welcome email', detail: 'Within 2 hours of signup', tools: 'Email template' }], kpis: ['% activate within 7 days', 'NPS at 7 days'] },
    contentEs: { purpose: 'Activar nuevos clientes dentro de 7 días.', frequency: 'Por registro', owner: 'Líder de CS', steps: [{ step: 1, action: 'Correo de bienvenida', detail: 'Dentro de 2 horas del registro', tools: 'Plantilla de correo' }], kpis: ['% activan dentro de 7 días', 'NPS al día 7'] },
  },

  // ═══ r62: SOP: Content Publishing Pipeline ═══
  r62: {
    kind: 'sop',
    content: { purpose: 'Publish blog posts consistently.', frequency: 'Weekly', owner: 'Content Lead', steps: [{ step: 1, action: 'Ideation', detail: 'Topic brainstorm session', tools: 'Slack, Docs' }], kpis: ['Posts published per week', 'Engagement rate'] },
    contentEs: { purpose: 'Publicar artículos de blog consistentemente.', frequency: 'Semanal', owner: 'Líder de Contenido', steps: [{ step: 1, action: 'Ideación', detail: 'Sesión de lluvia de ideas de temas', tools: 'Slack, Docs' }], kpis: ['Posts publicados por semana', 'Tasa de compromiso'] },
  },

  // ═══ r63: SOP: Sales Outreach Cadence ═══
  r63: {
    kind: 'sop',
    content: { purpose: 'Multi-channel sales outreach.', frequency: 'Daily', owner: 'Sales Lead', steps: [{ step: 1, action: 'LinkedIn message', detail: 'Personalized intro', tools: 'LinkedIn' }], kpis: ['Conversations started', 'Reply rate %'] },
    contentEs: { purpose: 'Divulgación de ventas multicanal.', frequency: 'Diario', owner: 'Líder de Ventas', steps: [{ step: 1, action: 'Mensaje de LinkedIn', detail: 'Introducción personalizada', tools: 'LinkedIn' }], kpis: ['Conversaciones iniciadas', 'Tasa de respuesta %'] },
  },

  // ═══ r64: SOP: Bug Triage & Incident Response ═══
  r64: {
    kind: 'sop',
    content: { purpose: 'Manage bugs and incidents.', frequency: 'As-needed', owner: 'Engineering Lead', steps: [{ step: 1, action: 'Report bug', detail: 'Log in system', tools: 'GitHub Issues' }], kpis: ['Time to response', 'Time to resolution'] },
    contentEs: { purpose: 'Gestionar errores e incidentes.', frequency: 'Según sea necesario', owner: 'Líder de Ingeniería', steps: [{ step: 1, action: 'Reportar error', detail: 'Registrar en sistema', tools: 'GitHub Issues' }], kpis: ['Tiempo para respuesta', 'Tiempo para resolución'] },
  },

  // ═══ r65: SOP: Monthly Close & Financial Review ═══
  r65: {
    kind: 'sop',
    content: { purpose: 'Monthly financial review and close.', frequency: 'Monthly', owner: 'Finance Lead', steps: [{ step: 1, action: 'Reconcile accounts', detail: 'Match bank statement', tools: 'QuickBooks' }], kpis: ['Close by 10th of month', 'P&L accuracy'] },
    contentEs: { purpose: 'Revisión financiera mensual y cierre.', frequency: 'Mensual', owner: 'Líder de Finanzas', steps: [{ step: 1, action: 'Reconciliar cuentas', detail: 'Coincidir estado de cuenta bancario', tools: 'QuickBooks' }], kpis: ['Cierre antes del día 10', 'Precisión de P&L'] },
  },

  // ═══ r66: SOP: Hiring & Interviewing Process ═══
  r66: {
    kind: 'sop',
    content: { purpose: 'Hire quality employees.', frequency: 'As-needed', owner: 'HR Lead', steps: [{ step: 1, action: 'Post job description', detail: 'On job boards', tools: 'LinkedIn, AngelList' }], kpis: ['Time to hire', 'Offer acceptance rate'] },
    contentEs: { purpose: 'Contratar empleados de calidad.', frequency: 'Según sea necesario', owner: 'Líder de RRHH', steps: [{ step: 1, action: 'Publicar descripción del trabajo', detail: 'En bolsas de trabajo', tools: 'LinkedIn, AngelList' }], kpis: ['Tiempo para contratar', 'Tasa de aceptación de oferta'] },
  },

  // ═══ r67: SOP: Social Media Management ═══
  r67: {
    kind: 'sop',
    content: { purpose: 'Manage social media presence.', frequency: 'Daily', owner: 'Marketing Lead', steps: [{ step: 1, action: 'Post on Twitter', detail: '1-2 posts daily', tools: 'Buffer, Hootsuite' }], kpis: ['Followers gained', 'Engagement rate'] },
    contentEs: { purpose: 'Gestionar presencia en redes sociales.', frequency: 'Diario', owner: 'Líder de Marketing', steps: [{ step: 1, action: 'Publicar en Twitter', detail: '1-2 posts diarios', tools: 'Buffer, Hootsuite' }], kpis: ['Seguidores ganados', 'Tasa de compromiso'] },
  },

  // ═══ r68: SOP: Customer Feedback Loop ═══
  r68: {
    kind: 'sop',
    content: { purpose: 'Capture and act on customer feedback.', frequency: 'Weekly', owner: 'Product Lead', steps: [{ step: 1, action: 'Collect feedback', detail: 'Via surveys and calls', tools: 'Typeform, Calendly' }], kpis: ['Feedback items processed', 'Features built from feedback'] },
    contentEs: { purpose: 'Capturar y actuar sobre comentarios de clientes.', frequency: 'Semanal', owner: 'Líder de Producto', steps: [{ step: 1, action: 'Recopilar comentarios', detail: 'Via encuestas y llamadas', tools: 'Typeform, Calendly' }], kpis: ['Elementos de comentarios procesados', 'Características construidas a partir de comentarios'] },
  },

  // ═══ r70: Client Proposal & SOW Template ═══
  r70: {
    kind: 'template',
    content: {
      description: 'Professional services proposal with scope, deliverables, timeline, pricing, and terms. Close more deals faster with a proposal that answers every buying objection upfront.',
      fields: [
        { label: 'Client Name', placeholder: 'Company or individual name', type: 'text', required: true },
        { label: 'Project Title', placeholder: 'e.g., "Q1 Brand Identity & Website Redesign"', type: 'text', required: true },
        { label: 'Total Project Value', placeholder: 'e.g., $18,500', type: 'text', required: true },
        { label: 'Project Start Date', placeholder: 'Proposed start date', type: 'date', required: true },
        { label: 'Project End Date', placeholder: 'Proposed completion date', type: 'date', required: true },
      ],
      sections: [
        {
          heading: 'Executive Summary & Problem Statement',
          body: `Start with THEIR problem, not your credentials.\n\n**Template:**\n"[Client] is [situation]. You've expressed that [key challenge] is costing you [measurable impact]. This proposal outlines how [your company] will [solve it] so that [desired outcome] by [date]."\n\n**Example:**\n"TechFlow is scaling from 50 to 200 employees in 12 months. You've expressed that your current brand identity feels inconsistent and is hurting recruitment. This proposal outlines how Bright Studio will create a cohesive brand system so that TechFlow has a professional identity that attracts senior engineers by March 31."\n\n**Why this works:** It shows you listened. It connects your work to their business outcome. It's specific enough to verify.`,
        },
        {
          heading: 'Scope of Work & Deliverables',
          body: `Be specific to the point of discomfort. Vague scope = scope creep = relationship damage.\n\n**Scope structure:**\n1. **In Scope (explicit):** List every deliverable with clear acceptance criteria\n2. **Out of Scope (explicit):** List what's NOT included — saves arguments later\n3. **Client Responsibilities:** What you need from them to deliver\n\n**Deliverables template:**\n- Deliverable 1: Brand Identity System\n  - 3 logo variations (primary, secondary, icon)\n  - Color palette (5 colors with hex codes and CMYK values)\n  - Typography system (2 font families with usage rules)\n  - Brand guidelines PDF (30+ pages)\n  - **Acceptance criteria:** Client approves final version or provides written feedback\n\n**Out of scope (examples):**\n- Website development (proposal scope is design only)\n- Photography or video production\n- Social media content creation`,
        },
        {
          heading: 'Timeline & Payment Terms',
          body: `**Project timeline (Phase-based):**\n\n| Phase | Duration | Deliverables | Client Action Required |\n|-------|----------|-------------|------------------------|\n| Discovery | Week 1 | Brief, stakeholder interviews | Provide access to team |\n| Concepts | Weeks 2-3 | 3 brand directions | Feedback within 5 days |\n| Refinement | Week 4 | 2 revisions included | Written approval |\n| Final Delivery | Week 5 | All files, brand guide | Final payment |\n\n**Payment schedule (recommended):**\n- 50% on project kickoff (reduces cancellation risk)\n- 25% at concept presentation milestone\n- 25% on final delivery\n\n**Late payment clause:** Invoices unpaid after 15 days incur 1.5%/month interest charge.\n\n**Kill fee:** If client cancels after kickoff, retain 50% of unpaid balance to cover work completed.`,
        },
        {
          heading: 'Investment & Revision Policy',
          body: `**Investment summary:**\n\n| Service | Fee |\n|---------|-----|\n| Brand Identity System | $12,000 |\n| Brand Guidelines Document | $3,500 |\n| Project Management | $2,000 |\n| **Total Investment** | **$17,500** |\n\n**What's included:**\n- 2 rounds of revisions per major deliverable\n- 1 final presentation / walkthrough call\n- 30-day post-delivery Q&A support\n\n**What additional revisions cost:**\n- Additional revision rounds: $150/hour\n- Rush delivery (<48 hours): 25% surcharge\n\n**IP ownership:** Full IP transfers to client upon final payment. Agency retains right to show work in portfolio unless NDA applies.\n\n**Acceptance:** This proposal is valid for 14 days. Sign below to reserve your project start date.`,
        },
      ],
    },
    contentEs: {
      description: 'Propuesta de servicios profesionales con alcance, entregables, línea de tiempo, precios y términos. Cierra más tratos más rápido con una propuesta que responde cada objeción de compra de antemano.',
      fields: [
        { label: 'Nombre del Cliente', placeholder: 'Nombre de empresa o individuo', type: 'text', required: true },
        { label: 'Título del Proyecto', placeholder: 'Ej: "Rediseño de Identidad de Marca Q1"', type: 'text', required: true },
        { label: 'Valor Total del Proyecto', placeholder: 'Ej: $18,500', type: 'text', required: true },
        { label: 'Fecha de Inicio del Proyecto', placeholder: 'Fecha de inicio propuesta', type: 'date', required: true },
        { label: 'Fecha de Finalización del Proyecto', placeholder: 'Fecha de finalización propuesta', type: 'date', required: true },
      ],
      sections: [
        {
          heading: 'Resumen Ejecutivo y Declaración del Problema',
          body: `Comienza con SU problema, no con tus credenciales.\n\n**Plantilla:**\n"[Cliente] está [situación]. Has expresado que [desafío clave] te está costando [impacto medible]. Esta propuesta describe cómo [tu empresa] resolverá [problema] para que [resultado deseado] antes de [fecha]."\n\n**Por qué funciona:** Demuestra que escuchaste. Conecta tu trabajo con su resultado empresarial. Es suficientemente específico para verificar.`,
        },
        {
          heading: 'Alcance del Trabajo y Entregables',
          body: `Sé específico hasta el punto de incomodidad. Alcance vago = expansión del alcance = daño a la relación.\n\n**Estructura del alcance:**\n1. **En el Alcance (explícito):** Lista cada entregable con criterios de aceptación claros\n2. **Fuera del Alcance (explícito):** Lista lo que NO está incluido\n3. **Responsabilidades del Cliente:** Lo que necesitas de ellos\n\n**Plantilla de entregables:**\n- Entregable 1: Sistema de Identidad de Marca\n  - 3 variaciones de logotipo\n  - Paleta de colores (5 colores con códigos hex)\n  - Sistema tipográfico\n  - PDF de guías de marca (+30 páginas)\n  - **Criterio de aceptación:** Cliente aprueba versión final`,
        },
        {
          heading: 'Línea de Tiempo y Términos de Pago',
          body: `**Línea de tiempo del proyecto:**\n\n| Fase | Duración | Entregables | Acción Requerida del Cliente |\n|------|----------|-------------|-----------------------------|\n| Descubrimiento | Semana 1 | Brief, entrevistas | Proporcionar acceso al equipo |\n| Conceptos | Semanas 2-3 | 3 direcciones de marca | Retroalimentación en 5 días |\n| Refinamiento | Semana 4 | 2 revisiones incluidas | Aprobación escrita |\n| Entrega Final | Semana 5 | Todos los archivos | Pago final |\n\n**Programa de pago (recomendado):**\n- 50% en inicio del proyecto\n- 25% en presentación de conceptos\n- 25% en entrega final\n\n**Cláusula de pago tardío:** Facturas no pagadas después de 15 días generan 1.5%/mes de interés.`,
        },
        {
          heading: 'Inversión y Política de Revisiones',
          body: `**Resumen de inversión:**\n\n| Servicio | Tarifa |\n|---------|--------|\n| Sistema de Identidad de Marca | $12,000 |\n| Documento de Guías de Marca | $3,500 |\n| Gestión de Proyecto | $2,000 |\n| **Inversión Total** | **$17,500** |\n\n**Qué está incluido:**\n- 2 rondas de revisiones por entregable principal\n- 1 presentación/llamada final de revisión\n- 30 días de soporte post-entrega\n\n**Propiedad de PI:** La PI completa se transfiere al cliente con el pago final.\n\n**Aceptación:** Esta propuesta es válida por 14 días.`,
        },
      ],
    },
  },

  // ═══ r71: Brand Identity & Style Guide ═══
  r71: {
    kind: 'template',
    content: {
      description: 'Complete brand identity system: logo usage, color palette, typography, imagery, voice & tone, and usage rules. The document that makes every piece of content feel like it came from the same company.',
      fields: [
        { label: 'Brand Name', placeholder: 'Your company name', type: 'text', required: true },
        { label: 'Brand Tagline', placeholder: 'Your one-line brand promise', type: 'text', required: true },
        { label: 'Primary Brand Color (Hex)', placeholder: 'e.g., #2563EB', type: 'text', required: true },
        { label: 'Brand Archetype', placeholder: 'e.g., The Hero, The Sage, The Creator', type: 'select', options: ['The Hero', 'The Sage', 'The Creator', 'The Caregiver', 'The Explorer', 'The Rebel', 'The Lover', 'The Jester', 'The Ruler', 'The Innocent', 'The Magician', 'The Everyman'] },
        { label: 'Primary Audience', placeholder: 'e.g., B2B SaaS founders, 25-45', type: 'text', required: true },
      ],
      sections: [
        {
          heading: 'Logo System: How to Use Your Mark',
          body: `**The 4 logo variants every brand needs:**\n1. **Primary logo** (full horizontal lockup — default for most uses)\n2. **Stacked logo** (vertical — for square formats, profile photos)\n3. **Wordmark only** (text only — for tight horizontal spaces)\n4. **Icon/mark only** (favicon, app icon, badge)\n\n**Logo clear space rule:** Always maintain clear space equal to the height of the lowercase "x" in your wordmark on all sides.\n\n**Minimum size:** Never display the primary logo smaller than 80px wide digitally or 1.5 inches print.\n\n**Prohibited uses (document these explicitly):**\n- Do not stretch, squash, or rotate the logo\n- Do not add drop shadows, gradients, or outlines\n- Do not display on backgrounds that create contrast issues\n- Do not use the icon alone in formal business documents\n- Do not alter the colors from the approved palette`,
        },
        {
          heading: 'Color System: Primary, Secondary & Neutrals',
          body: `**Color psychology matters:** Colors create the first emotional impression before a word is read.\n\n**System structure:**\n- **1 Primary brand color** (dominant, used in CTA buttons, headers, accents)\n- **1 Secondary color** (complementary, used for hover states, supporting elements)\n- **4 Neutral shades** (light gray, mid gray, dark gray, near-black for text)\n- **2 Semantic colors** (success green, error red — standard)\n\n**Color specifications (include ALL of these):**\n- HEX: #2563EB (for digital/screens)\n- RGB: 37, 99, 235\n- CMYK: 84, 58, 0, 8 (for print)\n- Pantone: PMS 285 C (for brand merchandise)\n\n**Accessibility rule:** All text-on-background color combinations must meet WCAG AA minimum 4.5:1 contrast ratio. Test every combination at webaim.org/resources/contrastchecker.`,
        },
        {
          heading: 'Typography: Hierarchy & Usage',
          body: `**The 2-font system (recommended for brands):**\n- **Display/Heading font:** Personality font — expressive, unique, used for H1-H2\n- **Body/UI font:** Utility font — legible, neutral, used for H3-H6, body, UI elements\n\n**Type scale (use a ratio — 1.25 or 1.333):**\n| Level | Size | Weight | Usage |\n|-------|------|--------|-------|\n| H1 | 48px | 700 | Page titles |\n| H2 | 38px | 700 | Section headers |\n| H3 | 30px | 600 | Sub-sections |\n| H4 | 24px | 600 | Card titles |\n| Body | 16px | 400 | All body text |\n| Small | 14px | 400 | Captions, labels |\n| XS | 12px | 400 | Legal, metadata |\n\n**Web font loading:** Use Google Fonts or self-host. Limit to 2 font families × 3 weights = 6 font files maximum for performance.`,
        },
        {
          heading: 'Voice & Tone: How Your Brand Speaks',
          body: `Voice is constant. Tone adjusts to context.\n\n**Voice (always true — your brand's personality):**\nDefine 3-4 personality traits with "we are / we are not" pairs to prevent misinterpretation.\n\nExample for a FinTech startup:\n- Direct, not blunt\n- Confident, not arrogant\n- Empathetic, not patronizing\n- Expert, not academic\n\n**Tone guidelines by context:**\n| Context | Tone | Example |\n|---------|------|---------|\n| Marketing | Inspiring, ambitious | "Change how the world moves money" |\n| Onboarding | Warm, encouraging | "You're 3 steps from your first payment" |\n| Error messages | Calm, helpful | "Something went wrong. Here's what to do:" |\n| Support | Human, patient | "I understand. Let me help you fix that." |\n\n**Writing rules:**\n- Active voice over passive (always)\n- Short sentences: max 25 words for body, max 12 for CTAs\n- Numbers over words for metrics ("3x faster" not "three times faster")\n- Oxford comma (pick one — document it)`,
        },
      ],
    },
    contentEs: {
      description: 'Sistema completo de identidad de marca: uso del logotipo, paleta de colores, tipografía, imágenes, voz y tono, y reglas de uso.',
      fields: [
        { label: 'Nombre de la Marca', placeholder: 'Nombre de tu empresa', type: 'text', required: true },
        { label: 'Eslogan de la Marca', placeholder: 'Tu promesa de marca en una línea', type: 'text', required: true },
        { label: 'Color Principal de la Marca (Hex)', placeholder: 'Ej: #2563EB', type: 'text', required: true },
        { label: 'Arquetipo de Marca', placeholder: 'Ej: El Héroe, El Sabio, El Creador', type: 'select', options: ['El Héroe', 'El Sabio', 'El Creador', 'El Cuidador', 'El Explorador', 'El Rebelde', 'El Amante', 'El Bufón', 'El Gobernante', 'El Inocente', 'El Mago', 'El Hombre Común'] },
        { label: 'Audiencia Principal', placeholder: 'Ej: Fundadores SaaS B2B, 25-45 años', type: 'text', required: true },
      ],
      sections: [
        {
          heading: 'Sistema de Logotipo: Cómo Usar Tu Marca',
          body: `**Las 4 variantes de logotipo que toda marca necesita:**\n1. **Logotipo principal** (lockup horizontal — predeterminado para la mayoría de usos)\n2. **Logotipo apilado** (vertical — para formatos cuadrados)\n3. **Solo wordmark** (solo texto — para espacios horizontales ajustados)\n4. **Solo icono/marca** (favicon, icono de app)\n\n**Usos prohibidos (documenta estos explícitamente):**\n- No estires, aplastes ni rotes el logotipo\n- No añadas sombras, degradados ni contornos\n- No muestres sobre fondos con problemas de contraste\n- No alteres los colores de la paleta aprobada`,
        },
        {
          heading: 'Sistema de Colores: Primarios, Secundarios y Neutros',
          body: `**Estructura del sistema:**\n- **1 Color principal de marca** (dominante, usado en botones CTA, encabezados)\n- **1 Color secundario** (complementario, estados hover, elementos de apoyo)\n- **4 Tonos neutros** (gris claro, gris medio, gris oscuro, casi negro para texto)\n- **2 Colores semánticos** (verde éxito, rojo error)\n\n**Especificaciones de color:**\n- HEX: #2563EB (digital/pantallas)\n- RGB: 37, 99, 235\n- CMYK: 84, 58, 0, 8 (impresión)\n- Pantone: PMS 285 C (merchandising)\n\n**Regla de accesibilidad:** Todas las combinaciones texto-fondo deben cumplir WCAG AA mínimo 4.5:1 de relación de contraste.`,
        },
        {
          heading: 'Tipografía: Jerarquía y Uso',
          body: `**El sistema de 2 fuentes (recomendado):**\n- **Fuente de visualización/encabezado:** Fuente de personalidad — expresiva, única\n- **Fuente de cuerpo/UI:** Fuente de utilidad — legible, neutral\n\n**Escala tipográfica:**\n- H1: 48px, Peso 700 — Títulos de página\n- H2: 38px, Peso 700 — Encabezados de sección\n- H3: 30px, Peso 600 — Sub-secciones\n- Cuerpo: 16px, Peso 400 — Todo el texto de cuerpo\n- Pequeño: 14px — Subtítulos, etiquetas\n\n**Carga de fuentes web:** Limitar a 2 familias × 3 pesos = 6 archivos de fuente máximo.`,
        },
        {
          heading: 'Voz y Tono: Cómo Habla Tu Marca',
          body: `La voz es constante. El tono se ajusta al contexto.\n\n**Voz (siempre verdadera — personalidad de tu marca):**\nDefine 3-4 rasgos de personalidad con pares "somos / no somos".\n\nEjemplo para startup FinTech:\n- Directos, no bruscos\n- Seguros, no arrogantes\n- Empáticos, no condescendientes\n- Expertos, no académicos\n\n**Pautas de tono por contexto:**\n- Marketing: Inspirador, ambicioso\n- Incorporación: Cálido, alentador\n- Mensajes de error: Tranquilo, útil\n- Soporte: Humano, paciente\n\n**Reglas de escritura:**\n- Voz activa sobre pasiva (siempre)\n- Frases cortas: máximo 25 palabras para cuerpo, máximo 12 para CTA`,
        },
      ],
    },
  },

  // ═══ r72: Investor Data Room Checklist ═══
  r72: {
    kind: 'template',
    content: {
      description: 'Complete data room checklist for seed and Series A due diligence. Organized by category — have everything ready before investors ask.',
      fields: [
        { label: 'Company Name', placeholder: 'Your startup', type: 'text', required: true },
        { label: 'Round Type', placeholder: 'e.g., Seed, Series A', type: 'select', options: ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Other'], required: true },
        { label: 'Data Room Platform', placeholder: 'e.g., Notion, Google Drive, Docsend, Capdesk', type: 'text', required: true },
        { label: 'Last Updated', placeholder: 'Keep current — stale data rooms kill deals', type: 'date', required: true },
        { label: 'NDA Required?', placeholder: 'Yes/No — most seed rounds do not require NDA', type: 'text', required: true },
      ],
      sections: [
        {
          heading: 'Corporate Documents',
          body: `**Must have before any investor meeting:**\n- Certificate of Incorporation (Delaware C-Corp preferred by US VCs)\n- Articles of Organization (if LLC)\n- Operating Agreement or Shareholder Agreement\n- Bylaws\n- EIN / Tax ID documentation\n\n**Cap table documents:**\n- Current cap table (Carta or Pulley preferred; Excel accepted at seed)\n- All SAFE agreements with terms (amount, cap, discount)\n- All convertible note agreements\n- Option pool: ESOP plan document, all option grant agreements\n- Any side letters with investors\n\n**IP assignments:**\n- Founder IP assignment agreements (all founders must have signed these)\n- Employee IP assignment agreements (all employees)\n- Contractor IP assignment agreements\n- Patent applications or granted patents (if any)\n- Trademark registrations`,
        },
        {
          heading: 'Financial Documents',
          body: `**Financials investors will always request:**\n- 3-year financial model (P&L, balance sheet, cash flow — even if projections)\n- Last 12 months actual P&L (management accounts)\n- Bank statements: last 3 months\n- Current burn rate and runway calculation\n\n**Unit economics:**\n- CAC by channel (paid, organic, referral)\n- LTV calculation with assumptions shown\n- Payback period by cohort\n- Gross margin by product/customer segment\n\n**For Series A+ (add):**\n- Audited financials (2-3 years)\n- Board-approved budget\n- Revenue recognition policy\n- Accounts receivable aging\n- Top 10 customers by ARR`,
        },
        {
          heading: 'Product & Market Documents',
          body: `**Product:**\n- Product demo video (5 min max — update quarterly)\n- Product roadmap (1-2 pages, next 12 months)\n- Key product metrics (DAU, MAU, NPS, activation rate, retention curves)\n- Technical architecture overview (1 page for non-technical investors)\n\n**Market:**\n- TAM/SAM/SOM analysis with sources\n- Competitive landscape map\n- Customer case studies (2-3 written or video)\n- Key customer contracts (redacted if necessary)\n\n**Team:**\n- Founder bios (1 page each)\n- Key hire profiles (for roles you're actively recruiting)\n- Org chart (current and 12-month plan)\n- Advisor bios and equity grants`,
        },
        {
          heading: 'Deal Documents (Share Only with Serious Investors)',
          body: `**Do not put these in the main data room. Share separately via DocSend with tracking.**\n\n- **Pitch deck** (latest version, watermarked via DocSend)\n- **Term sheet** (once issued — not until you have mutual interest)\n- **Due diligence checklist** (investor-specific, respond to each item)\n\n**Data room hygiene:**\n- Use DocSend or Notion with permission tracking — know who viewed what\n- Update at least quarterly — stale data (6+ months old) signals poor management\n- Create a "latest" folder at the top level with the 5 most commonly requested docs\n- Log every investor interaction in your CRM\n\n**Red flag signals in your data room:**\n- Multiple versions of the same doc with conflicting numbers\n- Cap table that doesn't match actual equity grants\n- Financial projections with no assumptions\n- Missing IP assignment for a key founder or engineer`,
        },
      ],
    },
    contentEs: {
      description: 'Lista completa de sala de datos para diligencia debida de semilla y Serie A. Organizada por categoría — ten todo listo antes de que los inversores lo pidan.',
      fields: [
        { label: 'Nombre de la Empresa', placeholder: 'Tu startup', type: 'text', required: true },
        { label: 'Tipo de Ronda', placeholder: 'Ej: Semilla, Serie A', type: 'select', options: ['Pre-Semilla', 'Semilla', 'Serie A', 'Serie B', 'Otro'], required: true },
        { label: 'Plataforma de Sala de Datos', placeholder: 'Ej: Notion, Google Drive, Docsend', type: 'text', required: true },
        { label: 'Última Actualización', placeholder: 'Mantén actualizada — salas de datos obsoletas matan los tratos', type: 'date', required: true },
        { label: '¿Se Requiere NDA?', placeholder: 'Sí/No — la mayoría de rondas semilla no requieren NDA', type: 'text', required: true },
      ],
      sections: [
        {
          heading: 'Documentos Corporativos',
          body: `**Obligatorio antes de cualquier reunión de inversores:**\n- Certificado de Incorporación (Delaware C-Corp preferido por VCs de EE.UU.)\n- Acuerdo de accionistas\n- Estatutos\n\n**Documentos de tabla de capitalización:**\n- Tabla de capitalización actual (Carta o Pulley preferido)\n- Todos los acuerdos SAFE con términos\n- Todos los acuerdos de notas convertibles\n- Plan de opciones ESOP y todos los acuerdos de concesión\n\n**Asignaciones de PI:**\n- Acuerdos de asignación de PI del fundador (todos los fundadores deben haberlos firmado)\n- Acuerdos de asignación de PI de empleados\n- Registros de marcas comerciales`,
        },
        {
          heading: 'Documentos Financieros',
          body: `**Finanzas que los inversores siempre solicitarán:**\n- Modelo financiero de 3 años (P&L, balance, flujo de caja)\n- Últimos 12 meses de P&L real\n- Extractos bancarios: últimos 3 meses\n- Tasa de quema actual y cálculo de runway\n\n**Economía de unidades:**\n- CAC por canal (pago, orgánico, referido)\n- Cálculo de LTV con supuestos mostrados\n- Período de recuperación por cohorte\n- Margen bruto por producto/segmento de cliente`,
        },
        {
          heading: 'Documentos de Producto y Mercado',
          body: `**Producto:**\n- Video de demostración del producto (máx 5 min — actualizar trimestralmente)\n- Roadmap de producto (1-2 páginas, próximos 12 meses)\n- Métricas clave de producto (DAU, MAU, NPS, tasa de activación, curvas de retención)\n\n**Mercado:**\n- Análisis TAM/SAM/SOM con fuentes\n- Mapa del panorama competitivo\n- Casos de estudio de clientes (2-3 escritos o en video)\n\n**Equipo:**\n- Biografías de fundadores (1 página cada uno)\n- Perfiles de contrataciones clave\n- Organigrama actual y plan a 12 meses`,
        },
        {
          heading: 'Documentos del Trato (Compartir Solo con Inversores Serios)',
          body: `**No pongas esto en la sala de datos principal. Comparte por separado vía DocSend con seguimiento.**\n\n- Deck de presentación (última versión, con marca de agua)\n- Hoja de términos (una vez emitida)\n\n**Higiene de la sala de datos:**\n- Usa DocSend o Notion con seguimiento de permisos\n- Actualiza al menos trimestralmente\n- Crea una carpeta "últimos" con los 5 documentos más solicitados\n- Registra cada interacción de inversor en tu CRM\n\n**Señales de alerta en tu sala de datos:**\n- Múltiples versiones del mismo documento con números contradictorios\n- Tabla de capitalización que no coincide con concesiones reales de equity\n- Proyecciones financieras sin supuestos`,
        },
      ],
    },
  },

  // ═══ r73: Meeting Agenda & Notes Template ═══
  r73: {
    kind: 'template',
    content: {
      description: 'Structured meeting format that eliminates wasted meetings: objectives, pre-reads, discussion, decisions, and action items. If a meeting can be async, cancel it.',
      fields: [
        { label: 'Meeting Title', placeholder: 'e.g., "Q1 Roadmap Prioritization — Decision Meeting"', type: 'text', required: true },
        { label: 'Date & Time', placeholder: 'e.g., Jan 15, 2025 at 10:00 AM PT', type: 'text', required: true },
        { label: 'Meeting Owner', placeholder: 'Who is responsible for running this meeting?', type: 'text', required: true },
        { label: 'Meeting Type', placeholder: 'Decision / Brainstorm / Status Update / 1:1', type: 'select', options: ['Decision', 'Brainstorm', 'Status Update', '1:1', 'All Hands', 'External / Customer'], required: true },
        { label: 'Decision Needed By', placeholder: 'e.g., Jan 15 EOD (keep meetings time-boxed to decisions)', type: 'text', required: true },
      ],
      sections: [
        {
          heading: 'Pre-Meeting Setup (Send 24 Hours Before)',
          body: `**The meeting is won or lost in the setup, not the room.**\n\n**Pre-meeting packet (send 24 hours before via Notion or Google Doc):**\n\n1. **Meeting objective (1 sentence):** "The purpose of this meeting is to decide [X] so that [Y] can happen by [date]."\n\n2. **Pre-read (if any):** Link or attach doc. Maximum 10 minutes to read. State: "Please read this before the meeting. We will not re-present the material in the session."\n\n3. **Agenda with time allocation:**\n| Time | Topic | Owner | Goal |\n|------|-------|-------|------|\n| 0:00-0:05 | Objectives & context | Meeting owner | Alignment |\n| 0:05-0:20 | Status update | [Person] | Information only |\n| 0:20-0:45 | Decision: [Topic] | [Decision owner] | Decide |\n| 0:45-0:55 | Action items review | Meeting owner | Commitment |\n| 0:55-1:00 | Parking lot | All | Triage |\n\n4. **Decisions to be made (list them explicitly):** "By end of meeting, we need to decide: (1) [Decision A], (2) [Decision B]"`,
        },
        {
          heading: 'During the Meeting: Run It Tight',
          body: `**Opening (first 2 min):**\n- State the objective aloud: "We are here to decide [X]. We have 60 minutes. Let's stay focused."\n- Designate a note-taker (not the meeting owner)\n- Remind everyone: "Put phones away. Laptops only if you're taking notes."\n\n**For decision meetings — use this structure:**\n1. Brief framing: "Here's the context (3 min max)"\n2. Options presented: "Option A vs Option B vs Option C"\n3. Discussion: "What info do we need that we don't have? What are the risks?"\n4. Decision: "Using [RAPID/consensus], the decision is X. Rationale: Y."\n5. Action items: "Who does what by when?"\n\n**Parking lot:** For topics that arise but aren't on agenda — write them down, acknowledge them, and say "we'll address that separately." Do not let parking lot items derail the agenda.\n\n**On time-keeping:** The meeting owner is responsible for clock management. Give a 10-minute warning before the end.`,
        },
        {
          heading: 'Meeting Notes & Follow-Up (Send Within 2 Hours)',
          body: `**Notes structure (the only format that actually gets read):**\n\n**DECISIONS MADE:**\n- [Decision 1]: We will [X]. Owner: [Name]. Rationale: [Y].\n- [Decision 2]: We will NOT do [X] because [Y]. Revisit in Q3.\n\n**ACTION ITEMS:**\n| Action | Owner | Due Date | Done? |\n|--------|-------|----------|-------|\n| Draft new pricing model | Alice | Jan 20 | ☐ |\n| Customer discovery: 5 calls on topic X | Bob | Jan 22 | ☐ |\n\n**PARKING LOT (next meeting items):**\n- [Topic A] — add to Feb 1 agenda\n\n**NOT DISCUSSED (deferred):**\n- [Topic B] — Alice to create async doc for input by Jan 18\n\n**Meeting effectiveness score (ask everyone 0-5):** 3 questions — Was your time well spent? Was the objective achieved? What would make next meeting better?`,
        },
      ],
    },
    contentEs: {
      description: 'Formato de reunión estructurado que elimina reuniones desperdiciadas: objetivos, pre-lecturas, discusión, decisiones y elementos de acción.',
      fields: [
        { label: 'Título de la Reunión', placeholder: 'Ej: "Priorización del Roadmap Q1 — Reunión de Decisión"', type: 'text', required: true },
        { label: 'Fecha y Hora', placeholder: 'Ej: 15 Ene 2025 a las 10:00 AM', type: 'text', required: true },
        { label: 'Dueño de la Reunión', placeholder: '¿Quién es responsable de dirigir esta reunión?', type: 'text', required: true },
        { label: 'Tipo de Reunión', placeholder: 'Decisión / Lluvia de Ideas / Actualización / 1:1', type: 'select', options: ['Decisión', 'Lluvia de Ideas', 'Actualización de Estado', '1:1', 'Todos los Equipos', 'Externa / Cliente'], required: true },
        { label: 'Decisión Necesaria Para', placeholder: 'Ej: 15 Ene EOD', type: 'text', required: true },
      ],
      sections: [
        {
          heading: 'Configuración Previa a la Reunión (Enviar 24 Horas Antes)',
          body: `**La reunión se gana o se pierde en la configuración, no en la sala.**\n\n**Paquete previo a la reunión:**\n\n1. **Objetivo de la reunión (1 frase):** "El propósito de esta reunión es decidir [X] para que [Y] pueda ocurrir antes de [fecha]."\n\n2. **Pre-lectura:** Máximo 10 minutos para leer. Indica: "Por favor lee esto antes de la reunión. No vamos a re-presentar el material."\n\n3. **Agenda con asignación de tiempo:**\n| Tiempo | Tema | Responsable | Objetivo |\n|--------|------|-------------|----------|\n| 0:00-0:05 | Objetivos y contexto | Dueño reunión | Alineación |\n| 0:05-0:20 | Actualización de estado | [Persona] | Solo información |\n| 0:20-0:45 | Decisión: [Tema] | [Dueño decisión] | Decidir |\n| 0:45-0:55 | Revisión de elementos de acción | Dueño reunión | Compromiso |\n\n4. **Decisiones a tomar (listarlas explícitamente)**`,
        },
        {
          heading: 'Durante la Reunión: Condúcela con Precisión',
          body: `**Apertura (primeros 2 min):**\n- Enuncia el objetivo en voz alta\n- Designa a un tomador de notas (no el dueño de la reunión)\n- Recuerda: "Teléfonos guardados. Laptops solo para notas."\n\n**Para reuniones de decisión:**\n1. Breve encuadre (3 min máx)\n2. Opciones presentadas: Opción A vs B vs C\n3. Discusión: ¿Qué información necesitamos?\n4. Decisión: "La decisión es X. Justificación: Y."\n5. Elementos de acción: ¿Quién hace qué y cuándo?\n\n**Lista de parking:** Para temas que surgen pero no están en la agenda — anótalos y trátarlos por separado.`,
        },
        {
          heading: 'Notas de Reunión y Seguimiento (Enviar en 2 Horas)',
          body: `**Estructura de notas:**\n\n**DECISIONES TOMADAS:**\n- [Decisión 1]: Haremos [X]. Responsable: [Nombre]. Justificación: [Y].\n\n**ELEMENTOS DE ACCIÓN:**\n| Acción | Responsable | Fecha Límite | ¿Listo? |\n|--------|-------------|-------------|--------|\n| Borrador nuevo modelo de precios | Alicia | 20 Ene | ☐ |\n\n**LISTA DE PARKING:**\n- [Tema A] — añadir a agenda del 1 feb\n\n**NO DISCUTIDO (aplazado):**\n- [Tema B] — Alicia creará doc asíncrono para aportaciones el 18 Ene\n\n**Puntuación de efectividad de la reunión (pregunta a todos 0-5):** ¿Fue bien aprovechado tu tiempo? ¿Se logró el objetivo? ¿Qué mejoraría la próxima reunión?`,
        },
      ],
    },
  },

  // ═══ r74: Product Requirements Document ═══
  r74: {
    kind: 'template',
    content: {
      description: 'One-page PRD format: problem statement, user stories, acceptance criteria, success metrics, and launch checklist. Keeps engineering and design aligned without a 20-page document nobody reads.',
      fields: [
        { label: 'Feature Name', placeholder: 'e.g., "Team Invite Flow v2"', type: 'text', required: true },
        { label: 'Product Owner', placeholder: 'Who is accountable for this feature?', type: 'text', required: true },
        { label: 'Engineering Lead', placeholder: 'Who is building this?', type: 'text', required: true },
        { label: 'Target Launch Date', placeholder: 'Realistic, not aspirational', type: 'date', required: true },
        { label: 'Priority', placeholder: 'P0 (must ship), P1 (should ship), P2 (nice to have)', type: 'select', options: ['P0 — Must Ship', 'P1 — Should Ship', 'P2 — Nice to Have', 'Spike / Research'], required: true },
      ],
      sections: [
        {
          heading: 'Problem Statement & User Stories',
          body: `**Problem statement (fill in the blank):**\n"[User type] currently struggles with [problem] because [root cause]. This causes [impact]. We know this because [evidence: user research / data / support tickets]."\n\n**User stories (write 3-5, covering main flows and edge cases):**\nFormat: "As a [user type], I want to [action] so that [outcome]."\n\nExamples:\n- "As a team admin, I want to invite team members via email so that I can onboard my team without giving them my credentials."\n- "As an invited team member, I want to accept an invitation without creating an account first so that I can start collaborating immediately."\n- "As a team admin, I want to revoke pending invitations so that I can control who joins my workspace."\n\n**Non-goals (important — be explicit):**\n- This version will NOT support bulk invite via CSV (v3)\n- This version will NOT send reminder emails for expired invitations`,
        },
        {
          heading: 'Acceptance Criteria & Edge Cases',
          body: `**Acceptance criteria (the definition of done):**\nEach story needs testable acceptance criteria. Not "it works" — specific, verifiable conditions.\n\nExample for Team Invite:\n- [ ] Admin can enter 1-10 email addresses in a single form\n- [ ] System sends invite email within 60 seconds\n- [ ] Invite link expires after 7 days (not 6, not 8)\n- [ ] Accepting invite creates account with same email as invite\n- [ ] Admin sees real-time status: Pending / Accepted / Expired\n- [ ] Inviting an existing user shows error: "This user is already a member"\n\n**Edge cases to handle:**\n- What if invited email already has an account? (prompt to log in, then join)\n- What if invite email bounces? (show delivery failure in admin view)\n- What if user accepts with different email? (not allowed — invite is email-specific)\n- What if admin account is deleted before invite is accepted? (invites auto-expire)\n\n**Error states:**\n- Every form field must have validation with helpful error copy\n- System error must show a user-friendly message + action to take`,
        },
        {
          heading: 'Success Metrics & Launch Checklist',
          body: `**Success metrics (measure these pre and post-launch):**\n- Primary: Invitation acceptance rate > 65% within 7 days (baseline: 0)\n- Secondary: Time to first team member added < 5 min from account creation\n- Guardrail: No increase in auth support tickets post-launch\n\n**Launch checklist:**\n\n**Engineering:**\n- [ ] Unit tests written and passing\n- [ ] E2E tests for critical paths\n- [ ] Load tested for 1,000 concurrent invites\n- [ ] Feature flag implemented for gradual rollout\n\n**Product:**\n- [ ] User acceptance testing with 3+ real users\n- [ ] A/B test set up for invite email copy\n\n**Legal / Security:**\n- [ ] Email sending compliant with CAN-SPAM / GDPR\n- [ ] No PII logged in error messages\n\n**Launch:**\n- [ ] Rollout plan: 10% → 25% → 50% → 100% (weekly increments)\n- [ ] Rollback plan documented\n- [ ] Monitoring dashboard configured`,
        },
      ],
    },
    contentEs: {
      description: 'Formato PRD de una página: declaración del problema, historias de usuario, criterios de aceptación, métricas de éxito y lista de verificación de lanzamiento.',
      fields: [
        { label: 'Nombre de la Función', placeholder: 'Ej: "Flujo de Invitación de Equipo v2"', type: 'text', required: true },
        { label: 'Dueño del Producto', placeholder: '¿Quién es responsable de esta función?', type: 'text', required: true },
        { label: 'Líder de Ingeniería', placeholder: '¿Quién está construyendo esto?', type: 'text', required: true },
        { label: 'Fecha de Lanzamiento Objetivo', placeholder: 'Realista, no aspiracional', type: 'date', required: true },
        { label: 'Prioridad', placeholder: 'P0 (debe lanzarse), P1 (debería lanzarse), P2 (bueno tener)', type: 'select', options: ['P0 — Debe Lanzarse', 'P1 — Debería Lanzarse', 'P2 — Bueno Tener', 'Spike / Investigación'], required: true },
      ],
      sections: [
        {
          heading: 'Declaración del Problema e Historias de Usuario',
          body: `**Declaración del problema:**\n"[Tipo de usuario] actualmente tiene dificultades con [problema] porque [causa raíz]. Esto causa [impacto]. Sabemos esto porque [evidencia]."\n\n**Historias de usuario (escribe 3-5, cubriendo flujos principales y casos extremos):**\nFormato: "Como [tipo de usuario], quiero [acción] para que [resultado]."\n\nEjemplos:\n- "Como administrador de equipo, quiero invitar a miembros del equipo por email para poder incorporar a mi equipo sin darles mis credenciales."\n- "Como miembro de equipo invitado, quiero aceptar una invitación sin crear una cuenta primero para poder empezar a colaborar inmediatamente."\n\n**No-objetivos (importante — sé explícito):**\n- Esta versión NO soportará invitación masiva vía CSV (v3)\n- Esta versión NO enviará emails recordatorios para invitaciones expiradas`,
        },
        {
          heading: 'Criterios de Aceptación y Casos Extremos',
          body: `**Criterios de aceptación (la definición de terminado):**\nCada historia necesita criterios de aceptación verificables.\n\nEjemplo para Invitación de Equipo:\n- [ ] Administrador puede ingresar 1-10 emails en un solo formulario\n- [ ] El sistema envía email de invitación en 60 segundos\n- [ ] El enlace de invitación expira después de 7 días\n- [ ] Aceptar invitación crea cuenta con el mismo email\n- [ ] Administrador ve estado en tiempo real: Pendiente / Aceptado / Expirado\n\n**Casos extremos a manejar:**\n- ¿Qué si el email invitado ya tiene cuenta? (invitar a iniciar sesión, luego unirse)\n- ¿Qué si el email rebota? (mostrar fallo de entrega en vista del administrador)\n- ¿Qué si el usuario acepta con email diferente? (no permitido)`,
        },
        {
          heading: 'Métricas de Éxito y Lista de Verificación de Lanzamiento',
          body: `**Métricas de éxito:**\n- Principal: Tasa de aceptación de invitaciones > 65% en 7 días\n- Secundaria: Tiempo para añadir primer miembro del equipo < 5 min desde creación de cuenta\n- Salvaguarda: Sin aumento en tickets de soporte de autenticación post-lanzamiento\n\n**Lista de verificación de lanzamiento:**\n\n**Ingeniería:**\n- [ ] Pruebas unitarias escritas y pasando\n- [ ] Pruebas E2E para rutas críticas\n- [ ] Prueba de carga para 1,000 invitaciones simultáneas\n- [ ] Indicador de función implementado para despliegue gradual\n\n**Producto:**\n- [ ] Prueba de aceptación de usuario con 3+ usuarios reales\n\n**Lanzamiento:**\n- [ ] Plan de despliegue: 10% → 25% → 50% → 100%\n- [ ] Plan de reversión documentado\n- [ ] Panel de monitoreo configurado`,
        },
      ],
    },
  },

  // ═══ r75: Contractor & Freelancer Agreement Pack ═══
  r75: {
    kind: 'template',
    content: {
      description: 'Essential contractor agreements: NDA, independent contractor agreement, SOW addendum, IP assignment, and payment terms. Use before ANY paid engagement — even with trusted people.',
      fields: [
        { label: 'Contractor Name', placeholder: 'Full legal name', type: 'text', required: true },
        { label: 'Contractor Business Name', placeholder: 'If different from personal name', type: 'text', required: true },
        { label: 'Project / Engagement Title', placeholder: 'e.g., "Product Design Sprint — Q1 2025"', type: 'text', required: true },
        { label: 'Start Date', placeholder: 'Engagement start date', type: 'date', required: true },
        { label: 'Total Engagement Value', placeholder: 'e.g., $8,500 fixed fee or $150/hr', type: 'text', required: true },
        { label: 'Payment Schedule', placeholder: 'e.g., 50% upfront, 50% on delivery', type: 'text', required: true },
      ],
      sections: [
        {
          heading: 'Independent Contractor Agreement: The Core Document',
          body: `**Why this matters more than an NDA:** The ICA establishes the relationship type. Get it wrong and the IRS may reclassify your contractor as an employee — triggering back taxes, penalties, and benefits liability.\n\n**IRS 3-factor behavioral control test (must answer "no" to all for contractor status):**\n1. Do you control HOW they work (hours, location, tools)? → Employee signal\n2. Do you provide all tools and resources? → Employee signal\n3. Is this their only business engagement? → Employee signal\n\n**Essential ICA clauses:**\n- **Relationship:** "Contractor is an independent contractor and not an employee, agent, or partner of Company."\n- **Control:** "Contractor has the right to determine the method, details, and means of performing Services."\n- **Expenses:** "Contractor is responsible for all costs and expenses of performing the Services unless explicitly agreed."\n- **Benefits:** "Contractor is not entitled to any employee benefits, vacation, or sick pay."\n- **Taxes:** "Contractor is responsible for all federal and state taxes on compensation received."\n- **Non-exclusivity:** "This Agreement does not prevent Contractor from performing services for others."\n\n**1099 threshold:** Issue IRS Form 1099-NEC for any contractor paid >$600 in a calendar year.`,
        },
        {
          heading: 'IP Assignment: Who Owns What They Build',
          body: `**The default without an IP clause:** In the US, absent a written agreement, copyright in work created by an independent contractor belongs to the CONTRACTOR, not the company. This is the opposite of employees (where work-for-hire doctrine applies).\n\n**Required language (include in ICA or as a separate exhibit):**\n"All work product, inventions, ideas, discoveries, developments, improvements, and materials conceived, created, or developed by Contractor in the performance of Services under this Agreement ('Work Product') shall be deemed 'work made for hire' to the extent permitted by law. To the extent any Work Product is not deemed work made for hire, Contractor hereby irrevocably assigns to Company all right, title, and interest in and to the Work Product, including all intellectual property rights therein."\n\n**What this covers:**\n- All code written during the engagement\n- All designs, mockups, and visual assets\n- All written content and documentation\n- Any inventions or improvements\n\n**Pre-existing IP exclusion:** Contractors should list any pre-existing tools/code/frameworks they'll use that they want to keep. List in Exhibit A. Company gets a license, contractor retains ownership.`,
        },
        {
          heading: 'Confidentiality (NDA) & Non-Solicitation',
          body: `**Confidentiality clause essentials:**\n\n"Contractor agrees to keep confidential all information disclosed by Company that is marked confidential or that a reasonable person would understand to be confidential, including but not limited to: customer lists, pricing, product roadmaps, financial information, and trade secrets ('Confidential Information')."\n\n**Obligations:**\n- No disclosure to third parties without written consent\n- Use only for performing Services\n- Return or destroy upon request\n- Survives termination for 3-5 years (or longer for trade secrets)\n\n**Non-solicitation (separate from confidentiality):**\n"For a period of [12 months] following termination of this Agreement, Contractor will not directly solicit any employees, contractors, or customers of Company."\n\n**Non-compete note:** Non-competes with independent contractors are harder to enforce than with employees. Narrow scope (specific industry, geography, time period) dramatically improves enforceability. Consult legal counsel for your state.`,
        },
        {
          heading: 'SOW Addendum & Payment Protection',
          body: `**Statement of Work (SOW) — complete for each engagement:**\n- Scope of Services (detailed, specific deliverables)\n- Timeline with milestones\n- Acceptance criteria (how you'll know it's done)\n- Revision policy (# of rounds included, cost for additional)\n- Deliverables format (file types, documentation required)\n\n**Payment protection clauses:**\n- **Kill fee:** "If Company terminates without cause, Contractor is entitled to [50%] of remaining unpaid fees for work completed or in progress."\n- **Late payment:** "Invoices unpaid after [30] days accrue interest at [1.5%] per month."\n- **Payment on acceptance:** "Payment triggered within [5] business days of written acceptance of deliverable."\n\n**Dispute resolution:**\n- Informal: 30-day cure period before formal dispute\n- Formal: Binding arbitration (AAA rules) in [City, State]\n- Governing law: [State] law governs this Agreement\n\n**Red flags to watch for with contractors:**\n- No portfolio, references, or verifiable prior work\n- Asks for full payment upfront (pay 50/50 max)\n- Refuses to sign an IP assignment agreement`,
        },
      ],
    },
    contentEs: {
      description: 'Acuerdos esenciales para contratistas: NDA, acuerdo de contratista independiente, adenda SOW, asignación de PI y términos de pago.',
      fields: [
        { label: 'Nombre del Contratista', placeholder: 'Nombre legal completo', type: 'text', required: true },
        { label: 'Nombre Comercial del Contratista', placeholder: 'Si es diferente del nombre personal', type: 'text', required: true },
        { label: 'Título del Proyecto / Compromiso', placeholder: 'Ej: "Sprint de Diseño de Producto — Q1 2025"', type: 'text', required: true },
        { label: 'Fecha de Inicio', placeholder: 'Fecha de inicio del compromiso', type: 'date', required: true },
        { label: 'Valor Total del Compromiso', placeholder: 'Ej: $8,500 tarifa fija o $150/hr', type: 'text', required: true },
        { label: 'Programa de Pago', placeholder: 'Ej: 50% por adelantado, 50% en entrega', type: 'text', required: true },
      ],
      sections: [
        {
          heading: 'Acuerdo de Contratista Independiente: El Documento Central',
          body: `**Por qué importa más que un NDA:** El ACI establece el tipo de relación. Si se hace mal, el IRS puede reclasificar a tu contratista como empleado, generando impuestos atrasados y responsabilidades.\n\n**Prueba de control conductual del IRS (debe responder "no" a todo para estatus de contratista):**\n1. ¿Controlas CÓMO trabajan (horarios, ubicación, herramientas)? → Señal de empleado\n2. ¿Proporcionas todas las herramientas y recursos? → Señal de empleado\n3. ¿Es este su único compromiso comercial? → Señal de empleado\n\n**Cláusulas esenciales del ACI:**\n- Relación: "El Contratista es un contratista independiente y no un empleado."\n- Control: "El Contratista tiene el derecho de determinar el método de realización de los Servicios."\n- Beneficios: "El Contratista no tiene derecho a ningún beneficio de empleado."\n- Impuestos: "El Contratista es responsable de todos los impuestos sobre la compensación recibida."`,
        },
        {
          heading: 'Asignación de PI: Quién Posee lo que Construyen',
          body: `**El valor predeterminado sin cláusula de PI:** En EE.UU., sin un acuerdo escrito, los derechos de autor sobre el trabajo creado por un contratista independiente pertenecen al CONTRATISTA, no a la empresa.\n\n**Lenguaje requerido:**\n"Todo producto de trabajo concebido, creado o desarrollado por el Contratista en el desempeño de los Servicios se considerará 'trabajo por encargo' en la medida permitida por la ley. En la medida en que cualquier Producto de Trabajo no se considere trabajo por encargo, el Contratista asigna irrevocablemente a la Empresa todos los derechos sobre el Producto de Trabajo."\n\n**Qué cubre:**\n- Todo el código escrito durante el compromiso\n- Todos los diseños y activos visuales\n- Todo el contenido escrito y documentación\n\n**Exclusión de PI preexistente:** Los contratistas deben listar cualquier herramienta/código/marco preexistente que quieran conservar.`,
        },
        {
          heading: 'Confidencialidad (NDA) y No Captación',
          body: `**Elementos esenciales de la cláusula de confidencialidad:**\n\n"El Contratista acepta mantener confidencial toda información divulgada por la Empresa que esté marcada como confidencial o que una persona razonable entendería que es confidencial, incluyendo: listas de clientes, precios, hojas de ruta de productos, información financiera y secretos comerciales."\n\n**Obligaciones:**\n- Sin divulgación a terceros sin consentimiento escrito\n- Usar solo para realizar los Servicios\n- Devolver o destruir a petición\n- Sobrevive a la terminación durante 3-5 años\n\n**No captación:**\n"Durante un período de [12 meses] después de la terminación, el Contratista no captará directamente a ningún empleado, contratista o cliente de la Empresa."`,
        },
        {
          heading: 'Adenda SOW y Protección de Pago',
          body: `**Declaración de Trabajo (SOW) — completar para cada compromiso:**\n- Alcance de los Servicios (entregables detallados y específicos)\n- Línea de tiempo con hitos\n- Criterios de aceptación\n- Política de revisiones (# de rondas incluidas, costo por adicionales)\n\n**Cláusulas de protección de pago:**\n- **Tarifa de cancelación:** "Si la Empresa termina sin causa, el Contratista tiene derecho al [50%] de los honorarios no pagados restantes."\n- **Pago tardío:** "Las facturas no pagadas después de [30] días acumulan intereses del [1.5%] mensual."\n\n**Señales de alerta con contratistas:**\n- Sin portafolio, referencias o trabajo anterior verificable\n- Solicita pago completo por adelantado (paga máximo 50/50)\n- Se niega a firmar un acuerdo de asignación de PI`,
        },
      ],
    },
  },


};
