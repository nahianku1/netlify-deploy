const core = require("@actions/core");
const { execSync } = require("child_process");

async function run() {
  try {
    // Get inputs from the action metadata
    const authToken = core.getInput("auth_token");
    const buildDir = core.getInput("build_directory");
    const siteName = core.getInput("site_name");

    // Set environment variables for Netlify CLI
    process.env.NETLIFY_AUTH_TOKEN = authToken;

    // Install Dependencies
    console.log("Installing Dependencies...");
    execSync(`npm ci`);

    // Building artifacts
    console.log("Building artifacts...");
    const createSiteOutput = execSync(`npm run build`);
    console.log(createSiteOutput);

    // Deploy to Netlify
    console.log("Running deployment commands...");
    execSync(`netlify deploy --dir=${buildDir} --site=${siteName} --prod`);

    console.log("Deployment to Netlify was successful.");
    const url = `Live URL:- https://${siteName}.netlify.app`;
    core.setOutput("live-url", url);
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
