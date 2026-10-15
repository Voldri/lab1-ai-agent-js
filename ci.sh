#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
npm ci
npm test
npm run build

output="$(./build/hello)"
if [ "$output" != "Hello, World!" ]; then
  echo "Unexpected output: $output" >&2
  exit 1
fi

echo "CI OK"
