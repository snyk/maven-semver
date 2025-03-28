import { parse } from "csv-parse";
import { stringify } from "csv-stringify";
import { compare } from "./lib/comparison.js";

async function main() {
  const parser = parse({
    cast: false,
    delimiter: ";",
    encoding: "utf8",
  });

  parser.on("error", function (err) {
    console.error(err.message);
  });

  const packages = new Map();
  parser.on("readable", function () {
    let record;
    while ((record = parser.read()) !== null) {
      packages.set(record[0], record[1].split(","));
    }
  });

  const fp = process.stdin;
  fp.on("data", (data) => {
    parser.write(data);
  });

  fp.on("end", () => {
    const stringifier = stringify({
      delimiter: ";",
    });

    stringifier.on("readable", function () {
      let row;
      while ((row = stringifier.read()) !== null) {
        process.stdout.write(row);
      }
    });

    stringifier.on("error", function (err) {
      console.error(err.message);
    });

    packages.forEach((v, k) => {
      v.sort(compare);
      stringifier.write([k, v.join(",")]);
    });

    stringifier.end();
  });
}

await main();
