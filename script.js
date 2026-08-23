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

// ---------- Revelar seções ao rolar a página ----------
(function revealOnScroll() {
  const targets = document.querySelectorAll(
    '.tl-item, .step, .tl-figure, .callout, .demo-box'
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
