import Client, { connect } from "../../deps.ts";

export enum Job {
  config = "config",
  fs = "fs",
  repo = "repo",
  image = "image",
  sbom = "sbom",
}

export const exclude = [".fluentci"];

export const config = async (src = ".", exitCode?: number) => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const args = ["config", src];
    const TRIVY_EXIT_CODE = Deno.env.get("TRIVY_EXIT_CODE") || exitCode || "0";
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
  });
  return "Done";
};

export const fs = async (src = ".", exitCode?: number) => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const args = ["fs", src];
    const TRIVY_EXIT_CODE = Deno.env.get("TRIVY_EXIT_CODE") || exitCode || "0";
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
  });
  return "Done";
};

export const repo = async (src = ".", exitCode?: number, repoUrl?: string) => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const args = ["repo", Deno.env.get("TRIVY_REPO_URL") || repoUrl || src];
    const TRIVY_EXIT_CODE = Deno.env.get("TRIVY_EXIT_CODE") || exitCode || "0";
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
  });
  return "Done";
};

export const image = async (src = ".", exitCode?: number, image?: string) => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    if (!Deno.env.has("TRIVY_IMAGE") && !image) {
      throw new Error("TRIVY_IMAGE is not set");
    }

    const args = ["image", Deno.env.get("TRIVY_IMAGE") || image!];
    const TRIVY_EXIT_CODE = Deno.env.get("TRIVY_EXIT_CODE") || exitCode || "0";
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
  });
  return "Done";
};

export const sbom = async (src = ".", exitCode?: number, path?: string) => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    if (!Deno.env.has("TRIVY_SBOM_PATH") && !path) {
      throw new Error("TRIVY_SBOM_PATH is not set");
    }

    const args = ["sbom", Deno.env.get("TRIVY_SBOM_PATH") || path!];
    const TRIVY_EXIT_CODE = Deno.env.get("TRIVY_EXIT_CODE") || exitCode || "0";
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
  });
  return "Done";
};

export type JobExec = (
  src?: string,
  exitCode?: number
) =>
  | Promise<string>
  | ((src?: string, exitCode?: number, path?: string) => Promise<string>)
  | ((src?: string, exitCode?: number, repoUrl?: string) => Promise<string>)
  | ((src?: string, exitCode?: number, image?: string) => Promise<string>);

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
