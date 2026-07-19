(function () {
  const langToggle = document.getElementById('langToggle');
  const loadingCard = document.getElementById('loadingCard');
  const verifyCard = document.getElementById('verifyCard');
  const notFoundCard = document.getElementById('notFoundCard');
  const networkErrorCard = document.getElementById('networkErrorCard');
  const retryBtn = document.getElementById('retryBtn');
  const hintBox = document.getElementById('hintBox');
  const hintText = document.getElementById('hintText');
  const verifyForm = document.getElementById('verifyForm');
  const passwordInput = document.getElementById('passwordInput');
  const errorBox = document.getElementById('verifyError');
  const submitBtn = document.getElementById('verifySubmitBtn');
  const statusText = document.getElementById('statusText');

  langToggle.addEventListener('click', () => {
    window.i18n.setLang(window.i18n.getLang() === 'zh' ? 'en' : 'zh');
  });

  function setupPasswordToggle(toggleId, inputEl) {
    const toggleBtn = document.getElementById(toggleId);
    toggleBtn.addEventListener('click', () => {
      const revealed = inputEl.type === 'text';
      inputEl.type = revealed ? 'password' : 'text';
      toggleBtn.classList.toggle('revealed', !revealed);
      toggleBtn.setAttribute('aria-label', window.i18n.t(revealed ? 'create.showPassword' : 'create.hidePassword'));
    });
  }
  setupPasswordToggle('passwordToggle', passwordInput);

  function showError(key) {
    errorBox.textContent = window.i18n.t(key);
    errorBox.classList.add('visible');
  }

  function clearError() {
    errorBox.classList.remove('visible');
  }

  function showOnly(card) {
    [loadingCard, verifyCard, notFoundCard, networkErrorCard].forEach((c) => {
      c.classList.toggle('hidden', c !== card);
    });
  }

  const shortCode = location.pathname.replace(/^\/+/, '').split('/')[0];
  let ciphertextEnvelope = null;

  async function loadLink() {
    showOnly(loadingCard);
    let res;
    try {
      res = await fetch(`/api/link/${encodeURIComponent(shortCode)}`);
    } catch {
      // Network failure (offline, DNS, timeout) — distinct from "link doesn't exist".
      showOnly(networkErrorCard);
      return;
    }

    if (res.status === 404) {
      showOnly(notFoundCard);
      return;
    }
    if (!res.ok) {
      showOnly(networkErrorCard);
      return;
    }

    try {
      const data = await res.json();
      ciphertextEnvelope = data.ciphertext;
      if (data.hint) {
        hintText.textContent = data.hint;
        hintBox.classList.remove('hidden');
      }
      showOnly(verifyCard);
    } catch {
      showOnly(networkErrorCard);
    }
  }

  retryBtn.addEventListener('click', loadLink);

  verifyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();

    const password = passwordInput.value;
    submitBtn.disabled = true;
    submitBtn.textContent = window.i18n.t('verify.verifying');

    try {
      const decrypted = await window.transvelaCrypto.decryptFromEnvelope(password, ciphertextEnvelope);
      if (!/^https?:\/\//i.test(decrypted)) {
        showError('verify.invalidTarget');
        return;
      }
      verifyForm.classList.add('hidden');
      statusText.textContent = window.i18n.t('verify.redirecting');
      statusText.classList.remove('hidden');
      window.location.replace(decrypted);
    } catch {
      showError('verify.wrongPassword');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = window.i18n.t('verify.submitBtn');
    }
  });

  loadLink();
})();
