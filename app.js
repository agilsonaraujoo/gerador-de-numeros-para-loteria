(function(){
  const gameEl = document.getElementById('game');
  const genBtn = document.getElementById('generate');
  const copyBtn = document.getElementById('copy');
  const clearBtn = document.getElementById('clear');
  const qtyEl = document.getElementById('qty');
  const resultEl = document.getElementById('result');
  const historyEl = document.getElementById('history');
  const bannedEl = document.getElementById('banned');
  const downloadBtn = document.getElementById('download');

  const HISTORY_LIMIT = 5;
  const history = [];

  const RULES = {
    megasena: { picks: 6, min: 1, max: 60 },
    quina: { picks: 5, min: 1, max: 80 },
    lotofacil: { picks: 15, min: 1, max: 25 }
  };

  function randInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateUniqueNumbers({picks, min, max}, bannedSet){
    const set = new Set();
    const totalAvailable = (max - min + 1) - (bannedSet ? [...bannedSet].filter(n => n>=min && n<=max).length : 0);
    if(totalAvailable < picks){
      throw new Error('Quantidade de números disponíveis é menor que a quantidade exigida (verifique banidos).');
    }
    while(set.size < picks){
      const n = randInt(min, max);
      if(!bannedSet || !bannedSet.has(n)){
        set.add(n);
      }
    }
    return Array.from(set).sort((a,b) => a - b);
  }

  function createBadge(n){
    const b = document.createElement('div');
    b.className = 'badge';
    b.textContent = String(n).padStart(2, '0');
    return b;
  }

  function renderRows(rows){
    const frag = document.createDocumentFragment();
    rows.forEach((nums, idx) => {
      const line = document.createElement('div');
      line.style.display = 'flex';
      line.style.flexWrap = 'wrap';
      line.style.gap = '10px';
      line.style.marginTop = idx === 0 ? '0' : '10px';
      nums.forEach(n => line.appendChild(createBadge(n)));
      frag.appendChild(line);
    });
    return frag;
  }

  function render(numbers){
    resultEl.innerHTML = '';
    const isMulti = Array.isArray(numbers[0]);
    const rows = isMulti ? numbers : [numbers];
    resultEl.appendChild(renderRows(rows));
    const helper = document.createElement('div');
    helper.className = 'helper';
    helper.textContent = isMulti ? 'Múltiplos jogos em ordem crescente.' : 'Números gerados em ordem crescente.';
    resultEl.appendChild(helper);
  }

  function formatGames(games){
    return games.map(arr => arr.join(', ')).join('\n');
  }

  function renderHistory(){
    if(!historyEl) return;
    historyEl.innerHTML = '';
    const title = document.createElement('h2');
    title.textContent = 'Histórico (últimos 5)';
    title.className = 'history-title';
    historyEl.appendChild(title);
    const list = document.createElement('ol');
    list.className = 'history-list';
    history.forEach(item => {
      const li = document.createElement('li');
      li.className = 'history-item';
      const pre = document.createElement('pre');
      pre.textContent = item;
      li.appendChild(pre);
      list.appendChild(li);
    });
    historyEl.appendChild(list);
  }

  function currentRule(){
    return RULES[gameEl.value] || RULES.megasena;
  }

  function onGenerate(){
    const q = Math.max(1, Math.min(10, parseInt(qtyEl && qtyEl.value, 10) || 1));
    const rule = currentRule();
    const bannedSet = parseBanned(bannedEl && bannedEl.value);
    const games = [];
    try{
      for(let i=0;i<q;i++){
        games.push(generateUniqueNumbers(rule, bannedSet));
      }
      render(q === 1 ? games[0] : games);
      copyBtn.disabled = false;
      copyBtn.dataset.clipboard = formatGames(games);
      clearBtn.disabled = false;
      if(downloadBtn){
        downloadBtn.disabled = false;
        downloadBtn.dataset.text = formatGames(games);
        downloadBtn.dataset.filename = `${gameEl.value}-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.txt`;
      }

      const snapshot = formatGames(games);
      history.unshift(snapshot);
      while(history.length > HISTORY_LIMIT) history.pop();
      renderHistory();
    }catch(e){
      alert(e.message);
    }
  }

  function onDownload(){
    const text = (downloadBtn && downloadBtn.dataset.text) || '';
    if(!text){
      alert('Nenhum conteúdo para baixar. Gere números primeiro.');
      return;
    }
    const filename = (downloadBtn && downloadBtn.dataset.filename) || 'jogos.txt';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function parseBanned(text){
    if(!text) return new Set();
    const nums = text.split(/[,;\s]+/).map(t => parseInt(t, 10)).filter(n => Number.isInteger(n));
    return new Set(nums);
  }

  async function onCopy(){
    const text = copyBtn.dataset.clipboard || '';
    try{
      await navigator.clipboard.writeText(text);
      const old = copyBtn.textContent;
      copyBtn.textContent = 'Copiado!';
      setTimeout(()=> copyBtn.textContent = old, 1200);
    }catch(e){
      alert('Não foi possível copiar automaticamente. Copie manualmente: ' + text);
    }
  }

  function onClear(){
    resultEl.innerHTML = '';
    delete copyBtn.dataset.clipboard;
    copyBtn.disabled = true;
    clearBtn.disabled = true;
    if(downloadBtn){
      delete downloadBtn.dataset.text;
      delete downloadBtn.dataset.filename;
      downloadBtn.disabled = true;
    }
  }

  function applyTheme(mode){
    const body = document.body;
    if(mode === 'light'){
      body.classList.add('light');
    }else{
      body.classList.remove('light');
    }
    const btn = document.getElementById('theme-toggle');
    if(btn){
      btn.textContent = body.classList.contains('light') ? 'Tema escuro' : 'Tema claro';
    }
  }

  // Initialize theme from localStorage
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  const themeBtn = document.getElementById('theme-toggle');
  if(themeBtn){
    themeBtn.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light');
      const mode = isLight ? 'light' : 'dark';
      localStorage.setItem('theme', mode);
      applyTheme(mode);
    });
  }

  genBtn.addEventListener('click', onGenerate);
  copyBtn.addEventListener('click', onCopy);
  clearBtn.addEventListener('click', onClear);
  if(downloadBtn) downloadBtn.addEventListener('click', onDownload);
  // Keyboard shortcut: Enter -> Generate
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
      e.preventDefault();
      if(genBtn && !genBtn.disabled){
        onGenerate();
      }
    }
  });
})();
