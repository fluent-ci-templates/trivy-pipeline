# Trivy Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Ftrivy_pipeline&query=%24.version)](https://pkg.fluentci.io/trivy_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.37)
[![dagger-min-version](https://img.shields.io/badge/dagger-v0.11.7-blue?color=3D66FF&labelColor=000000)](https://dagger.io)
[![](https://jsr.io/badges/@fluentci/trivy)](https://jsr.io/@fluentci/trivy)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/trivy-pipeline)](https://codecov.io/gh/fluent-ci-templates/trivy-pipeline)
[![ci](https://github.com/fluent-ci-templates/trivy-pipeline/actions/workflows/ci.yml/badge.svg)](https://github.com/fluent-ci-templates/trivy-pipeline/actions/workflows/ci.yml)

A ready-to-use CI/CD Pipeline for scanning vulnerabilities using [Trivy](https://trivy.dev/).

## 🚀 Usage

Run the following command:

```bash
fluentci run trivy_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t trivy
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
fluentci run .
```

## 🧩 Dagger Module

Use as a [Dagger](https://dagger.io) Module:

```bash
dagger install github.com/fluent-ci-templates/trivy-pipeline@main
```

Call a function from the module:

```bash
dagger call config --src . --exit-code 0
dagger call image --src . --exit-code 0 --image hashicorp/terraform:1.6
```

## 🛠️ Environment variables

| Variable                | Description                                                         |
| ----------------------- | ------------------------------------------------------------------- |
| TRIVY_IMAGE             | The image to scan                                                   |
| TRIVY_SBOM_PATH         | The path to the software bill of materials                          |
| TRIVY_EXIT_CODE         | Specify exit code when any security issues are found. Defaults to 0 |

## ✨ Jobs

| Job      | Description                                   |
| -------- | --------------------------------------------- |
| config   | Scan configuration files                      |
| fs       | Scan a local filesystem                       |
| repo     | Scan a repository                             |
| image    | Scan a container image                        |
| sbom     | Scan a software bill of materials             |

```typescript
config(
  src: Directory | string,
  exitCode?: number,
  format?: string,
  outputFile?: string
): Promise<string>

fs(
  src: Directory | string,
  exitCode?: number,
  format?: string,
  outputFile?: string
): Promise<string>

repo(
  src: Directory | string,
  exitCode?: number,
  repoUrl?: string,
  format?: string,
  outputFile?: string
): Promise<string>

image(
  src: Directory | string,
  exitCode?: number,
  image?: string,
  format?: string,
  outputFile?: string
): Promise<string>

```

## 👨‍💻 Programmatic usage

You can also use this pipeline programmatically:

```ts
import { fs } from "jsr:@fluentci/trivy";

await fs(".");
```
