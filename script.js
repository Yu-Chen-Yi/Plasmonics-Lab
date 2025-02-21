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

    // 隱藏所有語言的圖片
    document.querySelectorAll('img[lang]').forEach(img => {
        img.style.display = 'none';
    });

    // 顯示當前語言的圖片
    document.querySelectorAll(`img[lang="${lang}"]`).forEach(img => {
        img.style.display = 'block';
    });

    // 更新所有可切換語言的圖片
    document.querySelectorAll('.language-switchable-img').forEach(img => {
        const newSrc = img.getAttribute(`data-img-${lang}`);
        if (newSrc) {
            img.src = newSrc;
        }
    });
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
        const response = await fetch('images/advisor-professor/data.json');
        const data = await response.json();

        // ✅ 處理多行教育與經歷
        const educationListZh = data.education_zh.map(line => `<li lang="zh">${line}</li>`).join('');
        const educationListEn = data.education_en.map(line => `<li lang="en">${line}</li>`).join('');
        const experienceListZh = data.experience_zh.map(line => `<li lang="zh">${line}</li>`).join('');
        const experienceListEn = data.experience_en.map(line => `<li lang="en">${line}</li>`).join('');

        // ✅ 動態生成 HTML
        const advisorHTML = `
            <div class="group-leader">
                <div class="leader-container">
                    <!-- Leader's Photo -->
                    <img src="images/advisor-professor/CMW.jpg" alt="Group Leader Photo" class="leader-photo">
                    <!-- Leader's Personal Information -->
                    <div class="leader-info">
                        <h2 class="leader-name">${data.name} <span class="leader-chinese-name">/ ${data.chinese_name}</span></h2>
                        
                        <!-- Education Section -->
                        <h3 lang="en">Education</h3>
                        <h3 lang="zh">學歷</h3>
                        <ul>
                            ${educationListZh}
                            ${educationListEn}
                        </ul>
                        
                        <!-- Experience Section -->
                        <h3 lang="en">Experience</h3>
                        <h3 lang="zh">經歷</h3>
                        <ul>
                            ${experienceListZh}
                            ${experienceListEn}
                        </ul>
                        
                        <!-- Research Areas -->
                        <h3 lang="en">Research</h3>
                        <h3 lang="zh">研究領域</h3>
                        <p lang="zh">${data.research_zh}</p>
                        <p lang="en">${data.research_en}</p>
                        
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
    fetch('current-members.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('members-container');
            container.innerHTML = ''; // Clear previous content if any

            data.forEach((member, index) => {
                const cardHTML = `
                    <div class="card" data-id="modal${index}" onclick="openmemberModal('modal${index}')">
                        <div class="profile">
                            <img src="${member.url}" alt="${member.name_en}">
                            <h2>${member.name_zh}</h2>
                            <h3>${member.name_en}</h3>
     
                            <h1 lang="zh"><strong>研究:</strong> ${member.research_interests_zh}</h1>
                            <p lang="en"><strong>Research:</strong> ${member.research_interests_en}</p>
                        </div>
                    </div>

                    <div class="modal" id="modal${index}">
                        <span class="close" onclick="closememberModal('modal${index}')">&times;</span>
                        <div class="modal-content">
                            <img src="${member.url}" alt="${member.name_en}">
                            <h2>${member.name_zh} (${member.name_en})</h2>
                            <h1 lang= "zh"><strong>身分:</strong> ${member.degree_zh}</h1>
                            <p lang= "en"><strong>Degree:</strong> ${member.degree_en}</p>
                            <h1 lang= "zh"><strong>入學年度:</strong> ${member.year_of_enrollment_zh}</h1>
                            <p lang= "en"><strong>Admission Year:</strong> ${member.year_of_enrollment_en}</p>
                            <h1 lang= "zh"><strong>畢業學校:</strong> ${member.school_zh}</h1>
                            <p lang= "en"><strong>Education:</strong> ${member.school_en}</p>
                            <h1 lang= "zh"><strong>技能:</strong> ${member.skills_zh}</h1>
                            <p lang= "en"><strong>Skill:</strong> ${member.skills_en}</p>
                            <h1 lang= "zh"><strong>研究:</strong> ${member.research_interests_zh}</h1>
                            <p lang= "en"><strong>Research:</strong><br>${member.research_interests_en}</p>
                            <p><strong>Email:</strong> <a href="mailto:${member.email}">${member.email}</a></p>
                        </div>
                        <!--<div class="radar-chart" data-name="${member.name_zh}">-->
                            <!--<img src="images/radar/${member.name_zh}.png" alt="雷達圖">-->
                        <!--</div>-->
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', cardHTML);
            });
        })
        .catch(error => console.error('Error loading members:', error));
}

// ✅ 自動載入 Former Members (與 Former Members 分開)
async function loadFormerMembers() {
    fetch('former-members.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('members-container');
        container.innerHTML = ''; // Clear previous content if any

        data.forEach((member, index) => {
            const cardHTML = `
                <div class="card" data-id="modal${index}" onclick="openmemberModal('modal${index}')">
                    <div class="profile">
                        <img src="${member.url}" alt="${member.name_en}">
                        <h2>${member.name_zh}</h2>
                        <h3>${member.name_en}</h2>
 
                        <h1 lang="zh"><strong>現職:</strong><br>${member.current_employment_zh}</h1>
                        <p lang="en"><strong>Current Job:</strong> ${member.current_employment_en}</p>
                    </div>
                </div>

                <div class="modal" id="modal${index}">
                    <span class="close" onclick="closememberModal('modal${index}')">&times;</span>
                    <div class="modal-content">
                        <img src="${member.url}" alt="${member.name_en}">
                        <h2>${member.name_zh} (${member.name_en})</h2>
                        <h1 lang="zh"><strong>現職:</strong><br>${member.current_employment_zh}</h1>
                        <p lang="en"><strong>Current Job:</strong><br>${member.current_employment_en}</p>
                        <h1 lang= "zh"><strong>入學年度:</strong> ${member.year_of_enrollment_zh}</h1>
                        <p lang= "en"><strong>Admission Year:</strong> ${member.year_of_enrollment_en}</p>
                        <h1 lang= "zh"><strong>畢業學校:</strong> ${member.school_zh}</h1>
                        <p lang= "en"><strong>Education:</strong> ${member.school_en}</p>
                        <h1 lang= "zh"><strong>技能:</strong> ${member.skills_zh}</h1>
                        <p lang= "en"><strong>Skill:</strong> ${member.skills_en}</p>
                        <h1 lang= "zh"><strong>研究:</strong> ${member.research_interests_zh}</h1>
                        <p lang= "en"><strong>Research:</strong><br>${member.research_interests_en}</p>
                        <p><strong>Email:</strong> <a href="mailto:${member.email}">${member.email}</a></p>
                    </div>
                    <!--<div class="radar-chart">-->
                    <!--    <img src="images/radar/${member.name_zh}.png" alt="雷達圖">-->
                    <!--</div>-->
                </div>
            `;
            container.insertAdjacentHTML('beforeend', cardHTML);
        });
    })
    .catch(error => console.error('Error loading members:', error));
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

                            <div class="pubg">${authorsHtml}</div>
                            <div class="pubd">${paper.description}</div>
                            <div class="publ">${linksHtml}</div>
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

async function loadAwards() {
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
                        <div class="news-image" onclick="openModal('${item.image}')">
                            <img src="${item.image}" alt="${item.text}">
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
            container.innerHTML = `<p class="error-message">無法載入新聞資料，請稍後再試。</p>`;
        });
}

function openmemberModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);

    document.addEventListener('keydown', function escHandler(event) {
        if (event.key === "Escape") {
            closememberModal(modalId);
            document.removeEventListener('keydown', escHandler);
        }
    });
}

function closememberModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 500);
}

// 開啟模態框並顯示放大圖片
function openModal(imageSrc) {
    const modal = document.getElementById('myModal');
    const modalImg = document.getElementById('modalImg');
    modal.style.display = "block";
    modalImg.src = imageSrc;
}

// 關閉模態框
function closeModal() {
    document.getElementById('myModal').style.display = "none";
}

// 點擊圖片外部關閉模態框
window.onclick = function(event) {
    const modal = document.getElementById('myModal');
    if (event.target === modal) {
        closeModal();
    }
};

// 使用鍵盤 ESC 鍵關閉模態框
window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});


// ✅ 綁定導覽列的點擊事件，並動態載入對應頁面
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();  // 防止頁面跳轉
            const sectionName = link.getAttribute('data-section'); // 讀取 data-section 屬性

            // 如果點擊的是研究按鈕，自動跳轉到超穎光學頁面
            if (sectionName === 'research') {
                loadSection('meta-optics');
            } else {
                loadSection(sectionName); // 載入對應頁面
            }

            navMenu.classList.remove('active'); // 自動關閉選單
            hamburger.textContent = '☰'; // 恢復漢堡圖示
        });
    });
});

// ✅ 預設載入首頁
window.onload = () => {
    loadSection('home');
};

