import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import ReactRefreshRspackPlugin from "@rspack/plugin-react-refresh";
import path from "path";
import { fileURLToPath } from "url";

const isDev = process.env.NODE_ENV === "development";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ["last 2 versions", "> 0.2%", "not dead", "Firefox ESR"];

export default defineConfig({
	entry: {
		main: "./src/main.tsx"
	},
	resolve: {
		extensions: ["...", ".ts", ".tsx", ".jsx"],
		alias: {
			"@adenta/ui": path.resolve(__dirname, "../ui/src"),
			"@adenta/core": path.resolve(__dirname, "../core/src"),
			"@adenta/cli": path.resolve(__dirname, "../cli/src")
		},
		modules: [
			path.resolve(__dirname, "node_modules"),
			path.resolve(__dirname, "../../node_modules"),
		]
	},
	module: {
		rules: [
			{
				test: /\.svg$/,
				type: "asset"
			},
			{
				test: /\.(jsx?|tsx?)$/,
				use: [
					{
						loader: "builtin:swc-loader",
						options: {
							jsc: {
								parser: {
									syntax: "typescript",
									tsx: true
								},
								transform: {
									react: {
										runtime: "automatic",
										development: isDev,
										refresh: isDev
									}
								}
							},
							env: { targets }
						}
					}
				]
			},
			{
				test: /\.css$/,
				type: "css"
			}
		]
	},
	plugins: [
		new rspack.HtmlRspackPlugin({
			template: "./index.html"
		}),
		isDev && new ReactRefreshRspackPlugin()
	].filter(Boolean),
	experiments: {
		css: true,
	},
});
