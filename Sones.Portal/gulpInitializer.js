const webpack = require("./webpack.config");
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var Webpack = require('webpack');
var prodMode = new Webpack.DefinePlugin({
    'process.env': {
        'NODE_ENV': JSON.stringify('production')
    }
});

let context = {
    bundleOutPutFileDestination: "",
    sourceCodeFolder: "",
    bunldePath: "",
    sourceCodeDestination: "",
    pageDirectory:"",
    solutionFolder: "Code\\",
    webpackContext: {
        entry: "",
        output: {
            path: __dirname + "\\bundles",
            filename: "[name].js",
            chunkFilename: "[name].js"
        },
        resolve: webpack.resolve,
        module: webpack.module,
        plugins: webpack.plugins
    },
    spSaveCoreOptions: {
        siteUrl: 'http://sp2016/sites/config/',
        notification: true,
        flatten: false
    },
    spSaveCreds: {
        domain: "dc",
        username: 'administrator',
        password: 'P@ssword'
    }
}

function GetContext(solutionName, ProductMode) {
    if (solutionName == null || solutionName == undefined) {
        throw Error("Please select solution using --solution ");
    }
    if (ProductMode) {
        var Config = require("./src/" + solutionName + "/feature");
        context.webpackContext.plugins.push(new UglifyJSPlugin({ uglifyOptions: { compress: true } }));
        context.webpackContext.plugins.push(prodMode);
        context.webpackContext.output.path = __dirname + "\\deploy\\WebApps\\Portal\\Features\\" + Config.Config.Site + "\\" + Config.Config.Feature + "\\Code\\" + solutionName;
        context.pageDirectory = __dirname + "\\deploy\\WebApps\\Portal\\Features\\" + Config.Config.Site + "\\" + Config.Config.Feature + "\\Upload\\Pages\\" ;
    } else {
        context.webpackContext.devtool = webpack.devtool;
        context.webpackContext.output.path = __dirname + "\\bundles\\" + solutionName;
    }
    console.log("path : " + context.webpackContext.output.path)
    context.webpackContext.entry = ".\\src\\" + solutionName + "\\src\\index.tsx";
    context.bundleOutPutFileDestination = context.solutionFolder + "\\" + solutionName + "\\";
    context.bundlePath = ".\\bundles\\" + solutionName + "\\**"
    context.sourceCodeFolder = ".\\src\\" + solutionName;
    context.sourceCodeDestination = context.solutionFolder + "\\src\\" + solutionName;
    return context;
}

module.exports = { GetContext }
