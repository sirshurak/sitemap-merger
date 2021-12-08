import cheerio from "cheerio";
import { writeFileSync, readFileSync } from "fs";
import beautify from "xml-beautifier";

export interface MergerOptions {
  prettyPrint: boolean;
}

export const defaultMergerOptions: MergerOptions = {
  prettyPrint: false,
};

export function merge(
  sitemap1: string,
  sitemap2: string,
  options: MergerOptions = defaultMergerOptions
): string {
  const queryDoc1 = cheerio.load(sitemap1, {
    xmlMode: true,
  });
  const queryDoc2 = cheerio.load(sitemap2, {
    xmlMode: true,
  });

  const toAdd = [];
  const locs = queryDoc1("urlset url loc");
  queryDoc2("urlset url").map(function (_, url) {
    const text = queryDoc1(this).find("loc").text();
    if (
      !locs.filter(function () {
        return queryDoc1(this).text() === text;
      }).length
    )
      toAdd.push(url);
  });

  toAdd.forEach((add) => queryDoc1("urlset").append(add));

  const result = queryDoc1.html();
  return options?.prettyPrint ? beautify(result) : result;
}
export function mergeToFile(
  sitemap1: string,
  sitemap2: string,
  outfile: string,
  options: MergerOptions = defaultMergerOptions
) {
  writeFileSync(outfile, merge(sitemap1, sitemap2, options));
}

export function mergeFromFilesToFile(
  sitemapFilePath1: string,
  sitemapFilePath2: string,
  outfile: string,
  options: MergerOptions = defaultMergerOptions
) {
  writeFileSync(
    outfile,
    merge(
      readFileSync(sitemapFilePath1).toString(),
      readFileSync(sitemapFilePath2).toString(),
      options
    )
  );
}
