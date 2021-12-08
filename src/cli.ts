import { program } from "commander";
import { defaultMergerOptions, mergeFromFilesToFile } from "./index";

const dispatch = (base, second, outFile, options) => {
  const entryOptions = Object.assign({}, defaultMergerOptions, options);

  mergeFromFilesToFile(base, second, outFile, entryOptions);

  console.log(`Merged sitemap to "${outFile}"`);
};

program
  .name("sitemap-merger")
  .arguments("<base-sitemap> <second-sitemap> <output-file>")
  .option("--format", "Pretty print the xml to output file")
  .action(dispatch);

program.parse(process.argv);
