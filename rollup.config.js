import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import image from '@rollup/plugin-image'
import nodePolyfills from "rollup-plugin-node-polyfills";
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

const name = pkg.name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, "$3")
  .replace(/^\w/, (m) => m.toUpperCase())
  .replace(/-\w/g, (m) => m[1].toUpperCase());

export default {
  input: "src/index.js",
  output: [
    { file: pkg.module, format: "es" },
    { file: pkg.main, format: "umd", name },
  ],
  plugins: [svelte(), nodePolyfills(), commonjs(), resolve(), image(), terser()],
};
