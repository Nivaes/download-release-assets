import * as core from "@actions/core";
import * as github from "@actions/github";
import * as thc from "typed-rest-client/HttpClient";
import fs from "fs";
import * as path from "path";
import {IHeaders} from "typed-rest-client/Interfaces";
import String from "./string";

export async function downloadFile(
  url: string,
  fileName: string,
  outputPath: string,
  content_type: string,
  token: string
): Promise<string> {
  const headers: IHeaders = {
    Accept: content_type,
    Connection: "keep-alive"
  };

  if (token !== "") {
    headers["Authorization"] = ` token ${token}`;
  }

  const client = new thc.HttpClient("download-release-assets");

  const response = await client.get(url, headers);

  if (response.message.statusCode !== 200) {
    throw new Error(`Unexpected response: ${response.message.statusCode} - ${response.message.statusMessage}`);
  }

  const outFilePath: string = path.resolve(outputPath, fileName);
  const fileStream: NodeJS.WritableStream = fs.createWriteStream(outFilePath);

  return new Promise((resolve, reject) => {
    response.message.on("error", err => {
      core.info(`Error to download ${url}`);
      return reject(err);
    });

    fileStream.on("error", err => {
      core.info(`Error to write ${outFilePath}`);
      return reject(err);
    });

    const outStream = response.message.pipe(fileStream);

    core.info(`Downloading file: ${url} to: ${outputPath}`);

    outStream.on("close", () => {
      return resolve(outFilePath);
    });
  });
}

async function run(): Promise<void> {
  try {
    if (github.context.eventName !== "release") {
      core.info("Not assets download. This actions is only for release event.");
      return;
    }

    const outputPath = core.getInput("outputPath", {required: false});
    core.debug(`outputPath: ${outputPath}`);
    if (String.isNullOrEmpty(outputPath)) core.info("outputPath: Default ");

    const token = core.getInput("token", {required: false});
    core.debug(`token: ${token}`);

    const downloads: Promise<string>[] = [];

    for (const asset of github.context.payload.release.assets) {
      core.debug(`browser_download_url: ${asset.browser_download_url}`);
      core.debug(`name: ${asset.name}`);
      core.debug(`content_type: ${asset.content_type}`);

      downloads.push(downloadFile(asset.url, asset.name, outputPath, asset.content_type, token));
    }
    await Promise.all(downloads);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
