function extractMaxStipend(stipendText) {
  const numbers = stipendText.match(/\d+/g);
  if (!numbers) return 0;

  return Math.max(...numbers.map(Number));
}
function scoreJob(job, criteria) {
  let score = 0;

  const title = job.title.toLowerCase();
  const location = job.location.toLowerCase();
  const stipend = extractMaxStipend(job.stipend || "");
  const skillsText = (job.skills || []).join(" ").toLowerCase();

  // Role scoring
  criteria.roles.forEach((role) => {
    if (title.includes(role.toLowerCase())) {
      score += 3;
    }
  });

  // Location scoring
  criteria.locations.forEach((loc) => {
    if (location.includes(loc.toLowerCase())) {
      score += 2;
    }
  });

  // Remote bonus
  if (location.includes("remote") || location.includes("work from home")) {
    score += 2;
  }

  // Stipend bonus
  if (stipend >= 20000) score += 3;
  else if (stipend >= 10000) score += 2;

  // 🚨 NEW 1: Unpaid penalty
  if (job.stipend && job.stipend.toLowerCase().includes("unpaid")) {
    score -= 2;
  }

  // 🚀 NEW 2: Skill boost (IMPORTANT)
  const skillBoosts = [
    "javascript",
    "react",
    "node",
    "html",
    "css",
    "next",
    "mongodb",
    "sql",
  ];

  skillBoosts.forEach((skill) => {
    if (skillsText.includes(skill)) {
      score += 2;
    }
  });

  return score;
}

function filterJobs(jobs, criteria) {
  return jobs
    .map((job) => ({
      ...job,
      score: scoreJob(job, criteria),
    }))
    .filter((job) => job.score >= 5)
    .sort((a, b) => b.score - a.score);
}

module.exports = { filterJobs };
