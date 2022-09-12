
const { whenProd, POSTCSS_MODES } = require("@craco/craco");
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require("webpack");
const path = require("path");

module.exports = {
    reactScriptsVersion: "react-scripts",
    eslint: {
        enable: false,
    },
    style: {
        postcss: {
            mode: POSTCSS_MODES.extends,
            loaderOptions: {
                postcssOptions: {
                    ident: 'postcss',
                    plugins: {
                        'postcss-px-to-viewport': {
                            viewportWidth: 750
                        }
                    }
                }
            },
        }
    },
    babel: {
        plugins: [
            ['@babel/plugin-proposal-optional-chaining'],
            ['@babel/plugin-proposal-nullish-coalescing-operator'],
            ['@babel/plugin-proposal-logical-assignment-operators'],
            [
                'import', {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: 'css',
                }
            ]
        ],
    },
    webpack: {
        alias: {
            '@com': path.resolve(__dirname, "src/components/"),
            '@store': path.resolve(__dirname, "src/store/"),
            '@img': path.resolve(__dirname, "src/img/"),
            '@view': path.resolve(__dirname, "src/view/"),
            '@util': path.resolve(__dirname, "src/util/"),
            '@config': path.resolve(__dirname, "src/config/"),
            '@http$': path.resolve(__dirname, "src/util/http.js"),
        },
        plugins: {
            add: [
                new webpack.ProvidePlugin({
                    util: ['@util', 'default'],
                    useFetch: ['@com', 'useFetch'],
                }),
                ...whenProd(() => [
                    new TerserPlugin({
                        terserOptions: {
                            compress: {
                                ecma: 5,
                                warnings: false,
                                comparisons: false,
                                inline: 2,
                                drop_debugger: true,
                                drop_console: true
                            }
                        }
                    })
                ], [])
            ],
        },
    },
    devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
        devServerConfig.proxy = {
            '/api/ee/upload_cert': {
                target: 'http://34.96.233.224:8887',
                secure: false,
                // pathRewrite: { '^/api': '' },
            },
            '/api/': {
                target: 'http://34.96.233.224:8020',
                secure: false,
                // pathRewrite: { '^/api': '' },
            },
        }
        return devServerConfig;
    },
}