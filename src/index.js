const fs = require("fs");
const { fetchInternships } = require("./scrapers/internshala");
const { filterJobs } = require("./filters/jobFilter");
const { sendEmail } = require("./email/emailService");

async function main() {
  try {
    console.log("🚀 Starting AI Job Agent...");

    await fetchInternships();

    const jobs = JSON.parse(fs.readFileSync("data/jobs.json", "utf-8"));

    const filtered = filterJobs(jobs, {
      roles: ["Web", "Developer", "Full Stack", "Frontend", "Backend"],
      locations: ["Delhi", "Noida", "Remote", "Work from home"],
      minStipend: 0,
      allowRemote: true,
    });

    console.log("\n🔥 FILTERED JOBS:", filtered.length);

    if (filtered.length === 0) {
      console.log("⚠️ No matching jobs found today");
      return;
    }

    const topJobs = filtered.slice(0, 5);

    console.log("📊 TOP JOBS FOR EMAIL:", topJobs.length);

    await sendEmail(topJobs);

    console.log("✅ Process completed successfully");
  } catch (err) {
    console.error("❌ Fatal error:", err.message);
    process.exit(1);
  }
}

main();
