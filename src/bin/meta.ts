#!/usr/bin/env node

import { run } from "../index.js";

process.on("uncaughtException", (err) => {
  console.error(err);
  process.exit(1);
});

run(process.cwd(), process.argv);
