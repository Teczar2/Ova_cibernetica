/* ══════════════════════════════
   EJERCICIOS
══════════════════════════════ */
const correctAnswers = { '1':'B', '2':'D', '3':'B' };

function checkEj(btn, choice, id) {
  const parent = btn.closest('.ejercicio-box');
  const options = parent.querySelectorAll('.ej-option');
  const fb = document.getElementById('fb-' + id);
  const correct = correctAnswers[id];

  options.forEach(o => { o.disabled = true; o.style.cursor = 'default'; });

  if (choice === correct) {
    btn.classList.add('correct');
    fb.classList.add('show','ok');
    fb.classList.remove('err');
  } else {
    btn.classList.add('wrong');
    fb.classList.add('show','err');
    fb.classList.remove('ok');
    fb.innerHTML = '❌ <strong>Incorrecto.</strong> ' + fb.innerHTML.replace(/^✅.*?<\/strong>/,'');
    // highlight correct
    options.forEach(o => {
      if (o.textContent.trim().startsWith(correct + ')')) o.classList.add('correct');
    });
  }
  fb.classList.add('show');
}

/* ══════════════════════════════
   JUEGO 1: EMPAREJAMIENTO
══════════════════════════════ */
const matchPairs = [
  { term:'Cibernética', def:'Ciencia del control y la comunicación en sistemas complejos' },
  { term:'Retroalimentación', def:'Uso de la salida para ajustar el comportamiento del sistema' },
  { term:'Homeostasis', def:'Tendencia del sistema a mantener su equilibrio interno' },
  { term:'Entropía', def:'Tendencia natural de los sistemas hacia el desorden' },
  { term:'Autopoiesis', def:'Capacidad de un sistema de producirse y reproducirse a sí mismo' },
  { term:'VSM', def:'Modelo de Stafford Beer con 5 subsistemas para la viabilidad organizacional' },
];

let matchSelected = null;
let matchScore = 0;

function renderMatch() {
  const left = document.getElementById('match-left');
  const right = document.getElementById('match-right');
  left.innerHTML = ''; right.innerHTML = '';
  matchScore = 0;
  document.getElementById('match-count').textContent = '0';

  const terms = [...matchPairs].map(p => p.term);
  const defs = [...matchPairs].map(p => p.def);
  shuffle(terms); shuffle(defs);

  terms.forEach(t => {
    const el = document.createElement('div');
    el.className = 'match-item';
    el.textContent = t;
    el.dataset.val = t;
    el.dataset.side = 'term';
    el.onclick = () => selectMatch(el);
    left.appendChild(el);
  });

  defs.forEach(d => {
    const el = document.createElement('div');
    el.className = 'match-item';
    el.textContent = d;
    el.dataset.val = d;
    el.dataset.side = 'def';
    el.onclick = () => selectMatch(el);
    right.appendChild(el);
  });
}

function selectMatch(el) {
  if (el.classList.contains('matched')) return;

  if (!matchSelected) {
    matchSelected = el;
    el.classList.add('selected');
    document.getElementById('match-msg').textContent = 'Ahora selecciona su definición...';
    return;
  }

  if (matchSelected === el) {
    el.classList.remove('selected');
    matchSelected = null;
    document.getElementById('match-msg').textContent = 'Selecciona un concepto para comenzar';
    return;
  }

  // Different sides required
  if (matchSelected.dataset.side === el.dataset.side) {
    matchSelected.classList.remove('selected');
    matchSelected = el;
    el.classList.add('selected');
    return;
  }

  // Check match
  const term = matchSelected.dataset.side === 'term' ? matchSelected : el;
  const def = matchSelected.dataset.side === 'def' ? matchSelected : el;

  const pair = matchPairs.find(p => p.term === term.dataset.val && p.def === def.dataset.val);

  if (pair) {
    term.classList.remove('selected'); def.classList.remove('selected');
    term.classList.add('matched'); def.classList.add('matched');
    matchScore++;
    document.getElementById('match-count').textContent = matchScore;
    document.getElementById('match-msg').textContent = matchScore < 6 ? '¡Correcto! Sigue así.' : '🎉 ¡Lo lograste! Completaste todos los pares.';
  } else {
    term.classList.add('wrong-flash'); def.classList.add('wrong-flash');
    document.getElementById('match-msg').textContent = '❌ No coinciden. Intenta otra combinación.';
    setTimeout(() => {
      term.classList.remove('wrong-flash','selected');
      def.classList.remove('wrong-flash','selected');
    }, 600);
  }
  matchSelected = null;
}

function resetMatch() {
  matchSelected = null;
  document.getElementById('match-msg').textContent = 'Selecciona un concepto para comenzar';
  renderMatch();
}

/* ══════════════════════════════
   JUEGO 2: CLASIFICAR
══════════════════════════════ */
const classifyData = [
  { text:'Fiebre que combate infección', cat:'positiva' },
  { text:'Termostato que apaga calefacción', cat:'negativa' },
  { text:'Pánico bancario (todos retiran)', cat:'positiva' },
  { text:'Regulador de velocidad (crucero)', cat:'negativa' },
  { text:'Inflación genera más inflación', cat:'positiva' },
  { text:'Pupila que se contrae con la luz', cat:'negativa' },
];

function renderClassify() {
  const bank = document.getElementById('words-bank');
  const elems = bank.querySelectorAll('.classify-word');
  elems.forEach(e => e.remove());

  const z1 = document.getElementById('zone-positiva');
  const z2 = document.getElementById('zone-negativa');
  z1.querySelectorAll('.classify-word').forEach(e => e.remove());
  z2.querySelectorAll('.classify-word').forEach(e => e.remove());

  const shuffled = shuffle([...classifyData]);
  shuffled.forEach(item => {
    const w = document.createElement('span');
    w.className = 'classify-word';
    w.textContent = item.text;
    w.draggable = true;
    w.dataset.cat = item.cat;
    w.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text', item.text);
      e.dataTransfer.setData('cat', item.cat);
    });
    bank.appendChild(w);
  });

  document.getElementById('classify-msg').textContent = '';
}

function dragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

document.addEventListener('dragleave', e => {
  if (e.currentTarget.classList) e.currentTarget.classList.remove('drag-over');
});

function drop(e, zone) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  const text = e.dataTransfer.getData('text');
  const cat = e.dataTransfer.getData('cat');

  // Find and move element
  const allWords = document.querySelectorAll('.classify-word');
  allWords.forEach(w => {
    if (w.textContent === text) {
      document.getElementById('zone-' + zone).appendChild(w);
    }
  });
}

function checkClassify() {
  const positiva = document.getElementById('zone-positiva').querySelectorAll('.classify-word');
  const negativa = document.getElementById('zone-negativa').querySelectorAll('.classify-word');

  let correct = 0; let total = 0;

  positiva.forEach(w => {
    total++;
    if (w.dataset.cat === 'positiva') { correct++; w.style.borderColor='#00ff64'; w.style.color='#00ff64'; }
    else { w.style.borderColor='#ff3232'; w.style.color='#ff3232'; }
  });

  negativa.forEach(w => {
    total++;
    if (w.dataset.cat === 'negativa') { correct++; w.style.borderColor='#00ff64'; w.style.color='#00ff64'; }
    else { w.style.borderColor='#ff3232'; w.style.color='#ff3232'; }
  });

  const msg = document.getElementById('classify-msg');
  if (total < classifyData.length) {
    msg.textContent = '⚠ Clasifica todos los ejemplos primero.';
    msg.style.color = 'var(--accent2)';
  } else {
    msg.textContent = `Resultado: ${correct}/${classifyData.length} correctos ${correct === classifyData.length ? '🎉' : '— revisa los rojos'}`;
    msg.style.color = correct === classifyData.length ? '#00ff64' : 'var(--accent2)';
  }
}

function resetClassify() {
  document.getElementById('classify-msg').textContent = '';
  renderClassify();
}

/* ══════════════════════════════
   QUIZ
══════════════════════════════ */
const quizData = [
  {
    q: '¿Quién es considerado el padre de la cibernética?',
    opts: ['Ludwig von Bertalanffy','Norbert Wiener','Stafford Beer','Peter Senge'],
    ans: 1,
    exp: 'Norbert Wiener publicó "Cibernética" en 1948, fundando esta disciplina.'
  },
  {
    q: 'La retroalimentación negativa en un sistema tiene como objetivo principal:',
    opts: ['Amplificar los cambios en el sistema','Reducir la diferencia entre el estado actual y el deseado','Aumentar la entropía del sistema','Eliminar la homeostasis'],
    ans: 1,
    exp: 'La retroalimentación negativa corrige desviaciones para mantener el equilibrio.'
  },
  {
    q: '¿Qué concepto describe la tendencia natural de los sistemas al desorden?',
    opts: ['Homeostasis','Negentropía','Entropía','Autopoiesis'],
    ans: 2,
    exp: 'La entropía, tomada de la termodinámica, describe el aumento del desorden en sistemas cerrados.'
  },
  {
    q: 'El Modelo de Sistema Viable (VSM) fue desarrollado por:',
    opts: ['Norbert Wiener','W. Ross Ashby','Stafford Beer','Humberto Maturana'],
    ans: 2,
    exp: 'Stafford Beer desarrolló el VSM para aplicar la cibernética a la gestión de organizaciones.'
  },
  {
    q: 'La "Ley de Variedad Requerida" establece que:',
    opts: ['Los sistemas deben minimizar su variedad interna','El controlador debe tener al menos tanta variedad como el sistema controlado','La variedad siempre reduce la eficiencia','Solo los sistemas cerrados pueden ser controlados'],
    ans: 1,
    exp: 'Ashby (1956): "Solo la variedad puede destruir variedad." El controlador necesita complejidad equivalente.'
  },
  {
    q: '¿Qué es la autopoiesis según Maturana y Varela?',
    opts: ['La tendencia de los sistemas a aumentar su tamaño','La capacidad de un sistema de producirse y mantenerse a sí mismo','El proceso de retroalimentación negativa en organismos','La organización jerárquica de subsistemas'],
    ans: 1,
    exp: 'Autopoiesis (1972): los seres vivos son sistemas que se producen a sí mismos continuamente.'
  },
  {
    q: 'En el VSM de Beer, ¿qué subsistema define la identidad y los valores del sistema?',
    opts: ['Sistema 1 — Operaciones','Sistema 3 — Control','Sistema 4 — Inteligencia','Sistema 5 — Política'],
    ans: 3,
    exp: 'El Sistema 5 (Política) define el propósito, identidad y valores que guían todo el sistema.'
  },
  {
    q: 'Un termostato que apaga la calefacción cuando la temperatura supera el límite es un ejemplo de:',
    opts: ['Retroalimentación positiva','Entropía máxima','Retroalimentación negativa','Autopoiesis'],
    ans: 2,
    exp: 'El termostato es el ejemplo clásico de retroalimentación negativa: corrige la desviación del setpoint.'
  },
  {
    q: '¿Cuál de los siguientes es un ejemplo de retroalimentación POSITIVA?',
    opts: ['Regulador de velocidad en un auto','Pupila que se contrae con la luz','Pánico bancario donde el retiro masivo genera más retiros','Sistema de inventario que repone stock automáticamente'],
    ans: 2,
    exp: 'En un pánico bancario, el miedo genera retiros que generan más miedo — es un bucle amplificador (positivo).'
  },
  {
    q: 'Peter Senge, en "La Quinta Disciplina", aplica la cibernética a las organizaciones mediante el concepto de:',
    opts: ['Taylorismo','Pensamiento sistémico y bucles de aprendizaje','Burocracia weberiana','Administración científica'],
    ans: 1,
    exp: 'Senge integra retroalimentación y pensamiento sistémico para construir "organizaciones que aprenden".'
  },
];

let qIndex = 0, qScore = 0, qAnswered = false;

function renderQuiz() {
  const q = quizData[qIndex];
  document.getElementById('quiz-num').textContent = `Pregunta ${qIndex+1} de ${quizData.length}`;
  document.getElementById('quiz-q').textContent = q.q;
  document.getElementById('quiz-bar').style.width = ((qIndex/quizData.length)*100)+'%';
  document.getElementById('quiz-next-btn').style.display='none';
  qAnswered = false;

  const opts = document.getElementById('quiz-opts');
  opts.innerHTML = '';
  q.opts.forEach((o,i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = o;
    btn.onclick = () => selectQuizOpt(btn, i);
    opts.appendChild(btn);
  });
}

function selectQuizOpt(btn, chosen) {
  if (qAnswered) return;
  qAnswered = true;
  const q = quizData[qIndex];
  const opts = document.getElementById('quiz-opts').querySelectorAll('.quiz-option');

  opts.forEach((o,i) => {
    o.disabled = true;
    if (i === q.ans) o.classList.add('correct');
    else if (i === chosen && chosen !== q.ans) o.classList.add('wrong');
  });

  if (chosen === q.ans) qScore++;

  // Show explanation
  const exp = document.createElement('div');
  exp.style.cssText = 'margin-top:0.75rem;font-size:0.82rem;color:var(--text-muted);line-height:1.6;padding:0.75rem 1rem;background:rgba(255,255,255,0.03);border-radius:8px;border-left:3px solid var(--accent)';
  exp.textContent = '💡 ' + q.exp;
  document.getElementById('quiz-opts').appendChild(exp);

  const nextBtn = document.getElementById('quiz-next-btn');
  nextBtn.style.display = 'block';
  nextBtn.textContent = qIndex < quizData.length - 1 ? 'Siguiente →' : 'Ver Resultado';
}

function quizNext() {
  qIndex++;
  if (qIndex >= quizData.length) {
    showResult();
  } else {
    renderQuiz();
  }
}

function showResult() {
  document.getElementById('quiz-active').style.display='none';
  document.getElementById('quiz-result').style.display='block';
  document.getElementById('quiz-bar').style.width='100%';

  const pct = Math.round((qScore/quizData.length)*100);
  document.getElementById('result-pct').textContent = pct + '%';
  document.getElementById('result-detail').textContent = `Respondiste correctamente ${qScore} de ${quizData.length} preguntas.`;

  let label, stars;
  if (pct >= 90) { label='¡Excelente dominio del tema!'; stars='⭐⭐⭐⭐⭐'; }
  else if (pct >= 70) { label='Buen trabajo. Repasa los conceptos fallidos.'; stars='⭐⭐⭐⭐'; }
  else if (pct >= 50) { label='Regular. Te recomendamos repasar la teoría.'; stars='⭐⭐⭐'; }
  else { label='Necesitas reforzar los conceptos. ¡Vuelve a la teoría!'; stars='⭐⭐'; }

  document.getElementById('result-label').textContent = label;
  document.getElementById('result-stars').textContent = stars;
}

function resetQuiz() {
  qIndex=0; qScore=0; qAnswered=false;
  document.getElementById('quiz-active').style.display='block';
  document.getElementById('quiz-result').style.display='none';
  renderQuiz();
}

/* ══════════════════════════════
   UTILS
══════════════════════════════ */
function shuffle(arr) {
  for (let i=arr.length-1;i>0;i--) {
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

/* Init */
renderMatch();
renderClassify();
renderQuiz();

/* ══════════════════════════════
   PILLS — scroll a sección
══════════════════════════════ */
const pillTargets = {
  'Cibernética':         '#teoria',
  'Retroalimentación':   '#teoria',
  'Homeostasis':         '#teoria',
  'Autoorganización':    '#ejemplos',
  'Control de sistemas': '#ejemplos',
};

document.querySelectorAll('.pill').forEach(pill => {
  const target = pillTargets[pill.textContent.trim()];
  if (!target) return;

  pill.addEventListener('click', () => {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
  });
});