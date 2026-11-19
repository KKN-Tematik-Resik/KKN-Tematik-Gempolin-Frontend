import { pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

export async function resolve(specifier, context, defaultResolve) {
  if (specifier.startsWith("@/")) {
    const subpath = specifier.slice(2);
    const basePath = path.resolve(process.cwd(), "src", subpath);
    const candidates = [
      basePath + ".ts",
      basePath + ".tsx",
      basePath + ".js",
      path.join(basePath, "index.ts"),
      path.join(basePath, "index.tsx"),
      basePath,
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return defaultResolve(pathToFileURL(candidate).href, context);
      }
    }
  }
  return defaultResolve(specifier, context);
}
