// 归一化后的示例数据（结构 = contract.js 中的 TrendItem / Blogger / FeedPost）
export const MOCK_TRENDS = [
  { categoryId: 'makeup',     title: '奶油肌底妆',     heat: 98, desc: '哑光奶油感底妆席卷全网，轻薄透气不假白。', tags: ['#底妆', '#奶油肌', '#自然妆'], posts: '4.2万条笔记' },
  { categoryId: 'makeup',     title: '玻璃感眼影',     heat: 91, desc: '透明质感眼影大热，水光闪烁玻璃眼效果。',   tags: ['#眼影', '#玻璃感', '#高光'],   posts: '2.8万条笔记' },
  { categoryId: 'technique',  title: '开眼角画法',     heat: 88, desc: '用眼线笔拉长眼形，适合单眼皮和内双。',     tags: ['#眼线', '#单眼皮'],           posts: '3.1万条笔记' },
  { categoryId: 'skincare',   title: 'SKII 新版神仙水', heat: 95, desc: '配方升级加入酵母菁华，紧致效果更强。',    tags: ['#SKII', '#精华水'],          posts: '5.6万条笔记' },
  { categoryId: 'medical',    title: '水光针 vs 玻尿酸', heat: 86, desc: '水光针补水保湿，玻尿酸填充塑形，功效不同。', tags: ['#水光针', '#医美科普'],      posts: '4.1万条笔记' },
  { categoryId: 'color',      title: '杏色系全面霸屏',   heat: 92, desc: '杏色腮红+唇釉+眼影三件套，温柔氛围感。',  tags: ['#杏色', '#氛围感'],          posts: '4.7万条笔记' },
  { categoryId: 'brand',      title: '雅诗兰黛战略调整', heat: 89, desc: '加大中国市场投入，押注国货联名。',        tags: ['#雅诗兰黛', '#品牌动向'],    posts: '3.9万条笔记' },
  { categoryId: 'celebrity',  title: '赵丽颖复出妆容',   heat: 97, desc: '复出活动造型引爆全网，被指定为女神妆。',  tags: ['#赵丽颖', '#红毯妆'],        posts: '7.2万条笔记' },
  { categoryId: 'hot',        title: '某品牌成分造假风波', heat: 96, desc: '博主曝光宣传成分含量与实测相差8倍。',     tags: ['#成分党', '#美妆热点'],      posts: '12万条笔记' },
  { categoryId: 'douyin',     title: '#她的妆容让我破防了', heat: 95, desc: '用户自发分享精致妆容，话题播放超10亿。', tags: ['#破防', '#精致妆容'],        posts: '话题10.2亿播放' },
]

export const MOCK_BLOGGERS = [
  { id: '抖音:luowangyu',   name: '骆王宇',     platform: '抖音',  followers: '2318万', avatar: '🌸', tag: '彩妆达人', verified: true,  color: '#FF6B9D' },
  { id: '微博:xulaoshi',    name: '深夜徐老师', platform: '微博',  followers: '1205万', avatar: '💄', tag: '护肤专家', verified: true,  color: '#C084FC' },
  { id: '小红书:pony',      name: 'PONY朴惠敏', platform: '小红书', followers: '986万',  avatar: '✨', tag: '仿妆大神', verified: true,  color: '#F59E0B' },
  { id: '抖音:maogeping',   name: '毛戈平',     platform: '抖音',  followers: '1560万', avatar: '👑', tag: '专业造型', verified: true,  color: '#60A5FA' },
]

// 可搜索的 KOL 目录（模拟第三方数据库；真实环境由新榜/千瓜接口返回）
export const KOL_DIRECTORY = [
  { id: '抖音:luowangyu',   name: '骆王宇',      platform: '抖音',  followers: '2318万', avatar: '🌸', tag: '彩妆达人',   verified: true },
  { id: '微博:xulaoshi',    name: '深夜徐老师',  platform: '微博',  followers: '1205万', avatar: '💄', tag: '护肤专家',   verified: true },
  { id: '小红书:pony',      name: 'PONY朴惠敏',  platform: '小红书', followers: '986万',  avatar: '✨', tag: '仿妆大神',   verified: true },
  { id: '抖音:maogeping',   name: '毛戈平',      platform: '抖音',  followers: '1560万', avatar: '👑', tag: '专业造型',   verified: true },
  { id: '小红书:cheng10an', name: '程十安an',    platform: '小红书', followers: '1450万', avatar: '🌷', tag: '学生党彩妆', verified: true },
  { id: '抖音:benny',       name: 'Benny董子初', platform: '抖音',  followers: '896万',  avatar: '💫', tag: '护肤科普',   verified: true },
  { id: '抖音:tim',         name: '化妆师Tim',   platform: '抖音',  followers: '1120万', avatar: '🎨', tag: '明星化妆师', verified: true },
  { id: '小红书:caro',      name: '大魔王Caro',  platform: '小红书', followers: '538万',  avatar: '👹', tag: '欧美妆',     verified: true },
  { id: '小红书:kakakaoo',  name: 'Kakakaoo-',   platform: '小红书', followers: '321万',  avatar: '🦋', tag: '氛围感妆容', verified: false },
  { id: '抖音:yizhilu',     name: '一只璐',      platform: '抖音',  followers: '672万',  avatar: '🌺', tag: '平价好物',   verified: false },
  { id: '小红书:chenlies',  name: '陈列室',      platform: '小红书', followers: '845万',  avatar: '🎀', tag: '日系妆容',   verified: false },
  { id: '微博:cherie',      name: '雪梨Cherie',  platform: '微博',  followers: '402万',  avatar: '🍒', tag: '甜美日常',   verified: false },
  { id: '抖音:xiaojiaying', name: '化妆师肖嘉颖', platform: '抖音',  followers: '764万',  avatar: '✂️', tag: '新娘造型',   verified: true },
  { id: 'B站:xiaomeng',     name: '小蒙XME',     platform: 'B站',   followers: '256万',  avatar: '🐱', tag: '测评向',     verified: true },
  { id: '小红书:tutu',      name: 'TUTU的彩妆',  platform: '小红书', followers: '188万',  avatar: '🌼', tag: '韩系裸妆',   verified: false },
  { id: '抖音:samchak',     name: '仙姆SamChak', platform: '抖音',  followers: '930万',  avatar: '🪄', tag: '创意彩妆',   verified: true },
  { id: '小红书:yumi',      name: 'Yumi的化妆台', platform: '小红书', followers: '143万',  avatar: '🧸', tag: '通勤妆',     verified: false },
  { id: '微博:meizhuang',   name: '美妆情报局',  platform: '微博',  followers: '610万',  avatar: '📰', tag: '行业资讯',   verified: true },
  { id: 'B站:lulu',         name: '机智的露露',  platform: 'B站',   followers: '298万',  avatar: '🌈', tag: '成分科普',   verified: true },
  { id: '抖音:lisa',        name: 'LisaEldridge', platform: '抖音', followers: '410万',  avatar: '🇬🇧', tag: '国际MUA',    verified: true },
  { id: '小红书:duoduo',    name: '朵朵不emo',   platform: '小红书', followers: '167万',  avatar: '🍑', tag: '油皮护肤',   verified: false },
  { id: '抖音:nana',        name: 'Nana的小宇宙', platform: '抖音',  followers: '521万',  avatar: '🌟', tag: '冷白皮妆容', verified: false },
]

export const MOCK_FEED = [
  { id: 'f1', bloggerId: '抖音:luowangyu', bloggerName: '骆王宇',     platform: '抖音',  title: '奶油肌底妆全教程！45分钟手把手', preview: '从打底、遮瑕到定妆，零基础也能跟上...', likes: '2.3万', comments: '1847', time: '2小时前', isHot: true,  cat: '妆容技巧', url: 'https://www.douyin.com/' },
  { id: 'f2', bloggerId: '微博:xulaoshi',  bloggerName: '深夜徐老师', platform: '微博',  title: '横评16款精华，用仪器实测吸收率',  preview: '结果出人意料，某大牌垫底...',          likes: '1.8万', comments: '2341', time: '5小时前', isHot: true,  cat: '护肤新品', url: 'https://weibo.com/' },
  { id: 'f3', bloggerId: '小红书:pony',    bloggerName: 'PONY朴惠敏', platform: '小红书', title: '挑战还原古代壁画妆容！全程教学',  preview: '本期仿妆难度系数五颗星...',           likes: '5.6万', comments: '8923', time: '1小时前', isHot: true,  cat: '明星妆容', url: 'https://www.xiaohongshu.com/' },
]
