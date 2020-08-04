import * as core from "@actions/core";
import * as github from "@actions/github";
import {Octokit} from "@octokit/core";
import fs from "fs";
import * as path from "path";
import String from "./string";

export async function downloadFile(
  octokit: Octokit,
  assetId: string,
  assetUrl: string,
  assetName: string,
  assetContentType: string,
  assetSize: number,
  outputPath: string
): Promise<void> {
  //const assetName: string = path.basename(assetPath);

  // Setup headers for API call, see Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-upload-release-asset for more information
  //const headers = {Accept: assetContentType, "content-type": assetContentType, "content-length": assetSize};
  const headers = {Accept: assetContentType, "content-length": assetSize};

  // Upload a release asset
  // API Documentation: https://developer.github.com/v3/repos/releases/#upload-a-release-asset
  // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-upload-release-asset

  core.debug(`assetId ${assetId}`);
  core.debug(`assetUrl ${assetUrl}`);
  core.debug(`assetName ${assetName}`);
  core.debug(`assetContentType ${assetContentType}`);
  core.debug(`assetSize ${assetSize}`);
  core.debug(`outputPath ${outputPath}`);

  const outFilePath: string = path.resolve(outputPath, assetName);
  const file = fs.createWriteStream(outFilePath);

  core.debug(`outFilePath ${outFilePath}`);

  const buffer = await octokit.repos.getReleaseAsset({
    url: assetUrl,
    headers
    // headers: {
    //   Accept: assetContentType,
    //   content-length, assetContentType
    // }
    //asset_id: assetId
    //name: fileName
    //access_token: token
  });
  core.debug("1");
  file.write(buffer.data);
  core.debug("2");
  file.end();
  core.debug("3");
}

async function run(): Promise<void> {
  try {
    if (github.context.eventName !== "release") {
      core.info("Not assets download. This actions is only for release event.");
      return;
    }

    const token: string = process.env.GITHUB_TOKEN as string;
    if (String.isNullOrEmpty(token)) {
      throw new Error("Not token definition");
    }
    const octokit = github.getOctokit(token);

    const outputPath = core.getInput("outputPath", {required: false});
    core.debug(`outputPath: ${outputPath}`);
    if (String.isNullOrEmpty(outputPath)) core.info("outputPath: Default ");

    const downloads: Promise<void>[] = [];

    for (const asset of github.context.payload.release.assets) {
      core.debug(`url: ${asset.url}`);
      core.debug(`browser_download_url: ${asset.browser_download_url}`);
      core.debug(`name: ${asset.name}`);
      core.debug(`content_type: ${asset.content_type}`);

      downloads.push(downloadFile(octokit, asset.id, asset.url, asset.name, asset.content_type, asset.size, outputPath));
    }
    await Promise.all(downloads);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
