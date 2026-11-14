/* Age-Less Medicine shop demo - product data and copy (EN / ES).
   All prices are SAMPLE prices for the demo. Claims come from the product cards, softened.
   LIVE BUILD NOTE: in the real store this list comes from her Shopify (Storefront API products query),
   keyed by Shopify product / variant IDs. The "shopify" field below is where those IDs go. */
window.AL_PRODUCTS = [
  {
    id: 'peptide-rx', img: 'assets/img/peptide-rx.webp', price: 89, shopify: { variantId: null },
    concerns: ['lines', 'firm'], badge: { en: 'Signature', es: 'Insignia' },
    name: { en: 'Peptide RX', es: 'Peptide RX' },
    size: { en: '1 fl oz (30 ml) airless pump', es: '1 fl oz (30 ml), bomba sin aire' },
    short: { en: 'Peptides and botanicals that visibly firm and smooth.', es: 'Péptidos y botánicos que reafirman y suavizan a la vista.' },
    long: { en: 'Her signature serum. A blend of peptides and botanicals that helps reduce the look of fine lines and wrinkles, and leaves skin looking firmer and tighter right away. Fragrance free, oil free, non-comedogenic.',
            es: 'Su sérum insignia. Una mezcla de péptidos y botánicos que ayuda a reducir la apariencia de líneas finas y arrugas, y deja la piel más firme y tensa al instante. Sin fragancia, sin aceites, no comedogénico.' },
    keys: [
      { en: ['Palmitoyl tripeptide-5', 'Supports the skin\u2019s own collagen'], es: ['Palmitoyl tripéptido-5', 'Apoya el colágeno propio de la piel'] },
      { en: ['CoQ10', 'Calming antioxidant'], es: ['CoQ10', 'Antioxidante calmante'] },
      { en: ['Hyaluronic acid', 'Moisture that sinks in and stays'], es: ['Ácido hialurónico', 'Hidratación que penetra y se queda'] },
      { en: ['Cucumber, chamomile and kelp', 'Botanical protection'], es: ['Pepino, manzanilla y algas', 'Protección botánica'] }
    ]
  },
  {
    id: 'sunscreen-50', img: 'assets/img/sunscreen-50.webp', price: 48, shopify: { variantId: null },
    concerns: ['sun'], badge: { en: 'Every morning', es: 'Cada mañana' },
    name: { en: 'Protective Antioxidant Sunscreen 50+', es: 'Protector Solar Antioxidante 50+' },
    size: { en: '4 fl oz (120 ml)', es: '4 fl oz (120 ml)' },
    short: { en: 'Tinted SPF 50+ moisturizer with zinc and six antioxidants.', es: 'Hidratante con color SPF 50+, zinc y seis antioxidantes.' },
    long: { en: 'Broad spectrum UVA and UVB SPF 50+ with 6% micronized zinc oxide, in a moisturizer with a natural tint. Fast absorbing, no white streaks, gentle on sensitive skin, and a great primer under makeup.',
            es: 'Protección de amplio espectro UVA y UVB SPF 50+ con 6% de óxido de zinc micronizado, en un hidratante con un tono natural. Se absorbe rápido, no deja rastro blanco, es suave con la piel sensible y funciona muy bien como base de maquillaje.' },
    keys: [
      { en: ['6% micronized zinc oxide', 'Broad spectrum SPF 50+'], es: ['6% óxido de zinc micronizado', 'Amplio espectro SPF 50+'] },
      { en: ['Green tea, caffeine, vitamin E', 'Six antioxidants in all'], es: ['Té verde, cafeína, vitamina E', 'Seis antioxidantes en total'] },
      { en: ['Hyaluronate and cucumber', 'Moisturizing base'], es: ['Hialuronato y pepino', 'Base hidratante'] }
    ]
  },
  {
    id: 'lumineyes', img: 'assets/img/lumineyes.webp', price: 68, shopify: { variantId: null },
    concerns: ['eyes', 'lines', 'firm'], badge: { en: 'You won\u2019t believe your eyes', es: 'No vas a creer tus ojos' },
    name: { en: 'Lumineyes', es: 'Lumineyes' },
    size: { en: '0.5 fl oz (15 ml) pump', es: '0.5 fl oz (15 ml), bomba' },
    short: { en: 'Eye cream for dark circles, puffiness and fine lines.', es: 'Crema de ojos para ojeras, bolsas y líneas finas.' },
    long: { en: 'Ten ingredients, each with a job. Tap what you\u2019d like to focus on below and see which ones go to work on it. Cruelty free, made in the USA.',
            es: 'Diez ingredientes, cada uno con su trabajo. Toca en qué te gustaría enfocarte y mira cuáles se encargan. Libre de crueldad, hecho en EE. UU.' },
    chart: true,
    keys: []
  },
  {
    id: 'firm-neck', img: 'assets/img/firm-neck.webp', price: 78, shopify: { variantId: null },
    concerns: ['neck', 'firm', 'lines'], badge: { en: 'The neck\u2019s best thing', es: 'Lo mejor para tu cuello' },
    name: { en: 'Firm Neck', es: 'Firm Neck' },
    size: { en: '1.7 oz (50 g) jar', es: 'Frasco de 1.7 oz (50 g)' },
    short: { en: 'Visibly firm, lift and smooth the neck.', es: 'Cuello visiblemente más firme, levantado y suave.' },
    long: { en: 'The neck often shows age before the face does. Firming peptides, ceramides, niacinamide and edelweiss help it look firmer, lifted and smoother, with a more even tone.',
            es: 'El cuello muchas veces muestra la edad antes que la cara. Péptidos reafirmantes, ceramidas, niacinamida y edelweiss lo ayudan a verse más firme, levantado y suave, con un tono más parejo.' },
    keys: [
      { en: ['Firming peptides', 'Firm and tighten'], es: ['Péptidos reafirmantes', 'Reafirman y tensan'] },
      { en: ['Edelweiss callus culture', 'Known to lift and tighten'], es: ['Cultivo de edelweiss', 'Conocido por levantar y tensar'] },
      { en: ['Niacinamide', 'More even tone and texture'], es: ['Niacinamida', 'Tono y textura más parejos'] },
      { en: ['Biomimetic ceramides', 'Nourish and improve elasticity'], es: ['Ceramidas biomiméticas', 'Nutren y mejoran la elasticidad'] }
    ]
  },
  {
    id: 'greens', img: 'assets/img/greens.webp', price: 46.95, shopify: { variantId: null },
    concerns: ['inside'], badge: { en: 'From the inside', es: 'Desde adentro' }, supplement: true,
    name: { en: 'Age-Less Greens', es: 'Age-Less Greens' },
    size: { en: '30 servings, 12.57 oz', es: '30 porciones, 12.57 oz' },
    short: { en: 'Dr. Linda\u2019s daily greens drink mix.', es: 'La mezcla de verdes diaria de la Dra. Linda.' },
    long: { en: 'A drink mix supplement to support the body\u2019s natural detoxification functions.* Vegetarian. Stir one scoop into water or a smoothie. Good skin starts on the inside.',
            es: 'Un suplemento en polvo para apoyar las funciones naturales de desintoxicación del cuerpo.* Vegetariano. Mezcla una medida en agua o en un batido. La buena piel empieza por dentro.' },
    keys: [
      { en: ['30 servings', 'A month of mornings'], es: ['30 porciones', 'Un mes de mañanas'] },
      { en: ['Vegetarian', 'Plant based mix'], es: ['Vegetariano', 'Mezcla a base de plantas'] }
    ]
  },
  {
    id: 'morning-routine', img: null, price: 235, compareAt: 277, shopify: { variantId: null },
    concerns: ['routine', 'sun', 'lines', 'eyes'], badge: { en: 'Save $42', es: 'Ahorra $42' }, bundle: ['cleanse-repair', 'hydration-mist', 'peptide-rx', 'lumineyes', 'sunscreen-50'],
    name: { en: 'The Morning Routine', es: 'La Rutina de la Mañana' },
    size: { en: '5 pieces: cleanse, mist, treat, eyes, protect', es: '5 piezas: limpiar, hidratar, tratar, ojos, proteger' },
    short: { en: 'Her five-step morning, boxed. Cleanse, treat, protect.', es: 'Sus cinco pasos de la mañana, en una caja. Limpiar, tratar, proteger.' },
    long: { en: 'The routine Dr. Linda builds for most of her patients, in the order you use it. About three minutes a morning.',
            es: 'La rutina que la Dra. Linda arma para la mayoría de sus pacientes, en el orden en que se usa. Unos tres minutos cada mañana.' },
    keys: []
  }
];

/* Bundle pieces (not sold alone in this demo) */
window.AL_PIECES = {
  'cleanse-repair': { img: 'assets/img/cleanse-repair.webp', name: { en: 'Antioxidant Cleanse & Repair', es: 'Limpiador Antioxidante Cleanse & Repair' }, note: { en: 'Vitamins A, C, E, green tea and CoQ10', es: 'Vitaminas A, C, E, té verde y CoQ10' } },
  'hydration-mist': { img: 'assets/img/hydration-mist.webp', name: { en: 'Revitalizing Hydration Mist', es: 'Bruma Hidratante Revitalizante' }, note: { en: 'Green tea, witch hazel, vitamin C', es: 'Té verde, hamamelis, vitamina C' } },
  'peptide-rx': { img: 'assets/img/peptide-rx.webp', name: { en: 'Peptide RX', es: 'Peptide RX' }, note: { en: 'Peptides that visibly firm', es: 'Péptidos que reafirman a la vista' } },
  'lumineyes': { img: 'assets/img/lumineyes.webp', name: { en: 'Lumineyes', es: 'Lumineyes' }, note: { en: 'Brighter, smoother eyes', es: 'Ojos más luminosos y suaves' } },
  'sunscreen-50': { img: 'assets/img/sunscreen-50.webp', name: { en: 'Sunscreen 50+', es: 'Protector Solar 50+' }, note: { en: 'Tinted, broad spectrum', es: 'Con color, amplio espectro' } }
};

/* Lumineyes ingredient x concern chart, read from her product card */
window.AL_EYE_CHART = {
  concerns: [
    ['lines', { en: 'Fine lines', es: 'Líneas finas' }],
    ['circles', { en: 'Dark circles', es: 'Ojeras' }],
    ['puff', { en: 'Puffiness', es: 'Bolsas' }],
    ['firm', { en: 'Firmness', es: 'Firmeza' }],
    ['tone', { en: 'Tone and texture', es: 'Tono y textura' }],
    ['discolor', { en: 'Discoloration', es: 'Manchas' }],
    ['red', { en: 'Redness', es: 'Rojeces' }],
    ['moist', { en: 'Moisture', es: 'Hidratación' }]
  ],
  ingredients: [
    [{ en: 'All-trans-retinol', es: 'Retinol all-trans' }, ['lines', 'firm', 'tone']],
    [{ en: 'Hyaluronic acid', es: 'Ácido hialurónico' }, ['lines', 'firm', 'moist']],
    [{ en: 'Ceramide and peptide complex', es: 'Complejo de ceramidas y péptidos' }, ['lines', 'circles', 'puff', 'firm', 'tone', 'discolor', 'moist']],
    [{ en: 'Green tea polyphenols', es: 'Polifenoles de té verde' }, ['red']],
    [{ en: 'Niacinamide', es: 'Niacinamida' }, ['lines', 'firm', 'tone']],
    [{ en: 'Caffeine', es: 'Cafeína' }, ['circles', 'puff']],
    [{ en: 'Arnica, vitamin K and chrysin', es: 'Árnica, vitamina K y crisina' }, ['circles', 'discolor']],
    [{ en: 'Emblica', es: 'Emblica' }, ['circles', 'puff', 'tone', 'red']],
    [{ en: 'Vitamins C and E', es: 'Vitaminas C y E' }, ['circles', 'puff']]
  ]
};

window.AL_I18N = {
  en: {
    skip: 'Skip to the shop', back_main: 'Back to Age-Less Medicine', clinic_site: 'Clinic site', clinic_short: 'Clinic', foot_clinic: 'Visit our clinic site', brand_aria: 'Age-Less Medicine, clinic home', nav_shop: 'Shop', nav_routine: 'Morning routine', nav_about: 'Dr. Linda', nav_visit: 'Visit',
    hear: 'Hear Dr. Linda', bag: 'Bag', demo_flag_short: 'Demo store \u00b7 test checkout', hc_sub: 'Medical-grade skin care from her Tampa practice, sent to your door.', hc_cta: 'Shop the collection', hc_link: 'Meet Dr. Linda', hc_cap: 'The Age-Less collection', hc_cap_link: 'Shop all', hc_alt: 'Age-Less Medicine skin care lineup on a marble counter: Firm Neck, Facial R & R Treatment, Firming Body Lotion, Peptide RX, Revitalizing Hydration Mist and Protective Antioxidant Sunscreen 50+', ingr_title: 'Inside Peptide RX', demo_flag: 'Demo store - sample prices - test checkout',
    hero_kicker_line: 'Medical-grade skin care from her Tampa practice',
    hero_title_1: 'Age-less,', hero_title_2: 'by Dr. Linda.',
    hero_sub: 'The same products she trusts in the treatment room, chosen for your skin and sent to your door.',
    hero_cta: 'Shop Peptide RX', hero_cta2: 'Shop by skin goal',
    hero_price: 'Peptide RX, 1 fl oz', scroll: 'Scroll',
    call_1: 'Peptides', call_1b: 'Visibly firm and tighten', call_2: 'CoQ10', call_2b: 'Calming antioxidant', call_3: 'Hyaluronic acid', call_3b: 'Moisture that stays', call_4: 'Botanicals', call_4b: 'Cucumber, chamomile, kelp',
    reveal_line: 'Peptides have been part of her practice for over twenty years. This is the serum she built around them.',
    concern_title: 'Your skin. Your\u00a0goals.', concern_sub: 'Choose what you\u2019d like to focus on, and we\u2019ll show you where Dr. Linda would start your routine.', goals_aria: 'Skin goals',
    c_all: 'The full collection', c_lines: 'Smoother lines', c_firm: 'Firmer skin', c_eyes: 'Brighter eyes', c_neck: 'Neck care', c_sun: 'Daily protection', c_inside: 'Wellness from within', c_routine: 'A complete routine',
    picks_all: 'Six favorites from her shelf', picks_n: '{n} picks for {c}', picks_1: 'Where to start for {c}', also: 'Also loved',
    add: 'Add to bag', added: 'Added', details: 'Details', sample: 'sample pricing', from: '',
    routine_title: 'Her morning, in three moves.', routine_sub: 'Five products, about three minutes. The routine Dr. Linda builds for most of her patients.',
    step_1: 'Cleanse', step_1b: 'Wash with Cleanse & Repair, then mist.', step_2: 'Treat', step_2b: 'Peptide RX all over, Lumineyes under the eyes.', step_3: 'Protect', step_3b: 'Finish with tinted Sunscreen 50+, every single day.',
    routine_cta: 'Add the Morning Routine', routine_price_note: 'instead of $277 separately',
    about_title: 'Care built around you.', about_body: 'Dr. Linda McClintock has spent more than two decades helping women and men in Tampa feel and look their best. Every product here is one she uses in her own practice, and she\u2019s happy to help you choose.',
    photo_ph: 'Dr. Linda\u2019s photo goes here', photo_ph2: 'Her own face and words, not a stock model',
    about_quote: '\u201cLive well. Age beautifully.\u201d', about_sign: 'Dr. Linda McClintock',
    voice_cta: 'Tap to hear Dr. Linda', voice_soon: 'Her welcome, in her own voice, is coming soon.',
    visit_title: 'Not sure where to start?', visit_body: 'Call the front desk or ask at your next visit. We\u2019ll build a routine around your skin.', visit_call: 'Call 813-286-4404', visit_where: 'Suite 110, One Urban Centre, 4830 W Kennedy Blvd, Tampa',
    foot_disc: 'Skin care products are cosmetics and are not intended to diagnose, treat, cure or prevent any disease. Results vary.',
    foot_supp: '*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure or prevent any disease.',
    foot_demo: 'Demo preview. Prices shown are samples. Checkout is in test mode and no card is charged.',
    cart_title: 'Your bag', cart_empty: 'Your bag is empty.', cart_empty_cta: 'Find your first product', subtotal: 'Subtotal', checkout: 'Checkout', ship_left: 'You\u2019re ${n} away from free shipping', ship_free: 'Free shipping unlocked', remove: 'Remove', qty: 'Quantity', taxes_note: 'Shipping and tax at checkout',
    co_title: 'Checkout', test_banner: 'Test mode - no real charge', co_step1: 'Details', co_step2: 'Payment', co_step3: 'Done',
    express: 'Express checkout', or: 'or', contact: 'Contact', email: 'Email', phone: 'Phone (optional)', delivery: 'Delivery', first: 'First name', last: 'Last name', address: 'Address', city: 'City', state: 'State', zip: 'ZIP code',
    method: 'How do you want it?', m_ship: 'Ship to me', m_ship_b: '3 to 5 business days', m_pick: 'Pick up at the clinic', m_pick_b: 'Ready next business day, Suite 110', free: 'Free',
    fill_test: 'Fill test details', continue: 'Continue to payment', back: 'Back', pay: 'Pay', card: 'Card number', exp: 'MM / YY', cvc: 'CVC', name_on: 'Name on card', test_card_hint: 'Test card prefilled. Use 4242 4242 4242 4242, any future date, any CVC.',
    summary: 'Order summary', shipping: 'Shipping', tax: 'Estimated tax', total: 'Total', processing: 'Processing',
    done_title: 'Thank you. Your order is in.', done_body: 'Order {o}. A receipt would go to {e}. This was a test, so nothing was charged.', done_ship: 'We\u2019ll email tracking as soon as it ships.', done_pick: 'We\u2019ll text you when it\u2019s ready at the front desk.', done_live: 'In the live store, Shopify sends the receipt and the order shows up in Dr. Linda\u2019s orders screen.', keep: 'Keep shopping',
    err_req: 'Please fill this in', err_email: 'Please enter a valid email', err_card: 'Check the card number', err_zip: 'Enter a 5 digit ZIP',
    co_opening: 'Opening secure checkout...', eye_tap: 'Choose a goal', eye_reset: 'Show all', toast_added: 'added to your bag', close: 'Close', in_box: 'In the box'
  },
  es: {
    skip: 'Ir a la tienda', back_main: 'Volver a Age-Less Medicine', clinic_site: 'Sitio de la clínica', clinic_short: 'Clínica', foot_clinic: 'Visita el sitio de nuestra clínica', brand_aria: 'Age-Less Medicine, inicio de la clínica', nav_shop: 'Tienda', nav_routine: 'Rutina de mañana', nav_about: 'Dra. Linda', nav_visit: 'Visítanos',
    hear: 'Escucha a la Dra. Linda', bag: 'Bolsa', demo_flag_short: 'Tienda demo \u00b7 pago de prueba', hc_sub: 'Cuidado de la piel de grado médico desde su consultorio en Tampa, directo a tu puerta.', hc_cta: 'Ver la colección', hc_link: 'Conoce a la Dra. Linda', hc_cap: 'La colección Age-Less', hc_cap_link: 'Ver todo', hc_alt: 'Línea de cuidado de la piel Age-Less Medicine sobre una encimera de mármol: Firm Neck, Facial R & R Treatment, Firming Body Lotion, Peptide RX, Revitalizing Hydration Mist y Protective Antioxidant Sunscreen 50+', ingr_title: 'Dentro de Peptide RX', demo_flag: 'Tienda demo - precios de muestra - pago de prueba',
    hero_kicker_line: 'Cuidado de la piel de grado médico, desde su consultorio en Tampa',
    hero_title_1: 'Age-less,', hero_title_2: 'por la Dra. Linda.',
    hero_sub: 'Los mismos productos en los que confía en su consultorio, elegidos para tu piel y enviados a tu puerta.',
    hero_cta: 'Comprar Peptide RX', hero_cta2: 'Compra según tu objetivo',
    hero_price: 'Peptide RX, 1 fl oz', scroll: 'Desliza',
    call_1: 'Péptidos', call_1b: 'Reafirman y tensan a la vista', call_2: 'CoQ10', call_2b: 'Antioxidante calmante', call_3: 'Ácido hialurónico', call_3b: 'Hidratación que se queda', call_4: 'Botánicos', call_4b: 'Pepino, manzanilla, algas',
    reveal_line: 'Los péptidos han sido parte de su práctica por más de veinte años. Este es el sérum que creó alrededor de ellos.',
    concern_title: 'Tu piel. Tus\u00a0objetivos.', concern_sub: 'Elige en qué te gustaría enfocarte y te mostramos con qué empezaría tu rutina la Dra. Linda.', goals_aria: 'Objetivos para tu piel',
    c_all: 'Toda la colección', c_lines: 'Líneas más suaves', c_firm: 'Piel más firme', c_eyes: 'Mirada más luminosa', c_neck: 'Cuidado del cuello', c_sun: 'Protección diaria', c_inside: 'Bienestar desde adentro', c_routine: 'Una rutina completa',
    picks_all: 'Seis favoritos de su repisa', picks_n: '{n} opciones para {c}', picks_1: 'Por dónde empezar: {c}', also: 'También les encanta',
    add: 'Agregar a la bolsa', added: 'Agregado', details: 'Detalles', sample: 'precio de muestra', from: '',
    routine_title: 'Su mañana, en tres pasos.', routine_sub: 'Cinco productos, unos tres minutos. La rutina que la Dra. Linda arma para la mayoría de sus pacientes.',
    step_1: 'Limpiar', step_1b: 'Lava con Cleanse & Repair y luego aplica la bruma.', step_2: 'Tratar', step_2b: 'Peptide RX en todo el rostro, Lumineyes debajo de los ojos.', step_3: 'Proteger', step_3b: 'Termina con el Protector Solar 50+ con color, todos los días.',
    routine_cta: 'Agregar la Rutina de la Mañana', routine_price_note: 'en vez de $277 por separado',
    about_title: 'Un cuidado hecho para ti.', about_body: 'La Dra. Linda McClintock lleva más de veinte años ayudando a mujeres y hombres en Tampa a sentirse y verse mejor. Cada producto aquí es uno que usa en su propia práctica, y con gusto te ayuda a elegir.',
    photo_ph: 'Aquí va la foto de la Dra. Linda', photo_ph2: 'Su propia cara y sus palabras, no una modelo de catálogo',
    about_quote: '\u201cVive bien. Envejece con belleza.\u201d', about_sign: 'Dra. Linda McClintock',
    voice_cta: 'Toca para escuchar a la Dra. Linda', voice_soon: 'Su bienvenida, con su propia voz, llega muy pronto.',
    visit_title: '¿No sabes por dónde empezar?', visit_body: 'Llama a la recepción o pregunta en tu próxima cita. Armamos una rutina para tu piel.', visit_call: 'Llama al 813-286-4404', visit_where: 'Suite 110, One Urban Centre, 4830 W Kennedy Blvd, Tampa',
    foot_disc: 'Los productos para la piel son cosméticos y no están destinados a diagnosticar, tratar, curar ni prevenir ninguna enfermedad. Los resultados varían.',
    foot_supp: '*Estas declaraciones no han sido evaluadas por la Administración de Alimentos y Medicamentos (FDA). Este producto no está destinado a diagnosticar, tratar, curar ni prevenir ninguna enfermedad.',
    foot_demo: 'Vista previa de demostración. Los precios son de muestra. El pago está en modo de prueba y no se cobra ninguna tarjeta.',
    cart_title: 'Tu bolsa', cart_empty: 'Tu bolsa está vacía.', cart_empty_cta: 'Encuentra tu primer producto', subtotal: 'Subtotal', checkout: 'Pagar', ship_left: 'Te faltan ${n} para el envío gratis', ship_free: 'Tienes envío gratis', remove: 'Quitar', qty: 'Cantidad', taxes_note: 'Envío e impuestos al pagar',
    co_title: 'Pago', test_banner: 'Modo de prueba - no se cobra nada', co_step1: 'Datos', co_step2: 'Pago', co_step3: 'Listo',
    express: 'Pago rápido', or: 'o', contact: 'Contacto', email: 'Correo electrónico', phone: 'Teléfono (opcional)', delivery: 'Entrega', first: 'Nombre', last: 'Apellido', address: 'Dirección', city: 'Ciudad', state: 'Estado', zip: 'Código postal',
    method: '¿Cómo lo quieres recibir?', m_ship: 'Envío a domicilio', m_ship_b: '3 a 5 días hábiles', m_pick: 'Recoger en la clínica', m_pick_b: 'Listo el siguiente día hábil, Suite 110', free: 'Gratis',
    fill_test: 'Llenar datos de prueba', continue: 'Continuar al pago', back: 'Atrás', pay: 'Pagar', card: 'Número de tarjeta', exp: 'MM / AA', cvc: 'CVC', name_on: 'Nombre en la tarjeta', test_card_hint: 'Tarjeta de prueba ya cargada. Usa 4242 4242 4242 4242, cualquier fecha futura y cualquier CVC.',
    summary: 'Resumen del pedido', shipping: 'Envío', tax: 'Impuesto estimado', total: 'Total', processing: 'Procesando',
    done_title: 'Gracias. Tu pedido está listo.', done_body: 'Pedido {o}. El recibo llegaría a {e}. Fue una prueba, así que no se cobró nada.', done_ship: 'Te enviamos el número de rastreo en cuanto salga.', done_pick: 'Te avisamos por mensaje cuando esté listo en la recepción.', done_live: 'En la tienda real, Shopify envía el recibo y el pedido aparece en la pantalla de pedidos de la Dra. Linda.', keep: 'Seguir comprando',
    err_req: 'Completa este campo', err_email: 'Escribe un correo válido', err_card: 'Revisa el número de tarjeta', err_zip: 'Escribe un código de 5 dígitos',
    co_opening: 'Abriendo el pago seguro...', eye_tap: 'Elige un objetivo', eye_reset: 'Ver todo', toast_added: 'se agregó a tu bolsa', close: 'Cerrar', in_box: 'Qué incluye'
  }
};
