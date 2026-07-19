// Shared i18n copy used by both the web app and the browser extension.
// Source of truth: shared/i18n.js — edit here, then run `npm run sync:shared`.
(function () {
  const DICT = {
    zh: {
      brand: { name: 'Transvela', tagline: '给链接多一步确认' },
      nav: { langToggle: 'EN' },
      hero: {
        eyebrow: '轻量链接门禁',
        headline: '链接打开前，先经一道郑重的确认',
        subheadline:
          '给文档、方案或私人内容加一道密码，让它更妥善地送到该收到的人手里。',
        feature1: '无需注册',
        feature2: '本地处理密码',
        feature3: '三步完成',
        cta: '立即创建专属链接',
        stepsTitle: '怎么用',
        step1: '粘贴你要分享的原始链接',
        step2: '设置密码，提示词选填',
        step3: '复制生成的短链接，发给对方'
      },
      create: {
        cardTag: '免注册',
        title: '创建专属口令链接',
        subtitle: '填写链接和密码，即刻生成。',
        urlLabel: '原始链接',
        urlPlaceholder: '粘贴你要分享的链接，例如 https://...',
        passwordLabel: '设置密码',
        passwordPlaceholder: '对方需要输入这个密码才能打开链接',
        showPassword: '显示密码',
        hidePassword: '隐藏密码',
        hintLabel: '密码提示（可选）',
        hintPlaceholder: '方便对方或你自己回忆密码的一句话',
        disclaimer: '这是一道门禁提醒，不是安全保证——无法防止对方在输入密码后把原始链接转发出去。请不要用于传播违法或侵权内容。',
        submitBtn: '生成专属链接',
        submitting: '正在生成…',
        resultTitle: '链接已生成',
        resultHint: '请自行妥善保存密码，我们不存储密码，也无法帮你找回。',
        copyBtn: '复制链接',
        copied: '已复制',
        createAnother: '再创建一条',
        errUrl: '请输入一个有效的链接（以 http:// 或 https:// 开头）',
        errPassword: '请设置密码',
        errServer: '生成失败，请稍后重试'
      },
      verify: {
        eyebrow: '专属内容',
        title: '这条链接需要密码',
        subtitle: '分享者为内容设置了一道确认，请输入收到的密码继续。',
        hintPrefix: '提示：',
        passwordLabel: '请输入密码',
        passwordPlaceholder: '密码',
        submitBtn: '确认',
        verifying: '正在验证…',
        loading: '正在为你准备这条内容…',
        wrongPassword: '密码不正确，请重试',
        invalidTarget: '目标链接格式无效，已阻止跳转',
        redirecting: '验证成功，正在跳转…',
        networkErrorTitle: '连接好像断了',
        networkError: '请检查网络连接后重试',
        retryBtn: '重试'
      },
      notFound: {
        title: '链接不存在或已失效',
        message: '请向分享者确认链接是否正确，或请对方重新发一条给你。',
        backLink: '创建我自己的链接'
      },
      extension: {
        tagline: '为当前页面加一道确认',
        title: '创建专属口令链接',
        subtitle: '当前页面已自动带入，设置密码即可分享。',
        subtitleFromLink: '已带入你右键点击的链接，设置密码即可分享。'
      },
      footer: { privacy: '无需注册', promise: '原始链接和密码不会以明文保存' }
    },
    en: {
      brand: { name: 'Transvela', tagline: 'One more step before a link opens' },
      nav: { langToggle: '中文' },
      hero: {
        eyebrow: 'A lightweight link gate',
        headline: 'Add a moment of care before your link opens',
        subheadline:
          'Add a password check to a document, proposal, or private link, so it reaches the right person with greater care.',
        feature1: 'No sign-up',
        feature2: 'Password handled locally',
        feature3: 'Ready in three steps',
        cta: 'Create your link now',
        stepsTitle: 'How it works',
        step1: 'Paste the original link you want to share',
        step2: 'Set a password, with an optional hint',
        step3: 'Copy the short link and send it over'
      },
      create: {
        cardTag: 'No sign-up',
        title: 'Create a password-gated link',
        subtitle: 'Add your link and password. We’ll handle the rest.',
        urlLabel: 'Original link',
        urlPlaceholder: 'Paste the link you want to share, e.g. https://...',
        passwordLabel: 'Set a password',
        passwordPlaceholder: 'The recipient must enter this to open the link',
        showPassword: 'Show password',
        hidePassword: 'Hide password',
        hintLabel: 'Password hint (optional)',
        hintPlaceholder: 'A short reminder for the recipient or yourself',
        disclaimer: 'This is a gentle gate, not a security guarantee — it cannot stop the link from being forwarded after the password is entered. Do not use it to distribute illegal or infringing content.',
        submitBtn: 'Generate link',
        submitting: 'Generating…',
        resultTitle: 'Your link is ready',
        resultHint: 'Please save the password yourself — we do not store it and cannot recover it for you.',
        copyBtn: 'Copy link',
        copied: 'Copied',
        createAnother: 'Create another',
        errUrl: 'Please enter a valid link (starting with http:// or https://)',
        errPassword: 'Please set a password',
        errServer: 'Something went wrong, please try again'
      },
      verify: {
        eyebrow: 'Shared especially with you',
        title: 'This link needs a password',
        subtitle: 'The sender added a quick check. Enter the password they shared with you to continue.',
        hintPrefix: 'Hint: ',
        passwordLabel: 'Enter password',
        passwordPlaceholder: 'Password',
        submitBtn: 'Continue',
        verifying: 'Verifying…',
        loading: 'Checking this link…',
        wrongPassword: 'Incorrect password, please try again',
        invalidTarget: 'The target link is invalid, redirect blocked',
        redirecting: 'Verified, redirecting…',
        networkErrorTitle: 'Connection lost',
        networkError: 'Looks like the network dropped. Check your connection and try again.',
        retryBtn: 'Retry'
      },
      notFound: {
        title: 'This link does not exist or has expired',
        message: 'Please double check with whoever shared it, or ask if it was regenerated.',
        backLink: 'Create your own link'
      },
      extension: {
        tagline: 'Add a check to this page',
        title: 'Create a password-gated link',
        subtitle: 'This page is ready. Set a password to share it.',
        subtitleFromLink: 'The link you right-clicked is ready. Set a password to share it.'
      },
      footer: { privacy: 'No sign-up', promise: 'Links and passwords are never stored in plain text' }
    }
  };

  const STORAGE_KEY = 'transvela_lang';

  function detectLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'zh' || saved === 'en') return saved;
    return (navigator.language || 'en').toLowerCase().startsWith('zh') ? 'zh' : 'en';
  }

  let currentLang = detectLang();

  function t(key) {
    const parts = key.split('.');
    let node = DICT[currentLang];
    for (const p of parts) {
      node = node && node[p];
    }
    return node == null ? key : node;
  }

  function setLang(lang) {
    currentLang = lang === 'zh' ? 'zh' : 'en';
    localStorage.setItem(STORAGE_KEY, currentLang);
    applyI18n();
  }

  function getLang() {
    return currentLang;
  }

  function applyI18n() {
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.classList.contains('revealed') ? 'create.hidePassword' : el.getAttribute('data-i18n-aria');
      el.setAttribute('aria-label', t(key));
    });
    document.querySelectorAll('[data-i18n-toggle]').forEach((el) => {
      el.textContent = t('nav.langToggle');
    });
  }

  window.i18n = { t, setLang, getLang, applyI18n };
  document.addEventListener('DOMContentLoaded', applyI18n);
})();
