// 原有提示词数组
const originalPrompts = {
  en: [
    // 🔮 科幻 / 未来感
    "A cyberpunk samurai in neon-lit Tokyo, cinematic lighting, ultra detailed, 8K",
    "Futuristic city skyline at sunset, vaporwave style, glowing buildings, reflections, 4K",
    "An astronaut meditating inside a zero-gravity space station, volumetric lighting, hyperrealistic",
    "A sleek robot bartender in a glowing lounge, chrome surfaces, cinematic mood",
    "Alien desert landscape with three suns, surreal style, vivid colors",
  
    // 🌿 奇幻 / 梦幻风
    "A floating castle above the clouds, fantasy style, soft light, ethereal atmosphere",
    "A forest spirit glowing in the mist, Studio Ghibli style, soft pastel colors",
    "A dragon flying over frozen mountains, epic fantasy, dark dramatic lighting",
    "Enchanted mushrooms glowing at night in a magical forest, bioluminescent, 4K",
    "A sorceress casting spells in a storm, backlit silhouette, powerful energy glow",
  
    // 👧 人物肖像类
    "A futuristic female warrior with glowing tattoos, side light, sharp focus",
    "Portrait of a celestial queen with star-filled hair, oil painting style",
    "A girl floating underwater surrounded by jellyfish, dreamy surreal lighting",
    "Steampunk inventor in workshop with glowing gadgets, intricate details",
    "A dark elf with golden eyes and silver armor, fantasy portrait",
  
    // 🌌 宏大场景 / 史诗构图
    "A spaceship approaching a giant glowing ringworld, cinematic sci-fi concept",
    "A lone figure walking on sand dunes under giant moons, epic scale",
    "An ancient temple hidden in a jungle, sunlight rays breaking through trees",
    "A knight standing at the edge of a burning battlefield, backlight silhouette",
    "A galaxy forming in the shape of a phoenix, cosmic surreal style",
  
    // 🐾 可爱 / 奇妙动物类
    "A panda chef cooking in a tiny forest kitchen, cozy warm style",
    "A golden retriever in astronaut suit on Mars, cartoonish",
    "A cat wearing a samurai helmet under cherry blossoms, 3D render",
    "A baby dragon curled up in a teacup, fantasy illustration",
    "A whale flying in the sky with balloons, dreamlike children's book style",
  
    // 🏙 城市/建筑类
    "Neon-lit street alley with steam rising, cinematic noir mood",
    "A cafe on the moon with Earth in the background, minimalist sci-fi",
    "Ancient Chinese village at dusk, glowing lanterns, water reflections",
    "Futuristic vertical city tower, cross-section view, glowing rooms",
    "Abandoned shopping mall overtaken by jungle, post-apocalyptic",
  
    // 🌀 抽象 / 风格化 / 实验
    "Colorful abstract portrait made of liquid paint, splatter style",
    "A face made of fractal glass shards, digital surrealism",
    "Musical notes floating in a 3D space, glowing lines and particles",
    "A dream collapsing into glitch pixels, vaporwave + noise style",
    "A wireframe deer inside a digital forest, neon synthwave theme",
  
    // 🍽️ 日常 + 超现实组合
    "A tea party floating in the sky on clouds, soft pastel colors",
    "A vending machine in the middle of the desert, photographic realism",
    "Sushi rolls orbiting a miniature planet, food fantasy",
    "A giant koi fish swimming through city streets after rain",
    "A bookshelf where books are tiny houses, magical realism",
  
    // 🏔 自然 / 极端环境
    "Thunderstorm over lavender fields, lightning frozen in time",
    "Volcano erupting during snowstorm, cinematic wide angle",
    "Deep ocean canyon glowing with bioluminescent coral, undersea realism",
    "Ice cave reflecting aurora borealis, sharp detail",
    "Mirage city in middle of sandstorm, minimalist concept",
  
    // 🧘‍♂️ 治愈系 / 轻柔风
    "A girl reading under a sakura tree during golden hour",
    "A fox sleeping on a mossy rock in the forest, soft focus",
    "Mountain cabin in the rain, viewed through foggy window",
    "A rabbit sitting in a teacup garden, cozy watercolor style",
    "Floating lanterns over still lake at night, calm and peaceful"
  ],
  zh: [
    // 🔮 科幻 / 未来感
    "霓虹灯照耀的东京中的赛博朋克武士，电影级光效，超高细节，8K",
    "日落时分的未来城市天际线，蒸汽波风格，发光的建筑，倒影，4K",
    "在零重力空间站内冥想的宇航员，体积光效果，超写实风格",
    "在发光的酒廊中一位光滑的机器人调酒师，镀铬表面，电影感氛围",
    "三个太阳的外星沙漠景观，超现实风格，鲜艳色彩",
  
    // 🌿 奇幻 / 梦幻风
    "云层之上的浮空城堡，奇幻风格，柔和光线，空灵氛围",
    "在薄雾中发光的森林精灵，吉卜力工作室风格，柔和粉彩色",
    "飞越冰冻山脉的龙，史诗奇幻，暗黑戏剧光效",
    "夜晚魔法森林中发光的魔幻蘑菇，生物发光，4K",
    "在风暴中施法的女巫，背光剪影，强大的能量光芒",
  
    // 👧 人物肖像类
    "带有发光纹身的未来女战士，侧光，锐利对焦",
    "一位头发中充满星星的天界女王肖像，油画风格",
    "漂浮在水下被水母环绕的女孩，梦幻超现实光效",
    "工作室中的蒸汽朋克发明家，带有发光的小设备，精致细节",
    "金色眼睛和银色盔甲的黑暗精灵，奇幻肖像",
  
    // 🌌 宏大场景 / 史诗构图
    "接近巨大发光环世界的宇宙飞船，电影级科幻概念",
    "巨型月亮下在沙丘上行走的孤独身影，宏大比例",
    "隐藏在丛林中的古代神庙，阳光透过树木的光芒",
    "站在燃烧战场边缘的骑士，背光剪影",
    "以凤凰形状形成的星系，宇宙超现实风格",
  
    // 🐾 可爱 / 奇妙动物类
    "在微型森林厨房烹饪的熊猫厨师，温馨暖心风格",
    "穿宇航服在火星上的金毛猎犬，卡通风格",
    "樱花树下戴着武士头盔的猫，3D渲染",
    "在茶杯中卷曲的小龙，幻想插画",
    "带着气球在天空中飞行的鲸鱼，梦幻儿童书籍风格",
  
    // 🏙 城市/建筑类
    "带有升腾蒸汽的霓虹灯照亮的街巷，电影黑色情调",
    "月球上的咖啡馆，背景是地球，极简科幻",
    "黄昏时分的中国古代村落，发光灯笼，水面倒影",
    "未来垂直城市塔，剖面图，发光房间",
    "被丛林吞没的废弃购物中心，末日后风格",
  
    // 🌀 抽象 / 风格化 / 实验
    "由液态颜料制成的多彩抽象肖像，飞溅风格",
    "由分形玻璃碎片组成的面孔，数字超现实主义",
    "在3D空间中漂浮的音符，发光线条和粒子",
    "崩溃成故障像素的梦境，蒸汽波+噪点风格",
    "数字森林中的线框鹿，霓虹合成波主题",
  
    // 🍽️ 日常 + 超现实组合
    "在云朵上的天空中漂浮的茶会，柔和粉彩色",
    "沙漠中央的自动售货机，摄影级写实",
    "环绕微型行星的寿司卷，食物幻想",
    "雨后在城市街道游泳的巨型锦鲤鱼",
    "书是微型房屋的书架，魔幻现实主义",
  
    // 🏔 自然 / 极端环境
    "薰衣草田上的雷暴，定格中的闪电",
    "暴风雪中爆发的火山，电影级广角",
    "深海峡谷中发光的生物发光珊瑚，海底写实",
    "反射极光的冰洞，锐利细节",
    "沙尘暴中的海市蜃楼城市，极简概念",
  
    // 🧘‍♂️ 治愈系 / 轻柔风
    "黄金时段在樱花树下阅读的女孩",
    "森林中睡在苔藓石头上的狐狸，柔焦",
    "雨中的山间小屋，透过雾蒙蒙的窗户观看",
    "坐在茶杯花园里的兔子，温馨水彩风格",
    "夜晚平静湖面上漂浮的灯笼，宁静和平"
  ]
};

// 新提供的提示词
const newPrompts = {
  en: [
    "a majestic lion wearing a crown, cinematic lighting, ultra detailed, trending on ArtStation",
    "a futuristic city skyline at sunset, digital illustration, 8K, vaporwave style",
    "a mystical forest with glowing mushrooms, fantasy landscape, dramatic lighting",
    "a cyberpunk samurai under neon lights, night rain, detailed character design",
    "an astronaut floating in a surreal dreamscape, watercolor texture, soft light",
    "a dreamy castle in the clouds, fantasy matte painting, golden hour lighting",
    "a realistic portrait of a woman with galaxy hair, hyper detailed, 4K",
    "an enchanted library with flying books, warm lighting, magical atmosphere",
    "a robot painting on canvas in a garden, whimsical illustration, sunny day",
    "a retro diner in the desert at dusk, cinematic vibes, pastel tones",
    "a magical deer in the snow forest, glowing antlers, mystical style",
    "a floating island with waterfalls and villages, digital painting, rich color",
    "a neon dragon flying over a futuristic city, concept art, high contrast",
    "a samurai fox with cherry blossoms, Japanese style, artistic ink",
    "a steampunk owl with gears and goggles, bronze tones, 3D render style",
    "a colorful underwater world with jellyfish, fantasy art, glowing style",
    "a lonely cabin in the woods under the aurora, northern lights, cold colors",
    "a girl riding a giant koi fish in the sky, dreamy Chinese painting style",
    "a moonlit desert with a glowing portal, science fantasy, cinematic look",
    "a fantasy marketplace with alien vendors, colorful chaos, concept art",
    "a baby elephant in a field of sunflowers, cheerful watercolor style",
    "a giant whale swimming through clouds, surreal art, dreamy atmosphere",
    "a medieval castle on a cliff during storm, moody painting, dark fantasy",
    "a forest spirit made of leaves and moss, character design, soft tones",
    "a glowing phoenix reborn from lava, epic scene, intense fire",
    "a tiny astronaut walking on a slice of orange, humorous surrealism",
    "a magician casting a spell in a mirror room, reflection effect, fantasy lighting",
    "a high-tech hacker girl with holographic UI, cyber style, blue tones",
    "a time traveler's workshop, steampunk gadgets, cozy lighting",
    "a neon-lit street in rainy Tokyo, photo-realistic, moody",
    "a fairytale bakery run by cats, charming interior, sweet colors",
    "a space pirate ship flying through asteroid belt, action scene",
    "a child and robot watching stars, heartwarming illustration, Pixar style",
    "a wolf howling at a pixel moon, retro pixel art style",
    "a sci-fi corridor with deep perspective, high detail, blue light",
    "a garden of oversized flowers and insects, micro world, fantasy",
    "a knight made of crystal, glowing light, elegant fantasy art",
    "a mysterious mirror floating in the forest, magical realism",
    "a witch flying over a candy village, pastel color, children's book art",
    "a windmill field with floating lanterns at night, soft glow",
    "a panda astronaut eating noodles on the moon, fun cartoon style",
    "a train crossing the sky bridge, clouds and stars, dream journey",
    "a dancing flame spirit in the dark cave, contrast lighting, concept art",
    "a futuristic fashion runway in space, chrome and neon",
    "a fairy garden with tiny houses in teacups, cozy magical art",
    "a jellyfish spaceship hovering over the ocean, sci-fi watercolor",
    "a ghostly fox running through misty bamboo forest, Japanese ink style",
    "a dream library inside a tree, spiral staircase, magical realism",
    "a mechanical bird nest made of wires, techno-organic fusion",
    "a giant robot helping a farmer in the rice field, warm rural tone"
  ],
  zh: [
    "一只戴着王冠的雄狮，电影感光影，超高细节，ArtStation 热门风格",
    "夕阳下的未来城市天际线，数字插画，8K，蒸汽波风格",
    "发光蘑菇点缀的神秘森林，奇幻场景，戏剧性光线",
    "霓虹灯下的赛博朋克武士，雨夜，人物细节丰富",
    "漂浮在梦境中的宇航员，水彩质感，柔光风格",
    "云中的梦幻城堡，奇幻插画，金色阳光照明",
    "银河头发的女性真实人像，超高细节，4K品质",
    "飞书魔法图书馆，温暖灯光，奇幻氛围",
    "花园中作画的机器人，童话插图，阳光明媚",
    "沙漠黄昏的复古餐厅，电影氛围，粉彩色调",
    "雪地森林中的魔法鹿，发光鹿角，梦幻风格",
    "漂浮的瀑布小岛，数字绘画，色彩丰富",
    "飞越未来城市的霓虹巨龙，概念艺术，对比强烈",
    "樱花中的武士狐狸，日本水墨风，艺术感十足",
    "带齿轮和护目镜的蒸汽朋克猫头鹰，青铜色，3D风格",
    "水母环绕的彩色海底世界，幻想艺术，发光风",
    "极光下森林小屋，寒冷色调，安静氛围",
    "女孩骑着巨型锦鲤飞行，国风水墨，梦幻色彩",
    "月光沙漠中的发光传送门，科幻奇幻风格，电影质感",
    "异星集市，色彩斑斓，充满幻想，概念插图风",
    "向日葵田中的小象，明快水彩风格",
    "云中游泳的鲸鱼，超现实艺术，梦幻氛围",
    "暴风雨中峭壁上的中世纪城堡，黑暗幻想风",
    "由树叶和苔藓构成的森林精灵，人物设定，柔和色调",
    "从岩浆中重生的凤凰，史诗场景，烈焰光效",
    "站在橙子上的迷你宇航员，幽默超现实风",
    "镜子房间中施法的魔法师，反射效果，奇幻灯光",
    "拥有全息界面的高科技黑客女孩，赛博风，蓝色调",
    "时间旅行者的工作间，蒸汽装置，温馨光影",
    "雨夜东京的霓虹街道，照片写实风，氛围浓厚",
    "由猫经营的童话烘焙店，可爱室内，甜美配色",
    "穿越小行星带的太空海盗船，动作场面",
    "孩子和机器人一起仰望星空，温馨插画,皮克斯风格",
    "狼对像素月嚎叫，复古像素艺术风格",
    "充满纵深的科幻走廊，高细节，蓝光渲染",
    "巨型花草与昆虫的花园，微观幻想世界",
    "水晶构成的骑士，发光效果，优雅幻想插画",
    "森林中漂浮的神秘镜子，魔幻写实主义",
    "女巫飞越糖果村庄，粉色童书风格",
    "夜空下的风车田，飘动的灯笼，柔和光晕",
    "在月球上吃面的小熊猫宇航员，趣味卡通风",
    "跨越天空桥的列车，云与星辰，梦幻旅程",
    "黑暗洞穴中跳舞的火焰精灵，对比强烈，概念风格",
    "太空中的未来时尚秀，金属色与霓虹风",
    "仙子花园中的茶杯小屋，温馨魔法风插画",
    "海面上漂浮的水母飞船，科幻水彩画风",
    "竹林迷雾中奔跑的幽灵狐狸，日本水墨风",
    "树中藏书馆，螺旋楼梯，魔法写实风格",
    "由电线构成的机械鸟巢，技术有机融合",
    "巨型机器人帮农夫插秧，乡村暖色调"
  ]
};

// 导出函数，返回合并后的所有提示词
export const getAllPrompts = () => {
  return {
    en: [...originalPrompts.en, ...newPrompts.en],
    zh: [...originalPrompts.zh, ...newPrompts.zh]
  };
};

// 导出函数，返回原有提示词
export const getOriginalPrompts = () => {
  return originalPrompts;
};

// 导出函数，返回新提示词
export const getNewPrompts = () => {
  return newPrompts;
};

// 为了兼容现有代码，保留原来的导出（使用 getAllPrompts 的结果）
export const curatedPrompts = newPrompts;
export const curatedPromptsZh = newPrompts.zh; 