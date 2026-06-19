require("dotenv").config();
const fs = require("fs");
const cron = require("node-cron");

const { fetchInternships } = require("./scrapers/internshala");
const { filterJobs } = require("./filters/jobFilter");
const { sendEmail } = require("./email/emailService");

async function runJobAgent() {
  console.log("🚀 Job Agent Running...");

  await fetchInternships();

  const jobs = JSON.parse(fs.readFileSync("data/jobs.json", "utf-8"));

  const filtered = filterJobs(jobs, {
    roles: ["Web", "Developer", "Full Stack", "Frontend", "Backend"],
    locations: ["Delhi", "Noida", "Remote"],
    minStipend: 0,
    allowRemote: true,
  });

  const topJobs = filtered.slice(0, 5);

  console.log("📊 Jobs Found:", filtered.length);
  console.log("📩 Sending Email with Top:", topJobs.length);

  await sendEmail(topJobs);

  console.log("✅ Cycle Complete");
}

/**
 * ⏰ CRON JOB (10 AM DAILY)
 * Format: minute hour day month weekday
 * 0 10 * * *  => 10:00 AM every day
 */
cron.schedule("0 10 * * *", () => {
  runJobAgent();
  console.log("⏰ Scheduled run at 10 AM triggered");
});

console.log("🤖 AI Job Agent is running in background...");
console.log("⏰ Waiting for 10:00 AM daily execution...");

// Optional: test run immediately
runJobAgent();
