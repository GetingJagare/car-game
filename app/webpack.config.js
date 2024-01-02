import { resolve } from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

export default function ( env ) {
    return {
        mode: env.MODE === 'development' ? 'development' : 'production',
        entry: {
            main: './src/js/main.ts',
        },
        optimization: {
            minimize: true,
            minimizer: [
                new CssMinimizerPlugin(),
                new TerserPlugin( {
                    terserOptions: {
                        format: {
                            comments: false,
                        },
                    },
                    extractComments: false,
                } ),
            ],
        },
        plugins: [
            new MiniCssExtractPlugin( {
                filename: '[name].css',
            } ),
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "sass-loader",
                    ],
                },
            ],
        },
        output: {
            path: resolve( '.', 'dist' ),
            clean: true,
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
    };
}
