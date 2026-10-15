const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const root = path.resolve(__dirname, "..");
const isWindows = process.platform === "win32";
const results = [];

function read(relative) {
  return fs.readFileSync(path.join(root, relative), "utf8");
}

function exists(relative) {
  return fs.existsSync(path.join(root, relative));
}

function command(command, args) {
  const result = cp.spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
  });
  return {
    status: result.status,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
  };
}

function nodeCommand(args) {
  return cp.spawnSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
  });
}

function check(name, fn) {
  try {
    const reason = fn();
    if (reason) {
      results.push({ name, ok: false, reason });
    } else {
      results.push({ name, ok: true });
    }
  } catch (error) {
    results.push({ name, ok: false, reason: error.message });
  }
}

function requiredSections(content, sections) {
  return sections.every((section) => content.includes(section));
}

check("manifest build-engineer", () => {
  const file = ".github/agents/build-engineer.agent.md";
  if (!exists(file)) return `${file} відсутній`;
  return requiredSections(read(file), ["Роль", "Заборонені дії", "Критерії успішного завершення"])
    ? ""
    : "відсутній обов'язковий розділ";
});

check("skills", () => {
  for (const skill of ["project-scaffold", "build-and-test", "github-actions"]) {
    const file = `.github/skills/${skill}/SKILL.md`;
    if (!exists(file)) return `${file} відсутній`;
    const content = read(file);
    const name = content.match(/^name:\s*["']?([^"'\r\n]+)["']?/m);
    if (!name || name[1].trim() !== skill) return `${file}: frontmatter name не збігається`;
    if (!requiredSections(content, ["Вхідні дані", "Перевірки", "Очікуваний результат", "Типовий сценарій помилки"])) {
      return `${file}: відсутній обов'язковий розділ`;
    }
  }
  return "";
});

check("commands", () => {
  for (const commandName of ["git-init", "create-project", "create-build", "create-actions", "check", "init"]) {
    const file = `.github/skills/${commandName}/SKILL.md`;
    if (!exists(file)) return `${file} відсутній`;
    const content = read(file);
    if (!/^description:\s*.+$/m.test(content)) return `${file}: відсутній description`;
    if (!requiredSections(content, ["Передумови", "Дії", "Повідомлення про помилку"])) {
      return `${file}: відсутній обов'язковий розділ`;
    }
  }
  return "";
});

check("порядок init", () => {
  const content = read(".github/skills/init/SKILL.md");
  const order = ["git-init", "create-project", "create-build", "create-actions", "check"];
  let previous = -1;
  for (const name of order) {
    const current = content.indexOf(`.github/skills/${name}/SKILL.md`);
    if (current <= previous) return "commands згадані не в правильному порядку";
    previous = current;
  }
  return "";
});

check("manifest і lockfile", () => {
  if (!exists("package.json") || !exists("package-lock.json")) return "package.json або package-lock.json відсутній";
  const packageJson = JSON.parse(read("package.json"));
  const scripts = packageJson.scripts || {};
  return ["start", "test", "build", "check"].every((name) => scripts[name])
    ? ""
    : "відсутній npm script";
});

check("Hello World", () => {
  if (!exists("src/hello.js")) return "src/hello.js відсутній";
  const result = nodeCommand(["src/hello.js"]);
  return result.status === 0 && result.stdout.trimEnd() === "Hello, World!"
    ? ""
    : "node src/hello.js не друкує рівно Hello, World!";
});

check("Jest BasicAddition", () => {
  const file = path.join(root, "node_modules", "jest", "bin", "jest.js");
  if (!fs.existsSync(file)) return "Jest не встановлено";
  const result = nodeCommand([file, "--json"]);
  let report;
  try {
    report = JSON.parse(result.stdout);
  } catch {
    return "вивід Jest не є JSON";
  }
  const assertion = (report.testResults || [])
    .flatMap((testFile) => testFile.assertionResults || [])
    .find((test) => test.title === "BasicAddition");
  return result.status === 0 && report.success === true && assertion && assertion.status === "passed"
    ? ""
    : "BasicAddition не пройшов або весь прогін неуспішний";
});

check("виконуваний build", () => {
  const file = isWindows ? "build/hello.exe" : "build/hello";
  if (!exists(file)) return `${file} відсутній`;
  const result = command(path.join(root, file), []);
  return result.status === 0 && result.stdout.trimEnd() === "Hello, World!"
    ? ""
    : `${file} не друкує рівно Hello, World!`;
});

check("GitHub Actions YAML", () => {
  if (!exists(".github/workflows/ci.yml")) return "workflow відсутній";
  const script = [
    "const y=require('yaml');",
    "const d=y.parse(require('fs').readFileSync('.github/workflows/ci.yml','utf8'));",
    "const branches=['develop','master'];",
    "if(!d.on||!d.on.push||!d.on.pull_request)process.exit(1);",
    "if(!branches.every(x=>d.on.push.branches.includes(x)&&d.on.pull_request.branches.includes(x)))process.exit(2);",
    "if(!d.jobs||Object.keys(d.jobs).length!==1)process.exit(3);",
    "const j=Object.values(d.jobs)[0];",
    "if(!j.strategy||!j.strategy.matrix||!['ubuntu-latest','windows-latest','macos-latest'].every(x=>j.strategy.matrix.os.includes(x)))process.exit(4);",
    "const runs=(j.steps||[]).filter(s=>s.run).map(s=>s.run);",
    "if(runs.some(run=>run!=='bash ci.sh'&&run!=='ci.bat'))process.exit(5);",
  ].join("");
  const result = nodeCommand(["-e", script]);
  return result.status === 0 ? "" : "YAML, job або matrix не відповідає вимогам";
});

check("Git ignore", () => {
  if (!exists(".gitignore")) return ".gitignore відсутній";
  const lines = read(".gitignore").split(/\r?\n/);
  if (!lines.includes("node_modules/") || !lines.includes("build/")) return "відсутні node_modules/ або build/";
  const result = command("git", ["ls-files"]);
  if (result.status !== 0) return "git недоступний";
  return result.stdout.split(/\r?\n/).some((file) => /^(node_modules|build)\//.test(file))
    ? "node_modules/ або build/ відстежуються"
    : "";
});

check("секрети", () => {
  const result = command("git", ["ls-files"]);
  if (result.status !== 0) return "git недоступний";
  const tokenPrefixes = ["p_", "o_", "u_", "s_", "r_"].map((suffix) => ["gh", suffix].join(""));
  const tokenPattern = new RegExp(`(?:${tokenPrefixes.join("|")})[A-Za-z0-9_\\-]{20,}`);
  const privateKeyPattern = new RegExp(["-----BEGIN", "(?: [A-Z0-9]+)? PRIVATE KEY-----"].join(""));
  for (const file of result.stdout.split(/\r?\n/).filter(Boolean).filter((name) => name !== "package-lock.json")) {
    const content = read(file);
    if (tokenPattern.test(content) || privateKeyPattern.test(content)) return `секрет знайдено у ${file}`;
  }
  return "";
});

let passed = 0;
results.forEach((result, index) => {
  if (result.ok) {
    passed += 1;
    console.log(`[PASS] ${index + 1}. ${result.name}`);
  } else {
    console.log(`[FAIL] ${index + 1}. ${result.name} — ${result.reason}`);
  }
});

if (passed === results.length) {
  console.log(`CHECK PASSED: ${passed}/${results.length}`);
  process.exitCode = 0;
} else {
  console.log(`CHECK FAILED: ${results.length - passed} з ${results.length} перевірок не пройдено`);
  process.exitCode = 1;
}
