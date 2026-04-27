#!/usr/bin/env node
import { Command, CommanderError } from "commander";
import { getExitCodeForFailOn, parseFailOnThreshold } from "./failOn";
import { renderJsonReport, renderMarkdownReport, scanComposeFile } from "./index";
import { getToolVersion } from "./version";

type OutputFormat = "markdown" | "json";

const program = new Command();

program
  .name("updatesentinel")
  .description("Open-source update risk checker for self-hosted Docker Compose stacks")
  .version(getToolVersion());

program
  .command("scan")
  .description("Scan a docker-compose.yml file and print an update risk report")
  .argument("<compose-file>", "Path to docker-compose.yml")
  .option("--format <format>", "Report format: markdown or json", "markdown")
  .option("--fail-on <severity>", "Exit 1 when findings meet threshold: high, medium, low, or none", "none")
  .action((composeFile: string, options: { format: string; failOn: string }) => {
    const format = parseOutputFormat(options.format);
    const failOn = parseFailOnThreshold(options.failOn);

    if (!format) {
      throw new Error(`Unsupported format "${options.format}". Supported formats are "markdown" and "json".`);
    }

    if (!failOn) {
      throw new Error(`Unsupported fail-on threshold "${options.failOn}". Supported values are "high", "medium", "low", and "none".`);
    }

    const result = scanComposeFile(composeFile);
    process.stdout.write(format === "json" ? renderJsonReport(result) : renderMarkdownReport(result));
    process.exitCode = getExitCodeForFailOn(result, failOn);
  });

program.exitOverride();

try {
  program.parse(process.argv);
} catch (error) {
  if (error instanceof CommanderError && error.exitCode === 0) {
    process.exit(0);
  }

  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`UpdateSentinel error: ${message}\n`);
  process.exit(2);
}

function parseOutputFormat(value: string): OutputFormat | undefined {
  return value === "markdown" || value === "json" ? value : undefined;
}
