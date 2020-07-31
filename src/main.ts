import * as core from "@actions/core";
import * as github from "@actions/github";
import * as Webhooks from "@octokit/webhooks";
//import { WebhookPayload } from "@actions/github/lib/interfaces";

//import { GitHub, context } from "@actions/github/lib/utils";

async function run(): Promise<void> {
  try {
    if (github.context.eventName !== "release") {
      core.debug("Not assets download");
      return;
    }

    const repository = github.context.repo.repo;
    core.debug(`repository: ${repository}`);

    const owner = github.context.repo.owner;
    core.debug(`owner: ${owner}`);

    const issue = github.context.payload.number;
    core.debug(`issue: ${issue}`);

    const releasePayload = github.context.payload as Webhooks.Webhooks.WebhookPayloadRelease;

    for (const element of releasePayload.release.assets) {
      core.info(`browser_download_url: ${element.browser_download_url}`);
      core.info(`name: ${element.name}`);
      core.info(`content_type: ${element.content_type}`);
    }

    //const github = new GitHub(process.env.GITHUB_TOKEN);
    //const aa = github.context.payload as WebhookPayload.
    //const token = core.getInput("repo-token");
    // const octokit1 = github.getOctokit(token);
    // github.context.payload.repository?.owner

    // const assets = octokit1.repos.listReleaseAssets(
    //   github.context.payload.repository?.owner,
    //   github.context.payload.repository
    //   // repo,
    //   // release_id,
    // );
    //const assets = github.context.repo.repo octokit .repos.listReleaseAssets();

    // const pullNumber = context.payload.pull_request.number;
    // const octokit = github.getOctokit(GITHUB_TOKEN);
    // const owner = context.payload.sender.login;
    // const repo = context.payload.repository.name;
    // const newComment = octokit.issues.createComment({
    //   owner,
    //   repo,
    //   issue_number: pullNumber,
    //   body,
    // });

    // octokit.repos.listReleaseAssets({
    //   owner,
    //   repo,
    //   release_id,
    // });
    // Parameters

    // if (github.context.ref.startsWith("refs/heads")) {
    //   core.debug("Headers");
    //   //const refs = github.context.ref.split('/');
    //   //version = github.context.ref.replace('refs/tags/release/', '');
    //   const branchName = github.context.ref.split("/").pop();
    //   const runNumber = github.context.runNumber;
    //   core.debug(`branchName: ${branchName}`);
    //   core.debug(`runNumber: ${runNumber}`);

    //   version = `${branchName}.${runNumber}`;
    // } else if (github.context.ref.startsWith("refs/tags/")) {
    //   core.debug("Tag");
    //   const tagName = github.context.ref.split("/").pop();
    //   core.debug(`tagName: ${tagName}`);

    //   version = `${tagName}`;
    // }

    // if (version.toLocaleUpperCase().startsWith("V")) {
    //   version = version.substr(1);
    // }

    // core.debug(`Version: ${version}`);
    // core.setOutput("version", version);
    // core.info(`Version: ${version}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
