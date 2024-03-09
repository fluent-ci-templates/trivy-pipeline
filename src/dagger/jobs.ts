/**
 * @module trivy
 * @description This module provides a set of functions for scanning container images, repositories, and local filesystems for vulnerabilities using Trivy.
 */

import { Directory, File, dag, env, exit } from "../../deps.ts";
import { getDirectory } from "./lib.ts";

export enum Job {
  config = "config",
  fs = "fs",
  repo = "repo",
  image = "image",
  sbom = "sbom",
}

export const exclude = [".fluentci"];

/**
 * Scan a configuration file
 *
 * @function
 * @description Scan a configuration file
 * @param {Directory | string} src
 * @param {number} exitCode
 * @param {string} format
 * @param {string} outputFile
 * @returns {Promise<File | string>}
 */
export async function config(
  src: Directory | string,
  exitCode = 0,
  format = "table",
  outputFile?: string
): Promise<File | string> {
  const context = await getDirectory(src);
  const args = ["config", "."];
  const TRIVY_EXIT_CODE = env.get("TRIVY_EXIT_CODE") || exitCode;
  args.push(`--exit-code=${TRIVY_EXIT_CODE}`);
  args.push(`--format=${format}`);

  outputFile = outputFile || "output";
  args.push(`--output=${outputFile}`);

  const ctr = dag
    .pipeline(Job.config)
    .container()
    .from("aquasec/trivy")
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(args);

  await ctr.stdout();
  const id = await ctr.file(`/app/${outputFile}`).id();
  return id;
}

/**
 * @function
 * @description Scan a local filesystem
 * @param {Directory | string} src
 * @param {number} exitCode
 * @param {string} format
 * @param {string} outputFile
 * @returns {Promise<File | string>}
 */
export async function fs(
  src: Directory | string,
  exitCode = 0,
  format = "table",
  outputFile?: string
): Promise<File | string> {
  const context = await getDirectory(src);
  const args = ["fs", "."];
  const TRIVY_EXIT_CODE = env.get("TRIVY_EXIT_CODE") || exitCode;
  args.push(`--exit-code=${TRIVY_EXIT_CODE}`);

  if (format) {
    args.push(`--format=${format}`);
  }

  outputFile = outputFile || "output";
  args.push(`--output=${outputFile}`);

  const ctr = dag
    .pipeline(Job.fs)
    .container()
    .from("aquasec/trivy")
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(args);

  await ctr.stdout();

  const id = await ctr.file(`/app/${outputFile}`).id();
  return id;
}

/**
 * @function
 * @description Scan a repository
 * @param {Directory | string} src
 * @param {number} exitCode
 * @param {string} repoUrl
 * @param {string} format
 * @param {string} outputFile
 * @returns {Promise<File | string>}
 */
export async function repo(
  src: Directory | string,
  exitCode = 0,
  repoUrl?: string,
  format = "table",
  outputFile?: string
): Promise<File | string> {
  const context = await getDirectory(src);
  const args = ["repo", env.get("TRIVY_REPO_URL") || repoUrl || "."];
  const TRIVY_EXIT_CODE = env.get("TRIVY_EXIT_CODE") || exitCode;
  args.push(`--exit-code=${TRIVY_EXIT_CODE}`);
  args.push(`--format=${format}`);

  outputFile = outputFile || "output";
  args.push(`--output=${outputFile}`);

  const ctr = dag
    .pipeline(Job.repo)
    .container()
    .from("aquasec/trivy")
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(args);
  await ctr.stdout();

  return ctr.file(`/app/${outputFile}`).id();
}

/**
 * @function
 * @description Scan a container image
 * @param {Directory | string} src
 * @param {number} exitCode
 * @param {string} image
 * @param {string} format
 * @param {string} outputFile
 * @returns {Promise<File | string>}
 */
export async function image(
  src: Directory | string,
  exitCode = 0,
  image?: string,
  format = "table",
  outputFile?: string
): Promise<File | string> {
  const context = await getDirectory(src);
  if (!env.has("TRIVY_IMAGE") && !image) {
    console.log("TRIVY_IMAGE is not set");
    exit(1);
    return "";
  }

  const args = ["image", env.get("TRIVY_IMAGE") || image!];
  args.push(`--format=${format}`);

  outputFile = outputFile || "output";
  args.push(`--output=${outputFile}`);

  const TRIVY_EXIT_CODE = env.get("TRIVY_EXIT_CODE") || exitCode;
  args.push(`--exit-code=${TRIVY_EXIT_CODE}`);

  const ctr = dag
    .pipeline(Job.image)
    .container()
    .from("aquasec/trivy")
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(args);

  await ctr.stdout();
  return ctr.file(`/app/${outputFile}`).id();
}

/**
 * @function
 * @description Scan a software bill of materials
 * @param {Directory | string} src
 * @param {number} exitCode
 * @param {string} path
 * @param {string} format
 * @param {string} outputFile
 * @returns {Promise<File | string>}
 */
export async function sbom(
  src: Directory | string,
  exitCode = 0,
  path?: string,
  format = "table",
  outputFile?: string
): Promise<File | string> {
  const context = await getDirectory(src);
  if (!env.has("TRIVY_SBOM_PATH") && !path) {
    console.error("TRIVY_SBOM_PATH is not set");
    exit(1);
    return "";
  }

  const args = ["sbom", env.get("TRIVY_SBOM_PATH") || path!];
  const TRIVY_EXIT_CODE = env.get("TRIVY_EXIT_CODE") || exitCode;
  args.push(`--exit-code=${TRIVY_EXIT_CODE}`);
  args.push(`--format=${format}`);

  outputFile = outputFile || "output";
  args.push(`--output=${outputFile}`);

  const ctr = dag
    .pipeline(Job.config)
    .container()
    .from("aquasec/trivy")
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(args);

  await ctr.stdout();
  return ctr.file(`/app/${outputFile}`).id();
}

export type JobExec = (
  src: Directory | string,
  exitCode?: number,
  path?: string,
  format?: string,
  outputFile?: string
) => Promise<File | string>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.config]: config,
  [Job.fs]: fs,
  [Job.repo]: repo,
  [Job.image]: image,
  [Job.sbom]: sbom,
};
