
const githubUsername = "suman222222"; 

const words = ['Networks', 'Code', 'Solutions', 'Interfaces'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const dynamicText = document.querySelector('.dynamic-text');
    if (!dynamicText) return;

    const currentWord = words[wordIndex];
    
    
    if (isDeleting) {
        // Remove one character
        dynamicText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        // Add one character
        dynamicText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    
    dynamicText.style.transform = 'scale(0.999)';
    requestAnimationFrame(() => {
        dynamicText.style.transform = 'scale(1)';
    });

    
    // If we just finished typing the whole word
    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(typeEffect, 1500); // Pause before deleting
        return;
    }
    
    // If we just finished deleting the whole word
    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length; // Move to next word
        setTimeout(typeEffect, 300); // Short pause before typing next
        return;
    }
    
    // Keep typing or deleting at normal speed
    const speed = isDeleting ? 80 : 120;
    setTimeout(typeEffect, speed);
}



// ============================================================
//  GITHUB LANGUAGE COLORS
// ============================================================
const colors = {
    HTML: "#e34c26",
    CSS: "#563d7c",
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572a5",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    PHP: "#4f5d95",
    Shell: "#89e051",
    Ruby: "#701516",
    Go: "#00ADD8",
    Rust: "#dea584",
    Swift: "#ffac45",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
    "C#": "#178600",
    Scala: "#c22d40",
    Perl: "#0298c3",
    R: "#198CE7"
};

async function fetchGithubSkills() {
    const skillBars = document.getElementById("githubSkillBars");
    const skillSummary = document.getElementById("githubSkillSummary");
    
    if (!skillBars || !skillSummary) {
        console.log("ℹ️ GitHub bars not on this page.");
        return;
    }

    try {
        const reposResponse = await fetch(
            `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`
        );
        if (!reposResponse.ok) throw new Error(`GitHub API returned ${reposResponse.status}`);

        const repos = await reposResponse.json();
        const publicRepos = repos.filter((repo) => !repo.fork);

        const languageResults = await Promise.all(
            publicRepos.map((repo) =>
                fetch(repo.languages_url)
                    .then((res) => (res.ok ? res.json() : {}))
                    .catch(() => ({}))
            )
        );

        const totals = languageResults.reduce((all, repoLangs) => {
            Object.entries(repoLangs).forEach(([lang, bytes]) => {
                all[lang] = (all[lang] || 0) + bytes;
            });
            return all;
        }, {});

        const totalBytes = Object.values(totals).reduce((sum, bytes) => sum + bytes, 0);
        if (!totalBytes) throw new Error("No language data found.");

        const skills = Object.entries(totals)
            .map(([language, bytes]) => ({
                language,
                percent: Math.round((bytes / totalBytes) * 100)
            }))
            .filter((skill) => skill.percent > 0)
            .sort((a, b) => b.percent - a.percent)
            .slice(0, 6);

        renderSkills(skills);
        skillSummary.textContent = `📊 Based on ${publicRepos.length} public repositories from @${githubUsername}.`;
    } catch (error) {
        console.warn("⚠️ GitHub fetch failed:", error.message);
        skillSummary.textContent = "⚠️ Showing estimated skills. Push code to GitHub to see live stats!";
        renderSkills([
            { language: "Java", percent: 40 },
            { language: "Python", percent: 30 },
            { language: "HTML", percent: 15 },
            { language: "CSS", percent: 10 },
            { language: "JavaScript", percent: 5 }
        ]);
    }
}

function renderSkills(skills) {
    const skillBars = document.getElementById("githubSkillBars");
    if (!skillBars) return;

    skillBars.innerHTML = "";

    skills.forEach((skill) => {
        const color = colors[skill.language] || "#8b5cf6";
        
        const row = document.createElement("div");
        row.className = "skill-row";

        const info = document.createElement("div");
        info.className = "skill-info";

        const language = document.createElement("span");
        language.textContent = skill.language;

        const percent = document.createElement("strong");
        percent.textContent = `${skill.percent}%`;

        const track = document.createElement("div");
        track.className = "skill-track";

        const fill = document.createElement("span");
        fill.style.width = "0%"; // Start at 0
        fill.style.background = color;

        // Animate to the actual width after a tiny delay
        setTimeout(() => {
            fill.style.width = `${skill.percent}%`;
        }, 100);

        info.append(language, percent);
        track.append(fill);
        row.append(info, track);
        skillBars.append(row);
    });
}

// ============================================================
//  START EVERYTHING ON PAGE LOAD
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Typing Animation (only on pages with .dynamic-text)
    if (document.querySelector('.dynamic-text')) {
        typeEffect();
    }

    // 2. GitHub Skills (only on pages with #githubSkillBars)
    if (document.getElementById("githubSkillBars")) {
        fetchGithubSkills();
    }

    // 3. Console greeting (professional touch)
    console.log("🚀 Suman Kapri's Portfolio is LIVE!");
    console.log("💻 Built with manual HTML, CSS, and JavaScript.");
    console.log("🔗 GitHub: @" + githubUsername);
});