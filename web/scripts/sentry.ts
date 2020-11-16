// @ts-ignore
const SentryCli = require("@sentry/cli");

async function createReleaseAndUpload() {
  if (!process.env.npm_package_version) {
    console.warn("Release version is not set");
    return;
  }

  const token = process.env.SENTRY_AUTH_TOKEN;
  if (!token) {
    console.warn("SENTRY_AUTH_TOKEN is not set, cannot generate a release tag");
    return;
  }

  console.log(token);

  const release = `minimal-solo@${process.env.npm_package_version}`;
  const cli = new SentryCli();
  try {
    console.log("Creating sentry release " + release);
    await cli.releases.new(release);
    console.log("Uploading source maps");
    await cli.releases.uploadSourceMaps(release, {
      include: ["web/build/static/js"],
      urlPrefix: "~/static/js",
      rewrite: false,
    });
    console.log("Finalizing release");
    await cli.releases.finalize(release);
  } catch (e) {
    console.error("Source maps uploading failed:", e);
  }
}
createReleaseAndUpload();
