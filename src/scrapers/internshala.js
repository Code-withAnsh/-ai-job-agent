const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

async function fetchInternships() {
  try {
    const { data } = await axios.get(
      "https://internshala.com/internships/web-development-internship"
    );

    const $ = cheerio.load(data);

    const internships = [];

    $(".individual_internship").each((index, element) => {
      const card = $(element);

      internships.push({
        title: card.find(".job-title-href").text().trim(),

        company: card.find(".company-name").text().trim(),

        location: card.find(".locations a").text().trim(),

        stipend: card.find(".stipend").text().trim(),

        duration: card.find(".row-1-item").eq(2).find("span").text().trim(),

        skills: card
          .find(".job_skill")
          .map((i, el) => $(el).text().trim())
          .get(),

        posted: card.find(".status-success span").text().trim(),

        applyLink:
          "https://internshala.com" + card.find(".job-title-href").attr("href"),
      });
    });

    fs.writeFileSync("data/jobs.json", JSON.stringify(internships, null, 2));

    console.log(`✅ Saved ${internships.length} internships`);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

module.exports = { fetchInternships };
