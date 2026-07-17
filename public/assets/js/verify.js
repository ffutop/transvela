(function () {
  const langToggle = document.getElementById('langToggle');
  const verifyCard = document.getElementById('verifyCard');
  const notFoundCard = document.getElementById('notFoundCard');
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

  function showError(key) {
    errorBox.textContent = window.i18n.t(key);
    errorBox.classList.add('visible');
  }

  function clearError() {
    errorBox.classList.remove('visible');
  }

  const shortCode = location.pathname.replace(/^\/+/, '').split('/')[0];
  let ciphertextEnvelope = null;

  async function loadLink() {
    try {
      const res = await fetch(`/api/link/${encodeURIComponent(shortCode)}`);
      if (res.status === 404) {
        notFoundCard.classList.remove('hidden');
        return;
      }
      if (!res.ok) throw new Error('server_error');

      const data = await res.json();
      ciphertextEnvelope = data.ciphertext;
      if (data.hint) {
        hintText.textContent = data.hint;
        hintBox.classList.remove('hidden');
      }
      verifyCard.classList.remove('hidden');
    } catch {
      notFoundCard.classList.remove('hidden');
    }
  }

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
