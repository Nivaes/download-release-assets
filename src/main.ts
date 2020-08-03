import * as core from "@actions/core";
import * as github from "@actions/github";
import {Octokit} from "@octokit/core";
// import * as thc from "typed-rest-client/HttpClient";
import fs from "fs";
import * as path from "path";
// import {IHeaders} from "typed-rest-client/Interfaces";
import String from "./string";
//import callbackGlob from "glob";
//import * as mimeTypes from "mime-types";

export async function downloadFile(
  octokit: Octokit,
  assetId: string,
  uploadUrl: string,
  fileName: string,
  content_type: string,
  outputPath: string,
  token: string
): Promise<void> {
  //const assetName: string = path.basename(assetPath);

  // Determine content-length for header to upload asset
  //const contentLength = (filePath: fs.PathLike) => fs.statSync(filePath).size;

  // Guess mime type using mime-types package - or fallback to application/octet-stream
  //const assetContentType = mimeTypes.lookup(assetName) || "application/octet-stream";

  //   // Setup headers for API call, see Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-upload-release-asset for more information
  //const headers = {"content-type": assetContentType, "content-length": contentLength(assetPath)};

  // Upload a release asset
  // API Documentation: https://developer.github.com/v3/repos/releases/#upload-a-release-asset
  // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-upload-release-asset

  core.debug(`assetId ${assetId}`);
  core.debug(`uploadUrl ${uploadUrl}`);
  core.debug(`fileName ${fileName}`);
  core.debug(`content_type ${content_type}`);
  core.debug(`outputPath ${outputPath}`);
  core.debug(`token ${token}`);

  const outFilePath: string = path.resolve(outputPath, fileName);
  const file = fs.createWriteStream(outFilePath);

  core.debug(`outFilePath ${outFilePath}`);

  const buffer = await octokit.repos.getReleaseAsset({
    //url: uploadUrl,
    headers: {
      Accept: content_type
    },
    asset_id: assetId
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

    const accessToken = core.getInput("token", {required: false});
    // core.debug(`token: ${token}`);

    //const downloads: Promise<void>[] = [];

    for (const asset of github.context.payload.release.assets) {
      core.debug(`url: ${asset.url}`);
      core.debug(`browser_download_url: ${asset.browser_download_url}`);
      core.debug(`name: ${asset.name}`);
      core.debug(`content_type: ${asset.content_type}`);

      //downloads.push(downloadFile(octokit, asset.url, asset.name, outputPath, asset.content_type));
      //await downloadFile(octokit, asset.url, asset.name, outputPath, asset.content_type);
      //await downloadFile(octokit, asset.id, github.context.payload.release.upload_url, asset.name, asset.content_type, outputPath);
      //await downloadFile(octokit, asset.id, github.context.payload.release.upload_url, asset.name, asset.content_type, outputPath);
      await downloadFile(octokit, asset.id, asset.url, asset.name, asset.content_type, outputPath, accessToken);
    }
    //await Promise.all(downloads);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
