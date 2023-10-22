import { gql } from "../../deps.ts";

export const config = gql`
  query config($src: String!, $exitCode: Int!) {
    config(src: $src, exitCode: $exitCode)
  }
`;

export const fs = gql`
  query fs($src: String!, $exitCode: Int!) {
    fs(src: $src, exitCode: $exitCode)
  }
`;

export const repo = gql`
  query repo($src: String!, $exitCode: Int!, $repoUrl: String!) {
    repo(src: $src, exitCode: $exitCode, repoUrl: $repoUrl)
  }
`;

export const image = gql`
  query image($src: String!, $exitCode: Int!, $image: String!) {
    image(src: $src, exitCode: $exitCode, image: $image)
  }
`;

export const sbom = gql`
  query sbom($src: String!, $exitCode: Int!, $path: String!) {
    sbom(src: $src, exitCode: $exitCode, path: $path)
  }
`;
