// 控制語言切換與內容載入
let currentLang = "en";
const langZhBtn = document.getElementById("lang-zh");
const langEnBtn = document.getElementById("lang-en");
const mainContent = document.getElementById('main-content');
// ✅ 確保語言切換按鈕正常工作
langZhBtn.addEventListener("click", () => updateLanguage('zh'));
langEnBtn.addEventListener("click", () => updateLanguage('en'));

// ✅ 檢查 main 元素是否存在
if (!mainContent) {
    console.error("錯誤: 找不到 <main> 元素！");
}

// ✅ 語言切換功能
function updateLanguage(lang) {
    currentLang = lang;
    document.body.classList.remove('zh', 'en');
    document.body.classList.add(lang);
}

// ✅ 載入區塊並執行特定函數
function loadSection(sectionName) {
    fetch(`sections/${sectionName}.html`)
        .then(response => {
            if (!response.ok) throw new Error(`頁面未找到: ${sectionName}`);
            return response.text();
        })
        .then(html => {
            mainContent.innerHTML = html;

            // ✅ 當載入不同頁面時執行對應函數
            if (sectionName === 'advisor-professor') {
                loadAdvisorProfessor();  // 自動載入 AdvisorProfessor
            }
            else if (sectionName === 'member') {
                loadAdvisorProfessor();  // 自動載入 AdvisorProfessor
            }
            else if (sectionName === 'current-members') {
                loadCurrentMembers();  // 自動載入 current members
            }
            else if (sectionName === 'former-members') {
                loadFormerMembers();  // 自動載入 former members
            }
            else if (sectionName === 'publications') {
                loadpublications();  // 自動載入 publications
            }
            else if (sectionName === 'code') {
                loadPapersWithCode();  // 自動載入 Code
            }
            else if (sectionName === 'projects'){
                loadProjects();         // 自動載入 Projects
            }
            else if (sectionName === 'news'){
                loadAwards();
            }
        })
        .catch(error => {
            console.error('載入內容失敗:', error);
            mainContent.innerHTML = `<p style="color: red;">找不到此頁面: ${sectionName}</p>`;
        });
}

// ✅ 自動載入顧問教授資訊
async function loadAdvisorProfessor() {
    const advisorContainer = document.getElementById('advisor-container');

    try {
        // ✅ 載入 JSON 資料
        const response = await fetch('/images/advisor-professor/data.json');
        const data = await response.json();

        // ✅ 處理多行教育與經歷
        const educationList = data.education.map(line => `<li>${line}</li>`).join('');
        const experienceList = data.experience.map(line => `<li>${line}</li>`).join('');

        // ✅ 動態生成 HTML
        const advisorHTML = `
            <div class="group-leader">
                <div class="leader-container">
                    <!-- Leader's Photo -->
                    <img src="/images/advisor-professor/CMW.jpg" alt="Group Leader Photo" class="leader-photo">
                    <!-- Leader's Personal Information -->
                    <div class="leader-info">
                        <h2 class="leader-name">${data.name} <span class="leader-chinese-name">/ ${data.chinese_name}</span></h2>
                        
                        <!-- Education Section -->
                        <h3>Education</h3>
                        <ul>${educationList}</ul>
                        
                        <!-- Experience Section -->
                        <h3>Experience</h3>
                        <ul>${experienceList}</ul>
                        
                        <!-- Research Areas -->
                        <h3>Research</h3>
                        <p>${data.research}</p>
                        
                        <!-- Contact Information -->
                        <p>Email: <a href="mailto:${data.email}">${data.email}</a></p>
                        <p><a href="${data.google_scholar}" target="_blank">Google Scholar</a></p>
                    </div>
                </div>
            </div>
        `;

        // ✅ 將生成的內容插入 DOM
        advisorContainer.innerHTML = advisorHTML;

    } catch (error) {
        console.error("❌ 無法載入教授資訊:", error);
        advisorContainer.innerHTML = `<p style="color: red;">無法載入教授資訊</p>`;
    }
}
// ✅ 自動載入 Current Members (與 Former Members 分開)
async function loadCurrentMembers() {
    const categories = ["phd", "master", "undergraduate"];
    const membersContainer = {
        phd: document.getElementById('phd-container'),
        master: document.getElementById('master-container'),
        undergraduate: document.getElementById('undergraduate-container')
    };

    for (const category of categories) {
        const memberNames = await fetch(`/current-members.json`).then(res => res.json()).then(data => data[category] || []);
        membersContainer[category].innerHTML = '';

        for (const name of memberNames) {
            try {
                // ✅ 自動偵測圖片格式
                const imageExtensions = ["png", "jpg", "jpeg"];
                let profileImage = "";
                
                for (const ext of imageExtensions) {
                    const testPath = `/images/current-members/${category}/${name}/Profile.${ext}`;
                    const imageExists = await fetch(testPath, { method: 'HEAD' });
                    if (imageExists.ok) {
                        profileImage = testPath;
                        break;
                    }
                }

                // ✅ 預設圖片
                if (!profileImage) {
                    profileImage = `/images/default-profile.png`;
                }

                // ✅ 讀取 JSON 格式成員資料
                const memberData = await fetch(`/images/current-members/${category}/${name}/data.json`).then(res => res.json());
                
                // ✅ 處理多行 education (如果是陣列則分行顯示)
                const educationContent = Array.isArray(memberData.education) 
                    ? memberData.education.map(line => `<li>${line}</li>`).join('') 
                    : `<li>${memberData.education}</li>`;
                const educationTWContent = Array.isArray(memberData.education_TW) 
                    ? memberData.education_TW.map(line => `<li>${line}</li>`).join('') 
                    : `<li>${memberData.education_TW}</li>`;
                // ✅ 處理多行 research (如果是陣列則分行顯示)
                const researchContent = Array.isArray(memberData.research) 
                    ? memberData.research.map(line => `<li>${line}</li>`).join('') 
                    : `<li>${memberData.research}</li>`;
                // ✅ 處理多行 research (如果是陣列則分行顯示)
                const researchTWContent = Array.isArray(memberData.research_TW) 
                    ? memberData.research_TW.map(line => `<li>${line}</li>`).join('') 
                    : `<li>${memberData.research_TW}</li>`;
                    // ✅ 動態生成成員卡片 (支持多行)
                const memberHTML = `
                    <div class="member-card">
                        <img src="${profileImage}" class="member-photo">
                        <div class="member-info">
                            
                            <h2 class="member-info">${memberData.name} <span class="leader-chinese-name">/ ${memberData.chinese_name}</span></h2>
                            <!-- 英文區塊 -->
                            <p lang="en"><strong>Education:</strong></p>
                            <ul lang="en">${educationContent}</ul>
                            <p lang="en"><strong>Research</strong></p>
                            <ul lang="en">${researchContent}</ul>
                    

                            <!-- 中文區塊 -->
                            <p lang="zh"><strong>學歷:</strong></p>
                            <ul lang="zh">${educationTWContent}</ul>
                            <p lang="zh"><strong>研究:</strong></p>
                            <ul lang="zh">${researchTWContent}</ul>

                            <!-- Email (通用) -->
                            <p><strong>Email:</strong> <a href="mailto:${memberData.email}">${memberData.email}</a></p>
                        </div>
                    </div>
                `;
                membersContainer[category].innerHTML += memberHTML;

            } catch (error) {
                console.error(`無法載入 ${name} 的資料`, error);
            }
        }
    }
}

async function loadFormerMembers() {
    const categories = ["phd", "master", "undergraduate"];
    const membersContainer = {
        phd: document.getElementById('phd-container'),
        master: document.getElementById('master-container'),
        undergraduate: document.getElementById('undergraduate-container')
    };

    for (const category of categories) {
        const memberNames = await fetch(`/former-members.json`).then(res => res.json()).then(data => data[category] || []);
        membersContainer[category].innerHTML = '';

        for (const name of memberNames) {
            try {
                // ✅ 自動偵測圖片格式
                const imageExtensions = ["png", "jpg", "jpeg"];
                let profileImage = "";
                
                for (const ext of imageExtensions) {
                    const testPath = `/images/former-members/${category}/${name}/Profile.${ext}`;
                    const imageExists = await fetch(testPath, { method: 'HEAD' });
                    if (imageExists.ok) {
                        profileImage = testPath;
                        break;
                    }
                }

                // ✅ 預設圖片
                if (!profileImage) {
                    profileImage = `/images/default-profile.png`;
                }

                // ✅ 讀取 JSON 格式成員資料
                const memberData = await fetch(`/images/former-members/${category}/${name}/data.json`).then(res => res.json());
                
                // ✅ 處理多行 education (如果是陣列則分行顯示)
                const educationContent = Array.isArray(memberData.education) 
                    ? memberData.education.map(line => `<li>${line}</li>`).join('') 
                    : `<li>${memberData.education}</li>`;
                const educationTWContent = Array.isArray(memberData.education_TW) 
                    ? memberData.education_TW.map(line => `<li>${line}</li>`).join('') 
                    : `<li>${memberData.education_TW}</li>`;
                // ✅ 處理多行 research (如果是陣列則分行顯示)
                const researchContent = Array.isArray(memberData.research) 
                    ? memberData.research.map(line => `<li>${line}</li>`).join('') 
                    : `<li>${memberData.research}</li>`;
                // ✅ 處理多行 research (如果是陣列則分行顯示)
                const researchTWContent = Array.isArray(memberData.research_TW) 
                    ? memberData.research_TW.map(line => `<li>${line}</li>`).join('') 
                    : `<li>${memberData.research_TW}</li>`;
                    // ✅ 動態生成成員卡片 (支持多行)
                const memberHTML = `
                    <div class="member-card">
                        <img src="${profileImage}" class="member-photo">
                        <div class="member-info">
                            <h3 class="member-name">${memberData.name} <span class="member-chinese-name">/ ${memberData.chinese_name}</span></h2>
                            <!-- 英文區塊 -->
                            <p lang="en"><strong>Education:</strong></p>
                            <ul lang="en">${educationContent}</ul>
                            <p lang="en"><strong>Research</strong></p>
                            <ul lang="en">${researchContent}</ul>
                    

                            <!-- 中文區塊 -->
                            <p lang="zh"><strong>學歷:</strong></p>
                            <ul lang="zh">${educationTWContent}</ul>
                            <p lang="zh"><strong>研究:</strong></p>
                            <ul lang="zh">${researchTWContent}</ul>

                            <!-- Email (通用) -->
                            <p><strong>Email:</strong> <a href="mailto:${memberData.email}">${memberData.email}</a></p>
                        </div>
                    </div>
                `;
                membersContainer[category].innerHTML += memberHTML;

            } catch (error) {
                console.error(`無法載入 ${name} 的資料`, error);
            }
        }
    }
}

async function loadpublications() {
    try {
        const response = await fetch('publications.json');
        if (!response.ok) throw new Error("Failed to load the JSON file.");

        const publications = await response.json();
        const container = document.getElementById('publications');
        container.innerHTML = '';

        publications.sort((a, b) => {
            const dateA = new Date(a.year.replace(/([\u4e00-\u9fa5]+)/, '-01-').trim());
            const dateB = new Date(b.year.replace(/([\u4e00-\u9fa5]+)/, '-01-').trim());
            return dateB - dateA;
        });

        publications.forEach(pub => {
            const keywordsHtml = pub.keywords.map(keyword => `<span class="tag">${keyword}</span>`).join(' ');
            const authorsHtml = pub.authors.join(', ');
            container.innerHTML += `
                <div class="publication">
                    <img src="${pub.img_scr}" alt="Publication Image">
                    <div class="publication-info">
                        <h2><a href="${pub.url}" target="_blank">${pub.title}</a></h2>
                        <p><strong>Authors:</strong> ${authorsHtml}</p>
                        <p><strong>Journal:</strong> ${pub.journal}</p>
                        <p><strong>Year:</strong> ${pub.year}</p>
                        <div class="tags">${keywordsHtml}</div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading publications:', error);
        document.getElementById('publications').innerHTML = '<p style="color: red;">Failed to load publications.</p>';
    }
}

async function loadPapersWithCode() {
    try {
        const response = await fetch('papers_with_code.json');
        if (!response.ok) throw new Error("Failed to load the JSON file.");

        const papers = await response.json();
        const container = document.getElementById('papers-container');
        container.innerHTML = '';

        papers.forEach(paper => {
            const authorsHtml = paper.authors.join(', ');
            const linksHtml = paper.links.map(link => `<li><a href="${link.url}" target="_blank">${link.text}</a></li>`).join('');
            container.innerHTML += `
                <div class="pubwrap">
                    <div class="row">
                        <div class="pubimg">
                            <img src="${paper.img_src}" alt="Paper Image">
                        </div>
                        <div class="pub">
                            <div class="pubt">${paper.title}</div>
                            <br>
                            <div class="pubg">${authorsHtml}</div>
                            <div class="pubd">${paper.description}</div>
                            <div class="publ"><ul>${linksHtml}</ul></div>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading papers with code:', error);
        document.getElementById('papers-container').innerHTML = '<p style="color: red;">Failed to load papers with code.</p>';
    }
}

async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        if (!response.ok) throw new Error("Failed to load the projects JSON.");

        const projects = await response.json();
        const container = document.getElementById('projects-container');
        container.innerHTML = '';

        projects.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
        projects.forEach(project => {
            container.innerHTML += `
                <div class="project-item">
                    <h3><a href="${project.url}" target="_blank">${project.title}</a></h3>
                    <p><strong>Start Date:</strong> ${project.start_date} | <strong>End Date:</strong> ${project.end_date}</p>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projects-container').innerHTML = '<p style="color: red;">Failed to load projects.</p>';
    }
}

function loadAwards() {
    const container = document.getElementById('news-container');
    container.innerHTML = ''; // 清空現有內容

    fetch('awards.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('無法載入新聞資料');
            }
            return response.json();
        })
        .then(data => {
            const newsData = data.news;
            newsData.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('news-card');

                // 如果有圖片
                if (item.image) {
                    card.innerHTML = `
                        <div class="news-image">
                            <img src="${item.image}" alt="${item.text}" onerror="this.src='images/awards/default-placeholder.png';">
                        </div>
                        <h3 class="news-title">${item.text}</h3>
                        <p class="news-date">日期: ${item.date}</p>
                    `;
                } else { // 沒有圖片的處理
                    card.classList.add('no-image');
                    card.innerHTML = `
                        <h3 class="news-title">${item.text}</h3>
                        <p class="news-date">日期: ${item.date}</p>
                    `;
                }
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('載入新聞資料失敗:', error);
            container.innerHTML = `<p style="color: red;">無法載入新聞資料，請稍後再試。</p>`;
        });
}

// ✅ 綁定導覽列的點擊事件，並動態載入對應頁面
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[data-section]').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const sectionName = this.getAttribute('data-section');
            loadSection(sectionName);
        });
    });
});

// ✅ 預設載入首頁
window.onload = () => {
    loadSection('news');
};
