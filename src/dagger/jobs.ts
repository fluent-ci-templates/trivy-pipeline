import { Directory, File, dag } from "../../deps.ts";
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
 * @function
 * @description Scan a configuration file
 * @param {Directory | string} src
 * @param {number} exitCode
 * @param {string} format
 * @param {string} output
 * @returns {Promise<File | string>}
 */
export async function config(
  src: Directory | string,
  exitCode?: number,
  format?: string,
  output?: string
): Promise<File | string> {
  const context = await getDirectory(dag, src);
  const args = ["config", "."];
  const TRIVY_EXIT_CODE = Deno.env.get("TRIVY_EXIT_CODE") || exitCode || "0";
  args.push(`--exit-code=${TRIVY_EXIT_CODE}`);

  if (format) {
    args.push(`--format=${format}`);
  }

  output = output || "output";
  args.push(`--output=${output}`);

  const ctr = dag
    .pipeline(Job.config)
    .container()
    .from("aquasec/trivy")
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(args);

  await ctr.stdout();
  const id = await ctr.file(`/app/${output}`).id();
  return id;
}

/**
 * @function
 * @description Scan a local filesystem
 * @param {Directory | string} src
 * @param {number} exitCode
 * @param {string} format
 * @param {string} output
 * @returns {Promise<File | string>}
 */
export async function fs(
  src: Directory | string,
  exitCode?: number,
  format?: string,
  output?: string
): Promise<File | string> {
  const context = await getDirectory(dag, src);
  const args = ["fs", "."];
  const TRIVY_EXIT_CODE = Deno.env.get("TRIVY_EXIT_CODE") || exitCode || "0";
  args.push(`--exit-code=${TRIVY_EXIT_CODE}`);

  if (format) {
    args.push(`--format=${format}`);
  }

  output = output || "output";
  args.push(`--output=${output}`);

  const ctr = dag
    .pipeline(Job.fs)
    .container()
    .from("aquasec/trivy")
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(args);

  await ctr.stdout();

  const id = await ctr.file(`/app/${output}`).id();
  return id;
}

/**
 * @function
 * @description Scan a repository
 * @param {Directory | string} src
 * @param {number} exitCode
 * @param {string} repoUrl
 * @param {string} format
 * @param {string} output
 * @returns {Promise<File | string>}
 */
export async function repo(
  src: Directory | string,
  exitCode?: number,
  repoUrl?: string,
  format?: string,
  output?: string
): Promise<File | string> {
  const context = await getDirectory(dag, src);
  const args = ["repo", Deno.env.get("TRIVY_REPO_URL") || repoUrl || "."];
  const TRIVY_EXIT_CODE = Deno.env.get("TRIVY_EXIT_CODE") || exitCode || "0";
  args.push(`--exit-code=${TRIVY_EXIT_CODE}`);

  if (format) {
    args.push(`--format=${format}`);
  }

  output = output || "output";
  args.push(`--output=${output}`);

  const ctr = dag
    .pipeline(Job.repo)
    .container()
    .from("aquasec/trivy")
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(args);
  await ctr.stdout();

  const id = await ctr.file(`/app/${output}`).id();
  return id;
}

/**
 * @function
 * @description Scan a container image
 * @param {Directory | string} src
 * @param {number} exitCode
 * @param {string} image
 * @param {string} format
 * @param {string} output
 * @returns {Promise<File | string>}
 */
export async function image(
  src: Directory | string,
  exitCode?: number,
  image?: string,
  format?: string,
  output?: string
): Promise<File | string> {
  const context = await getDirectory(dag, src);
  if (!Deno.env.has("TRIVY_IMAGE") && !image) {
    console.log("TRIVY_IMAGE is not set");
    Deno.exit(1);
  }

  const args = ["image", Deno.env.get("TRIVY_IMAGE") || image!];

  if (format) {
    args.push(`--format=${format}`);
  }

  output = output || "output";
  args.push(`--output=${output}`);

  const TRIVY_EXIT_CODE = Deno.env.get("TRIVY_EXIT_CODE") || exitCode || "0";
  args.push(`--exit-code=${TRIVY_EXIT_CODE}`);

  const ctr = dag
    .pipeline(Job.image)
    .container()
    .from("aquasec/trivy")
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(args);

  await ctr.stdout();
  const id = await ctr.file(`/app/${output}`).id();
  return id;
}

/**
 * @function
 * @description Scan a software bill of materials
 * @param {Directory | string} src
 * @param {number} exitCode
 * @param {string} path
 * @param {string} format
 * @param {string} output
 * @returns {Promise<File | string>}
 */
export async function sbom(
  src: Directory | string,
  exitCode?: number,
  path?: string,
  format?: string,
  output?: string
): Promise<File | string> {
  const context = await getDirectory(dag, src);
  if (!Deno.env.has("TRIVY_SBOM_PATH") && !path) {
    console.error("TRIVY_SBOM_PATH is not set");
    Deno.exit(1);
  }

  const args = ["sbom", Deno.env.get("TRIVY_SBOM_PATH") || path!];
  const TRIVY_EXIT_CODE = Deno.env.get("TRIVY_EXIT_CODE") || exitCode || "0";
  args.push(`--exit-code=${TRIVY_EXIT_CODE}`);

  if (format) {
    args.push(`--format=${format}`);
  }

  output = output || "output";
  args.push(`--output=${output}`);

  const ctr = dag
    .pipeline(Job.config)
    .container()
    .from("aquasec/trivy")
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(args);

  await ctr.stdout();
  const id = await ctr.file(`/app/${output}`).id();
  return id;
}

export type JobExec = (
  src: Directory | string,
  exitCode?: number,
  path?: string,
  format?: string,
  output?: string
) => Promise<File | string>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.config]: config,
  [Job.fs]: fs,
  [Job.repo]: repo,
  [Job.image]: image,
  [Job.sbom]: sbom,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.config]: "Scan a configuration file",
  [Job.fs]: "Scan a local filesystem",
  [Job.repo]: "Scan a repository",
  [Job.image]: "Scan a container image",
  [Job.sbom]: "Scan a software bill of materials",
};
