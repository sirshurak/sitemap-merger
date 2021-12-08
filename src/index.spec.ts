import cheerio from "cheerio";
import { existsSync, unlinkSync, writeFileSync } from "fs";
import { merge, mergeToFile, mergeFromFilesToFile } from "./index";

const fileBegin =
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';
const fileEnd = "</urlset>";

const file1 = `${fileBegin}
                    <url>
                        <loc>https://localhost</loc>
                        <lastmod>2021-12-07T20:45:33+00:00</lastmod>
                        <priority>1.00</priority>
                    </url>
                    <url>
                        <loc>https://localhost/teste</loc>
                        <lastmod>2021-12-07T20:45:33+00:00</lastmod>
                        <priority>1.00</priority>
                    </url>
               ${fileEnd}`;

const file2 = `${fileBegin}
                    <url>
                        <loc>https://localhost</loc>
                        <lastmod>2021-12-07T20:45:33+00:00</lastmod>
                        <priority>1.00</priority>
                    </url>
                    <url>
                        <loc>https://localhost/teste</loc>
                        <lastmod>2021-12-07T20:45:33+00:00</lastmod>
                        <priority>1.00</priority>
                    </url>
                    <url>
                        <loc>https://localhost/teste2</loc>
                        <lastmod>2021-12-07T20:45:33+00:00</lastmod>
                        <priority>1.00</priority>
                    </url>
               ${fileEnd}`;

describe("merge test", () => {
  it("should merge files", () => {
    const result = merge(file1, file2);
    expect(
      cheerio.load(result, {
        xmlMode: true,
      })("url")
    ).toHaveLength(3);
  });

  it("should merge files and pretty print", () => {
    const result = merge(file1, file2, { format: true });
    expect(
      cheerio.load(result, {
        xmlMode: true,
      })("url")
    ).toHaveLength(3);
  });

  it("should merge files with empty file 2", () => {
    const result = merge(file1, "");
    expect(
      cheerio.load(result, {
        xmlMode: true,
      })("url")
    ).toHaveLength(2);
  });

  it("should merge files with empty files", () => {
    const result = merge("", "");
    expect(result).toBe("");
  });
});

describe("mergeToFile test", () => {
  it("should merge files", () => {
    const fileName = "sitemap.xml";
    mergeToFile(file1, file2, fileName);
    expect(existsSync(fileName)).toBeTruthy();
    unlinkSync(fileName);
  });
});

describe("mergeFromFilesToFile test", () => {
  it("should merge from files and save", () => {
    const fileName = "sitemap.xml";
    const oldFileName = "old-sitemap.xml";
    const newFileName = "new-sitemap.xml";
    writeFileSync(oldFileName, file1);
    writeFileSync(newFileName, file2);
    mergeFromFilesToFile(oldFileName, newFileName, fileName);
    expect(existsSync(fileName)).toBeTruthy();
    unlinkSync(fileName);
    unlinkSync(oldFileName);
    unlinkSync(newFileName);
  });
});
