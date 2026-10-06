(() => {
  const sections = Array.from(document.querySelectorAll('.box'));
  const links = Array.from(document.querySelectorAll('[data-benchmark]'));
  function selectBenchmark(id) {
    if (!sections.some(section => section.id === id)) return;
    sections.forEach(section => { section.hidden = section.id !== id; });
    links.forEach(link => {
      if (link.dataset.benchmark === id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }
  links.forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    selectBenchmark(link.dataset.benchmark);
    history.replaceState(null, '', link.hash);
    document.getElementById('benchmarks').scrollIntoView({behavior: 'instant'});
  }));
  const initial = location.hash.slice(1);
  selectBenchmark(sections.some(section => section.id === initial) ? initial : sections[0].id);
  window.addEventListener('hashchange', () => selectBenchmark(location.hash.slice(1)));
  const dialog = document.getElementById('preview-dialog');
  const image = document.getElementById('preview-image');
  const title = document.getElementById('preview-title');
  document.querySelectorAll('.preview-link').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      image.src = link.getAttribute('href');
      image.alt = link.querySelector('img')?.alt || link.dataset.title;
      title.textContent = link.dataset.title;
      dialog.showModal();
      document.body.classList.add('modal-open');
    });
  });
  document.getElementById('close-preview').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }});
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    image.removeAttribute('src');
  });
  document.querySelectorAll('.cover').forEach(img => img.addEventListener('error', () => {
    const message = document.createElement('p');
    message.className = 'image-error';
    message.textContent = 'This preview could not be loaded. Open the image to retry.';
    img.replaceWith(message);
  }, {once: true}));
})();
