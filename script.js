const githubUsername = "suman222222";
const skillBars = document.getElementById("githubSkillBars");
const skillSummary = document.getElementById("githubSkillSummary");

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
    Shell: "#89e051"
};

async function fetchGithubSkills() {
    try {
        const reposResponse = await fetch(
            `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`
        );

        if (!reposResponse.ok) {
            throw new Error("GitHub repositories could not be loaded.");
        }

        const repos = await reposResponse.json();
        const publicRepos = repos.filter((repo) => !repo.fork);

        const languageResults = await Promise.all(
            publicRepos.map((repo) =>
                fetch(repo.languages_url)
                    .then((response) => (response.ok ? response.json() : {}))
                    .catch(() => ({}))
            )
        );

        const totals = languageResults.reduce((allLanguages, repoLanguages) => {
            Object.entries(repoLanguages).forEach(([language, bytes]) => {
                allLanguages[language] = (allLanguages[language] || 0) + bytes;
            });
            return allLanguages;
        }, {});

        const totalBytes = Object.values(totals).reduce((sum, bytes) => sum + bytes, 0);

        if (!totalBytes) {
            throw new Error("No language data found.");
        }

        const skills = Object.entries(totals)
            .map(([language, bytes]) => ({
                language,
                percent: Math.round((bytes / totalBytes) * 100)
            }))
            .filter((skill) => skill.percent > 0)
            .sort((a, b) => b.percent - a.percent)
            .slice(0, 6);

        renderSkills(skills);
        skillSummary.textContent = `Based on ${publicRepos.length} public GitHub repositories from @${githubUsername}.`;
    } catch (error) {
        skillSummary.textContent =
            "Showing starter skill estimates. GitHub data will update automatically when available.";
    }
}

function renderSkills(skills) {
    skillBars.innerHTML = "";

    skills.forEach((skill) => {
        const color = colors[skill.language] || "#2563eb";
        const row = document.createElement("div");
        const info = document.createElement("div");
        const language = document.createElement("span");
        const percent = document.createElement("strong");
        const track = document.createElement("div");
        const fill = document.createElement("span");

        row.className = "skill-row";
        info.className = "skill-info";
        track.className = "skill-track";

        language.textContent = skill.language;
        percent.textContent = `${skill.percent}%`;
        fill.style.width = `${skill.percent}%`;
        fill.style.background = color;

        info.append(language, percent);
        track.append(fill);
        row.append(info, track);
        skillBars.append(row);
    });
}

fetchGithubSkills();
