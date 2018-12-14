const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    entry: './src/canvastools/ts/CanvasTools.ts',
    output: {
        filename: 'ct.js',
        path: path.resolve(__dirname, './dist/js'),
        libraryTarget: 'umd',
        library: 'CanvasTools',
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: require.resolve('snapsvg'),
                loader: 'imports-loader?this=>window,fix=>module.exports=0'
            }
          ]
      },
      resolve: {
         extensions: ['.ts', '.js'],  
         plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })]
      }
};