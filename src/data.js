export const CATEGORIES = [
  { id: 'makeup',     icon: '🌸', label: '彩妆趋势',     color: '#FF6B9D' },
  { id: 'technique',  icon: '💄', label: '妆容技巧',     color: '#F472B6' },
  { id: 'skincare',   icon: '🧴', label: '护肤新品',     color: '#34D399' },
  { id: 'medical',    icon: '🏥', label: '医美科普',     color: '#60A5FA' },
  { id: 'tools',      icon: '🔧', label: '美妆工具',     color: '#A78BFA' },
  { id: 'color',      icon: '🌈', label: '流行色系',     color: '#FBBF24' },
  { id: 'brand',      icon: '💼', label: '品牌动向',     color: '#F97316' },
  { id: 'newproduct', icon: '💄', label: '彩妆新品',     color: '#EC4899' },
  { id: 'celebrity',  icon: '✨', label: '明星妆容',     color: '#8B5CF6' },
  { id: 'mua',        icon: '👨‍🎨', label: '化妆师动向',   color: '#06B6D4' },
  { id: 'muacontent', icon: '🎭', label: '化妆师内容',   color: '#14B8A6' },
  { id: 'hot',        icon: '🔥', label: '美妆热点',     color: '#EF4444' },
  { id: 'meme',       icon: '🤣', label: '流行段子',     color: '#F59E0B' },
  { id: 'douyin',     icon: '📱', label: '抖音热议',     color: '#000000' },
  { id: 'vocab',      icon: '💬', label: '博主常用词',   color: '#7C3AED' },
]

export const DAILY_CONTENT = {
  makeup: [
    { title: '奶油肌底妆', heat: 98, desc: '哑光奶油感底妆席卷全网，轻薄透气不假白，打造自然无瑕"第二层皮肤"效果。', tags: ['#底妆', '#奶油肌', '#自然妆'], posts: '4.2万条笔记' },
    { title: '玻璃感眼影', heat: 91, desc: '透明质感眼影大热，水光闪烁"玻璃眼"效果，配合卧蚕打亮加分。', tags: ['#眼影', '#玻璃感', '#高光'], posts: '2.8万条笔记' },
    { title: '豆沙咬唇妆', heat: 82, desc: '复古豆沙色重回榜单，内圈晕染自然咬唇，显白百搭。', tags: ['#唇妆', '#豆沙色', '#复古'], posts: '1.9万条笔记' },
  ],
  technique: [
    { title: '开眼角画法', heat: 88, desc: '用眼线笔拉长眼形，适合单眼皮和内双，放大双眼效果显著。', tags: ['#眼线', '#单眼皮', '#眼形修饰'], posts: '3.1万条笔记' },
    { title: '卧蚕打亮技巧', heat: 79, desc: '用白色眼线笔或高光粉提亮卧蚕，打造电眼少女感。', tags: ['#卧蚕', '#打亮', '#减龄'], posts: '2.0万条笔记' },
    { title: '腮红拍打法', heat: 74, desc: '用手指拍打腮红代替刷子，更自然融入皮肤，营造健康血色感。', tags: ['#腮红', '#手指拍打', '#血色感'], posts: '1.5万条笔记' },
  ],
  skincare: [
    { title: 'SKII 新版神仙水', heat: 95, desc: '配方升级，加入酵母菁华成分，紧致效果更强，限量樱花瓶同步上市。', tags: ['#SKII', '#精华水', '#紧致'], posts: '5.6万条笔记' },
    { title: '兰蔻小黑瓶 Pro', heat: 87, desc: 'Pro 版新增烟酰胺成分，美白抗氧效果升级，适合25+熟龄肌。', tags: ['#兰蔻', '#精华', '#美白'], posts: '3.8万条笔记' },
    { title: '国货修丽可平替', heat: 81, desc: '半分一CE精华被测评博主盛赞为修丽可平替，价格相差10倍效果相近。', tags: ['#国货', '#平替', '#VC精华'], posts: '2.7万条笔记' },
  ],
  medical: [
    { title: '水光针 vs 玻尿酸', heat: 86, desc: '水光针补水保湿，玻尿酸填充塑形，功效完全不同，消费者常混淆。', tags: ['#水光针', '#玻尿酸', '#医美科普'], posts: '4.1万条笔记' },
    { title: '热玛吉真的有效吗', heat: 78, desc: '热玛吉射频紧肤原理解析，适合年龄段、维持时长、价格区间全攻略。', tags: ['#热玛吉', '#射频', '#抗衰'], posts: '3.3万条笔记' },
    { title: '刷酸入门指南', heat: 72, desc: '水杨酸、果酸、杏仁酸浓度怎么选？皮肤科医生给出专业建议。', tags: ['#刷酸', '#水杨酸', '#果酸'], posts: '2.9万条笔记' },
  ],
  tools: [
    { title: '气垫粉扑改造法', heat: 76, desc: '将普通粉扑剪成花瓣状，死角遮瑕更到位，博主亲测有效。', tags: ['#气垫', '#粉扑改造', '#遮瑕'], posts: '1.8万条笔记' },
    { title: '硅胶美妆蛋测评', heat: 68, desc: '硅胶美妆蛋 vs 普通海绵蛋，哪个更省粉？真实上脸对比。', tags: ['#美妆蛋', '#硅胶', '#底妆工具'], posts: '1.4万条笔记' },
    { title: '电动粉底刷新品', heat: 63, desc: 'AMIRO 新出电动粉底刷，振动上粉均匀服帖，适合厚底妆。', tags: ['#粉底刷', '#电动', '#上妆工具'], posts: '1.1万条笔记' },
  ],
  color: [
    { title: '杏色系全面霸屏', heat: 92, desc: '杏色腮红+杏色唇釉+杏色眼影三件套，温柔氛围感满分，全年龄段适用。', tags: ['#杏色', '#氛围感', '#大地色'], posts: '4.7万条笔记' },
    { title: '薄荷绿美甲流行', heat: 85, desc: '薄荷绿从美甲延伸到眼影，清凉夏日配色成为年轻女生最爱。', tags: ['#薄荷绿', '#夏日妆', '#美甲'], posts: '3.5万条笔记' },
    { title: '巧克力棕复兴', heat: 77, desc: '深棕色调强势回归，巧克力棕唇色、棕色眼线笔成秋冬必备。', tags: ['#巧克力棕', '#深棕', '#秋冬色'], posts: '2.6万条笔记' },
  ],
  brand: [
    { title: '雅诗兰黛战略调整', heat: 89, desc: '雅诗兰黛集团宣布加大中国市场投入，新增5个本土品牌合作，押注国货联名。', tags: ['#雅诗兰黛', '#品牌动向', '#中国市场'], posts: '3.9万条笔记' },
    { title: 'Dior 美妆新掌门', heat: 81, desc: 'Dior Beauty 任命新创意总监，首个系列聚焦"裸感高定"，秋季发布。', tags: ['#Dior', '#高定美妆', '#品牌战略'], posts: '2.8万条笔记' },
    { title: '完美日记港股计划', heat: 74, desc: '逸仙电商披露港股上市计划，旗下完美日记、小奥汀等品牌估值受关注。', tags: ['#完美日记', '#国货', '#上市'], posts: '2.0万条笔记' },
  ],
  newproduct: [
    { title: 'YSL 黑鸦片唇釉', heat: 94, desc: '全新黑鸦片系列唇釉12色上市，丝绒质地显色度极高，定价480元。', tags: ['#YSL', '#唇釉', '#新品'], posts: '5.1万条笔记' },
    { title: '花西子苗族印记 2.0', heat: 87, desc: '花西子苗族印记系列二代升级，加入非遗刺绣元素，联名礼盒已开启预售。', tags: ['#花西子', '#国货', '#限定'], posts: '3.7万条笔记' },
    { title: 'MAC × 迪士尼联名', heat: 80, desc: 'MAC 携手迪士尼推出白雪公主系列，口红、眼影盘、腮红三件套，限量发售。', tags: ['#MAC', '#迪士尼', '#联名'], posts: '2.5万条笔记' },
  ],
  celebrity: [
    { title: '赵丽颖复出妆容', heat: 97, desc: '赵丽颖复出活动造型引爆全网，粉底质感+哑光红唇，被指定为"女神妆"。', tags: ['#赵丽颖', '#红毯妆', '#复原教程'], posts: '7.2万条笔记' },
    { title: '迪丽热巴机场妆', heat: 91, desc: '热巴机场素颜感妆容走红，卧蚕腮红+杏色唇膏，清爽不失精致。', tags: ['#迪丽热巴', '#机场妆', '#素颜感'], posts: '5.8万条笔记' },
    { title: '春晚明星妆复盘', heat: 85, desc: '今年春晚各位女明星妆容逐一解析，谁的造型最出圈？博主投票结果公布。', tags: ['#春晚', '#明星妆', '#复盘'], posts: '4.3万条笔记' },
  ],
  mua: [
    { title: 'Linda Cantello 离职', heat: 83, desc: 'Giorgio Armani 首席化妆师 Linda Cantello 宣布退休，接班人未定，业界关注。', tags: ['#化妆师', '#Armani', '#行业动态'], posts: '2.1万条笔记' },
    { title: 'Lisa Eldridge 新书', heat: 76, desc: '国际顶级MUA Lisa Eldridge 出版新书《Face Forward》，中文版即将引进。', tags: ['#LisaEldridge', '#化妆师', '#新书'], posts: '1.7万条笔记' },
    { title: '毛戈平北京大师班', heat: 71, desc: '毛戈平于6月8日开设线下大师班，名额30人，售票2小时内售罄。', tags: ['#毛戈平', '#大师班', '#线下活动'], posts: '1.4万条笔记' },
  ],
  muacontent: [
    { title: '骆王宇｜奶油肌全流程', heat: 90, desc: '骆王宇发布45分钟奶油肌全套教程，从底妆到高光逐步拆解，评论区求合集。', tags: ['#骆王宇', '#底妆教程', '#奶油肌'], posts: '3.6万条笔记' },
    { title: '深夜徐老师｜精华横评', heat: 84, desc: '横评16款热销精华，深夜徐老师用仪器实测吸收率，结论出人意料。', tags: ['#深夜徐老师', '#精华测评', '#护肤'], posts: '2.9万条笔记' },
    { title: 'PONY｜春季仿妆教程', heat: 78, desc: 'PONY 仿妆知名女演员，完成度引发粉丝惊叹，视频当日破200万播放。', tags: ['#PONY', '#仿妆', '#教程'], posts: '2.2万条笔记' },
  ],
  hot: [
    { title: '某品牌成分造假风波', heat: 96, desc: '博主曝光某国产护肤品牌宣传成分含量与实测相差8倍，品牌方已发声明回应。', tags: ['#成分党', '#品牌争议', '#美妆热点'], posts: '12万条笔记' },
    { title: '韩妆在华销量断崖下滑', heat: 88, desc: '多家韩妆品牌Q1财报显示中国市场销量同比下滑35%，国货趁势扩张。', tags: ['#韩妆', '#国货崛起', '#市场趋势'], posts: '4.8万条笔记' },
    { title: '美妆直播造假被罚', heat: 82, desc: '某头部美妆主播因虚假宣传被开罚单，罚款金额创直播电商行业新高。', tags: ['#直播', '#美妆主播', '#虚假宣传'], posts: '6.3万条笔记' },
  ],
  meme: [
    { title: '"我就是那个素颜也好看的人"', heat: 93, desc: '抖音爆款段子：化妆1小时出门被朋友说"你今天没化妆吧"，哭笑不得。配合BGM《好日子》使用。', tags: ['#段子', '#化妆', '#反差'], posts: '8.1万条笔记' },
    { title: '"护肤品用完了才是真爱"', heat: 86, desc: '反向种草文学流行：只有护肤品被用到见底才算真正推荐，收藏夹不算数。', tags: ['#护肤', '#种草文学', '#真实评测'], posts: '5.5万条笔记' },
    { title: '"色号刺客"梗重出江湖', heat: 79, desc: '博主色号与素人实际上色反差过大引发共鸣，"色号刺客"梗二次传播爆发。', tags: ['#色号刺客', '#唇色', '#网络梗'], posts: '3.9万条笔记' },
  ],
  douyin: [
    { title: '#她的妆容让我破防了', heat: 95, desc: '用户自发分享让自己情绪崩溃的精致妆容，高质量内容集中爆发，话题播放超10亿。', tags: ['#破防', '#精致妆容', '#情感共鸣'], posts: '话题10.2亿播放' },
    { title: '#素颜挑战 第三季', heat: 89, desc: '网红博主发起第三季素颜挑战，素颜自拍配合特效，引发全网模仿浪潮。', tags: ['#素颜挑战', '#全民参与', '#美妆话题'], posts: '话题7.8亿播放' },
    { title: '#古风妆容还原', heat: 83, desc: '仿古代壁画、影视剧还原古风妆容兴起，95后、00后为主要创作群体。', tags: ['#古风妆', '#国风', '#文化热点'], posts: '话题5.4亿播放' },
  ],
  vocab: [
    { title: '本期常用词速查', heat: 99, desc: '', tags: [], posts: '每日更新', vocab: [
      { word: '显白', def: '让皮肤看起来更白皙，常用于色号、妆容推荐' },
      { word: '上脸', def: '产品在脸上实际使用的效果，区别于色板展示' },
      { word: '烂脸', def: '用了某产品后皮肤爆痘/过敏，否定该产品' },
      { word: '闷痘', def: '产品过于滋润或油腻，堵塞毛孔引发痘痘' },
      { word: '平替', def: '功效相近但价格更低的替代产品' },
      { word: '成分党', def: '重视护肤品成分表、追求科学护肤的群体' },
      { word: '氛围感', def: '整体妆容/造型带来的特定情绪或风格感觉' },
      { word: '内卷', def: '美妆博主竞争激烈、内容同质化严重' },
      { word: '种草', def: '推荐某产品，让人产生购买欲望' },
      { word: '拔草', def: '打消对某产品的购买欲，通常源于负面测评' },
      { word: '白月光', def: '心中最完美的、无法被替代的那款产品' },
      { word: '朱砂痣', def: '戒掉又重新购买的产品，对应"白月光"' },
    ]},
  ],
}

export const bloggers = [
  { id: 1, name: '骆王宇',     platform: '抖音',  followers: '2318万', avatar: '🌸', tag: '彩妆达人',   verified: true,  color: '#FF6B9D' },
  { id: 2, name: '深夜徐老师', platform: '微博',  followers: '1205万', avatar: '💄', tag: '护肤专家',   verified: true,  color: '#C084FC' },
  { id: 3, name: 'PONY朴惠敏', platform: '小红书', followers: '986万', avatar: '✨', tag: '仿妆大神',   verified: true,  color: '#F59E0B' },
  { id: 4, name: '陈列室',     platform: '小红书', followers: '845万', avatar: '🎀', tag: '日系妆容',   verified: false, color: '#34D399' },
  { id: 5, name: '毛戈平',     platform: '抖音',  followers: '1560万', avatar: '👑', tag: '专业造型',   verified: true,  color: '#60A5FA' },
  { id: 6, name: '一只璐',     platform: '抖音',  followers: '672万',  avatar: '🌺', tag: '平价好物',   verified: false, color: '#FB7185' },
]

/* 推荐博主库：搜索/一键添加候选 */
export const SUGGESTED_BLOGGERS = [
  { id: 101, name: '化妆师Tim',    platform: '抖音',  followers: '1120万', avatar: '🎨', tag: '明星化妆师', verified: true,  color: '#8B5CF6' },
  { id: 102, name: '大魔王Caro',   platform: '小红书', followers: '538万',  avatar: '👹', tag: '欧美妆',     verified: true,  color: '#EF4444' },
  { id: 103, name: '雪梨Cherie',   platform: '微博',  followers: '402万',  avatar: '🍒', tag: '甜美日常',   verified: false, color: '#FB7185' },
  { id: 104, name: 'Benny董子初',  platform: '抖音',  followers: '896万',  avatar: '💫', tag: '护肤科普',   verified: true,  color: '#06B6D4' },
  { id: 105, name: '程十安an',     platform: '小红书', followers: '1450万', avatar: '🌷', tag: '学生党彩妆', verified: true,  color: '#F472B6' },
  { id: 106, name: 'Kakakaoo-',    platform: '小红书', followers: '321万',  avatar: '🦋', tag: '氛围感妆容', verified: false, color: '#A78BFA' },
  { id: 107, name: '化妆师肖嘉颖',  platform: '抖音',  followers: '764万',  avatar: '✂️', tag: '新娘造型',   verified: true,  color: '#14B8A6' },
  { id: 108, name: '小猪姐姐',     platform: '微博',  followers: '289万',  avatar: '🐷', tag: '平价测评',   verified: false, color: '#FBBF24' },
]

const AVATAR_POOL = ['🌟', '🌹', '🦄', '🍑', '🌻', '💐', '🎀', '🌼', '🪷', '🍓']
const COLOR_POOL = ['#FF6B9D', '#C084FC', '#F59E0B', '#34D399', '#60A5FA', '#FB7185', '#8B5CF6', '#14B8A6']

/* 根据用户输入生成一个自定义博主 */
export const createCustomBlogger = (name, platform) => ({
  id: Date.now(),
  name: name.trim(),
  platform: platform || '抖音',
  followers: '—',
  avatar: AVATAR_POOL[Math.floor(Math.random() * AVATAR_POOL.length)],
  tag: '自定义关注',
  verified: false,
  color: COLOR_POOL[Math.floor(Math.random() * COLOR_POOL.length)],
})

export const generateFeed = () => [
  { id: 1, blogger: bloggers[0], title: '奶油肌底妆全教程！45分钟手把手', preview: '从打底、遮瑕到定妆，零基础也能跟上...', likes: '2.3万', comments: '1847', time: '2小时前', platform: '抖音',  isHot: true,  image: '🎨', cat: '妆容技巧' },
  { id: 2, blogger: bloggers[1], title: '横评16款精华，用仪器实测吸收率', preview: '结果出人意料，某大牌垫底，某国货逆袭...', likes: '1.8万', comments: '2341', time: '5小时前', platform: '微博',  isHot: true,  image: '🧪', cat: '护肤新品' },
  { id: 3, blogger: bloggers[2], title: '挑战还原古代壁画妆容！全程教学', preview: '本期仿妆难度系数五颗星，跟着我一步步来...', likes: '5.6万', comments: '8923', time: '1小时前', platform: '小红书', isHot: true,  image: '🎭', cat: '明星妆容' },
  { id: 4, blogger: bloggers[4], title: '毛戈平大师班｜专业化妆师底妆秘籍', preview: '从事彩妆行业30年，今天分享最核心底妆技巧...', likes: '4.1万', comments: '5612', time: '3小时前', platform: '抖音',  isHot: false, image: '👨‍🎨', cat: '化妆师内容' },
  { id: 5, blogger: bloggers[3], title: '小众日系品牌安利！千元内平替选择', preview: '日本留学3年找来的宝藏品牌，国内基本买不到...', likes: '9876', comments: '2134', time: '4小时前', platform: '小红书', isHot: false, image: '🌸', cat: '彩妆趋势' },
  { id: 6, blogger: bloggers[5], title: '平价好物合集｜50元内彩妆神器', preview: '穷鬼套装来了！这些产品真的不输大牌...', likes: '3.2万', comments: '4521', time: '6小时前', platform: '抖音',  isHot: false, image: '💰', cat: '美妆热点' },
]
