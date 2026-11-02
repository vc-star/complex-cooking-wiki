'use strict';
(() => {
  let language = 'zh';
  try { language = localStorage.getItem('cc-wiki-language') === 'en' ? 'en' : 'zh'; } catch {}
  const requested = new URLSearchParams(location.search).get('lang');
  if (requested === 'zh' || requested === 'en') language = requested;
  const entries = new Map();
  const add = lines => lines.trim().split('\n').forEach(line => {
    const divider = line.indexOf('|');
    if (divider > 0) entries.set(line.slice(0, divider), line.slice(divider + 1));
  });
  add(`
复杂料理|Complex Cooking
田间厨房手册|The Farm Kitchen Handbook
首页|Home
从田间，到餐桌。|From farm to table.
亲手备料、控火，再端上一餐好饭。|Prep, cook, and serve a meal of your own.
新手入门|Getting Started
全部菜谱|All Recipes
厨具与工位|Tools & Stations
切配与控火|Prep & Heat
料理品质|Food Quality
厨艺与职业|Cooking Skill
我的料理簿|My Cookbook
安装与常见问题|Installation & FAQ
更新记录|Changelog
从这四道开始|Start with these four
按工位查找|Browse by station
常用指南|Kitchen guides
品质与售价|Quality & Prices
操作|Controls
左键|Left click
拿放、判定|Place, pick up, confirm
拿放与判定|Place, pick up, confirm
开始／暂停切配与控火|Start / pause prep or heat
开始／暂停小游戏|Start / pause minigame
装盘接取|Plate and collect
备料、烹饪、装盘|Prep, cook, serve
搜索菜谱或食材|Search recipes or ingredients
搜索手册|Search the handbook
搜索|Search
菜名、食材、厨具……|Recipe, ingredient, station…
跳到正文|Skip to content
展开导航|Open navigation
站点导航|Site navigation
本页导航|On this page
本页目录|On this page
关闭搜索|Close search
关闭预览|Close preview
关闭|Close
菜谱工序图放大预览|Recipe diagram preview
图鉴|Grid
列表|List
显示方式|View
搜菜名、原料或工位|Search recipes, ingredients or stations
筛选菜谱|Filter recipes
菜谱排序|Sort recipes
按原作顺序|Game order
原料少的在前|Fewest ingredients
按名称排序|Name
按工位筛选|Filter by station
全部|All
道料理|recipes
没有找到菜谱|No recipes found
清除筛选|Clear filters
料理|Dish
原料|Ingredients
使用工位|Stations
使用设备|Equipment
盘内组合|Combine on a plate
取消收藏|Remove bookmark: 
收藏菜谱|Bookmark recipe
已收藏|Bookmarked
收藏|Bookmarks
已做过|Cooked
已经做过|Cooked
记为做过了|Mark as cooked
做过|Cooked
打印这道菜|Print recipe
食材|Ingredients
做法|Method
工序图|Process diagram
完整制作工序图|complete process diagram
完整工序图|complete process diagram
放大|Enlarge 
也可以做|You could also make
查找也使用|Find recipes using 
的料理| 
制作规则|Brewing rules
空盘|Empty plate
砧板|Cutting Board
搅拌机|Mixer
平底锅|Frying Pan
深锅|Cooking Pot
烤箱|Oven
蒸屉|Steamer
冰箱|Refrigerator
咖啡机|Coffee Maker
左键点击咖啡机|Left-click the coffee maker
咖啡三杯经咖啡机即时制作一杯三倍浓缩咖啡|Three coffees brewed instantly into one Triple Shot Espresso
咖啡机摆放在室内或室外均可，靠近后操作；一次点击制作一份。|Place the coffee maker indoors or outdoors and interact from nearby. Each click makes one serving.
产物固定为普通品质，记录制作次数；不使用小游戏，不获得厨艺经验，也不触发原料返还或额外产出。|The result is always normal quality and counts as a craft. There is no minigame, Cooking XP, ingredient refund, or bonus serving.
咖啡不足或背包无法容纳成品时不扣材料。恰好三杯咖啡消耗后腾出的格子可用于接收成品。|Ingredients are kept if you lack coffee or inventory space. A slot freed by consuming exactly three coffees can hold the result.
最后一份取完时返还空盆；背包满时空盆会落在附近。|The empty bowl is returned after the last serving. If your inventory is full, it drops nearby.
浏览器未允许保存，当前记录仅在本次页面中有效。|Browser storage is unavailable. These records last only for this session.
已夹进料理簿|Added to your cookbook
已取消收藏|Bookmark removed
又学会一道菜，已记下。|Another dish learned and recorded.
已撤销制作记录|Cooking record removed
手动记录，仅保存在当前浏览器。|Manually recorded and saved in this browser only.
道已尝试|recipes tried
制作记录进度|Cooking progress
料理簿分类|Cookbook tabs
暂无收藏|No bookmarks yet
暂无制作记录|No cooking records yet
浏览菜谱|Browse recipes
导出料理簿|Export cookbook
这一页，还没收进手册。|This page is not in the handbook yet.
页面未找到|Page not found
去翻菜谱|Browse recipes
这一页没有找到。试试更短的菜名或食材名称。|Nothing found. Try a shorter recipe or ingredient name.
指令已复制|Copied
复制不可用，请选中指令手动复制。|Copy unavailable. Select the text and copy it manually.
全部相关菜谱|All related recipes
第一道菜：煎鸡蛋|Your first dish: Fried Egg
开火之前|Before you start
安装 |Install 
或以上版本|or later
与 |and 
，将 ComplexCooking 文件夹放进游戏的 Mods 目录，再通过 SMAPI 启动。|. Put the ComplexCooking folder in the game's Mods directory, then launch through SMAPI.
进入|Enter 
至少升级过一次的农舍厨房|a farmhouse kitchen upgraded at least once
。联机时每位玩家需安装相同版本的 Mod 和依赖；暂不支持同机分屏。备料台附近需要留出空位，如果家具挡住了台面，先挪开它。|. Every multiplayer participant needs matching mod and dependency versions. Split-screen is not supported. Move furniture away from the prep counter before cooking.
查看完整安装与排错步骤|Full installation and troubleshooting
亲手做一份煎鸡蛋|Make a Fried Egg
准备一份任意蛋。|Prepare one egg of any kind.
将蛋拿在手里，靠近平底锅，鼠标左键投入。|Hold the egg, approach the frying pan, and left-click to add it.
按 Q，开始控火。|Press Q to start cooking.
指针经过绿色区域时点击左键；精准一次推进 20%，其他区域推进 8%。同一趟扫过只接受一次判定。|Left-click when the pointer reaches the green zone. A perfect hit adds 20% progress; other zones add 8%. Only one click counts per sweep.
进度达到 100%，拿空盘接取。|At 100% progress, collect with an empty plate.
从盘子架取一个空盘，手持空盘左键点击完成的平底锅，料理就做好了。|Take an empty plate from the plate rack, hold it, and left-click the finished pan to collect your meal.
翻到煎鸡蛋菜谱|Open Fried Egg recipe
记住这几个操作|Essential controls
会发生什么|What happens
左键点击原料目标|Left-click an ingredient target
放入手里的一份材料|Add one held ingredient
空手左键点击锅或盆|Left-click a pot or bowl with empty hands
端起可移动容器|Pick up the movable container
手持容器左键点击空灶／空台面|Hold a container and left-click an empty burner / counter
放下容器|Put the container down
靠近可操作工位按 Q|Press Q near an available station
打开、暂停或继续切配／控火小游戏|Open, pause or resume the prep / heat minigame
小游戏内点击左键|Left-click inside a minigame
完成一次切配或控火判定|Make one prep or heat attempt
手持空盘点击需装盘的工位|Hold an empty plate and click a plating station
接取锅中料理或生鱼片|Collect cooked food or Sashimi
左键点击冷却完成的冰箱下层门|Left-click the lower fridge door after cooling
直接取出，不消耗盘子|Collect directly, without using a plate
单人打开料理小游戏时，游戏时钟与其他料理设备暂停；联机全员进入可暂停菜单后，世界时间暂停，加工继续。已有进度和判定保留。|In single-player, cooking minigames pause the clock and other stations. In multiplayer, world time pauses when everyone opens a pausable menu, while processing continues. Progress and scores are preserved.
厨房里的收藏与原料|Kitchen favorites and ingredients
作用|Effect
菜谱列表中 Alt + 左键点击已学会的菜|Alt + left-click a learned recipe in the recipe list
收藏／取消收藏，菜谱显示金色外框|Toggle a favorite; favorited recipes have a gold border
鼠标放在厨房顶部收藏栏上滚动滚轮|Scroll over the favorites bar at the top of the kitchen
切换收藏图的行|Switch rows of favorites
悬停工位、容器或半成品|Hover over a station, container or intermediate item
查看完整原料与数量|See all ingredients and quantities
物品栏中拿起有内容物的容器，点击垃圾桶|Pick up a filled container in your inventory and click the trash can
打开取回原料／清空窗口|Open the recover ingredients / empty dialog
游戏内收藏可在各地图显示，联机共用并随存档保存；本站料理簿独立保存在浏览器。|In-game favorites appear across maps, are shared in multiplayer, and are saved with the game. This site's cookbook is stored separately in your browser.
下一道，试试什么？|What will you cook next?
菜谱菜单用来查看材料和工序，点击菜谱不会直接合成。已经会的菜，可以在本站的「我的料理簿」里手动记下。|The recipe menu shows ingredients and steps; clicking a recipe does not craft it. Record dishes you have made in My Cookbook.
手动备料 · Q 打开小游戏|Manual prep · Q opens the minigame
切菜、去壳、面团整形都在这里完成。每一轮有 4 条目标线；同一备料工序中的多份食材合并处理。|Chop, shell, and shape dough here. Each round has four target lines. Multiple ingredients in the same prep stage are processed together.
墨汁意大利饺在砧板或台面直接合并包馅。|Squid Ink Ravioli is assembled and filled directly on the board or counter.
自动搅拌 · 8 秒|Automatic mixing · 8 seconds
将配方要求的材料放齐，搅拌机自动调制。可以端起搅拌盆，把面糊或混合物送往下一道工序。|Add all required ingredients to start automatic mixing. Pick up the bowl to carry the batter or mixture to the next stage.
手动控火 · 可移动容器|Manual heat · Movable container
承担煎、炒等工序。把正确的材料放进锅，放在可用灶位，再按 Q 开始控火。|Used for frying and sautéing. Add the right ingredients, place on an available burner, and press Q to start.
锅拿离灶位后暂停，放回可用灶位可继续。|Lifting the pan off the burner pauses cooking. Return it to an available burner to resume.
用来煮、炖与油炸。配方可能需要先备料或搅拌；遵循工序图，不能把尚未处理的材料直接跳步投入。|Used for boiling, stewing, and deep-frying. Follow the diagram: some ingredients must be prepped or mixed before they can be added.
薯饼在本 Mod 中使用深锅，与原作一键烹饪不同。|In this mod, Hashbrowns use the cooking pot.
自动烘焙 · 不使用控火小游戏|Automatic baking · No heat minigame
位于灶台下层。按菜谱放入半成品、整盘料理或搅拌盆。|Below the stove. Add an intermediate item, a plated dish, or a mixing bowl as the recipe requires.
粉红蛋糕整盆入炉后返还空盆，烤好直接取出。枫糖棒烤好后直接淋糖浆。|Pink Cake returns the empty bowl when loaded; collect the cake directly after baking. Add syrup to Maple Bars after baking.
手动控火 · 支持带盆加工|Manual heat · Accepts mixing bowls
蒸制也通过控火小游戏推进。带盆蒸的料理可以直接将搅拌盆放入蒸屉，不需要额外模具。|Steaming uses the heat minigame too. Recipes steamed in a bowl accept the mixing bowl directly; no extra mold is needed.
最后一份接取后返还空盆；背包满时空盆落在附近。|The empty bowl is returned after the last serving. If your inventory is full, it drops nearby.
自动冷却 · 下层门操作|Automatic cooling · Use the lower door
上层门用于原版储物，下层门用来冷却。端着已完成加热的深锅，左键点击实际冰箱的下层门倒入食物，手中保留空锅。|The upper door opens vanilla storage; the lower door cools food. Hold a pot that has finished heating and left-click the lower door to pour it in. You keep the empty pot.
冷却需 8 秒，完成后直接拿取，不消耗盘子；单人加工时暂停游戏时间。|Cooling takes eight seconds. Collect directly without a plate. Game time pauses during single-player processing.
即时制作 · 左键操作|Instant brewing · Left click
手持咖啡×3，靠近已摆放的原版咖啡机并左键点击，立即得到三倍浓缩咖啡×1。室内外均可使用，每次只制作一份。|Hold 3 Coffee, approach a placed vanilla Coffee Maker, and left-click for 1 Triple Shot Espresso. Works indoors or outdoors, one serving per click.
保留咖啡机每天自动产出咖啡的功能。|The coffee maker still produces its daily coffee automatically.
盘子架可以无限取用空盘，不需要清洗。空台面用来临时放置容器与盘子；容器内部的原料、工序和成绩会随容器保留。|The plate rack provides unlimited empty plates with no washing required. Empty counters hold containers and plates. Ingredients, stage, and scores stay with each container.
切配：对准四条目标线|Prep: hit the four target lines
切割线左右移动，食材上有 |The cutting line moves back and forth across 
4 条目标线|four target lines
。当切割线进入尚未完成的目标范围时，点击左键，完成这一刀；四条线全部切中即完成备料。|. Left-click inside an unfinished target to cut. Hit all four to finish prepping.
点偏会计入尝试次数，已完成的线也不能重复得分。去壳、处理籽料与面团整形沿用这套小游戏。|Misses count as attempts; completed targets cannot score again. Shelling, seed preparation, and dough shaping use the same minigame.
例子|Example
切配准确率|Prep accuracy
4 次命中，4 次尝试|4 hits in 4 attempts
4 次命中，5 次尝试|4 hits in 5 attempts
4 次命中，6 次尝试|4 hits in 6 attempts
约 66.7%|About 66.7%
厨艺越高，切割线移动越慢。0 级单向约 1.8 秒，5 级约 2.12 秒，10 级约 2.57 秒；每轮目标线数量仍为 4 条。|Higher Cooking levels slow the cutting line. One sweep takes about 1.8 seconds at level 0, 2.12 at level 5, and 2.57 at level 10. There are still four targets per round.
控火：看绿区，不要连点|Heat: aim for green, one click per sweep
平底锅、深锅和蒸屉共用控火玩法。指针在三个区域间往返；绿色「刚刚好」为精准，另外两区分别表示「火小了」与「过火了」。|Pans, pots, and steamers share the heat minigame. The pointer crosses three zones: green is Perfect, while the other zones are Too Low and Too Hot.
判定|Result
加工进度|Progress
刚刚好|Perfect
火小了／过火了|Too Low / Too Hot
同一趟移动再次点击|Click again during the same sweep
不接受第二次判定|A second click does not count
每次指针折返，绿色区域会换位置。|The green zone moves whenever the pointer turns around.
厨艺 0 级时绿区宽度为 12%，每级增加 1 个百分点，10 级为 22%。越接近出锅，指针越快：单向时间从约 1.1 秒逐渐缩短到 0.8 秒。|The green zone covers 12% at Cooking level 0, plus one percentage point per level, reaching 22% at level 10. The pointer speeds up as cooking progresses: each sweep shortens from about 1.1 to 0.8 seconds.
失误也会推进加工，只影响本次成绩。全程精准需要 5 次有效判定。料理完成后等待装盘，不会继续烧坏。|Mistakes still advance cooking but lower your score. Five perfect hits finish the dish. Finished food waits for plating and will not burn.
什么时候会暂停？|When does cooking pause?
单人模式下，打开任一料理小游戏时，游戏时钟与其他自动加工设备暂停，当前小游戏继续运行。单人模式关闭窗口后，游戏时间与其他自动设备恢复，不会把暂停期间的现实时间补算进去。|In single-player, opening a cooking minigame pauses the clock and other automatic stations. Closing it resumes them without catching up on elapsed real time.
使用 Q 暂停或离开小游戏，已经完成的目标、尝试次数、加工进度和失误都会保留。拿起锅具或重新开窗口，不能重置成绩。|Pause with Q or leave the minigame to preserve targets, attempts, progress, and mistakes. Picking up cookware or reopening the window does not reset scores.
搅拌和烘焙不使用小游戏。冰箱下层的冷加工也自动完成。联机时，只要还有玩家在场景中活动，世界时间继续；全员进入料理小游戏或可暂停菜单后，世界时间暂停，各设备加工继续。|Mixing, baking, and lower-fridge cooling are automatic. In multiplayer, time runs while anyone is active in the world. Once everyone opens a cooking minigame or pausable menu, time pauses while stations keep processing.
先看操作，再加原料分|Start with technique, then add ingredients
同时有切配和控火时：|For recipes with both prep and heat: 
操作分 = 切配平均准确率 × 40 + 控火平均准确率 × 60|Technique score = average prep accuracy × 40 + average heat accuracy × 60
。只有一种手动工序时，直接使用该类工序的平均准确率。|. With only one manual stage type, use its average accuracy directly.
把可有品质的原料换算为普通 0、银星 1、金星 2、铱星 3，求平均并向下取整。每一档加 5 分，最多加 15 分；总分最高 100。|For ingredients that can have quality, assign Normal 0, Silver 1, Gold 2, and Iridium 3. Round their average down. Each rank adds 5 points, up to 15, with a total score capped at 100.
成品|Result
条件|Requirement
自制料理售价倍率|Homemade sale multiplier
总分低于 60|Score below 60
总分达到 60|Score at least 60
总分达到 80|Score at least 80
所有手动工序全程精准，且无旧版加工记录|All manual stages perfect, with no legacy processing records
原料加分可能让总分达到 100，但只要手动工序出现过失误，仍最多为金星。完全没有手动工序的新批次（如巧克力蛋糕、黑莓脆皮饼），直接使用原料品质档位评星。|Ingredient bonuses can raise the score to 100, but any manual mistake caps quality at Gold. Fresh batches with no manual stages, such as Chocolate Cake or Blackberry Cobbler, use the ingredient quality rank directly.
算算这一锅的成色|Estimate your dish's quality
填入各类工序的平均准确率；售价以你输入的普通品质基础售价估算。|Enter average accuracy for each stage type. Sale price is estimated from the normal-quality base price you provide.
这道菜的工序|Recipe stages
切配 + 控火|Prep + Heat
只有切配|Prep only
只有控火|Heat only
全自动料理|Fully automatic
原料品质档位（平均后向下取整）|Ingredient rank (average, rounded down)
普通 · 0 档|Normal · Rank 0
银星 · 1 档|Silver · Rank 1
金星 · 2 档|Gold · Rank 2
铱星 · 3 档|Iridium · Rank 3
切配平均准确率|Average prep accuracy
控火平均准确率|Average heat accuracy
普通品质基础售价（g）|Normal-quality base price (g)
本人的职业加成|Your profession bonus
无售价加成|No sale bonus
风味厨师／食养专家 +15%|Flavor Chef / Nutrition Expert +15%
招牌主厨 +30%|Signature Chef +30%
按新批次、无旧版加工记录计算。仅用于理解规则；其他 Mod 的价格调整不包含在内。|Assumes a fresh batch without legacy processing records. For understanding the rules; price changes from other mods are not included.
三倍浓缩咖啡固定为普通品质，|Triple Shot Espresso is always normal quality and 
不适用这套料理评分|does not use this scoring system
哪些原料不拉低平均品质？|Which ingredients do not lower average quality?
原料品质平均排除|The ingredient-quality average excludes ingredients with 
固定无星|fixed normal quality
的材料：面粉、糖、油、醋、大米、枫糖浆、墨汁、海草、绿藻、白藻、苔藓、山洞萝卜、姜、虚空蛋黄酱。|: Flour, Sugar, Oil, Vinegar, Rice, Maple Syrup, Squid Ink, Seaweed, Green Algae, White Algae, Moss, Cave Carrot, Ginger, and Void Mayonnaise.
普通品质的鱼、蔬果、奶、蛋仍按 0 档计入；蛋黄酱与奶酪等本来可以有品质的材料也照常计入。不要把「普通品质」误认为「不参与平均」。|Normal-quality fish, produce, milk, and eggs still count as rank 0. Mayonnaise, Cheese, and other ingredients that can have quality also count. Normal quality does not mean excluded.
按原料品质评星 · 第 |Ingredient quality · Rank 
 档| 
操作 |Technique 
 + 原料 | + Ingredients 
 分| points
全程精准|All perfect
普通|Normal
银星|Silver
金星|Gold
铱星|Iridium
厨艺经验从哪里来|Earning Cooking XP
项目|Action
基础经验|Base XP
每项必需备料|Each required prep stage
每项控火|Each heat stage
每段自动搅拌／烘焙／冷加工／组合|Each automatic mixing / baking / cooling / assembly stage
首次完成一道菜|First completion of a recipe
额外 +20|Bonus +20
首次做出一道菜的铱星成品|First Iridium result for a recipe
额外 +30|Bonus +30
结算时，基础工序经验先加上品质档位 ×2；如果手动工序全程精准，再将这一部分乘 1.5 并向下取整，最后叠加首次奖励。成品只结算一次，反复切分同一工序不能无限增加经验。|Add quality rank ×2 to base stage XP. If all manual stages were perfect, multiply that subtotal by 1.5 and round down, then add first-time bonuses. Each finished dish awards XP once; splitting a stage repeatedly cannot farm XP.
厨艺越高，备料切割线越慢、控火绿区越宽。等级成长不会增加每轮需要完成的目标线。|Higher Cooking levels slow prep lines and widen the heat minigame's green zone. The number of prep targets stays the same.
从生疏到熟练|From beginner to skilled cook
等级|Level
累计经验|Total XP
新获得的菜谱／选择|Recipe unlocked / Choice
选择节俭厨师或风味厨师|Choose Thrifty Chef or Flavor Chef
根据 5 级路线选择进阶职业|Choose an advanced profession for your level 5 branch
已经学会的原版菜谱仍然保留。上表是厨艺升级额外授予的菜谱，不表示其他菜只能靠厨艺等级解锁。|You keep vanilla recipes you already know. These are extra recipes awarded by Cooking levels; other recipes are not restricted to skill unlocks.
你想成为什么样的厨师？|What kind of chef will you be?
节俭厨师|Thrifty Chef
风味厨师|Flavor Chef
食材管家|Ingredient Manager
丰盛厨师|Generous Chef
招牌主厨|Signature Chef
食养专家|Nutrition Expert
5 级|Level 5
10 级|Level 10
想少消耗材料，可以沿节俭路线发展；常卖料理，可以选择招牌主厨；更常带饭去矿洞，则可以考虑食养专家。售价与恢复加成均有「本人自制」条件。|Choose the thrifty branch to save ingredients, Signature Chef to sell meals, or Nutrition Expert for food you take mining. Sale and recovery bonuses apply only to meals you cooked yourself.
完成时有35%概率返还1份价值最高的原料，保留品质。|On completion, a 35% chance to return one of the most valuable ingredients, preserving its quality.
本人自制料理的售价提高15%。|Your homemade dishes sell for 15% more.
返还1份价值最高原料的概率提高至70%，保留品质。|Raises the chance of returning one of the most valuable ingredients to 70%, preserving quality.
保留35%最高价值原料返还；另有25%概率多做1份同星级料理。|Keeps the 35% ingredient refund chance, plus a 25% chance for one extra serving of the same quality.
本人自制料理的售价总加成提高至30%。|Raises the total sale bonus for your homemade dishes to 30%.
保留售价+15%；食用本人自制料理时，体力和生命恢复量+25%。|Keeps the +15% sale bonus; your homemade meals restore 25% more energy and health when you eat them.
安装与进入厨房|Install and enter the kitchen
安装并使用 SMAPI。|Install and use SMAPI.
Mod 清单要求 SMAPI 4.1.0 或以上版本。安装方式见 |Requires SMAPI 4.1.0 or later. Installation instructions: 
SMAPI 官网|SMAPI website
安装 SpaceCore 依赖。|Install the SpaceCore dependency.
本版要求 SpaceCore 1.28.4 或以上版本。可前往 |Requires SpaceCore 1.28.4 or later. Visit the 
SpaceCore 发布页|SpaceCore download page
，并确认其与当前游戏版本匹配。| and check compatibility with your game version.
放入 ComplexCooking 文件夹。|Add the ComplexCooking folder.
使用你取得的对应版本安装文件，将含 manifest.json 与 ComplexCooking.dll 的文件夹放进 Mods，避免多套旧版并存。本站暂未提供 Mod 安装包下载。|Put the folder containing manifest.json and ComplexCooking.dll in Mods. Remove duplicate older versions. This site does not currently host the mod download.
通过 SMAPI 启动存档。|Launch your save through SMAPI.
农舍至少升级过一次。进入厨房，移开占用备料台区域的家具，再准备第一道菜。|Upgrade the farmhouse at least once. Enter the kitchen, clear furniture from the prep counter area, and prepare your first dish.
下厨时遇到的小问题|Kitchen questions
为什么厨房里没有新工位？|Why are the new stations missing?
检查农舍或小屋是否至少升级一次、备料台区域是否被家具或放置物占用。再检查 SMAPI 是否加载了 ComplexCooking 与所需版本的 SpaceCore。|Check that the farmhouse or cabin has been upgraded at least once and the prep counter area is clear. Check that SMAPI loaded ComplexCooking and the required SpaceCore version.
为什么点菜谱没有直接出菜？|Why doesn't clicking a recipe make the dish?
这正是 Mod 的玩法：菜谱菜单用于查看用料与流程图。需要准备原料，经过对应工位加工，按菜谱接取成品。|Recipes show ingredients and diagrams. Prepare the ingredients, process them at the required stations, and collect the dish as described.
为什么材料投不进去？会不会被扣掉？|Why can't I add an ingredient? Will it be consumed?
当前材料和数量必须仍能对应该工位、该阶段的一道合法配方。不合适的材料不会投入、不会扣除。先确认材料是否需要切配，以及你是否已经学会这道菜。|The ingredient and quantity must fit a valid recipe for the current station and stage. Invalid ingredients are not added or consumed. Check whether prep is needed and whether you know the recipe.
为什么空手拿不到完成的料理？|Why can't I collect food with empty hands?
锅中料理和生鱼片需要空盘接取；粉红蛋糕与冰箱冷却完成的食物直接取出。整盘入炉的料理沿用已有盘子。按对应菜谱的做法操作。|Pot dishes and Sashimi need an empty plate. Collect Pink Cake and cooled fridge food directly. Dishes baked on a plate keep that plate. Follow the individual recipe.
为什么 Q 没反应？|Why does Q do nothing?
请先靠近有正确材料、可进行手动加工的砧板或锅具。搅拌机、烤箱与冷加工自动完成。切配与控火使用 Q 启动。|Stand near a board or cookware containing the correct ingredients for a manual stage. Mixers, ovens, and cooling run automatically; Q starts prep and heat minigames.
锅拿走再放回，会清除失误吗？|Does picking up cookware erase mistakes?
不会。容器会保留原料、当前阶段、加工进度与判定成绩，拿起、换灶、关闭再打开窗口都不会清除失误。|No. Containers retain ingredients, stage, progress, and scores. Picking them up, changing burners, or reopening the window does not erase mistakes.
能和朋友联机做饭吗？|Can I cook with friends?
支持原版合作模式。每位玩家需安装相同版本的 Mod 和依赖；厨房与收藏由房主同步保存，暂不支持同机分屏。|Vanilla co-op is supported. Everyone needs matching mod and dependency versions. The host synchronizes and saves the kitchen and favorites. Split-screen is not supported.
三倍浓缩咖啡怎么制作？|How do I make Triple Shot Espresso?
手持咖啡×3，靠近已摆放的咖啡机并左键点击，即时得到三倍浓缩咖啡×1。咖啡机每天自动产咖啡的功能保留。|Hold 3 Coffee and left-click a nearby placed Coffee Maker to instantly make 1 Triple Shot Espresso. Daily automatic coffee production is preserved.
查看配方|View recipe
`);
  add(`
任意奶|Any Milk
任意蛋|Any Egg
任意鱼|Any Fish
冬根|Winter Root
午夜鲤鱼|Midnight Carp
南瓜|Pumpkin
咖啡|Coffee
土豆|Potato
墨西哥薄饼|Tortilla
大嘴鲈鱼|Largemouth Bass
大米|Rice
大麦粉|Wheat Flour
小麦粉|Wheat Flour
大黄|Rhubarb
太阳鱼|Sunfish
奶酪|Cheese
姜|Ginger
小白菜|Bok Choy
小龙虾|Crayfish
山洞萝卜|Cave Carrot
山药|Yam
普通蘑菇|Common Mushroom
杏子|Apricot
枫糖浆|Maple Syrup
椰子|Coconut
榛子|Hazelnut
比目鱼|Flounder
沙丁鱼|Sardine
油|Oil
洋蓟|Artichoke
海参|Sea Cucumber
海草|Seaweed
玉米|Corn
玉黍螺|Periwinkle
甘蓝菜|Kale
甜瓜|Melon
甜菜|Beet
白藻|White Algae
糖|Sugar
红叶卷心菜|Red Cabbage
绿藻|Green Algae
羊肚菌|Morel
芋头|Taro Root
芒果|Mango
花椰菜|Cauliflower
苋菜|Amaranth
苔藓|Moss
苹果|Apple
茄子|Eggplant
菠萝|Pineapple
萝卜|Radish
蒜|Garlic
蒲公英|Dandelion
蓝爵|Blue Jazz
蓝莓|Blueberry
蔓越莓|Cranberries
蕨菜|Fiddlehead Fern
虚空蛋黄酱|Void Mayonnaise
虞美人花|Poppy
虹鳟鱼|Rainbow Trout
虾|Shrimp
蚌|Mussel
蛋黄酱|Mayonnaise
蛤|Clam
蜗牛|Snail
螃蟹|Crab
西红柿|Tomato
辣椒|Hot Pepper
醋|Vinegar
野山葵|Wild Horseradish
野梅|Wild Plum
金枪鱼|Tuna
防风草|Parsnip
青豆|Green Bean
韭葱|Leek
香蕉|Banana
鱿鱼墨汁|Squid Ink
鱿鱼|Squid
鲑鱼|Salmon
鲤鱼|Carp
鲷鱼|Bream
鳗鱼|Eel
黑莓|Blackberry
龙虾|Lobster
`);
  add(`
两种蘑菇切配|Prep both mushrooms
与油放入平底锅控火|Add oil and cook in the frying pan
两种鱼备料|Prep both fish
与墨汁搅拌|Mix with Squid Ink
原盆入蒸屉控火|Steam in the same bowl using the heat minigame
冰箱下层冷却|Cool in the lower fridge compartment
直接取出|Collect directly
切好的鱼或现成生鱼片，与煮好的米饭、海草入盘。投料顺序不限。|Combine prepped fish or ready-made Sashimi, cooked rice, and Seaweed on a plate, in any order.
放齐材料搅拌|Add all ingredients and mix
南瓜切配|Prep the Pumpkin
与奶放入深锅控火|Add Milk and cook in the pot
土豆切配|Prep the Potato
与油放入深锅控火|Add Oil and cook in the pot
墨汁、粉和面后整形；与切碎番茄在砧板或台面合并包馅|Mix Squid Ink and Flour into dough, then shape; fill with chopped Tomato on the board or counter
大嘴鲈鱼切配|Prep the Largemouth Bass
与粉搅拌裹粉|Mix with Flour to coat
与油入深锅控火|Add Oil and cook in the pot
太阳鱼、鲷鱼切配|Prep the Sunfish and Bream
与小麦粉搅拌|Mix with Wheat Flour
装盘入炉|Plate and bake
奶、糖搅拌|Mix Milk and Sugar
姜×3切配|Prep 3 Ginger
与糖入深锅|Add Sugar to the pot
小白菜、洋蓟、蔓越莓切配；前两种煮好，与蔓越莓入盘。|Prep Bok Choy, Artichoke, and Cranberries. Cook the first two, then plate with the Cranberries.
小麦粉、糖、蛋搅拌|Mix Wheat Flour, Sugar, and Egg
入炉返还空盆|Bake; the empty bowl is returned
砧板整形|Shape on the cutting board
直接入炉|Bake directly
小麦粉搅拌成面团|Mix Wheat Flour into dough
小龙虾、蚌、玉黍螺、番茄切配|Prep Crayfish, Mussel, Periwinkle, and Tomato
山洞萝卜×2备料|Prep 2 Cave Carrots
与奶、糖入深锅|Add Milk and Sugar to the pot
山洞萝卜、冬根切配|Prep Cave Carrot and Winter Root
用空盘接齐|Collect all on an empty plate
整盘入炉|Bake the whole plate
山洞萝卜、蘑菇、甘蓝菜切配|Prep Cave Carrot, Mushroom, and Kale
山药、南瓜切配|Prep Yam and Pumpkin
山药切配|Prep the Yam
与糖入平底锅控火|Add Sugar and cook in the frying pan
平底锅控火|Cook in the frying pan
手持空盘接取|Collect while holding an empty plate
手持咖啡×3，左键点击咖啡机，立即得到三倍浓缩咖啡×1。咖啡机每天产咖啡的功能保留。|Hold 3 Coffee and left-click the Coffee Maker for 1 Triple Shot Espresso. Its daily coffee production is preserved.
端盆倒入平底锅控火|Pour the bowl into the frying pan and cook
椰子、菠萝、辣椒切配|Prep Coconut, Pineapple, and Hot Pepper
椰子、虾、普通蘑菇切配|Prep Coconut, Shrimp, and Common Mushroom
椰子备料，与米入蒸屉控火；芒果另切片|Prep Coconut and steam with Rice; slice Mango separately
榛子×3去壳|Shell 3 Hazelnuts
直接放入烤箱|Put directly in the oven
沙丁鱼×2切配后煎好，与现成薯饼入盘。|Prep and fry 2 Sardines, then plate with ready-made Hashbrowns.
洋蓟切配|Prep the Artichoke
与奶入深锅控火|Add Milk and cook in the pot
海参、蓝爵切配；海参煮好后，与蓝爵、薄饼入盘。|Prep Sea Cucumber and Blue Jazz. Cook the Sea Cucumber, then plate with Blue Jazz and Tortilla.
煎鸡蛋、奶、薯饼、薄煎饼放入空盘，齐料即完成。|Place Fried Egg, Milk, Hashbrowns, and Pancakes on an empty plate. The dish completes when all are added.
玉米切配|Prep the Corn
搅拌成面团|Mix into dough
倒入平底锅控火|Pour into the frying pan and cook
甜瓜切配|Prep the Melon
与小麦粉、糖、蛋搅拌|Mix with Wheat Flour, Sugar, and Egg
整盆入炉，返还空盆|Bake in the bowl; the empty bowl is returned
番茄、甜菜切配|Prep Tomato and Beet
番茄熬酱、茄子切片|Cook Tomato into sauce and slice Eggplant
入盘铺料|Layer on a plate
原盘入炉|Bake on the same plate
白藻×2放入深锅控火|Cook 2 White Algae in the pot
砧板切配|Prep on the cutting board
也可继续加米饭、海草做寿司。|You can also add Rice and Seaweed to make Maki Roll.
米、奶、糖入深锅控火|Cook Rice, Milk, and Sugar in the pot
端锅倒入冰箱下层冷却|Pour from the pot into the lower fridge compartment to cool
粉、糖和面|Mix Flour and Sugar into dough
加枫糖浆|Add Maple Syrup
粉、蛋搅拌后整形；蓝莓、糖另拌馅|Mix Flour and Egg, then shape; mix Blueberries and Sugar separately for filling
粉和面、整形；番茄熬酱、奶酪切碎|Mix and shape dough; cook Tomato sauce and chop Cheese
粉和面；玉黍螺切配后与虚空蛋黄酱拌馅|Mix dough; prep Periwinkle and mix with Void Mayonnaise for filling
粉和面；黑莓×2与糖拌馅|Mix dough; mix 2 Blackberries with Sugar for filling
两路入盘|Combine both on a plate
红叶卷心菜、萝卜切配|Prep Red Cabbage and Radish
绿藻×4放入深锅控火|Cook 4 Green Algae in the pot
芋头×4切配|Prep 4 Taro Roots
端锅倒入搅拌盆|Pour from the pot into a mixing bowl
花椰菜煮软、奶酪切碎|Boil Cauliflower until soft and chop Cheese
苔藓×20放入深锅控火|Cook 20 Moss in the pot
蔓越莓、苹果切配|Prep Cranberries and Apple
蔓越莓切配|Prep the Cranberries
与糖放入深锅控火|Add Sugar and cook in the pot
蔬菜切配后直接炒熟；面包单独切开，再一起入盘。|Prep and stir-fry the vegetables. Slice Bread separately, then combine on a plate.
蕨菜、蒜切配|Prep Fiddlehead Fern and Garlic
虞美人处理|Prep the Poppy
与小麦粉、糖搅拌|Mix with Wheat Flour and Sugar
虹鳟鱼切配|Prep the Rainbow Trout
与绿藻放入深锅控火|Add Green Algae and cook in the pot
虾切配、煮熟后冷却；番茄、野山葵另拌酱|Prep, boil, and cool Shrimp; mix Tomato and Wild Horseradish into sauce separately
蛤切配|Prep the Clam
蜗牛、蒜切配|Prep Snail and Garlic
端盆入炉|Put the bowl in the oven
蟹切配|Prep the Crab
与小麦粉、蛋搅拌|Mix with Wheat Flour and Egg
与油入平底锅控火|Add Oil and cook in the frying pan
辣椒、奶酪切配|Prep Hot Pepper and Cheese
野梅×2切配|Prep 2 Wild Plums
与粉、糖搅拌|Mix with Flour and Sugar
金枪鱼切配后煎好；卷心菜切配后与蛋黄酱搅拌，与薄饼入盘。|Prep and fry Tuna. Prep Cabbage and mix with Mayonnaise, then plate with Tortilla.
防风草切配|Prep the Parsnip
与奶、醋放入深锅控火|Add Milk and Vinegar and cook in the pot
防风草切配后煎好，与现成煎蛋卷入盘。|Prep and fry Parsnip, then plate with a ready-made Omelet.
青豆×2切配|Prep 2 Green Beans
面包、榛子、蔓越莓备料|Prep Bread, Hazelnut, and Cranberries
面包、番茄切配|Prep Bread and Tomato
与油入盘|Plate with Oil
面团整形后煮面；番茄另熬酱|Shape dough and boil noodles; cook Tomato into sauce separately
面团整形；南瓜与奶、糖做馅|Shape dough; make filling with Pumpkin, Milk, and Sugar
面团整形；大黄与糖做馅|Shape dough; make filling with Rhubarb and Sugar
面皮、熟馅入盘|Plate the dough and cooked filling
香蕉备料|Prep the Banana
与奶、糖搅拌|Mix with Milk and Sugar
鱿鱼切配|Prep the Squid
鲑鱼、苋菜、甘蓝菜切配|Prep Salmon, Amaranth, and Kale
鲤鱼×4一起切配|Prep 4 Carp together
搅拌成形|Mix and form
鳗鱼、辣椒切配|Prep Eel and Hot Pepper
鳗鱼切配|Prep the Eel
鱼片和油放入平底锅控火|Cook the fish fillets with Oil in the frying pan
龙虾切配|Prep the Lobster
深锅控火|Cook in the pot
持空盘接取|Collect with an empty plate
盘内组合|Combine on a plate
搅拌|Mix
切配|Prep
入盘|Plate
入炉|Bake
装盘|Plate
接取|Collect
`);
  add(`
新手入门 · 第一份煎鸡蛋|Getting Started · Your first Fried Egg
厨具与工位 · 拿放与装盘|Tools & Stations · Moving and plating
切配与控火 · 暂停规则|Prep & Heat · Pausing
料理品质 · 评星与售价试算|Food Quality · Scoring and price calculator
厨艺与职业 · 升级与奖励|Cooking Skill · Levels and rewards
开始 怎么做 新手 第一餐 操作|start how beginner first meal controls
厨具 锅 平底锅 深锅 怎么装盘 装盘 搅拌机 砧板 冰箱 蒸屉 烤箱 空盘|tools pan pot plating mixer cutting board fridge steamer oven plate
小游戏 切菜 刀工 控火 火候 操作 暂停 Q|minigame chopping prep heat controls pause Q
品质 铱星 金星 银星 售价 价格 分数 品质平均|quality iridium gold silver sale price score average calculator
厨艺 经验 升级 职业 风味 节俭 食养 主厨 管家 丰盛|cooking experience xp levels professions flavor thrifty nutrition signature manager generous
安装 SMAPI SpaceCore 看不到 无法 放不进 装盘 联机 咖啡 三倍浓缩咖啡 下载|install SMAPI SpaceCore missing cannot add plate multiplayer coffee espresso download
`);
  // Cards omit 任意 (Any); register the same shortened labels used by the renderer.
  for (const recipe of window.WIKI_DATA.recipes) {
    for (const ingredient of recipe.ingredients) {
      if (ingredient.name.startsWith('任意') && entries.has(ingredient.name)) {
        entries.set(ingredient.name.replace('任意', ''), entries.get(ingredient.name).replace(/^Any /, ''));
      }
    }
  }
  // Recipe names use the game's existing English catalog instead of literal translations.
  for (const recipe of window.WIKI_DATA.recipes) entries.set(recipe.name, recipe.english);
  // Detail pages remove the final full stop when splitting methods into steps.
  for (const [source, target] of [...entries]) {
    if (source.endsWith('。')) entries.set(source.slice(0, -1), target.replace(/\.$/, ''));
  }
  const keys = [...entries.keys()].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(keys.map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
  const translate = value => language === 'en' ? String(value).replace(pattern, key => entries.get(key)).replace(/。/g, '.').replace(/，/g, ', ').replace(/；/g, '; ').replace(/、/g, ', ').replace(/：/g, ': ').replace(/／/g, ' / ') : String(value);
  window.WIKI_I18N = { language, translate };

  const attributes = ['aria-label', 'alt', 'title', 'placeholder'];
  function localize(root) {
    if (language !== 'en') return;
    if (root.nodeType === Node.TEXT_NODE) {
      if (!root.parentElement?.closest('script,style,[data-language-switch]')) {
        const next = translate(root.nodeValue);
        if (next !== root.nodeValue) root.nodeValue = next;
      }
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE || root.matches('script,style,[data-language-switch]')) return;
    for (const name of attributes) if (root.hasAttribute(name)) {
      const original = root.getAttribute(name), next = translate(original);
      if (next !== original) root.setAttribute(name, next);
    }
    for (const child of root.childNodes) localize(child);
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    const select = document.querySelector('#language-select');
    select.value = language;
    select.addEventListener('change', () => {
      try { localStorage.setItem('cc-wiki-language', select.value); } catch {
        // Keep switching usable when persistent storage is disabled.
      }
      const next = new URL(location.href);
      next.searchParams.set('lang', select.value);
      location.assign(next.href);
    });
    localize(document.body);
    document.title = translate(document.title);
    const description = document.querySelector('meta[name="description"]');
    if (language === 'en') description.content = 'Complex Cooking Mod Wiki: ingredients and methods for 80 kitchen recipes and Triple Shot Espresso, cooking stations, minigames, quality, skills, and professions.';
    const observer = new MutationObserver(records => {
      observer.disconnect();
      for (const record of records) {
        if (record.type === 'childList') for (const node of record.addedNodes) localize(node);
        else localize(record.target);
      }
      document.title = translate(document.title);
      observe();
    });
    const observe = () => observer.observe(document.documentElement, {subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:attributes});
    observe();
  });
})();
