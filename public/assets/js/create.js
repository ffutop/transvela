(function () {
  const form = document.getElementById('createForm');
  const urlInput = document.getElementById('urlInput');
  const passwordInput = document.getElementById('passwordInput');
  const hintInput = document.getElementById('hintInput');
  const errorBox = document.getElementById('createError');
  const submitBtn = document.getElementById('submitBtn');
  const resultBox = document.getElementById('resultBox');
  const shortLinkText = document.getElementById('shortLinkText');
  const copyBtn = document.getElementById('copyBtn');
  const createAnotherBtn = document.getElementById('createAnotherBtn');
  const langToggle = document.getElementById('langToggle');
  const heroCta = document.getElementById('heroCta');

  langToggle.addEventListener('click', () => {
    window.i18n.setLang(window.i18n.getLang() === 'zh' ? 'en' : 'zh');
  });

  heroCta.addEventListener('click', () => {
    document.getElementById('createCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
    urlInput.focus();
  });

  function showError(key) {
    errorBox.textContent = window.i18n.t(key);
    errorBox.classList.add('visible');
  }

  function clearError() {
    errorBox.classList.remove('visible');
  }

  function isValidHttpUrl(value) {
    try {
      const u = new URL(value);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();

    const url = urlInput.value.trim();
    const password = passwordInput.value;
    const hint = hintInput.value.trim();

    if (!isValidHttpUrl(url)) {
      showError('create.errUrl');
      return;
    }
    if (!password) {
      showError('create.errPassword');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = window.i18n.t('create.submitting');

    try {
      const ciphertext = await window.transvelaCrypto.encryptToEnvelope(password, url);
      const res = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ciphertext, hint: hint || null })
      });

      if (!res.ok) throw new Error('server_error');
      const data = await res.json();

      const shortUrl = `${location.origin}/${data.short_code}`;
      shortLinkText.textContent = shortUrl;
      form.classList.add('hidden');
      resultBox.classList.remove('hidden');
      copyBtn.dataset.url = shortUrl;
      copyBtn.setAttribute('data-i18n', 'create.copyBtn');
      window.i18n.applyI18n();
    } catch (err) {
      showError('create.errServer');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = window.i18n.t('create.submitBtn');
    }
  });

  copyBtn.addEventListener('click', async () => {
    const url = copyBtn.dataset.url;
    try {
      await navigator.clipboard.writeText(url);
      copyBtn.textContent = window.i18n.t('create.copied');
      setTimeout(() => {
        copyBtn.textContent = window.i18n.t('create.copyBtn');
      }, 1500);
    } catch {
      // Clipboard API unavailable; the link text is already selectable on screen.
    }
  });

  createAnotherBtn.addEventListener('click', () => {
    form.reset();
    form.classList.remove('hidden');
    resultBox.classList.add('hidden');
    clearError();
  });
})();
