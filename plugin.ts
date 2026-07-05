// Fresh Plugin
// Documentation: https://github.com/user/fresh/blob/main/docs/plugins.md
// https://github.com/sinelaw/fresh/blob/master/docs/plugins/api/index.md
// https://getfresh.dev/docs/plugins/api

const editor = getEditor();
const pathSep = editor.pathJoin("a", "b").includes("/") ? "/" : "\\";

const NO_TERMINAL: number = -1;
let terminal: TerminalResult = {
  bufferId: NO_TERMINAL,
  terminalId: NO_TERMINAL,
  splitId: null,
};

// Languages list, not complete!!!.
// console.log(
//   `${JSON.stringify(Object.keys(editor.getConfig().languages).sort())}`,
// );

// Create a Map with initial key-value pairs
let defaultExecutors = new Map<string, string>([
  ["asm", ""],
  ["astro", ""],
  ["bash", 'chmod +x "${file}" && "${file}"'],
  ["bibtex", ""],
  ["bibtex-style", ""],
  ["c", 'zig run -lc "${file}"'],
  ["c3", ""],
  ["clojure", 'lein exec "${file}"'],
  ["cmake", ""],
  ["cmake-cache", ""],
  ["cpp", 'zig run -lc++ "${file}"'],
  ["csharp", 'scriptcs "${file}"'],
  ["css", ""],
  ["cuda", ""],
  ["dart", 'dart "${file}"'],
  ["dockerfile", ""],
  ["doxygen", ""],
  ["doxygen-config", ""],
  ["earthfile", ""],
  ["elixir", ""],
  ["erlang", 'escript "${file}"'],
  ["fish", 'chmod +x "${file}" && "${file}"'],
  [
    "fortran",
    'gfortran "${file}" -o "${extTmpDir}${/}${fileBasenameNoExtension}" && "${extTmpDir}${/}${fileBasenameNoExtension}"',
  ],
  ["fsharp", 'fsi "${file}"'],
  ["gas", ""],
  ["gdscript", ""],
  ["git-commit", ""],
  ["git-rebase", ""],
  ["gitattributes", ""],
  ["gitconfig", ""],
  ["gitignore", ""],
  ["gleam", 'gleam run -m "${fileDirnamename}${/}${fileBasenameNoExtension}"'],
  ["glsl", ""],
  ["go", 'go run "${file}"'],
  ["gomod", ""],
  ["graphql", ""],
  ["haskell", ""],
  ["hip", ""],
  ["hlsl", ""],
  ["html", ""],
  ["hyprlang", ""],
  ["ini", ""],
  ["java", 'java "${file}"'],
  ["javascript", 'node "${file}"'],
  ["json", ""],
  ["jsonc", ""],
  ["julia", 'julia "${file}"'],
  ["justfile", ""],
  ["kdl", ""],
  ["kotlin", ""],
  ["latex", ""],
  ["less", 'lessc "${file}" "${extTmpDir}${/}${fileBasenameNoExtension}.css"'],
  ["llvm-ir", ""],
  ["lua", ""],
  ["m4", ""],
  ["makefile", ""],
  ["markdown", ""],
  ["metal", ""],
  ["mlir", ""],
  ["nim", ""],
  ["nix", ""],
  ["nushell", ""],
  ["ocaml", 'ocaml "${file}"'],
  ["odin", ""],
  ["pbxproj", ""],
  ["perl", 'perl "${file}"'],
  ["php", 'php "${file}"'],
  ["pkg-config", ""],
  ["po", ""],
  ["powershell", 'powershell -ExecutionPolicy ByPass -File "${file}"'],
  ["protobuf", ""],
  ["python", 'python -u -X utf8 "${file}"'],
  ["r", 'Rscript "${file}"'],
  ["racket", 'racket "${file}"'],
  ["ruby", 'ruby "${file}"'],
  [
    "rust",
    'rustc "${file}" -o "${extTmpDir}${/}${fileBasenameNoExtension}" && "${extTmpDir}${/}${fileBasenameNoExtension}"',
  ],
  ["scala", 'scala "${file}"'],
  ["scss", 'scss --style expanded "${file}"'],
  ["slang", ""],
  ["smali", 'sml "${file}"'],
  ["solidity", ""],
  ["sql", ""],
  ["starlark", ""],
  ["svelte", ""],
  ["swift", 'swift "${file}"'],
  ["systemverilog", ""],
  ["templ", ""],
  ["terraform", ""],
  ["tex", ""],
  ["toml", ""],
  ["typescript", 'node "${file}"'],
  ["typst", ""],
  ["verilog", ""],
  ["vhdl", ""],
  ["vlang", 'v run "${file}"'],
  ["vue", ""],
  ["wavefront-obj", ""],
  ["wgsl", ""],
  ["windows-resource", ""],
  ["yaml", ""],
  ["zig", 'zig run "${file}"'],
]);

// Initial executer settings
for (const [langId, executor] of defaultExecutors) {
  editor.defineConfigString(`Executor:${langId}`, {
    default: executor,
    description: `Executor for ${langId}`,
  });
}

function getActiveBufferInfo(): BufferInfo | null {
  const bufferId = editor.getActiveBufferId();
  const bufferInfo = editor.getBufferInfo(bufferId);
  if (bufferInfo) {
    console.log(`Buffer Info: ${JSON.stringify(bufferInfo)}`);
    return bufferInfo;
  } else {
    console.log(`No active buffer info`);
    return null;
  }
}

function getExecutor(language: string): string | null {
  const executorDSL = editor.getPluginConfig()[`Executor:${language}`];
  if (executorDSL !== undefined && executorDSL.length > 0) {
    console.log(`Executor for ${language}: ${JSON.stringify(executorDSL)}`);
    return executorDSL;
  } else {
    console.log(`No executor defined for ${language}`);
    return null;
  }
}

function runInTerminal(src: string) {
  console.log("content", src);
  if (terminal.terminalId == NO_TERMINAL) {
    editor
      .createTerminal()
      .then((newTerminal: TerminalResult) => {
        console.log(`Created a terminal, ${JSON.stringify(newTerminal)}`);
        terminal.bufferId = newTerminal.bufferId;
        terminal.terminalId = newTerminal.terminalId;
        terminal.splitId = newTerminal.splitId;
        editor.sendTerminalInput(terminal.terminalId, src + "\n");
      })
      .catch((e) => {
        editor.debug(`Failed to create termonal, ${e}`);
      });
  } else {
    editor.showBuffer(terminal.bufferId);
    editor.sendTerminalInput(terminal.terminalId, src + "\n");
  }
}

async function runInBack() {
  console.log("Run in background");
}

function run(): void {
  // editor.setStatus("Hello zongou from your plugin!");
  const bufferInfo = getActiveBufferInfo();

  if (bufferInfo) {
    console.log(`Buffer Info: ${JSON.stringify(bufferInfo)}`);
    const path = bufferInfo.path;
    const language = bufferInfo.language;

    const executor = getExecutor(language);
    console.log(`Executor for ${language}: ${JSON.stringify(executor)}`);

    if (executor) {
      const filePath = bufferInfo.path;
      const fileBasename = editor.pathBasename(filePath);
      const fileBasenameNoExtension = editor.pathBasename(
        filePath,
        editor.pathExtname(filePath),
      );
      const fileExtname = editor.pathExtname(filePath);
      const fileDirname = editor.pathDirname(filePath);
      const fileDirnameBasename = editor.pathBasename(fileDirname);
      const tmpDirEnv = editor.getEnv("TMPDIR");
      const extTmpDir = tmpDirEnv ? tmpDirEnv : "/tmp";
      console.log("pathSeparator", editor.pathJoin('"', '"'));
      console.log(
        `filePath=${filePath}, fileBasename=${fileBasename}, fileBasenameNoExtension=${fileBasenameNoExtension}, fileExtname=${fileExtname}, fileDirname=${fileDirname}, fileDirnameBasename=${fileDirnameBasename}`,
      );
      editor
        .getBufferText(bufferInfo.id, 0, bufferInfo.length)
        .then((content) => {
          const command = executor
            .replace(/\$\{file\}/g, filePath)
            .replace(/\$\{fileBasename\}/g, fileBasename)
            .replace(/\$\{fileBasenameNoExtension\}/g, fileBasenameNoExtension)
            .replace(/\$\{fileExtname\}/g, fileExtname)
            .replace(/\$\{fileDirname\}/g, fileDirname)
            .replace(/\$\{fileDirnameBasename\}/g, fileDirnameBasename)
            .replace(/\$\{pathSeparator\}/g, pathSep)
            .replace(/\$\{\/\}/g, pathSep)
            .replace(/\$\{content\}/g, content)
            .replace(/\$\{extTmpDir\}/g, extTmpDir);

          console.log(`Command to run: ${command}`);
          runInTerminal(command);
        });
    }
  }
}
registerHandler("run", run);
editor.registerCommand("x", "Run Script", "run");

// Reset terminal state when the terminal exits
editor.on("terminal_exit", ({ terminal_id, exit_code }) => {
  editor.debug(`Terminal Exit, id=${terminal_id}, exit_code=${exit_code}`);
  if (terminal_id == terminal.terminalId) {
    terminal.bufferId = NO_TERMINAL;
    terminal.terminalId = NO_TERMINAL;
    terminal.splitId = null;
  }
});

function popUp(): void {
  editor.showActionPopup({
    id: "run",
    title: "Run Script",
    message: "Choose an action to run",
    actions: [
      { id: "run_code", label: "Run Code" },
      { id: "run_file", label: "Run File" },
    ],
  });
}
registerHandler("popUp", popUp);
editor.registerCommand("popUp", "Popup Demo", "popUp");

editor.on("action_popup_result", (data) => {
  console.log(`Action Popup Result: ${JSON.stringify(data)}`);
  // {"popup_id":"run","action_id":"run_code"}
  switch (data.popup_id) {
    case "run":
      switch (data.action_id) {
        case "run_code":
          console.log("run code");
          break;
        case "run_file":
          console.log("run file");
          break;
      }
      break;
  }
});
