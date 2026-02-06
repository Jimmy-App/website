import { spawn } from 'node:child_process';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const env = { ...process.env };
delete env.NODE_OPTIONS;

const nextBin = new URL('../node_modules/next/dist/bin/next', import.meta.url);
const nextBinPath = fileURLToPath(nextBin);
const child = spawn(process.execPath, [nextBinPath, 'dev', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
