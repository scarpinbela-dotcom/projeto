// ---------- Demo interativa: tamanho do orifício ----------
// Mapeia o valor do slider (1-100) para blur/brilho da imagem,
// ilustrando o trade-off nitidez x luminosidade da câmara escura.

(function apertureDemo() {
  const range = document.getElementById('apertureRange');
  const img = document.getElementById('demoImg');
  const stateLabel = document.getElementById('apertureState');
  const noteLabel = document.getElementById('apertureNote');

  if (!range || !img) return;

  function update(value) {
    const v = Number(value); // 1 (furo pequeno) .. 100 (furo grande)

    // Furo pequeno -> mais nítido, mais escuro
    // Furo grande -> mais borrado, mais claro
    const blur = (v / 100) * 6.5;          // 0px a 6.5px
    const brightness = 0.55 + (v / 100) * 0.75; // 0.55 a 1.3

    img.style.filter = `blur(${blur.toFixed(2)}px) brightness(${brightness.toFixed(2)})`;

    if (v < 25) {
      stateLabel.textContent = 'orifício pequeno';
      noteLabel.textContent = 'imagem nítida, porém escura';
    } else if (v < 45) {
      stateLabel.textContent = 'orifício ideal';
      noteLabel.textContent = 'melhor equilíbrio entre nitidez e luz';
    } else if (v < 75) {
      stateLabel.textContent = 'orifício grande';
      noteLabel.textContent = 'mais luz, imagem começa a borrar';
    } else {
      stateLabel.textContent = 'orifício muito grande';
      noteLabel.textContent = 'feixes se sobrepõem: imagem bastante borrada';
    }
  }

  range.addEventListener('input', (e) => update(e.target.value));
  update(range.value);
})();

// ---------- Demo 2: distância orifício → parede ----------
// Quanto maior a distância, maior (porém mais tênue) a imagem projetada,
// ilustrando a semelhança de triângulos por trás da câmara escura.

(function distanceDemo() {
  const range = document.getElementById('distanceRange');
  const stateLabel = document.getElementById('distanceState');
  const noteLabel = document.getElementById('distanceNote');

  const rayA2 = document.getElementById('rayA2');
  const rayB2 = document.getElementById('rayB2');
  const screenWall = document.getElementById('screenWall');
  const imgShape = document.getElementById('imgShape');

  if (!range || !rayA2) return;

  const pinholeX = 146;
  const pinholeY = 130;
  const minX = 220;   // parede bem próxima
  const maxX = 452;   // parede bem distante (limite do viewBox)
  const baseHalfHeight = 45; // metade da altura da imagem quando distância = mínima

  function update(value) {
    const v = Number(value); // 20..100
    const t = (v - 20) / 80; // 0..1
    const wallX = minX + t * (maxX - minX);
    const halfHeight = baseHalfHeight * (0.5 + t * 1.3); // cresce com a distância

    const topY = pinholeY - halfHeight;
    const bottomY = pinholeY + halfHeight;

    rayA2.setAttribute('x2', wallX);
    rayA2.setAttribute('y2', bottomY);
    rayB2.setAttribute('x2', wallX);
    rayB2.setAttribute('y2', topY);

    screenWall.setAttribute('x', wallX - 6);

    const imgWidth = 32 * (0.6 + t * 0.5);
    imgShape.setAttribute(
      'points',
      `${wallX + 6},${topY} ${wallX + 6},${bottomY} ${wallX + 6 + imgWidth},${topY}`
    );

    // opacidade cai levemente com a distância (imagem mais tênue)
    imgShape.style.opacity = (0.9 - t * 0.35).toFixed(2);

    if (t < 0.3) {
      stateLabel.textContent = 'imagem pequena';
      noteLabel.textContent = 'parede próxima do orifício: imagem pequena e intensa';
    } else if (t < 0.7) {
      stateLabel.textContent = 'imagem média';
      noteLabel.textContent = 'distância intermediária: bom equilíbrio de tamanho e brilho';
    } else {
      stateLabel.textContent = 'imagem grande';
      noteLabel.textContent = 'parede distante: imagem grande, porém mais tênue';
    }
  }

  range.addEventListener('input', (e) => update(e.target.value));
  update(range.value);
})();

// ---------- Demo 3: quiz interativo ----------

(function quiz() {
  const box = document.getElementById('quizBox');
  if (!box) return;

  const questions = box.querySelectorAll('.quiz-question');
  const scoreLabel = document.getElementById('quizScore');
  let correctCount = 0;
  let answeredCount = 0;

  questions.forEach((question) => {
    const correctOpt = question.dataset.answer;
    const buttons = question.querySelectorAll('.quiz-opt');
    const feedback = question.querySelector('.quiz-feedback');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (question.dataset.answered) return; // já respondida
        question.dataset.answered = 'true';
        answeredCount++;

        const chosen = btn.dataset.opt;
        const isCorrect = chosen === correctOpt;
        if (isCorrect) correctCount++;

        buttons.forEach((b) => {
          b.disabled = true;
          if (b.dataset.opt === correctOpt) b.classList.add('correct');
          else if (b === btn) b.classList.add('incorrect');
        });

        feedback.textContent = isCorrect
          ? 'Correto!'
          : 'Quase — a resposta certa está destacada acima.';

        if (answeredCount === questions.length) {
          scoreLabel.textContent = `Você acertou ${correctCount} de ${questions.length} perguntas.`;
        }
      });
    });
  });
})();

// ---------- Revelar seções ao rolar a página ----------
(function revealOnScroll() {
  const targets = document.querySelectorAll(
    '.tl-item, .step, .tl-figure, .use-card, .demo-box, .quiz-question'
  );

  if (!('IntersectionObserver' in window) || targets.length === 0) return;

  targets.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => observer.observe(el));
})();

// ---------- Navegação suave com offset do topbar fixo ----------
(function smoothAnchors() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
