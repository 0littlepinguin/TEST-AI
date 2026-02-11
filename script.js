// State Management
let currentQuestionIndex = 0;
let scores = { A: 0, B: 0, C: 0, D: 0 };
let userName = "Traveler";

// DOM Elements
const screens = {
    welcome: document.getElementById('welcome-screen'),
    loading: document.getElementById('loading-screen'),
    quiz: document.getElementById('quiz-screen'),
    result: document.getElementById('result-screen'),
    poster: document.getElementById('poster-modal')
};

// Access Key Logic
function checkKey() {
    const key = document.getElementById('access-key').value;
    const errorMsg = document.getElementById('key-error');
    
    if (key === "AI Career 000") {
        document.getElementById('lock-screen').classList.add('hidden');
        document.getElementById('lock-screen').classList.remove('flex');
        
        screens.welcome.classList.remove('hidden');
        screens.welcome.classList.add('flex');
        
        // Initialize User Count when entering welcome screen
        initUserCount();
    } else {
        errorMsg.classList.remove('hidden');
        document.getElementById('access-key').classList.add('border-red-500');
    }
}

// User Count Logic
function initUserCount() {
    let count = localStorage.getItem('ai_quiz_user_count');
    
    if (!count) {
        count = 1300;
    } else {
        count = parseInt(count);
    }
    
    // Increment count for current session
    const newCount = count + Math.floor(Math.random() * 3) + 1; // Randomly add 1-3 users
    localStorage.setItem('ai_quiz_user_count', newCount);
    
    // Animate count
    const countElement = document.getElementById('user-count');
    countElement.innerText = newCount.toLocaleString();
}

// Data: Questions
const questions = [
    {
        question: "面对Sora、ChatGPT等现象级AI工具的持续涌现，你的第一直觉是？",
        options: [
            { text: "第一时间上手，探索其边界与创新应用潜能", type: "B" }, // Creative/Curious
            { text: "保持审慎观察，警惕技术泡沫与潜在风险", type: "C" }, // Skeptic/Human-focused
            { text: "迅速评估其商业价值，思考如何赋能现有业务", type: "D" }  // Pragmatic/Strategy
        ]
    },
    {
        question: "在AI技术高速发展的背景下，你最担忧的潜在风险是？",
        options: [
            { text: "结构性失业加剧，加深社会不平等", type: "C" }, // Social/Human concern
            { text: "奇点临近，人类丧失对超级智能的控制权", type: "A" }, // Control/Logic
            { text: "信息污染与深度伪造（Deepfake）泛滥，侵蚀真相", type: "B" } // Reality/Art
        ]
    },
    {
        question: "在人机协作（Human-AI Collaboration）过程中，你更倾向于哪种交互模式？",
        options: [
            { text: "结构化引导：通过精准的Prompt工程构建思维链（CoT）", type: "A" }, // Logic
            { text: "发散式共创：将AI视为灵感缪斯，进行头脑风暴", type: "B" }, // Creative
            { text: "结果导向：下达明确指令，追求最高效的产出交付", type: "D" } // Result-oriented
        ]
    },
    {
        question: "在未来的AI增强型团队中，你认为自己最核心的定位是？",
        options: [
            { text: "资源整合者：优化人机分工，最大化团队效能", type: "D" }, // Efficiency
            { text: "创意破壁人：利用技术打破常规，通过AI实现美学突破", type: "B" }, // Inspiration
            { text: "人文粘合剂：在算法理性的缝隙中，维系团队的情感温度", type: "C" } // Human touch
        ]
    },
    {
        question: "你理想中的“后AI时代”社会图景是怎样的？",
        options: [
            { text: "以人为本：技术隐于无形，科技主要服务于人类的精神福祉", type: "C" }, // Dystopian/Humanist
            { text: "极致效率：全自动化社会，人类从重复劳动中彻底解放", type: "D" }, // Utopian/Efficiency
            { text: "无限可能：现实与虚拟边界消融，涌现前所未有的艺术形态", type: "B" } // Chaotic/Creative
        ]
    },
    {
        question: "当AI模型产生“幻觉”（Hallucination）生成错误信息时，你的反应是？",
        options: [
            { text: "批判性审视：分析其逻辑漏洞，不再轻信算法输出", type: "A" }, // Critical
            { text: "娱乐化解构：将其视为一种数字幽默，分享其荒谬之处", type: "B" }, // Playful
            { text: "伦理担忧：意识到技术局限，担忧其对弱势群体的误导", type: "C" } // Protective/Ethical
        ]
    },
    {
        question: "假设AI承担了所有生产性工作，你会选择如何度过一生？",
        options: [
            { text: "投身艺术创造，探索人类想象力的极致边界", type: "B" }, // Creative
            { text: "致力于社区建设与公益，重构人与人之间的深度连接", type: "C" }, // Social/Human
            { text: "钻研哲学与基础科学，拓展人类知识的版图", type: "A" } // Intellectual
        ]
    },
    {
        question: "解决复杂问题时，你更依赖哪种认知模式？",
        options: [
            { text: "演绎推理：建立严密的逻辑框架，层层推导", type: "A" }, // Linear/Logic
            { text: "直觉思维：跳出框架，寻找非线性的创新解法", type: "B" }, // Lateral/Intuitive
            { text: "战略权衡：评估多方利弊，寻求系统最优解", type: "D" } // Strategic
        ]
    },
    {
        question: "如何看待人类与AI建立深层情感连接（如电影《Her》中的场景）？",
        options: [
            { text: "理性否定：算法模拟的反馈本质是代码，并非真实情感", type: "A" }, // Rational
            { text: "包容理解：只要能慰藉孤独，情感的形式不应被定义", type: "C" }, // Empathetic
            { text: "开放探索：这是一种全新的情感维度，值得体验", type: "B" } // Open/Imaginative
        ]
    },
    {
        question: "在AI定义的未来，你希望成为哪种角色的原型？",
        options: [
            { text: "领航者：驾驭技术洪流，引领组织穿越周期", type: "D" }, // Leader
            { text: "造梦师：重塑感官体验，定义新的美学范式", type: "B" }, // Creator
            { text: "守望者：坚守人文底线，防止技术异化人性", type: "C" } // Humanist
        ]
    }
];

// Data: Results
const results = {
    A: {
        title: "深空架构师",
        subtitle: "The System Architect",
        desc: "你是AI时代的基石搭建者。你拥有穿透表象看本质的逻辑能力，AI在你手中不是黑盒，而是精密的仪器。你擅长拆解复杂问题，并构建系统化的解决方案。",
        strength: "强大的逻辑推理能力与系统思维。你能精准地发现AI的逻辑漏洞，并能设计出让AI高效运转的Workflow。",
        careers: {
            existing: [
                { name: "提示词工程师 (Prompt Engineer)", desc: "通过设计精准的指令（Prompt）来引导AI输出高质量内容，相当于AI的'翻译官'。" },
                { name: "AI模型训练师", desc: "负责整理数据并'教'AI学习，让AI变得更聪明、更懂特定领域的知识。" },
                { name: "数据清洗专家", desc: "处理杂乱的数据，去除垃圾信息，为AI提供高质量的'食物'。" }
            ],
            future: [
                { name: "个人数字孪生架构师", desc: "帮普通人打造一个AI分身，让它模仿你的语气和思维去处理工作。" },
                { name: "神经接口设计师", desc: "设计大脑与电脑直接连接的界面，实现'意念打字'或'脑机交互'。" },
                { name: "算法偏见审计员", desc: "像查账一样检查AI算法，确保它没有歧视某些群体或产生错误判断。" }
            ]
        }
    },
    B: {
        title: "幻梦编织者",
        subtitle: "The Dream Weaver",
        desc: "你是AI时代的创意引爆点。你拥有天马行空的想象力，AI是你画笔的延伸。你不拘泥于规则，总能用AI创造出让人惊叹的全新内容。",
        strength: "卓越的审美与发散性思维。你能用感性的语言激发AI的潜能，创造出超越人类传统经验的艺术作品。",
        careers: {
            existing: [
                { name: "AI插画师/生成艺术家", desc: "利用Midjourney等工具，将脑海中的画面瞬间变成高质量的图像作品。" },
                { name: "AI视频导演", desc: "一个人就是一支队伍，利用AI生成视频素材、配音和剪辑，制作电影级大片。" },
                { name: "虚拟人设设计师", desc: "打造虚拟网红（Vtuber）的外形、性格和背景故事，赋予它们'灵魂'。" }
            ],
            future: [
                { name: "沉浸式世界构建师", desc: "为VR/AR游戏或元宇宙设计完整的虚拟世界观、物理规则和生态系统。" },
                { name: "梦境体验设计师", desc: "利用脑机接口技术，像编写剧本一样设计并生成可以'做'出来的梦境。" },
                { name: "多模态交互导演", desc: "设计声音、视觉、触觉同步的交互体验，让用户感觉像在与真实的生命交流。" }
            ]
        }
    },
    C: {
        title: "心灵守护者",
        subtitle: "The Human Guardian",
        desc: "你是AI时代的人性锚点。在冰冷的算法世界里，你守护着温暖的情感与道德边界。你最擅长理解人类的微妙情绪，确保技术不脱离人文关怀。",
        strength: "极强的共情能力与道德敏感度。你是连接硅基智能与碳基生命的桥梁，确保AI的发展始终服务于人类福祉。",
        careers: {
            existing: [
                { name: "AI伦理官", desc: "制定规则，防止AI被滥用（如制造假新闻、诈骗），是AI世界的'警察'。" },
                { name: "人机交互心理学家", desc: "研究人类与AI互动时的心理变化，优化AI的'情商'，让它更懂人话。" },
                { name: "情感陪伴师", desc: "利用AI工具辅助，为孤独的人群提供更深度的心理疏导和情感支持。" }
            ],
            future: [
                { name: "人机关系咨询师", desc: "专门解决人类与AI伴侣或助手之间的情感纠纷和依赖问题。" },
                { name: "算法福利官", desc: "确保算法在分配工作或资源时（如外卖派单）对人类是公平和人道的。" },
                { name: "记忆策展人", desc: "帮助人们整理一生的数字记忆，用AI生成逝去亲人的虚拟形象以供缅怀。" }
            ]
        }
    },
    D: {
        title: "未来领航员",
        subtitle: "The Strategic Pilot",
        desc: "你是AI时代的掌舵人。你拥有敏锐的商业嗅觉和资源整合能力。你并不沉迷于技术细节，但你最知道如何利用AI技术达成宏大的商业目标。",
        strength: "宏观战略眼光与资源整合力。你擅长将AI能力转化为实际生产力，你是那个决定AI往哪个方向飞的人。",
        careers: {
            existing: [
                { name: "AI产品经理", desc: "发现用户需求，指挥技术团队用AI做出好用的产品（如APP、网站）。" },
                { name: "数字化转型专家", desc: "帮助传统公司（如工厂、超市）引入AI技术，提高赚钱效率。" },
                { name: "自动化工作流设计师", desc: "把重复繁琐的工作（如发邮件、填表）设计成自动运行的AI流程。" }
            ],
            future: [
                { name: "AI生态系统规划师", desc: "设计多个AI之间如何协作，比如让订票AI、酒店AI和打车AI自动配合安排行程。" },
                { name: "首席自动化官 (CAO)", desc: "公司高管职位，专门负责决定公司里哪些工作该给人做，哪些该给AI做。" },
                { name: "算力资源交易员", desc: "像炒股一样买卖AI计算能力，确保公司以最低成本获得最强算力。" }
            ]
        }
    }
};

// Functions

function startQuiz() {
    screens.welcome.classList.add('hidden');
    screens.loading.classList.remove('hidden');
    screens.loading.classList.add('flex');
    
    const loadingTexts = [
        "正在扫描你的逻辑回路...",
        "正在连接未来的职业数据库...",
        "正在计算你与硅基生命的契合度...",
        "正在下载未来职业图谱..."
    ];
    
    let textIndex = 0;
    const textElement = document.getElementById('loading-text');
    
    const interval = setInterval(() => {
        textIndex = (textIndex + 1) % loadingTexts.length;
        textElement.innerText = loadingTexts[textIndex];
    }, 800);

    setTimeout(() => {
        clearInterval(interval);
        screens.loading.classList.add('hidden');
        screens.loading.classList.remove('flex');
        screens.quiz.classList.remove('hidden');
        screens.quiz.classList.add('flex');
        renderQuestion();
    }, 3000);
}

function renderQuestion() {
    const q = questions[currentQuestionIndex];
    document.getElementById('question-text').innerText = q.question;
    
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    
    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "w-full text-left p-4 rounded-xl bg-slate-800 border border-slate-700 hover:bg-indigo-900/50 hover:border-indigo-500 transition-all text-slate-200 text-base font-medium active:scale-95";
        btn.innerText = opt.text;
        btn.onclick = () => selectOption(opt.type);
        container.appendChild(btn);
    });
}

function selectOption(type) {
    if (scores[type] !== undefined) {
        scores[type]++;
    }
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        renderQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    screens.quiz.classList.add('hidden');
    screens.quiz.classList.remove('flex');
    screens.result.classList.remove('hidden');
    screens.result.classList.add('flex');
    
    // Calculate Winner
    let maxScore = -1;
    let winner = 'A';
    
    // Simple logic: max score. If tie, priority A > B > C > D
    for (const [key, value] of Object.entries(scores)) {
        if (value > maxScore) {
            maxScore = value;
            winner = key;
        }
    }
    
    // Update Stats
    const totalQ = questions.length;
    document.getElementById('score-A').innerText = Math.round((scores.A / totalQ) * 100) + '%';
    document.getElementById('score-B').innerText = Math.round((scores.B / totalQ) * 100) + '%';
    document.getElementById('score-C').innerText = Math.round((scores.C / totalQ) * 100) + '%';
    document.getElementById('score-D').innerText = Math.round((scores.D / totalQ) * 100) + '%';

    const data = results[winner];
    
    document.getElementById('result-title').innerText = data.title;
    // document.getElementById('result-subtitle').innerText = data.subtitle;
    document.getElementById('result-desc').innerText = data.desc;
    document.getElementById('result-strength').innerText = data.strength;
    
    // Render Career Lists
    const renderCareers = (list) => {
        return list.map(item => `
            <div class="mb-2">
                <details class="group">
                    <summary class="cursor-pointer text-white text-sm font-bold list-none flex justify-between items-center bg-slate-800/50 p-2 rounded hover:bg-slate-700/50 transition-colors">
                        <span>${item.name}</span>
                        <span class="text-xs text-slate-500 group-open:rotate-180 transition-transform transform origin-center">▼</span>
                    </summary>
                    <p class="text-xs text-slate-300 mt-2 pl-3 border-l-2 border-indigo-500/50 leading-relaxed py-1">
                        ${item.desc}
                    </p>
                </details>
            </div>
        `).join('');
    };

    document.getElementById('career-existing').innerHTML = renderCareers(data.careers.existing);
    document.getElementById('career-future').innerHTML = renderCareers(data.careers.future);
}

function generatePoster() {
    const element = document.getElementById('result-card');
    
    // Temporarily adjust style for better capture
    const originalStyle = element.style.cssText;
    // element.style.width = "375px"; // Fixed width for consistency
    
    html2canvas(element, {
        backgroundColor: '#1e293b', // Match card bg or use transparent
        scale: 2, // High resolution
        logging: false,
        useCORS: true
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        document.getElementById('generated-image').src = imgData;
        
        // Show modal
        const modal = document.getElementById('poster-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // Restore style
        element.style.cssText = originalStyle;
    });
}

function closePoster() {
    const modal = document.getElementById('poster-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Initialize
// (Nothing to do, waiting for user to click start)
