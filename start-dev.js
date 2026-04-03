const { execSync } = require("child_process");
execSync("npx next dev --port 3000", { stdio: "inherit", cwd: __dirname });
