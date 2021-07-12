import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import image from "@rollup/plugin-image";
import livereload from "rollup-plugin-livereload";
import nodePolyfills from "rollup-plugin-node-polyfills";
import css from "rollup-plugin-css-only";

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn(
        "npm",
        ["run", "serve", "--", "--dev"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: true,
      },
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: "bundle.css" }),

    // Need this to polyfill `EventEmitter`
    nodePolyfills(),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),

    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    livereload("public"),

    image(),
  ],
  watch: {
    clearScreen: false,
  },
};
