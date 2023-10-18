import {
  queryType,
  makeSchema,
  dirname,
  join,
  resolve,
  stringArg,
  nonNull,
  intArg,
} from "../../deps.ts";

import { config, fs, repo, image, sbom } from "./jobs.ts";

const Query = queryType({
  definition(t) {
    t.string("config", {
      args: {
        src: nonNull(stringArg()),
        exitCode: nonNull(intArg()),
      },
      resolve: async (_root, args, _ctx) =>
        await config(args.src, args.exitCode),
    });
    t.string("fs", {
      args: {
        src: nonNull(stringArg()),
        exitCode: nonNull(intArg()),
      },
      resolve: async (_root, args, _ctx) => await fs(args.src, args.exitCode),
    });
    t.string("repo", {
      args: {
        src: nonNull(stringArg()),
        exitCode: nonNull(intArg()),
        repoUrl: nonNull(stringArg()),
      },
      resolve: async (_root, args, _ctx) =>
        await repo(args.src, args.exitCode, args.repoUrl),
    });
    t.string("image", {
      args: {
        src: nonNull(stringArg()),
        exitCode: nonNull(intArg()),
        image: nonNull(stringArg()),
      },
      resolve: async (_root, args, _ctx) =>
        await image(args.src, args.exitCode, args.image),
    });
    t.string("sbom", {
      args: {
        src: nonNull(stringArg()),
        exitCode: nonNull(intArg()),
        path: nonNull(stringArg()),
      },
      resolve: async (_root, args, _ctx) =>
        await sbom(args.src, args.exitCode, args.path),
    });
  },
});

export const schema = makeSchema({
  types: [Query],
  outputs: {
    schema: resolve(join(dirname(".."), dirname(".."), "schema.graphql")),
    typegen: resolve(join(dirname(".."), dirname(".."), "gen", "nexus.ts")),
  },
});
