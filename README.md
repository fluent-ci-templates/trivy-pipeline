# Trivy Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Ftrivy_pipeline&query=%24.version)](https://pkg.fluentci.io/trivy_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.37)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/trivy-pipeline)](https://codecov.io/gh/fluent-ci-templates/trivy-pipeline)

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

```graphql
config(exitCode: Int!, src: String!): String

fs(exitCode: Int!, src: String!): String

image(
  exitCode: Int!, 
  image: String!, 
  src: String!
): String

repo(
  exitCode: Int!, 
  repoUrl: String!, 
  src: String!
): String

sbom(
  exitCode: Int!, 
  path: String!, 
  src: String!
): String
```
## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { fs } from "https://pkg.fluentci.io/trivy_pipeline@v0.2.2/mod.ts";

await fs();
```
