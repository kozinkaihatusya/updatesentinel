#!/usr/bin/env node
import { Command } from "commander";
import { renderMarkdownReport, scanComposeFile } from "./index";

const program = new Command();

program
  .name("updatesentinel")
  .description("Open-source update risk checker for self-hosted Docker Compose stacks")
  .version("0.1.0");

program
  .command("scan")
  .description("Scan a docker-compose.yml file and print an update risk report")
  .argument("<compose-file>", "Path to docker-compose.yml")
  .option("--format <format>", "Report format: markdown", "markdown")
  .action((composeFile: string, options: { format: string }) => {
    if (options.format !== "markdown") {
      throw new Error(`Unsupported format "${options.format}". The MVP supports only "markdown".`);
    }

    const result = scanComposeFile(composeFile);
    process.stdout.write(renderMarkdownReport(result));
  });

program.exitOverride();

try {
  program.parse(process.argv);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`UpdateSentinel error: ${message}\n`);
  process.exit(1);
}
