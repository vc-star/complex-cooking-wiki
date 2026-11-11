'use strict';
const DATA = window.WIKI_DATA;
// Public release version is independent of the installed development DLL version.
const RELEASE_VERSION = '1.3.0';
const copy = (zh, en) => window.WIKI_I18N.language === 'en' ? en : zh;
const localizedSearchText = value => `${value} ${window.WIKI_I18N.translate(value)}`;
const RECIPES = DATA.recipes;
const byId = new Map(RECIPES.map(r => [r.id, r]));
const $ = (s, root = document) => root.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url = (id, value) => `#/${id}${value ? '?' + new URLSearchParams(value).toString() : ''}`;
const recipeUrl = id => `#/recipe/${encodeURIComponent(id)}`;
const img = (src, alt = '', cls = '', extra = '') => `<img src="${esc(src)}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''} loading="lazy" ${extra}>`;
const textIngredients = r => r.ingredients.map(i => `${i.name.replace('任意', '')}${i.quantity > 1 ? '×' + i.quantity : ''}`).join(' · ');
const recipeLink = (id, label) => {const r = byId.get(id); return r ? `<a href="${recipeUrl(id)}">${esc(label || r.name)}</a>` : '';};
const TOOL_ICONS = {'砧板':'board','搅拌机':'mixer','平底锅':'pan','深锅':'pot','烤箱':'oven','蒸屉':'steamer','冰箱':'mixing_bowl','咖啡机':'coffee_maker'};
const TOOL_NAMES = Object.keys(TOOL_ICONS);
// The original game refrigerator is map art. A small code-native drawing is used for its navigation label.
const fridgeSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="24" viewBox="0 0 16 24"><path fill="#554c42" d="M2 0h12v24H2z"/><path fill="#d8dfd0" d="M3 1h10v21H3z"/><path fill="#f1f1de" d="M4 2h7v19H4z"/><path fill="#a5afa0" d="M3 9h10v1H3zM5 5h1v3H5zM5 12h1v5H5z"/><path fill="#333d32" d="M3 23h2v1H3zM11 23h2v1h-2z"/></svg>';
const fridgeSrc = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(fridgeSvg);
const toolImage = name => name === '冰箱' ? fridgeSrc : `assets/tools/${TOOL_ICONS[name]}.png`;
const KNOWN_IDS = new Set(RECIPES.map(r => r.id));
function readSet(key) {try {const a = JSON.parse(localStorage.getItem(key) || '[]');return new Set(Array.isArray(a) ? a.filter(id => KNOWN_IDS.has(id)) : []);} catch {return new Set();}}
let saved = readSet('cc-wiki-saved-v1');
let cooked = readSet('cc-wiki-cooked-v1');
let notebookTab = 'saved';
let listView = 'grid';
let currentPage = 'home';
let catalogState = {q:'',tool:'全部',sort:'number'};
let toastTimer;
function toast(message) {const el = $('#toast');el.textContent = message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer = setTimeout(() => el.classList.remove('visible'), 2400);}
function persist(key, set) {try {localStorage.setItem(key, JSON.stringify([...set]));return true;} catch {toast('浏览器未允许保存，当前记录仅在本次页面中有效。');return false;}}
function toggleRecord(kind, id) {if (!KNOWN_IDS.has(id)) return;const set = kind === 'save' ? saved : cooked;const active = !set.has(id);active ? set.add(id) : set.delete(id);const stored = persist(kind === 'save' ? 'cc-wiki-saved-v1' : 'cc-wiki-cooked-v1', set);if (stored) toast(kind === 'save' ? (active ? '已夹进料理簿' : '已取消收藏') : (active ? '又学会一道菜，已记下。' : '已撤销制作记录'));syncCounts();document.querySelectorAll(`[data-action="${kind}"][data-id="${CSS.escape(id)}"]`).forEach(b => {b.setAttribute('aria-pressed', String(active));if (b.classList.contains('bookmark-small')) {b.classList.toggle('saved', active);b.textContent = active ? '★' : '☆';b.setAttribute('aria-label', `${active ? '取消收藏' : '收藏'}${byId.get(id).name}`);} else {b.classList.toggle('on', active);b.textContent = kind === 'save' ? (active ? '★ 已收藏' : '☆ 收藏菜谱') : (active ? '✓ 已经做过' : '记为做过了');}});if (currentPage === 'notebook') updateNotebook();else if (currentPage === 'recipes') updateCatalog();}
function syncCounts() {$('#notebook-count').textContent = saved.size;}
const crumbs = (label, parent) => parent ? `<a class="back-link" href="${esc(parent.href)}">← ${esc(parent.label)}</a>` : '';
const section = (id, no, title, body) => `<section class="article-section" id="${id}" data-toc="${esc(title)}"><h2>${title}</h2>${body}</section>`;
const tip = (title, text) => `<aside class="article-tip">${text}</aside>`;
const table = (heads, rows, cls = '') => `<table class="article-table ${cls}"><thead><tr>${heads.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

function homePage() {
  const starters = ['fried_egg', 'sashimi', 'hashbrowns', 'omelet'];
  return `<section class="home-hero" id="welcome">
    <div><h1>从田间，到餐桌。</h1><p class="hero-intro">${copy('亲手做饭，或自动切配与加热，再端上一餐好饭。','Prep and cook by hand or use automatic processing, then serve a meal of your own.')}</p><div class="hero-links"><a class="solid-button" href="#/start">新手入门 <span>↗</span></a><a class="text-link" href="#/recipes">全部菜谱 <span>${RECIPES.length}</span> →</a></div></div>
    <figure class="kitchen-figure" aria-label="备料、烹饪、装盘"><div class="kitchen-scene kitchen-sequence"><div class="kitchen-step">${img('assets/tools/board.png','','')}</div><span class="kitchen-arrow" aria-hidden="true">→</span><div class="kitchen-step">${img('assets/tools/pan.png','','')}</div><span class="kitchen-arrow" aria-hidden="true">→</span><div class="kitchen-step">${img('assets/icons/fried_egg.png','','')}</div></div></figure>
  </section>
  <section class="home-section" id="first-dish"><div class="section-heading"><h2>从这四道开始</h2><a href="#/recipes">全部菜谱 ↗</a></div><div class="starter-recipes">${starters.map(id => {const r=byId.get(id);return `<a class="starter-recipe" href="${recipeUrl(r.id)}">${img(r.icon,r.name)}<h3>${r.name}</h3><div class="small-ingredients">${textIngredients(r)}</div></a>`;}).join('')}</div></section>
  <section class="home-section" id="find-station"><div class="section-heading"><h2>按工位查找</h2><a href="#/stations">厨具与工位 ↗</a></div><div class="station-strip">${TOOL_NAMES.map(t => `<a class="station-shortcut" href="${url('recipes',{tool:t})}">${img(toolImage(t),t)}<span>${t}</span></a>`).join('')}</div></section>
  <div class="home-bottom"><section id="quick-reading"><div class="section-heading"><h2>常用指南</h2></div><ul class="reading-list"><li><a href="#/techniques"><b>切配与控火</b><em>↗</em></a></li><li><a href="#/quality"><b>品质与售价</b><em>↗</em></a></li><li><a href="#/skills"><b>厨艺与职业</b><em>↗</em></a></li><li><a href="#/install"><b>安装与常见问题</b><em>↗</em></a></li></ul></section><section class="quick-controls"><div class="section-heading"><h2>操作</h2></div><dl><div><dt><kbd>左键</kbd></dt><dd>拿放、判定</dd></div><div><dt><kbd>${copy('加工键','Cooking key')}</kbd></dt><dd>${copy('默认 Q，可在 GMCM 改键','Default Q; rebind in GMCM')}</dd></div><div><dt>${img('assets/tools/plate.png','空盘')}</dt><dd>装盘接取</dd></div></dl></section></div>`;
}
function saveButton(r) {return `<button class="bookmark-small${saved.has(r.id)?' saved':''}" data-action="save" data-id="${r.id}" aria-label="${saved.has(r.id)?'取消收藏':'收藏'}${r.name}" aria-pressed="${saved.has(r.id)}">${saved.has(r.id)?'★':'☆'}</button>`;}
function gridItems(recipes) {return `<div class="recipe-grid">${recipes.map(r => `<article class="recipe-item">${saveButton(r)}${cooked.has(r.id)?'<span class="cooked-mark" aria-label="已做过">✓</span>':''}<a href="${recipeUrl(r.id)}">${img(r.icon,r.name)}<h3>${esc(r.name)}</h3><div class="ingredients-summary" title="${esc(textIngredients(r))}">${esc(textIngredients(r))}</div></a></article>`).join('')}</div>`;}
function tableItems(recipes) {return `<table class="recipe-table"><thead><tr><th scope="col">料理</th><th scope="col">原料</th><th scope="col" class="table-tools">使用工位</th><th scope="col">收藏</th></tr></thead><tbody>${recipes.map(r => `<tr><td><a href="${recipeUrl(r.id)}">${img(r.icon,'')}${esc(r.name)}${cooked.has(r.id)?' ✓':''}</a></td><td class="table-ingredients">${esc(textIngredients(r))}</td><td class="table-tools">${esc(r.tools.join(' / ')||'盘内组合')}</td><td>${saveButton(r)}</td></tr>`).join('')}</tbody></table>`;}
function filteredRecipes() {const q = catalogState.q.trim().toLowerCase();let items = RECIPES.filter(r => (!q || [r.name,r.english,r.instructions,...r.ingredients.map(i=>i.name),...r.tools].map(localizedSearchText).join(' ').toLowerCase().includes(q)) && (catalogState.tool==='全部' || r.tools.includes(catalogState.tool)));if(catalogState.sort==='name')items.sort((a,b)=>window.WIKI_I18N.translate(a.name).localeCompare(window.WIKI_I18N.translate(b.name),window.WIKI_I18N.language==='en'?'en':'zh-CN'));if(catalogState.sort==='ingredients')items.sort((a,b)=>a.ingredients.length-b.ingredients.length||a.number-b.number);return items;}
function recipesPage(params) {catalogState = {q:params.get('q')||'',tool:TOOL_NAMES.includes(params.get('tool'))?params.get('tool'):'全部',sort:'number'};return `${crumbs('全部菜谱')}<div class="page-subhead"><h1>全部菜谱</h1></div><div class="recipe-toolbar"><label class="inline-search"><span class="search-symbol" aria-hidden="true"></span><input id="recipe-query" type="search" value="${esc(catalogState.q)}" placeholder="搜菜名、原料或工位" aria-label="筛选菜谱"></label><select id="recipe-sort" class="sort-select" aria-label="菜谱排序"><option value="number">按原作顺序</option><option value="ingredients">原料少的在前</option><option value="name">按名称排序</option></select></div><div class="filter-tabs" role="group" aria-label="按工位筛选">${['全部',...TOOL_NAMES].map(t => `<button data-filter="${t}" class="${catalogState.tool===t?'active':''}" aria-pressed="${catalogState.tool===t}">${t}<small>${t==='全部'?RECIPES.length:RECIPES.filter(r=>r.tools.includes(t)).length}</small></button>`).join('')}</div><div class="result-summary"><span id="result-count" aria-live="polite"></span><div class="view-controls" aria-label="显示方式"><button data-view="grid" class="${listView==='grid'?'active':''}" aria-pressed="${listView==='grid'}">图鉴</button><button data-view="table" class="${listView==='table'?'active':''}" aria-pressed="${listView==='table'}">列表</button></div></div><div id="catalog-results"></div>`;}
function updateCatalog() {const el = $('#catalog-results');if(!el)return;const items=filteredRecipes();$('#result-count').textContent = `${items.length} 道料理`;el.innerHTML=items.length?(listView==='table'?tableItems(items):gridItems(items)):`<div class="empty-state">${img('assets/tools/plate.png','')}<h2>没有找到菜谱</h2><button class="outline-button" data-action="clear-filters">清除筛选</button></div>`;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b.dataset.filter===catalogState.tool);b.setAttribute('aria-pressed',String(b.dataset.filter===catalogState.tool));});document.querySelectorAll('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===listView);b.setAttribute('aria-pressed',String(b.dataset.view===listView));});const params={};if(catalogState.q)params.q=catalogState.q;if(catalogState.tool!=='全部')params.tool=catalogState.tool;history.replaceState(null,'',url('recipes',params));}

function detailPage(r) {if(r.kind==='coffee')return coffeePage(r);const steps=copy(r.instructions,r.instructionsEnglish||r.instructions).replace(/[。.]$/,'').split(/\s*→\s*/);const related=RECIPES.filter(x=>x.id!==r.id&&x.ingredients.some(i=>r.ingredients.some(ri=>ri.id===i.id))).sort((a,b)=>a.ingredients.length-b.ingredients.length).slice(0,4);return `${crumbs(r.name,{href:'#/recipes',label:'全部菜谱'})}<div class="recipe-detail-top">${img(r.icon,r.name,'detail-icon')}<div><h1>${esc(r.name)}</h1></div></div><div class="detail-actions"><button class="outline-button ${saved.has(r.id)?'on':''}" data-action="save" data-id="${r.id}" aria-pressed="${saved.has(r.id)}">${saved.has(r.id)?'★ 已收藏':'☆ 收藏菜谱'}</button><button class="outline-button ${cooked.has(r.id)?'on':''}" data-action="cook" data-id="${r.id}" aria-pressed="${cooked.has(r.id)}">${cooked.has(r.id)?'✓ 已经做过':'记为做过了'}</button><button class="plain-button" data-action="print">打印这道菜 ↗</button></div><ul class="recipe-tools" aria-label="使用工位">${r.tools.map(t=>`<li><a href="${url('recipes',{tool:t})}">${img(toolImage(t),'')}${t}</a></li>`).join('')}</ul>${section('ingredients','01','食材',`<div class="ingredient-list">${r.ingredients.map(i=>`<a class="ingredient" href="${url('recipes',{q:i.name})}" title="查找也使用${i.name}的料理">${i.icon?img(i.icon,i.name):''}<span>${esc(i.name)}<small>× ${i.quantity}</small></span></a>`).join('')}</div>`)}${section('method','02','做法',`<ol class="step-list">${steps.map(s=>`<li>${esc(s.replace(/[。.]$/,''))}</li>`).join('')}</ol><div><span class="key-note"><kbd>左键</kbd>拿放与判定</span><span class="key-note"><kbd>${copy('加工键','Cooking key')}</kbd>${copy('默认 Q；小游戏或自动加工','Default Q; minigame or automatic processing')}</span></div>${r.id==='plum_pudding'?'<p class="recipe-note">最后一份取完时返还空盆；背包满时空盆会落在附近。</p>':''}`)}${section('diagram','03','工序图',`<figure class="diagram-box"><button class="diagram-button" data-diagram="${r.diagram}" data-name="${r.name}" aria-label="放大${r.name}工序图">${img(r.diagram,`${r.name}完整制作工序图`,'',`style="width:${r.diagramWidth*2}px"`)}</button></figure>`)}${related.length?section('related','04','也可以做',`<div class="related-recipes">${related.map(x=>`<a href="${recipeUrl(x.id)}">${img(x.icon,'')}${x.name} ↗</a>`).join('')}</div>`):''}`;}

function coffeePage(r) {
  const ingredient=r.ingredients[0];
  return `${crumbs(r.name,{href:'#/recipes',label:'全部菜谱'})}<div class="recipe-detail-top">${img(r.icon,r.name,'detail-icon')}<div><h1>${esc(r.name)}</h1></div></div>
  <div class="detail-actions"><button class="outline-button ${saved.has(r.id)?'on':''}" data-action="save" data-id="${r.id}" aria-pressed="${saved.has(r.id)}">${saved.has(r.id)?'★ 已收藏':'☆ 收藏菜谱'}</button><button class="outline-button ${cooked.has(r.id)?'on':''}" data-action="cook" data-id="${r.id}" aria-pressed="${cooked.has(r.id)}">${cooked.has(r.id)?'✓ 已经做过':'记为做过了'}</button><button class="plain-button" data-action="print">打印这道菜 ↗</button></div>
  <ul class="recipe-tools" aria-label="使用设备"><li><a href="#/stations#coffee-maker">${img(toolImage('咖啡机'),'')}咖啡机</a></li></ul>
  ${section('ingredients','01','食材',`<div class="ingredient-list"><a class="ingredient" href="${url('recipes',{q:ingredient.name})}">${img(ingredient.icon,ingredient.name)}<span>${esc(ingredient.name)}<small>× ${ingredient.quantity}</small></span></a></div>`)}
  ${section('method','02','做法',`<div class="coffee-flow" aria-label="咖啡三杯经咖啡机即时制作一杯三倍浓缩咖啡"><div class="coffee-stage">${img(ingredient.icon,ingredient.name)}<span>${esc(ingredient.name)} × ${ingredient.quantity}</span></div><span class="coffee-arrow" aria-hidden="true">→</span><div class="coffee-stage">${img(toolImage('咖啡机'),'咖啡机','coffee-machine')}<span>左键点击咖啡机</span></div><span class="coffee-arrow" aria-hidden="true">→</span><div class="coffee-stage">${img(r.icon,r.name)}<span>${esc(r.name)} × ${r.outputQuantity}</span></div></div><p>${esc(copy(r.instructions,r.instructionsEnglish||r.instructions))}</p><p>咖啡机摆放在室内或室外均可，靠近后操作；一次点击制作一份。</p>`)}
  ${section('rules','03','制作规则',`<p>产物固定为普通品质，记录制作次数；不使用小游戏，不获得厨艺经验，也不触发原料返还或额外产出。</p><p>咖啡不足或背包无法容纳成品时不扣材料。恰好三杯咖啡消耗后腾出的格子可用于接收成品。</p>`)}
  `;
}

function startPage() {
  return `<h1>${copy('第一道菜：煎鸡蛋','Your first dish: Fried Egg')}</h1>
  ${section('before-start','','开火之前',`
    <p>${copy('安装 SMAPI、SpaceCore 1.28.4+ 和 GMCM 1.16.0+，将 ComplexCooking 放进 Mods，再通过 SMAPI 启动游戏。','Install SMAPI, SpaceCore 1.28.4+, and GMCM 1.16.0+. Put ComplexCooking in Mods and launch through SMAPI.')}</p>
    <p>${copy('农舍升级一次即可使用厨房；修复后的姜岛农舍也可使用。联机玩家统一 Mod 和依赖版本。','Upgrade the farmhouse once to unlock its kitchen, or use the repaired Island Farmhouse. Everyone in multiplayer needs matching mod and dependency versions.')}</p>
    <a class="text-link" href="#/install">${copy('安装与常见问题 →','Installation & FAQ →')}</a>`)}
  ${section('first-egg','','亲手做一份煎鸡蛋',`
    <ol class="number-steps">
      <li><div><strong>${copy('把一份任意蛋放进平底锅。','Add one egg of any kind to the frying pan.')}</strong><p>${copy('手持蛋，靠近有锅的炉位，左键投入。','Hold the egg, approach the pan on a burner, and left-click.')}</p></div></li>
      <li><div><strong>${copy('按加工键，默认 Q。','Press the cooking key, Q by default.')}</strong><p>${copy('小游戏开启时，指针进入绿区后点击左键；关闭时自动加热，默认 6 秒。开关和按键都在 GMCM → 复杂料理中设置。','With minigames on, left-click as the pointer enters green. With them off, heating is automatic and takes 6 seconds by default. Change either setting in GMCM → Complex Cooking.')}</p></div></li>
      <li><div><strong>${copy('完成后，用空盘接取。','Collect the finished dish with an empty plate.')}</strong><p>${copy('从盘架取盘，手持空盘左键点击平底锅。空盘无限取用，无需清洗。','Take a plate from the rack, hold it, and left-click the pan. Plates are unlimited and need no washing.')}</p></div></li>
    </ol><a class="solid-button" href="${recipeUrl('fried_egg')}">${copy('打开煎鸡蛋菜谱 ↗','Open Fried Egg recipe ↗')}</a>`)}
  ${section('controls','','操作', table(
    [copy('按键','Control'),copy('作用','Action')], [
      [copy('左键','Left click'),copy('投料、拿放容器、装盘；小游戏内判定','Add ingredients, move containers, plate food; confirm a minigame attempt')],
      [copy('加工键 · 默认 Q','Cooking key · Default Q'),copy('靠近工位开始加工；小游戏内暂停／继续','Start at a nearby station; pause / resume inside a minigame')],
      ['Esc',copy('退出小游戏，保留进度与成绩','Leave the minigame, keeping progress and scores')],
      [copy('Alt + 左键菜谱','Alt + left-click a recipe'),copy('收藏／取消流程图；悬停后滚轮翻行','Toggle a diagram favorite; hover and scroll to change rows')],
      [copy('悬停工位或容器','Hover over a station or container'),copy('查看内容与数量','See contents and quantities')],
      [copy('拿起容器后点击物品栏垃圾桶','Pick up a container and click the inventory trash can'),copy('选回一份原始食材，其余倒掉；容器保留','Recover one original ingredient; discard the rest and keep the container')]
    ]) + `<p>${copy('游戏内流程图收藏全体共享并随存档保存；本站料理簿独立保存在浏览器。','In-game diagram favorites are shared and saved with the game. This site’s cookbook is stored separately in your browser.')}</p>`)}
  `;
}

const STATIONS = [{"name": "砧板", "id": "board", "examples": ["sashimi", "hashbrowns", "bread"]}, {"name": "搅拌机", "id": "mixer", "examples": ["omelet", "salad", "chocolate_cake"]}, {"name": "平底锅", "id": "pan", "examples": ["fried_egg", "spicy_eel", "salmon_dinner"]}, {"name": "深锅", "id": "pot", "examples": ["hashbrowns", "pumpkin_soup", "fried_calamari"]}, {"name": "烤箱", "id": "oven", "examples": ["bread", "pink_cake", "pizza"]}, {"name": "蒸屉", "id": "steamer", "examples": ["plum_pudding", "mango_sticky_rice", "seafoam_pudding"]}, {"name": "冰箱", "id": "cold", "examples": ["ice_cream", "rice_pudding", "banana_pudding"]}, {"name": "咖啡机", "id": "coffee-maker", "examples": ["triple_shot_espresso"]}];
function stationsPage() {
  const descriptions = {
    board:copy('切菜、去壳、整形。按加工键开始；小游戏开启时每轮命中 4 条目标线，关闭时默认等待 3 秒。','Chop, shell, and shape. Press the cooking key to start. With minigames on, hit four targets; with them off, wait 3 seconds by default.'),
    mixer:copy('放齐材料后自动搅拌，约 8 秒。端起搅拌盆，把混合物送往下一道工序。','Mixes automatically once all ingredients are added, taking about 8 seconds. Carry the bowl to the next stage.'),
    pan:copy('用于煎、炒。放入正确材料，把锅放上炉位，按加工键开始控火或自动加热。','For frying and sautéing. Add the required ingredients, place on a burner, and press the cooking key for the heat minigame or automatic heating.'),
    pot:copy('用于煮、炖、油炸。先完成菜谱要求的切配或搅拌，再放入锅中加热。','For boiling, stewing, and deep-frying. Complete any required prep or mixing before adding ingredients to the pot.'),
    oven:copy('位于灶台下层，按菜谱放入半成品、整盘料理或搅拌盆，自动烘焙。','Below the stove. Add an intermediate item, plated dish, or mixing bowl as the recipe requires; baking is automatic.'),
    steamer:copy('按加工键开始蒸制，可使用小游戏或自动加热。带盆的料理直接放入搅拌盆，不另需模具。','Press the cooking key to steam with a minigame or automatic heating. Bowl recipes accept the mixing bowl directly; no extra mold is needed.'),
    cold:copy('原冰箱上层门用于储物，下层门用于冷却。端着已加热的深锅左键倒入，约 8 秒后直接取出，无需盘子。','The built-in fridge’s upper door opens storage; its lower door cools food. Pour from a heated pot with left click, then collect after about 8 seconds without a plate.'),
    'coffee-maker':copy('手持 3 杯咖啡，左键点击已摆放的原版咖啡机，立即换取 1 杯普通品质三倍浓缩咖啡；保留每日产咖啡。','Hold 3 Coffee and left-click a placed vanilla Coffee Maker for 1 normal-quality Triple Shot Espresso. Daily coffee production is preserved.')
  };
  return `<h1>厨具与工位</h1>
    <p>${copy('容器可连同内容物搬运，材料、进度和成绩随容器保留。锅具离开炉位时暂停加热，放回兼容炉位继续；空台面用于临时放置。','Carry containers with their contents, progress, and scores intact. Heating pauses off a burner and resumes on a compatible burner. Empty counters hold items temporarily.')}</p>
    ${STATIONS.map(s=>`<section class="station-detail" id="${s.id}" data-toc="${s.name}">${img(toolImage(s.name),s.name)}<div><h2>${s.name}</h2><p>${descriptions[s.id]}</p><div class="examples">${s.examples.map(id=>recipeLink(id)).join('')}<a href="${url('recipes',{tool:s.name})}">${copy('全部相关菜谱 →','All related recipes →')}</a></div></div></section>`).join('')}
    ${section('layout','','厨房与布局',`
      ${table([copy('厨房','Kitchen'),copy('使用方式','Access')],[
        [copy('农舍与联机小屋','Farmhouse & cabins'),copy('首次升级解锁厨房；第二次升级增加主要工位','First upgrade unlocks the kitchen; the second adds major stations')],
        [copy('姜岛农舍','Island Farmhouse'),copy('修复后使用完整厨房，移位冰箱保留库存','Repair it to use the full kitchen; relocated fridge contents are preserved')],
        [copy('布局编辑','Layout editor'),copy('GMCM → 复杂料理 → 厨房布局，或做菜菜单的“厨房布局”按钮','GMCM → Complex Cooking → Kitchen Layout, or the cooking menu’s Kitchen Layout button')]
      ])}
      <p>${copy('可移动工位、添加台面、预览默认布局。盘架可选 2 格 3 盘或 3 格 4 盘，支持正面、侧面与左右翻转；无效调整保留原设置。布局按房屋保存，联机由房主编辑。','Move stations, add counters, and preview the default layout. Choose a two-tile rack with three plates or a three-tile rack with four, facing front, left, or right. Invalid changes keep the original settings. Layouts are saved per house; the host edits them in multiplayer.')}</p>
    `)}
  `;
}

function techniquesPage() {
  return `<h1>切配与控火</h1>
  ${section('mode','','加工方式',`
    <p>${copy('在 GMCM → 复杂料理设置小游戏与加工键。小游戏默认开启，每人独立选择；投料、搬运、搅拌、烘焙、冷却和装盘仍按菜谱完成。','Set minigames and the cooking key in GMCM → Complex Cooking. Minigames default to on and are a personal choice. Follow the recipe for loading, moving, mixing, baking, cooling, and plating in either mode.')}</p>
    ${table([copy('小游戏','Minigames'),copy('按加工键后','After pressing the cooking key')],[
      [copy('开启','On'),copy('进入切配或控火判定界面','Enter the prep or heat minigame')],
      [copy('关闭','Off'),copy('自动切配／整形默认 3 秒，加热默认 6 秒','Automatic prep / shaping: 3 seconds; heating: 6 seconds by default')]
    ])}
    <p>${copy('房主可将两种自动时长分别设为 1～60 秒；已开始的步骤沿用原方式和时长。自动加工不会自行暂停世界时间，锅具离开炉位时暂停加热。','The host can set each automatic duration to 1–60 seconds. A started step keeps its original mode and duration. Automatic processing does not itself pause world time; heating pauses when cookware leaves the burner.')}</p>
  `)}
  ${section('prep','','切配',`
    <p>${copy('移动的切割线进入未完成的目标范围时点击左键，命中 4 条线完成本轮。点偏计入尝试次数，已完成的线不能重复得分；准确率为命中次数 ÷ 尝试次数。','Left-click when the moving cutting line enters an unfinished target. Hit all four to complete the round. Misses count as attempts; completed targets cannot score twice. Accuracy is hits divided by attempts.')}</p>
    <p>${copy('去壳与面团整形使用相同玩法。厨艺越高，切割线越慢，目标线仍为 4 条。','Shelling and dough shaping use the same minigame. Higher Cooking levels slow the cutting line; each round still has four targets.')}</p>
  `)}
  ${section('heat','','控火',`
    ${table([copy('点击位置','Click position'),copy('加工进度','Progress')],[
      [copy('绿色区域','Green zone'),'+20%'],[copy('其余区域','Other zones'),'+8%'],[copy('同一趟再次点击','Another click in the same sweep'),copy('不计入','Does not count')]
    ])}
    <p>${copy('每次指针折返，绿区会换位置。绿区宽度从厨艺 0 级的 12% 增至 10 级的 22%；越接近完成，指针越快。失误也推进加工，完成后等待装盘，不会烧坏。','The green zone moves each time the pointer turns. Its width grows from 12% at Cooking level 0 to 22% at level 10. The pointer speeds up as cooking progresses. Mistakes still advance cooking; finished food waits for plating and will not burn.')}</p>
  `)}
  ${section('pause','','暂停与联机',`
    <p>${copy('单人进入小游戏时，世界时钟和其他料理设备暂停。按加工键暂停或按 Esc 退出，保留目标、尝试次数、进度和失误；拿走锅具、重开窗口也不会重置成绩。','In single-player, opening a minigame pauses the world clock and other cooking stations. Pause with the cooking key or leave with Esc to keep targets, attempts, progress, and mistakes. Moving cookware or reopening the window does not reset scores.')}</p>
    <p>${copy('联机时，所有人进入小游戏或可暂停菜单后，世界时钟暂停，设备加工继续。每位玩家独立设置小游戏和加工键；一个手动工位同时限一人操作，暂不支持同机分屏。','In multiplayer, world time pauses when everyone opens a minigame or pausable menu, while stations keep processing. Each player sets their own minigame preference and key. Only one player can operate a manual station at a time. Split-screen is not supported.')}</p>
  `)}`;
}

function qualityPage() {
  return `<h1>料理品质</h1>
  ${section('scoring','','手动品质',`
    <p>${copy('有切配和控火时，操作分 = 切配平均准确率 × 40 + 控火平均准确率 × 60；只有一种时，按该类平均准确率折算为百分制。','With both prep and heat, technique score = average prep accuracy × 40 + average heat accuracy × 60. With only one type, convert its average accuracy to a score out of 100.')}</p>
    <p>${copy('原料按普通 0、银星 1、金星 2、铱星 3 求平均并向下取整，每档加 5 分，最多加 15 分；总分最高 100。','Average ingredient ranks—Normal 0, Silver 1, Gold 2, Iridium 3—and round down. Add 5 points per rank, up to 15, with a total capped at 100.')}</p>
    ${table([copy('品质','Quality'),copy('条件','Requirement'),copy('自制料理售价倍率','Homemade sale multiplier')],[
      [copy('普通','Normal'),copy('总分低于 60','Score below 60'),'×1'],
      [copy('银星','Silver'),copy('总分达到 60','Score at least 60'),'×1.5'],
      [copy('金星','Gold'),copy('总分达到 80','Score at least 80'),'×3'],
      [copy('铱星','Iridium'),copy('所有手动工序精准，且无旧版加工记录','Every manual stage perfect, with no legacy processing records'),'×4']
    ],'quality-table')}
    <p>${copy('手动失误后，即使原料加分达到 100，也最多为金星。原本没有切配或控火的料理，直接按原料品质档位评星。','After a manual mistake, even a score of 100 is capped at Gold. Recipes with no prep or heat stages use the ingredient quality rank directly.')}</p>
  `)}
  ${section('automatic-quality','','自动品质',`
    <p>${copy('关闭小游戏后，品质由实际制作者的厨艺等级和原料品质决定。下表为全程自动、普通品质原料的新批次；8 级起才可能得到铱星，其他等级在相邻行之间插值。','With minigames off, quality depends on the actual cook’s skill and ingredient quality. These chances assume a fresh batch with automatic prep / heating throughout and normal ingredients. Iridium unlocks at level 8; other levels interpolate between adjacent rows.')}</p>
    ${table([copy('厨艺等级','Cooking level'),copy('普通','Normal'),copy('银星','Silver'),copy('金星','Gold'),copy('铱星','Iridium')],[
      ['0','80%','20%','0%','0%'],['2','55%','40%','5%','0%'],['4','25%','50%','25%','0%'],
      ['6','5%','40%','55%','0%'],['8','0%','20%','70%','10%'],['10','0%','10%','65%','25%']
    ])}
    <p>${copy('高品质原料提高升档概率。自动步骤保留基础经验、品质经验和首次奖励，不领取完美操作倍率；重新装盘、转交或读档不会重抽品质。混合手动与自动时，按实际步骤合并计算，不直接套用手动总分。','Higher-quality ingredients improve promotion chances. Automatic steps retain base XP, quality XP, and first-time bonuses, without the perfect-technique multiplier. Replating, handing off, or reloading does not reroll quality. Mixed manual and automatic batches combine their actual stages rather than using the manual score alone.')}</p>
  `)}
  ${section('calculator','','手动品质试算',`
    <div class="calculator" id="quality-calculator"><div class="calc-inputs">
      <label>${copy('这道菜的工序','Recipe stages')}<select id="calc-mode"><option value="both">${copy('切配 + 控火','Prep + Heat')}</option><option value="prep">${copy('只有切配','Prep only')}</option><option value="heat">${copy('只有控火','Heat only')}</option><option value="auto">${copy('原本没有切配／控火','No prep / heat stages')}</option></select></label>
      <label>${copy('原料品质档位（平均后向下取整）','Ingredient rank (average, rounded down)')}<select id="calc-rank"><option value="0">${copy('普通 · 0 档','Normal · Rank 0')}</option><option value="1">${copy('银星 · 1 档','Silver · Rank 1')}</option><option value="2">${copy('金星 · 2 档','Gold · Rank 2')}</option><option value="3">${copy('铱星 · 3 档','Iridium · Rank 3')}</option></select></label>
      <label>${copy('切配平均准确率','Average prep accuracy')} <output id="calc-prep-label">80%</output><input id="calc-prep" type="range" min="0" max="100" value="80"></label>
      <label>${copy('控火平均准确率','Average heat accuracy')} <output id="calc-heat-label">80%</output><input id="calc-heat" type="range" min="0" max="100" value="80"></label>
      <label>${copy('普通品质基础售价（g）','Normal-quality base price (g)')}<input id="calc-base" type="number" min="0" max="999999" value="100"></label>
      <label>${copy('本人的职业加成','Your profession bonus')}<select id="calc-profession"><option value="0">${copy('无售价加成','No sale bonus')}</option><option value="0.15">${copy('风味厨师／食养专家 +15%','Flavor Chef / Nutrition Expert +15%')}</option><option value="0.30">${copy('招牌主厨 +30%','Signature Chef +30%')}</option></select></label>
    </div><div class="calc-result" aria-live="polite"><strong class="quality-result" id="calc-quality">${copy('金星','Gold')}</strong><p id="calc-description"></p><div class="calc-price" id="calc-price">300 g</div></div>
    <p class="calc-note">${copy('适用于新批次的手动规则，不预测关闭小游戏后的随机品质，也不含其他 Mod 的售价调整。','For fresh batches under manual rules. Does not predict random quality with minigames off or include other mods’ price changes.')}</p></div>
  `)}
  ${section('ingredients-quality','','原料与调味',`
    <p>${copy('平均品质排除固定无星材料：面粉、糖、油、醋、大米、枫糖浆、墨汁、海草、绿藻、白藻、苔藓、山洞萝卜、姜、虚空蛋黄酱。普通品质的鱼、蔬果、奶、蛋仍按 0 档计入。','The quality average excludes fixed-quality ingredients: Flour, Sugar, Oil, Vinegar, Rice, Maple Syrup, Squid Ink, Seaweed, Green Algae, White Algae, Moss, Cave Carrot, Ginger, and Void Mayonnaise. Normal fish, produce, milk, and eggs still count as rank 0.')}</p>
    <p>${copy('手持齐氏调味料，左键点击台面或厨具里的成品。每份消耗一个，将普通或银星提升至金星；金星、铱星和已调味料理不消耗。调味不改变原始评分、经验和首次奖励。','Hold Qi Seasoning and left-click a finished dish on a counter or in cookware. One seasoning upgrades one Normal or Silver serving to Gold. Gold, Iridium, and already-seasoned food consume none. Seasoning does not change the original score, XP, or first-time bonuses.')}</p>
    <p>${copy('三倍浓缩咖啡固定为普通品质，不使用上述评分。','Triple Shot Espresso is always normal quality and does not use these scoring rules.')}</p>
  `)}`;
}
function updateCalculator() {if(!$('#quality-calculator'))return;const mode=$('#calc-mode').value,rank=+$('#calc-rank').value,p=+$('#calc-prep').value,h=+$('#calc-heat').value;$('#calc-prep-label').textContent=p+'%';$('#calc-heat-label').textContent=h+'%';$('#calc-prep').disabled=mode==='heat'||mode==='auto';$('#calc-heat').disabled=mode==='prep'||mode==='auto';const op=mode==='both'?.4*p+.6*h:mode==='prep'?p:mode==='heat'?h:0;const score=Math.min(100,op+rank*5);const perfect=mode==='both'?p===100&&h===100:mode==='prep'?p===100:mode==='heat'?h===100:false;const tier=mode==='auto'?rank:perfect?3:score>=80-1e-8?2:score>=60-1e-8?1:0;$('#calc-quality').textContent=['普通','银星','金星','铱星'][tier];$('#calc-description').textContent=mode==='auto'?`按原料品质评星 · 第 ${rank} 档`:`操作 ${Number(op.toFixed(1))} + 原料 ${rank*5} = ${Number(score.toFixed(1))} 分${perfect?' · 全程精准':''}`;const base=Math.min(999999,Math.max(0,Number($('#calc-base').value)||0));const qualityPrice=Math.floor(base*[1,1.5,3,4][tier]+1e-6);$('#calc-price').textContent=Math.floor(qualityPrice*(1+Number($('#calc-profession').value))+1e-6).toLocaleString('zh-CN')+' g';}

const profession = (id,name,level) => `<div class="profession">${img(`assets/professions/${id}.png`,name)}<div><small>${level.startsWith('5')?'5 级':'10 级'}</small><h3>${name}</h3><p>${esc(DATA.professions.find(p=>p.name===name)?.description||'')}</p></div></div>`;
function skillsPage() {return `${crumbs('厨艺与职业')}<h1>厨艺与职业</h1>${section('experience','01','厨艺经验从哪里来',table(['项目','基础经验'],[['每项必需备料','10'],['每项控火','15'],['每段自动搅拌／烘焙／冷加工／组合','5'],['首次完成一道菜','额外 +20'],['首次做出一道菜的铱星成品','额外 +30']])+`<p>${copy('工序基础经验加品质档位 ×2；全程手动精准时乘 1.5 并向下取整，再加首次奖励。含自动步骤时保留基础、品质与首次经验，不领取完美操作倍率。成品只结算一次。','Add quality rank ×2 to base stage XP. If all manual stages are perfect, multiply by 1.5 and round down, then add first-time bonuses. Batches with automatic steps keep base, quality, and first-time XP without the perfect-technique multiplier. Each dish awards XP once.')}</p><p>厨艺越高，备料切割线越慢、控火绿区越宽。等级成长不会增加每轮需要完成的目标线。</p>`)}${section('levels','02','从生疏到熟练',table(['等级','累计经验','新获得的菜谱／选择'],[['1','100','煎蛋卷'],['2','380','薄煎饼'],['3','770','卷心菜沙拉'],['4','1,300','水果沙拉'],['5','2,150','选择节俭厨师或风味厨师'],['6','3,300','面包'],['7','4,800','巧克力蛋糕'],['8','6,900','披萨'],['9','10,000','粉红蛋糕'],['10','15,000','根据 5 级路线选择进阶职业']])+`<p>已经学会的原版菜谱仍然保留。上表是厨艺升级额外授予的菜谱，不表示其他菜只能靠厨艺等级解锁。</p>`)}${section('professions','03','你想成为什么样的厨师？',`<div class="profession-tree"><div class="profession-branch">${profession('thrifty','节俭厨师','5 级 · 节省原料路线')}<div class="profession-children">${profession('manager','食材管家','10 级 · 二选一')}${profession('plentiful','丰盛厨师','10 级 · 二选一')}</div></div><div class="profession-branch">${profession('flavor','风味厨师','5 级 · 料理价值路线')}<div class="profession-children">${profession('signature','招牌主厨','10 级 · 二选一')}${profession('nutrition','食养专家','10 级 · 二选一')}</div></div></div>${tip('按自己的日常选','想少消耗材料，可以沿节俭路线发展；常卖料理，可以选择招牌主厨；更常带饭去矿洞，则可以考虑食养专家。售价与恢复加成均有「本人自制」条件。')}`)}`;}

function notebookPage() {return `${crumbs('我的料理簿')}<h1>我的料理簿</h1><p class="record-storage">手动记录，仅保存在当前浏览器。</p><div class="notebook-summary"><strong id="cooked-total">${cooked.size}</strong><span>/ ${RECIPES.length} 道已尝试</span><div class="meter" aria-label="制作记录进度"><i id="cooked-meter" style="width:${cooked.size/RECIPES.length*100}%"></i></div><span id="cooked-percent">${Math.round(cooked.size/RECIPES.length*100)}%</span></div><div class="notebook-tabs" role="group" aria-label="料理簿分类"><button data-notebook="saved" class="${notebookTab==='saved'?'active':''}" aria-pressed="${notebookTab==='saved'}">收藏 <span id="saved-tab-count">${saved.size}</span></button><button data-notebook="cooked" class="${notebookTab==='cooked'?'active':''}" aria-pressed="${notebookTab==='cooked'}">做过 <span id="cooked-tab-count">${cooked.size}</span></button></div><div id="notebook-results"></div><div class="notebook-tools"><button class="plain-button" data-action="export">导出料理簿 ↓</button></div>`;}
function updateNotebook() {const el=$('#notebook-results');if(!el)return;const set=notebookTab==='saved'?saved:cooked;const items=RECIPES.filter(r=>set.has(r.id));el.innerHTML=items.length?gridItems(items):`<div class="empty-state">${img('assets/tools/plate.png','')}<h2>${notebookTab==='saved'?'暂无收藏':'暂无制作记录'}</h2><a class="outline-button" href="#/recipes">浏览菜谱 →</a></div>`;$('#cooked-total').textContent=cooked.size;$('#cooked-meter').style.width=cooked.size/RECIPES.length*100+'%';$('#cooked-percent').textContent=Math.round(cooked.size/RECIPES.length*100)+'%';$('#saved-tab-count').textContent=saved.size;$('#cooked-tab-count').textContent=cooked.size;document.querySelectorAll('[data-notebook]').forEach(b=>{b.classList.toggle('active',b.dataset.notebook===notebookTab);b.setAttribute('aria-pressed',String(b.dataset.notebook===notebookTab));});}

function installPage() {
  return `<h1>安装与常见问题</h1>
  ${section('install','','安装与更新',`
    <ul class="dependency-list">
      <li><a href="https://smapi.io/" target="_blank" rel="noopener noreferrer">SMAPI ↗</a><span>${copy('最低 4.1.0；已用 4.5.2 验证','Minimum 4.1.0; verified with 4.5.2')}</span></li>
      <li><a href="https://www.nexusmods.com/stardewvalley/mods/1348" target="_blank" rel="noopener noreferrer">SpaceCore ↗</a><span>1.28.4+</span></li>
      <li><a href="https://www.nexusmods.com/stardewvalley/mods/5098" target="_blank" rel="noopener noreferrer">Generic Mod Config Menu ↗</a><span>1.16.0+</span></li>
    </ul>
    <p>${copy('适用于星露谷物语 1.6.15。装好以上必装前置，将含 manifest.json 的 ComplexCooking 文件夹放进 Mods，通过 SMAPI 启动。','For Stardew Valley 1.6.15. Install all required dependencies above, place the ComplexCooking folder containing manifest.json in Mods, and launch through SMAPI.')}</p>
    <p>${copy('更新前退出游戏并备份存档，再替换旧 ComplexCooking 文件夹；保留 config.json 可沿用设置。所有联机玩家统一使用 1.3.0，并安装一致版本的依赖。','Exit the game and back up your save before replacing the old ComplexCooking folder. Keep config.json to retain settings. Every multiplayer participant needs 1.3.0 and matching dependencies.')}</p>
  `)}
  ${section('settings','','设置',`
    <p>${copy('打开 GMCM → 复杂料理。','Open GMCM → Complex Cooking.')}</p>
    ${table([copy('设置项','Setting'),copy('生效方式','Behavior')],[
      [copy('启用 Mod','Enable Mod'),copy('仅在标题界面修改，下次载入生效；关闭后恢复菜单做菜，暂停本 Mod 的加工、经验和职业效果，保留物品、进度与布局','Change on the title screen; applies on the next load. Turning it off restores menu cooking and suspends this mod’s processing, XP, and profession effects, while preserving items, progress, and layouts')],
      [copy('小游戏与加工键','Minigames & cooking key'),copy('每位玩家独立设置；加工键默认 Q','Personal to each player; Q by default')],
      [copy('自动加工时长','Automatic durations'),copy('切配／整形默认 3 秒，加热默认 6 秒；房主可分别设为 1～60 秒','Prep / shaping defaults to 3 seconds, heating to 6; the host can set each to 1–60 seconds')],
      [copy('厨房布局','Kitchen layout'),copy('移动工位、添加台面、调整盘架；联机由房主编辑','Move stations, add counters, and adjust racks; host edits in multiplayer')]
    ])}
  `)}
  ${section('compatibility','','可选兼容',`
    <details id="farmers-store"><summary>${copy('农夫小店 1.0.3','Farmer’s Store 1.0.3')}</summary>
      <p>${copy('进入目标建筑，在 GMCM → 复杂料理 → 当前建筑厨房选择系统；默认使用农夫小店厨房。选择复杂料理后，农舍使用自带厨房，其他室内建筑可摆放购买的工位。','Enter the building and choose its kitchen in GMCM → Complex Cooking → Current Building Kitchen. Farmer’s Store is the default. Choosing Complex Cooking uses the built-in farmhouse kitchen and allows purchased stations in other indoor buildings.')}</p>
      ${table([copy('购买处','Vendor'),copy('设备','Equipment')],[
        [copy('专注货架二十年','Focus on shelves for twenty years'),copy('砧板台、搅拌台、空灶台、烤箱、冰箱、盘架、置物台','Prep counters, mixers, empty stoves, ovens, fridges, plate racks, and counters')],
        [copy('开店百宝店','Open a treasure store'),copy('平底锅、深锅、蒸屉','Frying pans, cooking pots, and steamers')]
      ])}
      <p>${copy('置物台 100g，其余复杂料理设备与锅具 2000g／件；先按农夫小店规则解锁供应商和食品经营许可。空灶台可放任意一种锅具，置物台可拼接。','Counters cost 100g; other Complex Cooking equipment and cookware cost 2,000g each. Unlock vendors and the food permit through Farmer’s Store. Empty stoves accept any cookware; counters connect together.')}</p>
      <p>${copy('手持买来的盘架时，按加工键切换 2／3 格，右键转向，左键放置。先取空内容再用镐回收设备；空锅随灶台返还，拆搅拌台前需归还搅拌盆。','While holding a purchased rack, use the cooking key to switch between two and three tiles, right-click to rotate, and left-click to place. Empty equipment before recovering it with a pickaxe. Empty cookware returns with the stove; return the mixing bowl before removing a mixer.')}</p>
      <p>${copy('成品可直接上菜，默认菜单价计入品质和职业，手动标价优先。订单、配送和记账仍由农夫小店负责。复杂料理厨房不产生脏盘；切换系统前先取走食物和原料，已买设备保留。','Serve finished meals directly. Default menu prices include quality and profession bonuses; custom prices take priority. Farmer’s Store handles orders, deliveries, and accounts. Complex Cooking kitchens produce no dirty plates. Remove food and ingredients before switching systems; purchased equipment is kept.')}</p>
    </details>
    <details><summary>Better Crafting 2.18.0</summary><p>${copy('开启 ReplaceCooking 后，支持的菜谱打开复杂料理指南并在工位制作；其他菜谱沿用原制作规则。两套收藏分别保存。','With ReplaceCooking enabled, supported recipes open the Complex Cooking guide and are made at stations. Other recipes keep their original crafting rules. The two favorites systems are stored separately.')}</p></details>
    <details><summary>Restauranteer 1.1.1</summary><p>${copy('在默认酒吧厨房制作订单，冰箱提供原料，前方吧台有七格置物位。点单与报酬由 Restauranteer 管理；需启用默认酒吧地图改动并满足原事件条件。','Cook orders in the default saloon kitchen, using fridge ingredients and seven counter spaces at the front bar. Restauranteer handles orders and rewards. Enable its default saloon map changes and meet its event requirements.')}</p></details>
    <details><summary>${copy('厨房美化与新增菜谱','Kitchen retextures & added recipes')}</summary><p>${copy('台面跟随当前农舍贴图。使用原版厨房素材的房型可自动识别，也可用布局编辑器调整；自定义酒吧与姜岛地图需要单独适配。','Counters follow the current farmhouse texture. Layouts using vanilla kitchen tiles can be detected automatically or adjusted in the editor. Custom saloon and Island Farmhouse maps need separate compatibility work.')}</p><p>${copy('新增或修改的菜谱按实际材料、解锁、产量与制作规则处理，不自动获得本 Mod 的小游戏或手工厨艺经验。本 Wiki 的 81 项配方对应原版配方。','Added or modified recipes keep their actual ingredients, unlocks, yields, and crafting rules. They do not automatically gain this mod’s minigames or manual Cooking XP. This wiki’s 81 recipes describe the vanilla recipes.')}</p></details>
  `)}
  ${section('faq','','常见问题',`
    <details><summary>${copy('为什么厨房里没有新工位？','Why are the new stations missing?')}</summary><p>${copy('确认已安装全部前置、标题界面的“启用 Mod”已开启，并至少升级一次房屋。移开挡住工位的家具；安装农夫小店时，还要确认当前建筑选择了复杂料理厨房。','Check all dependencies, Enable Mod on the title screen, and the first house upgrade. Clear furniture from station spaces. With Farmer’s Store installed, select the Complex Cooking kitchen for the current building.')}</p></details>
    <details><summary>${copy('为什么按 Q 没反应？','Why does Q do nothing?')}</summary><p>${copy('检查 GMCM 中的加工键，靠近已放齐正确材料的切配或加热工位。小游戏关闭时会直接开始自动加工；搅拌、烘焙和冷却不需要按键启动。','Check your configured cooking key and approach a prep or heat station with the correct ingredients. With minigames off, processing starts automatically after the keypress. Mixing, baking, and cooling need no start key.')}</p></details>
    <details><summary>${copy('为什么材料放不进去？','Why can’t I add an ingredient?')}</summary><p>${copy('材料和数量必须匹配当前工位与阶段的已学配方。不合适的材料不会扣除；按流程图检查是否应先切配或搅拌。','Ingredients and quantities must fit a known recipe at the current station and stage. Invalid ingredients are not consumed. Check the diagram for prep or mixing requirements.')}</p></details>
    <details><summary>${copy('完成的料理怎么取？','How do I collect finished food?')}</summary><p>${copy('锅中料理和生鱼片需要空盘；粉红蛋糕与冰箱冷却食物直接取出，整盘入炉的料理沿用原盘。详细操作见对应菜谱。','Pot dishes and Sashimi need an empty plate. Collect Pink Cake and cooled food directly; dishes baked on a plate keep that plate. Follow the individual recipe.')}</p></details>
    <details><summary>${copy('自动加工会重抽品质或清除失误吗？','Can automatic processing reroll quality or erase mistakes?')}</summary><p>${copy('不会。拿起锅具、重新装盘、切换设置或继续存档都会保留已有记录；已开工的步骤也不会被改成另一种加工方式。','No. Moving cookware, replating, changing settings, or reloading preserves existing records. A started step keeps its original processing mode.')}</p></details>
    <details id="coffee"><summary>${copy('三倍浓缩咖啡怎么做？','How do I make Triple Shot Espresso?')}</summary><p>${copy('手持三杯咖啡，左键点击已放置的咖啡机。每次得到一杯普通品质三倍浓缩咖啡，不获得厨艺经验，保留机器当天产出。','Hold three Coffee and left-click a placed Coffee Maker. Each click yields one normal-quality Triple Shot Espresso, with no Cooking XP and no effect on the machine’s daily output.')} <a href="#/recipe/triple_shot_espresso">${copy('查看配方 →','View recipe →')}</a></p></details>
  `)}`;
}

function updatesPage() {return `<h1>更新记录</h1>`;}

function renderRail() {
  const headings=[...document.querySelectorAll('#main [data-toc]')];
  const rail=$('#page-rail');
  rail.hidden=!headings.length;
  $('.site-layout').classList.toggle('no-rail',rail.hidden);
  rail.innerHTML=headings.length?`<div class="rail-inner"><nav class="rail-toc" aria-label="本页目录">${headings.map(h=>`<a href="#${esc(h.id)}" data-scroll="${esc(h.id)}">${esc(h.dataset.toc)}</a>`).join('')}</nav></div>`:'';
}
function route() {const raw=location.hash.slice(1)||'/';const parsed=new URL(raw,'https://wiki.local');const path=parsed.pathname.split('/').filter(Boolean);const id=path[0]||'home';currentPage=id;const titles={home:'首页',recipes:'全部菜谱',start:'新手入门',stations:'厨具与工位',techniques:'切配与控火',quality:'料理品质',skills:'厨艺与职业',notebook:'我的料理簿',install:'安装与常见问题',updates:'更新记录'};let body='';let title=titles[id]||'页面未找到';if(id==='home')body=homePage();else if(id==='recipes')body=recipesPage(parsed.searchParams);else if(id==='recipe'){let recipeId='';try{recipeId=decodeURIComponent(path[1]||'');}catch{}const r=byId.get(recipeId);if(r){body=detailPage(r);title=r.name;}else body=notFound();}else {const pages={start:startPage,stations:stationsPage,techniques:techniquesPage,quality:qualityPage,skills:skillsPage,notebook:notebookPage,install:installPage,updates:updatesPage};body=pages[id]?pages[id]():notFound();}$('#main').innerHTML=body;$('.header-version').innerHTML=`<i></i>v${esc(RELEASE_VERSION)}`;document.title=`${title} · 复杂料理 Wiki`;document.querySelectorAll('[data-nav]').forEach(a=>{const active=a.dataset.nav===(id==='recipe'?'recipes':id);a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});$('#recipe-total').textContent=RECIPES.length;syncCounts();if(id==='recipes')updateCatalog();if(id==='quality')updateCalculator();if(id==='notebook')updateNotebook();renderRail();closeMenu();window.scrollTo({top:0,behavior:'instant'});if(parsed.hash){const target=document.getElementById(parsed.hash.slice(1));if(target){if(target.tagName==='DETAILS')target.open=true;target.scrollIntoView();}}}
function notFound() {return `${crumbs('页面未找到')}<div class="not-found"><h1>这一页，还没收进手册。</h1><a class="solid-button" href="#/recipes">去翻菜谱 →</a></div>`;}

const searchDocs=[
{name:'新手入门',terms:'入门 开始 操作 getting started beginner first egg controls',href:'#/start'},
{name:'厨具与工位',terms:'厨房 布局 姜岛 盘架 工位 农舍 kitchen layout island farmhouse rack stations tools',href:'#/stations'},
{name:'切配与控火',terms:'小游戏 自动 加工 关闭 Q 时间 暂停 minigame automatic prep heat cooking key pause timer',href:'#/techniques'},
{name:'料理品质',terms:'自动 品质 铱星 概率 调味料 售价 计算 quality automatic probability iridium price calculator seasoning',href:'#/quality'},
{name:'厨艺与职业',terms:'厨艺 经验 升级 职业 cooking xp experience level profession',href:'#/skills'},
{name:'安装与常见问题',terms:'设置 前置 依赖 GMCM SMAPI SpaceCore 兼容 农夫小店 总开关 install update settings dependencies compatibility farmer store better crafting restauranteer enable',href:'#/install'}];
function search(query) {const q=query.trim().toLowerCase();const docs=q?searchDocs.filter(d=>localizedSearchText(d.name+' '+d.terms).toLowerCase().includes(q)):searchDocs.slice(0,3);const found=(q?RECIPES.filter(r=>[r.name,r.english,r.instructions,...r.ingredients.map(i=>i.name)].map(localizedSearchText).join(' ').toLowerCase().includes(q)):['fried_egg','pumpkin_soup','pizza'].map(id=>byId.get(id))).slice(0,15);$('#search-results').innerHTML=docs.map(d=>`<a class="search-result category" href="${d.href}"><span>${esc(d.name)}</span><span class="search-arrow">↗</span></a>`).join('')+found.map(r=>`<a class="search-result" href="${recipeUrl(r.id)}">${img(r.icon,'')}<span>${esc(r.name)}<small>${esc(textIngredients(r))}</small></span><span class="search-arrow">↗</span></a>`).join('')+(!docs.length&&!found.length?'<p class="search-no-results">这一页没有找到。试试更短的菜名或食材名称。</p>':'');}
function openSearch() {const d=$('#search-dialog');if(d.open)return;d.showModal();$('#dialog-query').value='';search('');$('#dialog-query').focus();}
function closeMenu() {$('#sidebar').classList.remove('is-open');$('#nav-shade').hidden=true;$('#menu-toggle').setAttribute('aria-expanded','false');}
$('#menu-toggle').addEventListener('click',()=>{const open=!$('#sidebar').classList.contains('is-open');$('#sidebar').classList.toggle('is-open',open);$('#nav-shade').hidden=!open;$('#menu-toggle').setAttribute('aria-expanded',String(open));});
$('#nav-shade').addEventListener('click',closeMenu);
$('#open-search').addEventListener('click',openSearch);
$('#close-search').addEventListener('click',()=>$('#search-dialog').close());
$('#close-image').addEventListener('click',()=>$('#image-dialog').close());
$('#dialog-query').addEventListener('input',e=>search(e.target.value));
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch();}if(e.key==='Escape')closeMenu();});
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.addEventListener('input',e=>{if(e.target.id==='recipe-query'){catalogState.q=e.target.value;updateCatalog();}if(e.target.closest('#quality-calculator'))updateCalculator();});
document.addEventListener('change',e=>{if(e.target.id==='recipe-sort'){catalogState.sort=e.target.value;updateCatalog();}if(e.target.closest('#quality-calculator'))updateCalculator();});
document.addEventListener('click',async e=>{const a=e.target.closest('a');if(a&&$('#search-dialog').open)$('#search-dialog').close();const scroll=e.target.closest('[data-scroll]');if(scroll){e.preventDefault();document.getElementById(scroll.dataset.scroll)?.scrollIntoView({behavior:'smooth'});return;}const filter=e.target.closest('[data-filter]');if(filter){catalogState.tool=filter.dataset.filter;updateCatalog();return;}const view=e.target.closest('[data-view]');if(view){listView=view.dataset.view;updateCatalog();return;}const notebook=e.target.closest('[data-notebook]');if(notebook){notebookTab=notebook.dataset.notebook;updateNotebook();return;}const diagram=e.target.closest('[data-diagram]');if(diagram){const image=$('#large-diagram');image.src=diagram.dataset.diagram;image.alt=diagram.dataset.name+'完整工序图';const probe=new Image();probe.onload=()=>{image.style.width=probe.naturalWidth*3+'px';};probe.src=diagram.dataset.diagram;$('#image-dialog').showModal();return;}const copy=e.target.closest('[data-copy]');if(copy){try{await navigator.clipboard.writeText(copy.dataset.copy);toast('指令已复制');}catch{toast('复制不可用，请选中指令手动复制。');}return;}const action=e.target.closest('[data-action]');if(!action)return;if(action.dataset.action==='save'||action.dataset.action==='cook'){toggleRecord(action.dataset.action,action.dataset.id);return;}if(action.dataset.action==='print'){window.print();return;}if(action.dataset.action==='clear-filters'){catalogState.q='';catalogState.tool='全部';$('#recipe-query').value='';updateCatalog();return;}if(action.dataset.action==='export'){const data={format:'complex-cooking-wiki-notebook',version:1,exportedAt:new Date().toISOString(),saved:[...saved],cooked:[...cooked]};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'});const href=URL.createObjectURL(blob);const link=document.createElement('a');link.href=href;link.download=window.WIKI_I18N.language==='en'?'complex-cooking-cookbook.json':'复杂料理-料理簿.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(href),1000);}});
window.addEventListener('storage',e=>{if(e.key==='cc-wiki-saved-v1'||e.key==='cc-wiki-cooked-v1'){saved=readSet('cc-wiki-saved-v1');cooked=readSet('cc-wiki-cooked-v1');syncCounts();if(currentPage==='notebook')updateNotebook();if(currentPage==='recipes')updateCatalog();}});
window.addEventListener('hashchange',route);
route();
