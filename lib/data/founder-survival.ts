// ── Founder Survival Dashboard — Types & Mock Data ──────────────────────
// Bilingual: English (title, description) + Spanish (titleEs, descriptionEs)

export type HabitCategory = 'movement' | 'nutrition' | 'tech' | 'relationships' | 'finance' | 'recovery' | 'longevity';
export type AtomicLaw = 'make-it-obvious' | 'make-it-attractive' | 'make-it-easy' | 'make-it-satisfying';

/** A habit that can be added to the daily protocol */
export interface DailyHabit {
  id: string;
  icon: string;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  atomicLaw: AtomicLaw;
  category: HabitCategory;
  /** Whether this is a core habit (always shown) or from the Choose Habits pool */
  isCore: boolean;
}

/** A habit in the Choose Habits pool (formerly Survival Quests) */
export interface ChooseHabit {
  id: string;
  icon: string;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  category: 'A' | 'B' | 'C';
  isGrayHat: boolean;
}

// ── CORE DAILY HABITS (always in protocol) ────────────────────────────

export const coreHabits: DailyHabit[] = [
  {
    id: 'steps', icon: '👟',
    title: '15K–20K Steps',
    titleEs: '15K–20K Pasos',
    description: 'Split into one morning block (7.5K) and one evening block (7.5K). Walk outdoors for sunlight exposure.',
    descriptionEs: 'Dividir en un bloque matutino (7.5K) y uno vespertino (7.5K). Caminar al aire libre para exposición solar.',
    atomicLaw: 'make-it-easy', category: 'movement', isCore: true,
  },
  {
    id: 'smoothie', icon: '🥤',
    title: 'Whole-Food Smoothie',
    titleEs: 'Smoothie de Alimentos Enteros',
    description: 'Banana, strawberry, frozen mango, unsweetened natural cacao. No powders, no added sugars.',
    descriptionEs: 'Plátano, fresa, mango congelado, cacao natural sin azúcar. Sin polvos, sin azúcares añadidos.',
    atomicLaw: 'make-it-obvious', category: 'nutrition', isCore: true,
  },
  {
    id: 'ai-workflow', icon: '🤖',
    title: '30min Agéntic Coding',
    titleEs: '30min de Código Agéntico',
    description: 'Deploy local AI workflows using Cursor + Ollama. Ship at least one automation or improvement.',
    descriptionEs: 'Desplegar flujos de IA local con Cursor + Ollama. Lanzar al menos una automatización o mejora.',
    atomicLaw: 'make-it-attractive', category: 'tech', isCore: true,
  },
  {
    id: 'connection', icon: '💜',
    title: '1hr Phone-Free Connection',
    titleEs: '1hr de Conexión sin Teléfono',
    description: 'Strictly undistracted, phone-in-another-room connection time with Marisol.',
    descriptionEs: 'Tiempo de conexión estrictamente sin distracciones, teléfono en otra habitación, con Marisol.',
    atomicLaw: 'make-it-satisfying', category: 'relationships', isCore: true,
  },
  {
    id: 'cash-flow', icon: '💰',
    title: 'Daily Cash Flow Review',
    titleEs: 'Revisión Diaria de Flujo de Caja',
    description: 'Review liquid cash flow, GBM portfolio balance, and digital bank yield rates (Nu, Klar, Mercado Pago).',
    descriptionEs: 'Revisar flujo de caja líquido, saldo del portafolio GBM y tasas de rendimiento de bancos digitales (Nu, Klar, Mercado Pago).',
    atomicLaw: 'make-it-obvious', category: 'finance', isCore: true,
  },
  {
    id: 'wim-hof', icon: '❄️',
    title: 'Wim Hof + Cold Shower',
    titleEs: 'Wim Hof + Ducha Fría',
    description: '3 rounds of holotropic breathing followed by a 2-minute cold shower. Builds stress resilience.',
    descriptionEs: '3 rondas de respiración holotrópica seguidas de 2 minutos de ducha fría. Construye resiliencia al estrés.',
    atomicLaw: 'make-it-easy', category: 'recovery', isCore: true,
  },
  {
    id: 'eating-window', icon: '⏰',
    title: '10-Hour Eating Window',
    titleEs: 'Ventana de Alimentación de 10hrs',
    description: 'Strict intermittent fasting window. First meal no earlier than 10am, last meal no later than 8pm.',
    descriptionEs: 'Ventana estricta de ayuno intermitente. Primera comida no antes de las 10am, última no después de las 8pm.',
    atomicLaw: 'make-it-obvious', category: 'nutrition', isCore: true,
  },
  {
    id: 'sunlight', icon: '☀️',
    title: 'Morning Sunlight (10–15min)',
    titleEs: 'Luz Solar Matutina (10–15min)',
    description: 'View natural sunlight outdoors within 30 minutes of waking. Sets circadian rhythm. No sunglasses.',
    descriptionEs: 'Ver luz solar natural al aire libre dentro de los 30 minutos de despertar. Establece el ritmo circadiano. Sin gafas de sol.',
    atomicLaw: 'make-it-obvious', category: 'longevity', isCore: true,
  },
];

// ── ALL HABITS (core + choose pool) for easy lookup ──────────────────

export const allHabits: DailyHabit[] = [...coreHabits];

// ── CHOOSE HABITS POOL (formerly Survival Quests) ────────────────────

export const chooseHabits: ChooseHabit[] = [
  // ═══════════ CATEGORY A: SUPERVIVENCIA DE AGENCIA ═══════════
  {
    id: 'sat-defense', icon: '🛡️',
    title: 'SAT Defense Shield',
    titleEs: 'Escudo de Defensa SAT',
    description: 'Learn the 12 essential tax deductions for digital agencies in Mexico. Register under the correct régimen fiscal (RIF or RESICO). Set up automated factura generation for every client payment.',
    descriptionEs: 'Aprende las 12 deducciones fiscales esenciales para agencias digitales en México. Regístrate bajo el régimen fiscal correcto (RIF o RESICO). Configura la generación automática de facturas por cada pago de cliente.',
    category: 'A', isGrayHat: false,
  },
  {
    id: 'imss-trap', icon: '🏥',
    title: 'The IMSS Trap',
    titleEs: 'La Trampa del IMSS',
    description: 'Fair, legal registration for yourself and every agency employee. Avoid the "esquema mixto" trap that underreports salaries. Understand voluntary continuation and modalidad 40 for retirement maximization.',
    descriptionEs: 'Registro justo y legal para ti y cada empleado de la agencia. Evita la trampa del "esquema mixto" que subreporta salarios. Entiende la continuación voluntaria y modalidad 40 para maximizar tu retiro.',
    category: 'A', isGrayHat: false,
  },
  {
    id: 'retainer-contracts', icon: '📜',
    title: 'Retainer Fortress Contracts',
    titleEs: 'Contratos Blindados de Retainer',
    description: 'Structure retainer contracts with scope-of-work annexes, hard deliverables, kill fees, and mandatory renewal windows. IP transfer on final payment only.',
    descriptionEs: 'Estructura contratos de retainer con anexos de alcance, entregables duros, honorarios de cancelación y ventanas de renovación obligatorias. Transferencia de IP solo al pago final.',
    category: 'A', isGrayHat: false,
  },
  {
    id: 'agentic-workflow', icon: '⚡',
    title: 'The Agéntic Workflow',
    titleEs: 'El Flujo Agéntico',
    description: 'Wire up n8n with local open-source models (Llama 3, Mistral) via Ollama. Automate lead enrichment, proposal drafting, and client reporting. Zero API costs, zero data leaks.',
    descriptionEs: 'Conecta n8n con modelos open-source locales (Llama 3, Mistral) vía Ollama. Automatiza enriquecimiento de leads, redacción de propuestas y reportes de clientes. Cero costos de API, cero fugas de datos.',
    category: 'A', isGrayHat: false,
  },
  {
    id: 'comfyui-rig', icon: '🖥️',
    title: 'Local AI: ComfyUI Rig',
    titleEs: 'IA Local: Rig ComfyUI',
    description: 'Configure ComfyUI to run on an Acer Predator or Redmagic rig without thermal throttling. Custom fan curves, undervolting, --lowvram flags for stable diffusion workflows.',
    descriptionEs: 'Configura ComfyUI para correr en un Acer Predator o rig Redmagic sin thermal throttling. Curvas de ventilador personalizadas, undervolting, flags --lowvram para flujos de stable diffusion.',
    category: 'A', isGrayHat: false,
  },
  {
    id: 'crisis-protocol', icon: '🩸',
    title: 'Eating Glass: Crisis Protocol',
    titleEs: 'Comiendo Vidrio: Protocolo de Crisis',
    description: 'When a client site gets hacked or Meta ad account banned: (1) Do not panic, (2) Do not blame team, (3) Execute pre-written incident checklist, (4) Communicate to client within 15min with clear timeline.',
    descriptionEs: 'Cuando hackeen un sitio o baneen una cuenta de Meta: (1) No entrar en pánico, (2) No culpar al equipo, (3) Ejecutar checklist pre-escrito, (4) Comunicar al cliente en 15min con cronograma claro.',
    category: 'A', isGrayHat: false,
  },
  {
    id: 'time-vampire', icon: '🧛',
    title: 'Time-Vampire Detection',
    titleEs: 'Detección de Vampiros de Tiempo',
    description: 'Spot a time-vampire client in 5 minutes. They ask for discounts before deliverables, message at 11pm, and "just have one more small change." Price them out deliberately — double your rate.',
    descriptionEs: 'Detecta un cliente vampiro en 5 minutos. Piden descuentos antes de ver entregables, mandan mensajes a las 11pm y "solo un pequeño cambio más." Sácalos deliberadamente — duplica tu tarifa.',
    category: 'A', isGrayHat: false,
  },
  {
    id: 'domain-hijacking', icon: '🏴‍☠️',
    title: 'Expired Domain Hijacking',
    titleEs: 'Secuestro de Dominios Expirados',
    description: 'Identify high-authority expired domains (DA 40+) in client niches. Purchase, rebuild with relevant content, 301-redirect link juice to client SEO. Monitor with Ahrefs/Semrush.',
    descriptionEs: 'Identifica dominios expirados de alta autoridad (DA 40+) en nichos de clientes. Compra, reconstruye con contenido relevante, redirige link juice al SEO del cliente con 301. Monitorea con Ahrefs/Semrush.',
    category: 'A', isGrayHat: true,
  },
  {
    id: 'weaponized-scope', icon: '⚔️',
    title: 'Weaponized Scope Creep',
    titleEs: 'Expansión de Alcance como Arma',
    description: 'When a bad client pushes beyond scope, do NOT push back. Let them breach. Document every request. After 3 breaches, invoke termination clause and keep deposit. This is legal — read your contract.',
    descriptionEs: 'Cuando un mal cliente empuja más allá del alcance, NO resistas. Déjalos violar el contrato. Documenta cada solicitud. Después de 3 violaciones, invoca la cláusula de terminación y quédate con el anticipo. Es legal — lee tu contrato.',
    category: 'A', isGrayHat: true,
  },

  // ═══════════ CATEGORY B: RESILIENCIA FINANCIERA ═══════════
  {
    id: 'bs-audit', icon: '🔴',
    title: 'BS Spending Audit (Hammer Style)',
    titleEs: 'Auditoría de Gastos Basura (Estilo Hammer)',
    description: 'Print 3 months of bank statements. Highlight every delivery app charge, taquito run, and forgotten subscription in red. Calculate the monthly bleed. Redirect that amount into investments.',
    descriptionEs: 'Imprime 3 meses de estados de cuenta. Subraya cada cargo de app de delivery, taquito y suscripción olvidada en rojo. Calcula la sangría mensual. Redirige esa cantidad exacta a inversiones.',
    category: 'B', isGrayHat: false,
  },
  {
    id: 'debt-eradication', icon: '💀',
    title: 'High-Interest Debt Eradication',
    titleEs: 'Erradicación de Deuda de Alto Interés',
    description: 'Liquidate underperforming assets. Kill every peso of credit card debt >30% APR. Escape Buró de Crédito death spiral. Zero consumer debt is the foundation.',
    descriptionEs: 'Liquida activos de bajo rendimiento. Elimina cada peso de deuda de tarjeta con >30% de interés. Escapa de la espiral mortal del Buró de Crédito. Cero deuda de consumo es la base.',
    category: 'B', isGrayHat: false,
  },
  {
    id: 'firewall-fund', icon: '🧱',
    title: 'Fully-Funded Firewall',
    titleEs: 'Firewall Completamente Fondecido',
    description: 'Ladder 6 months of bare-bones living expenses across Nu, Klar, and Mercado Pago earning daily yield. Do not invest beyond this until complete. This is your "f--k you" fund.',
    descriptionEs: 'Escalera 6 meses de gastos básicos en Nu, Klar y Mercado Pago generando rendimiento diario. No inviertas más allá hasta completarlo. Este es tu fondo "vete a la chingada".',
    category: 'B', isGrayHat: false,
  },
  {
    id: 'sandwich-gen', icon: '🥪',
    title: 'Sandwich Generation Reality Check',
    titleEs: 'Chequeo de Realidad Generación Sandwich',
    description: 'Sit with your parents. Trace their Afore balance, IMSS weeks, and pension eligibility. Know their health and care needs. Plan NOW — before decline makes it impossible.',
    descriptionEs: 'Siéntate con tus papás. Rastrea su saldo de Afore, semanas cotizadas en IMSS y elegibilidad de pensión. Conoce su estado de salud y necesidades de cuidado. Planea AHORA — antes de que el deterioro lo haga imposible.',
    category: 'B', isGrayHat: false,
  },
  {
    id: 'family-loan-firewall', icon: '🚫',
    title: 'Family Loan Firewall Scripts',
    titleEs: 'Guiones Firewall para Préstamos Familiares',
    description: 'Exact scripts for saying "no" to family money requests: "I\'m not in a position to help right now, but I can help review your budget." / "My money is tied up in investments." No guilt.',
    descriptionEs: 'Guiones exactos para decir "no" a pedidos de dinero familiar: "No estoy en posición de ayudar ahora, pero puedo ayudarte a revisar tu presupuesto." / "Mi dinero está atado en inversiones." Sin culpa.',
    category: 'B', isGrayHat: false,
  },
  {
    id: 'infonavit-hack', icon: '🏠',
    title: 'Hacking Infonavit & Mortgages',
    titleEs: 'Hackeando Infonavit e Hipotecas',
    description: 'Understand Infonavit co-financing, Cofinavit, and using your subcuenta de vivienda as down payment. Calculate TCO: predial, maintenance, and opportunity cost of down payment.',
    descriptionEs: 'Entiende el cofinanciamiento Infonavit, Cofinavit y cómo usar tu subcuenta de vivienda como enganche. Calcula costo total: predial, mantenimiento y costo de oportunidad del enganche.',
    category: 'B', isGrayHat: false,
  },
  {
    id: 'annual-engine', icon: '📈',
    title: 'The 15% Annual Engine',
    titleEs: 'El Motor del 15% Anual',
    description: 'Rebalance GBM portfolio across ETFs (VOO, QQQ, EEM), FIBRAs, and Cetes. Target 15% annual return, Sharpe >1.2. Rebalance quarterly. Compound interest is the 8th wonder.',
    descriptionEs: 'Rebalancea portafolio GBM entre ETFs (VOO, QQQ, EEM), FIBRAs y Cetes. Objetivo: 15% de retorno anual, Sharpe >1.2. Rebalancea trimestralmente. El interés compuesto es la 8va maravilla.',
    category: 'B', isGrayHat: false,
  },
  {
    id: 'ev-strategy', icon: '🚗',
    title: 'The EV Cash Strategy',
    titleEs: 'La Estrategia de Efectivo EV',
    description: 'Calculate Mexican EV tax deductions: IVA accreditable, ISR deduction up to 175K MXN, no tenencia in most states. Run TCO for Zeekr 8x vs combustion car financing.',
    descriptionEs: 'Calcula deducciones fiscales mexicanas para EVs: IVA acreditable, deducción de ISR hasta 175K MXN, sin tenencia en la mayoría de estados. Calcula TCO para Zeekr 8x vs financiamiento de auto de combustión.',
    category: 'B', isGrayHat: false,
  },

  // ═══════════ CATEGORY C: BLUEPRINT DEL FUNDADOR (BIOHACKING) ═══════════
  {
    id: 'hof-baseline', icon: '🧊',
    title: 'The Hof Baseline',
    titleEs: 'La Línea Base Hof',
    description: 'Master 3 rounds of Wim Hof breathing (30 deep breaths + exhale hold). Follow with 3 minutes of cold exposure. Track breath-hold time weekly. The cold is your teacher — it never lies.',
    descriptionEs: 'Domina 3 rondas de respiración Wim Hof (30 respiraciones profundas + retención en exhalación). Sigue con 3 minutos de exposición al frío. Registra tu tiempo de retención. El frío es tu maestro — nunca miente.',
    category: 'C', isGrayHat: false,
  },
  {
    id: 'hadzovic-meals', icon: '🍱',
    title: 'The Hadzovic Discipline',
    titleEs: 'La Disciplina Hadzovic',
    description: 'Pre-plan 100% of weekly meals. Every calorie has purpose — function or aesthetics. Zero unplanned calories. Meal prep Sunday. Track macros: 1.8g protein/kg, 0.8g fat/kg, rest complex carbs.',
    descriptionEs: 'Pre-planea el 100% de las comidas semanales. Cada caloría tiene propósito — función o estética. Cero calorías no planeadas. Meal prep domingo. Registra macros: 1.8g proteína/kg, 0.8g grasa/kg, resto carbohidratos complejos.',
    category: 'C', isGrayHat: false,
  },
  {
    id: 'hypertrophy', icon: '🏋️',
    title: 'Hypertrophy & Structural Armor',
    titleEs: 'Hipertrofia y Armadura Estructural',
    description: 'Bodybuilding resistance split (Push/Pull/Legs x2/week). Build structural armor against desk posture: rear delts, rhomboids, glutes, core. Sitting is the new smoking — compensate aggressively.',
    descriptionEs: 'Rutina de resistencia de fisicoculturismo (Empuje/Jalón/Pierna x2/semana). Construye armadura estructural contra la postura de escritorio: deltoides posteriores, romboides, glúteos, core. Sentarse es el nuevo fumar.',
    category: 'C', isGrayHat: false,
  },
  {
    id: 'cortisol', icon: '🚶',
    title: 'Cortisol: Two-Block Protocol',
    titleEs: 'Cortisol: Protocolo Dos Cuadras',
    description: 'Map 15min and 30min walking routes near your workspace. When stress spikes (client emergency, deadline), execute Two-Block Step Protocol. Walk, breathe, return. No phone.',
    descriptionEs: 'Mapea rutas de caminata de 15min y 30min cerca de tu espacio de trabajo. Cuando el estrés suba (emergencia de cliente, deadline), ejecuta el Protocolo de Dos Cuadras. Camina, respira, regresa. Sin teléfono.',
    category: 'C', isGrayHat: false,
  },
  {
    id: 'sleep', icon: '🌙',
    title: 'Sleep: The Ultimate Metric',
    titleEs: 'Dormir: La Métrica Definitiva',
    description: 'Defend the 8-hour unnegotiable sleep window. Cool room (18-20°C), pitch black, no screens 90min before bed. Track with Oura or Apple Watch. Sleep is non-negotiable.',
    descriptionEs: 'Defiende la ventana innegociable de 8 horas de sueño. Habitación fresca (18-20°C), oscuridad total, sin pantallas 90min antes de dormir. Monitorea con Oura o Apple Watch. Dormir no es negociable.',
    category: 'C', isGrayHat: false,
  },
  {
    id: 'decathlon', icon: '🏆',
    title: "Attia's Centenarian Decathlon",
    titleEs: 'El Decatlón Centenario de Attia',
    description: 'Define 10 physical tasks you want to do at 100 years old: carry groceries up stairs, pick up a grandchild, hike 5km. Reverse-engineer your training to build that capacity NOW.',
    descriptionEs: 'Define 10 tareas físicas que quieres hacer a los 100 años: cargar despensa subiendo escaleras, levantar a un nieto del piso, caminar 5km. Haz ingeniería inversa de tu entrenamiento para construir esa capacidad AHORA.',
    category: 'C', isGrayHat: false,
  },
  {
    id: 'zone2', icon: '🫁',
    title: 'The Zone 2 Base',
    titleEs: 'La Base de Zona 2',
    description: 'Commit to 3–4 hours of steady-state Zone 2 cardio per week. Conversational pace, nasal breathing. Builds mitochondrial density and insulin sensitivity. Rucking, incline walking, cycling.',
    descriptionEs: 'Comprométete a 3–4 horas de cardio constante en Zona 2 por semana. Ritmo conversacional, respiración nasal. Construye densidad mitocondrial y sensibilidad a la insulina. Rucking, caminata inclinada, ciclismo.',
    category: 'C', isGrayHat: false,
  },
  {
    id: 'vo2max', icon: '💨',
    title: 'The VO₂ Max Peak',
    titleEs: 'El Pico de VO₂ Max',
    description: 'One 30-minute max heart rate session per week. 4×4 intervals (4min at 90-95% max HR, 4min recovery ×4). VO₂ max is the #1 predictor of all-cause mortality. Defend it.',
    descriptionEs: 'Una sesión de 30 minutos a frecuencia cardíaca máxima por semana. Intervalos 4×4 (4min al 90-95% FC máx, 4min recuperación ×4). VO₂ max es el predictor #1 de mortalidad por todas las causas. Defiéndelo.',
    category: 'C', isGrayHat: false,
  },
  {
    id: 'nsdr', icon: '🧘',
    title: 'NSDR: Dopamine Recharge',
    titleEs: 'NSDR: Recarga de Dopamina',
    description: 'Replace afternoon caffeine crash with 20-minute Yoga Nidra / NSDR. Replenishes dopamine reserves and accelerates motor skill learning. YouTube: "Yoga Nidra 20 min".',
    descriptionEs: 'Reemplaza la caída de cafeína de la tarde con 20 minutos de Yoga Nidra / NSDR. Repone reservas de dopamina y acelera el aprendizaje motor. YouTube: "Yoga Nidra 20 min".',
    category: 'C', isGrayHat: false,
  },
];

// ── Category labels (bilingual) ──────────────────────────────────────

export const categoryLabels: Record<string, { en: string; es: string; icon: string }> = {
  A: { en: 'Agency Survival', es: 'Supervivencia de Agencia', icon: '🏴‍☠️' },
  B: { en: 'Financial Resilience', es: 'Resiliencia Financiera', icon: '💰' },
  C: { en: 'Founder Blueprint', es: 'Blueprint del Fundador', icon: '🧬' },
};

// ── Atomic Laws labels (bilingual) ───────────────────────────────────

export const atomicLawLabels: Record<AtomicLaw, { en: string; es: string; color: string }> = {
  'make-it-obvious': { en: 'Make it Obvious', es: 'Hazlo Obvio', color: 'bg-blue-400/10 text-blue-400 border-blue-400/20' },
  'make-it-attractive': { en: 'Make it Attractive', es: 'Hazlo Atractivo', color: 'bg-purple-400/10 text-purple-400 border-purple-400/20' },
  'make-it-easy': { en: 'Make it Easy', es: 'Hazlo Fácil', color: 'bg-green-400/10 text-green-400 border-green-400/20' },
  'make-it-satisfying': { en: 'Make it Satisfying', es: 'Hazlo Satisfactorio', color: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' },
};

// ── All available habits combined (core + pool) ──────────────────────

/** All habits the user can choose from (core + choose pool) */
export function getAvailableHabits(): DailyHabit[] {
  // Convert chooseHabits to DailyHabit shape for the picker
  const poolHabits: DailyHabit[] = chooseHabits.map((ch) => ({
    id: ch.id,
    icon: ch.icon,
    title: ch.title,
    titleEs: ch.titleEs,
    description: ch.description,
    descriptionEs: ch.descriptionEs,
    atomicLaw: 'make-it-obvious' as AtomicLaw,
    category: (ch.category === 'A' ? 'finance' : ch.category === 'B' ? 'finance' : 'longevity') as HabitCategory,
    isCore: false,
  }));
  return [...coreHabits, ...poolHabits];
}

// ── Day-of-week helpers ──────────────────────────────────────────────

export const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export type DayKey = (typeof DAY_KEYS)[number];

export const DAY_LABELS: Record<DayKey, { en: string; es: string }> = {
  mon: { en: 'Mon', es: 'Lun' },
  tue: { en: 'Tue', es: 'Mar' },
  wed: { en: 'Wed', es: 'Mié' },
  thu: { en: 'Thu', es: 'Jue' },
  fri: { en: 'Fri', es: 'Vie' },
  sat: { en: 'Sat', es: 'Sáb' },
  sun: { en: 'Sun', es: 'Dom' },
};

/** Get today's DayKey */
export function getTodayKey(): DayKey {
  const map: Record<number, DayKey> = { 0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat' };
  return map[new Date().getDay()];
}
