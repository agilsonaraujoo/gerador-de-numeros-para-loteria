(function(){
  const gameEl = document.getElementById('game');
  const genBtn = document.getElementById('generate');
  const copyBtn = document.getElementById('copy');
  const clearBtn = document.getElementById('clear');
  const qtyEl = document.getElementById('qty');
  const resultEl = document.getElementById('result');

  const RULES = {
    megasena: { picks: 6, min: 1, max: 60 },
    quina: { picks: 5, min: 1, max: 80 },
    lotofacil: { picks: 15, min: 1, max: 25 }
  };

  function randInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateUniqueNumbers({picks, min, max}){
    const set = new Set();
    while(set.size < picks){
      set.add(randInt(min, max));
    }
    return Array.from(set).sort((a,b) => a - b);
  }

  function render(numbers){
    // Accepts an array of numbers (single game) or array of arrays (multiple games)
    resultEl.innerHTML = '';
    const frag = document.createDocumentFragment();
    const isMulti = Array.isArray(numbers[0]);
    const rows = isMulti ? numbers : [numbers];

    rows.forEach((nums, idx) => {
      const line = document.createElement('div');
      line.style.display = 'flex';
      line.style.flexWrap = 'wrap';
      line.style.gap = '10px';
      line.style.marginTop = idx === 0 ? '0' : '10px';
      nums.forEach(n => {
        const b = document.createElement('div');
        b.className = 'badge';
        b.textContent = String(n).padStart(2, '0');
        line.appendChild(b);
      });
      frag.appendChild(line);
    });

    resultEl.appendChild(frag);
    const helper = document.createElement('div');
    helper.className = 'helper';
    helper.textContent = isMulti ? 'Múltiplos jogos em ordem crescente.' : 'Números gerados em ordem crescente.';
    resultEl.appendChild(helper);
  }

  function currentRule(){
    return RULES[gameEl.value] || RULES.megasena;
  }

  function onGenerate(){
    const q = Math.max(1, Math.min(10, parseInt(qtyEl && qtyEl.value, 10) || 1));
    const rule = currentRule();
    const games = [];
    for(let i=0;i<q;i++){
      games.push(generateUniqueNumbers(rule));
    }
    render(q === 1 ? games[0] : games);
    copyBtn.disabled = false;
    const lines = games.map(arr => arr.join(', '));
    copyBtn.dataset.clipboard = lines.join('\n');
    clearBtn.disabled = false;
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
  }

  genBtn.addEventListener('click', onGenerate);
  copyBtn.addEventListener('click', onCopy);
  clearBtn.addEventListener('click', onClear);
})();
