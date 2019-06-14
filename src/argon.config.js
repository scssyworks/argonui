const target = `dist`;
const source = `source`;
const username = `admin`;
const password = username;
const port = `4502`;
const clientlibDist = `apps/settings/wcm/designs`;
const projectName = `argonui`;

module.exports = {
    projectName,
    target,
    source,
    clientlibPath: `${target}/jcr_root/${clientlibDist}/${projectName}/clientlibs`,
    server: `http://${username}:${password}@localhost:${port}`,
    // AEM deploy configuration
    aem: {
        src: {
            atomPath: `<%= config.source %>/templates/atoms`,
            moleculePath: `<%= config.source %>/templates/molecules`,
            componentPath: `<%= config.source %>/templates/components`,
            content: `<%= config.app %>/jcr_root/content/${projectName}-ux/**/.content.xml`,
            contentXML: `<%= config.app %>/jcr_root/**/.content.xml`,
            components: `<%= config.app %>/jcr_root/**/*.{html,xml,txt}`,
            models: `<%= config.app %>/jcr_root/apps/**/*.js`,
            staticassets: `<%= config.app %>/jcr_root/apps/settings/wcm/**/*.{js,css}`,
            mediaassets: `<%= config.app %>/jcr_root/**/*.{jpg,mov,png,mp4,svg}`,
            fontassets: `<%= config.app %>/jcr_root/**/*.{otf,eot,ttf,woff}`,
            jsonData: `<%= config.app %>/jcr_root/**/*.json`
        },
        target: {
            atomPath: `<%= config.app %>/jcr_root/apps/${projectName}/components/atoms`,
            moleculePath: `<%= config.app %>/jcr_root/apps/${projectName}/components/molecules`,
            componentPath: `<%= config.app %>/jcr_root/apps/${projectName}/components/content`
        },
        uxContentDescriptor: `${projectName}-ux`,
        componentGroup: `demo-${projectName}`,
        componentGroupName: `Argon UI`
    },
    // Assemble configuration
    assemble: {
        options: {
            layouts: `*.hbs`,
            layoutdir: `<%= config.source %>/templates/layouts`,
            data: [
                `<%= config.source %>/data/*.{json,yml}`,
                `<%= config.source %>/templates/components/{,*/}*.json`
            ],
            partials: [
                `<%= config.source %>/templates/components/{,*/}*.hbs`
            ],
            collections: [
                {
                    name: `components`,
                    inflection: `component`,
                    sortorder: `ascending`,
                    sortby: `datetime`
                }
            ],
            helpers: [
                `<%= config.source %>/helpers/*`
            ]
        },
        pages: {
            options: {
                aemuxlib: {
                    contentRoot: `<%= config.app %>/jcr_root/content/${projectName}-ux`,
                    designJcrPath: `/${clientlibDist}/${projectName}`,
                    jcrFileRoot: `<%= config.app %>/jcr_root/`,
                    wrapJsonData: true
                }
            },
            files: [
                {
                    expand: true,
                    src: [
                        `<%= config.source %>/templates/components/**/**/**/*.hbs`
                    ],
                    dest: `<%= config.app %>/jcr_root/apps/${projectName}/components/content`
                }
            ]
        }
    },
    // Copy configuration
    copy: {
        uxlibdemo: [
            {
                expand: true,
                dot: true,
                cwd: `<%= config.source %>/clientlib-format`,
                src: [
                    `${clientlibDist}/**`
                ],
                dest: `<%= config.app %>/jcr_root/`
            }
        ],
        jsonData: [
            {
                expand: true,
                flatten: true,
                cwd: `<%= config.source %>/templates/components/`,
                src: [
                    `**/data/*.json`
                ],
                dest: `<%= config.app %>/jcr_root/${clientlibDist}/${projectName}/jsonData`
            }
        ]
    },
    // Webpack configuration
    webpack: {
        filePath: `${clientlibDist}/${projectName}/clientlibs/[name].publish/js/[name].js`,
        chunkFilePath: `${clientlibDist}/${projectName}/clientlibs/[name].publish/js/[name].[chunkhash].js`,
        root: `${target}/jcr_root`,
        modes: {
            dev: `development`,
            prod: `production`
        },
        entry: {
            global: `${source}/scripts/core/core.js`
        },
        cacheGroups: {
            vendor: {
                test: `[\\\\/]node_modules[\\\\/]|[\\\\/]vendor\\.scss`,
                name: `vendor`,
                minSize: 0,
                chunks: `all`
            },
            common: {
                testMultiple: true,
                name: `common`,
                minSize: 0,
                chunks: `all`
            },
            default_en: {
                test: `[\\\\/]default[\\\\/]en[\\\\/]base.scss`,
                name: `default.en`,
                enforce: true,
                chunks: `all`
            }
        },
        componentGroups: {
            common: [
                `${source}/scripts/common/`,
                `${source}/scripts/utils/`
            ]
        },
        handlebars: {
            helpersFolder: `${source}/scripts/helpers`,
            currentRelativeFolder: `${source}/templates-hbs`
        },
        fonts: {
            fontPath: `${clientlibDist}/${projectName}/clientlibs/global.publish/fonts`
        },
        clean: target,
        cssPath: `${clientlibDist}/${projectName}/clientlibs/[name].publish/css/[name].css`,
        cssChunkPath: `${clientlibDist}/${projectName}/clientlibs/[name].publish/css/[name].css`
    },
    // Remove chunk hash from clientlib files
    chunkrename: {
        vendor: `${clientlibDist}/${projectName}/clientlibs/vendor.publish/js/vendor.js`,
        common: `${clientlibDist}/${projectName}/clientlibs/common.publish/js/common.js`,
        'default.en': `${clientlibDist}/${projectName}/clientlibs/default.en.publish/js/default.js`
    },
    // Clientlibs configuration
    clientlibs: {
        vendor: {
            category: 'argonui.vendor',
            basePath: `${clientlibDist}/${projectName}/clientlibs/vendor.publish`,
            paths: [
                `${clientlibDist}/${projectName}/clientlibs/vendor.publish`
            ]
        },
        global: {
            category: 'argonui.global',
            basePath: `${clientlibDist}/${projectName}/clientlibs/global.publish`,
            paths: [
                `${clientlibDist}/${projectName}/clientlibs/global.publish`,
                `${clientlibDist}/${projectName}/clientlibs/common.publish`,
            ]
        }
    },
    // Watch for changes
    watch: {
        assemble: {
            files: [
                `<%= config.source %>/templates/components/**/*.hbs`,
                `<%= config.source %>/templates/layouts/**/*.hbs`,
                `<%= config.source %>/templates/components/**/*.json`
            ],
            tasks: [
                `assemble`,
                `copy:jsonData`,
                `aemdeploy:components`,
                `aemdeploy:models`,
                `aemdeploy:jsonData`
            ]
        },
        static: {
            files: [
                `<%= config.source %>/scripts/**/*.js`,
                `<%= config.source %>/templates/**/*.js`,
                `<%= config.source %>/styles/*.scss`,
                `<%= config.source %>/templates/components/**/*.scss`
            ],
            tasks: [
                `shell:lintingDev`,
                `shell:webpackDev`,
                `shell:removeChunkHash`,
                `copy:uxlibdemo`,
                `copy:jsonData`,
                `assemble`,
                `aemcomponentcopy:uxlib`,
                `aemdeploy`
            ]
        },
        aem: {
            files: [
                `<%= config.source %>/templates/components/**/*.html`
            ],
            tasks: [
                `aemcomponentcopy:uxlib`,
                `aemdeploy:components`
            ]
        }
    }
};