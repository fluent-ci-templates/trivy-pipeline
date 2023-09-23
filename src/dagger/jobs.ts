import Client from "../../deps.ts";

export enum Job {
  config = "config",
  fs = "fs",
  repo = "repo",
  image = "image",
  sbom = "sbom",
}

export const exclude = [".fluentci"];

export const config = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const args = ["config", src];
  const TRIVY_EXIT_CODE = Deno.env.get("TRIVY_EXIT_CODE") || "0";
  args.push(`--exit-code=${TRIVY_EXIT_CODE}`);

  const ctr = client
    .pipeline(Job.config)
    .container()
    .from("aquasec/trivy")
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(args);

  const result = await ctr.stdout();

  console.log(result);
};

export const fs = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const args = ["fs", src];
  const TRIVY_EXIT_CODE = Deno.env.get("TRIVY_EXIT_CODE") || "0";
  args.push(`--exit-code=${TRIVY_EXIT_CODE}`);

  const ctr = client
    .pipeline(Job.fs)
    .container()
    .from("aquasec/trivy")
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(args);

  const result = await ctr.stdout();

  console.log(result);
};

export const repo = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const args = ["repo", Deno.env.get("TRIVY_REPO_URL") || src];
  const TRIVY_EXIT_CODE = Deno.env.get("TRIVY_EXIT_CODE") || "0";
  args.push(`--exit-code=${TRIVY_EXIT_CODE}`);

  const ctr = client
    .pipeline(Job.repo)
    .container()
    .from("aquasec/trivy")
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(args);

  const result = await ctr.stdout();

  console.log(result);
};

export const image = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  if (!Deno.env.has("TRIVY_IMAGE")) {
    throw new Error("TRIVY_IMAGE is not set");
  }

  const args = ["image", Deno.env.get("TRIVY_IMAGE")!];
  const TRIVY_EXIT_CODE = Deno.env.get("TRIVY_EXIT_CODE") || "0";
  args.push(`--exit-code=${TRIVY_EXIT_CODE}`);

  const ctr = client
    .pipeline(Job.image)
    .container()
    .from("aquasec/trivy")
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(args);

  const result = await ctr.stdout();

  console.log(result);
};

export const sbom = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  if (!Deno.env.has("TRIVY_SBOM_PATH")) {
    throw new Error("TRIVY_SBOM_PATH is not set");
  }

  const args = ["sbom", Deno.env.get("TRIVY_SBOM_PATH")!];
  const TRIVY_EXIT_CODE = Deno.env.get("TRIVY_EXIT_CODE") || "0";
  args.push(`--exit-code=${TRIVY_EXIT_CODE}`);

  const ctr = client
    .pipeline(Job.config)
    .container()
    .from("aquasec/trivy")
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(args);

  const result = await ctr.stdout();

  console.log(result);
};

export type JobExec = (
  client: Client,
  src?: string
) =>
  | Promise<void>
  | ((
      client: Client,
      src?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<void>);

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
