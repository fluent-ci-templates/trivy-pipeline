# Trivy Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Ftrivy_pipeline&query=%24.version)](https://pkg.fluentci.io/trivy_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.37)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/trivy-pipeline)](https://codecov.io/gh/fluent-ci-templates/trivy-pipeline)

[![CodeSee](https://codesee-docs.s3.amazonaws.com/badge.svg?)](https://app.codesee.io/maps/public/25ddb0a0-c690-11ee-9af8-b973aab28c96)

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

## Dagger Module

Use as a [Dagger](https://dagger.io) Module:

```bash
dagger mod install github.com/fluent-ci-templates/trivy-pipeline@mod
```


## Environment variables

| Variable                | Description                                                         |
| ----------------------- | ------------------------------------------------------------------- |
| TRIVY_IMAGE             | The image to scan                                                   |
| TRIVY_SBOM_PATH         | The path to the software bill of materials                          |
| TRIVY_EXIT_CODE         | Specify exit code when any security issues are found. Defaults to 0 |

## Jobs

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
  output?: string
): Promise<string>

fs(
  src: Directory | string,
  exitCode?: number,
  format?: string,
  output?: string
): Promise<string>

repo(
  src: Directory | string,
  exitCode?: number,
  repoUrl?: string,
  format?: string,
  output?: string
): Promise<string>

image(
  src: Directory | string,
  exitCode?: number,
  image?: string,
  format?: string,
  output?: string
): Promise<string>


```
## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { fs } from "https://pkg.fluentci.io/trivy_pipeline@v0.3.2/mod.ts";

await fs(".");
```
