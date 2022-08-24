const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                include: [path.resolve(__dirname, "src")]
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist")
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, "dist"),
        },
    },
    mode: "development"
}