/* Hero mockups (?hero=a..e): extra copy for the five first-screen directions, EN + ES. */
(function () {
  var T = window.AL_I18N; if (!T) return;
  var add = {
    en: { hv_tag: 'Live well. Age beautifully.', hv_who: 'Dr. Linda McClintock', hv_where: 'Tampa, Florida',
          hv_e_eyebrow: 'Age-Less Medicine by Dr. Linda', hv_e_t1: 'Live well.', hv_e_t2: 'Age beautifully.' },
    es: { hv_tag: 'Vive bien. Envejece con belleza.', hv_who: 'Dra. Linda McClintock', hv_where: 'Tampa, Florida',
          hv_e_eyebrow: 'Age-Less Medicine por la Dra. Linda', hv_e_t1: 'Vive bien.', hv_e_t2: 'Envejece con belleza.' }
  };
  Object.keys(add).forEach(function (l) { T[l] = T[l] || {}; Object.keys(add[l]).forEach(function (k) { T[l][k] = add[l][k]; }); });
})();
