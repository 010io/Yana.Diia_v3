module.exports = {
  compress: false,
  removeComments: false,
  removeEmptyLines: false,
  includeFullDirectoryStructure: true,
  includeDiffs: true,
  includeLogs: true,
  output: [
    { style: "xml", file: "yana-diia-dump.xml" },
    { style: "markdown", file: "yana-diia-dump.md" },
    { style: "json", file: "yana-diia-dump.json" },
    { style: "plain", file: "yana-diia-dump.txt" }
  ]
};
