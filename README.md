#  F.A.M - Frontend Assets Manager

[![CircleCI](https://circleci.com/gh/rafaelrozon/frontend-assets-manager.svg?style=svg)](https://circleci.com/gh/rafaelrozon/frontend-assets-manager)
[![codecov](https://codecov.io/gh/rafaelrozon/frontend-assets-manager/branch/master/graph/badge.svg)](https://codecov.io/gh/rafaelrozon/frontend-assets-manager)

This library can be used as a Webpack plugin to generate a manifest file of Javascript and CSS files and/or a tool to inject script and link tags in other files (html, template files, etc).


##  Config file

    {
      "defaults": {
        "js": {
          "regex": "js",
          "prepend": ""
        },
        "css": {
          "regex": "css",
          "prepend": ""
        },
        "prettyPrint": true,
        "pathFromRoot": "./assets.json"
      },
      "config": {
        "sample": {
          "dest": [],
          "prepend": "",
          "assets": {
            "js": {
              "src": [],
              "regex": "",
              "prepend": ""
            },
            "css": {
              "src": [],
              "regex": "",
              "prepend": ""
            }
          }
        }
      }
    }

In general, values specified closer to the leaf nodes of the json tree overwrite values higher in the tree. For example, a regex field specified under `sample.js.regex` will overwrite any other regex field higher in the tree. This applies to regex and prepend fields.

-  `defaults`: if no other more specific values are in the under the config key, the default values will be used.

-  `defaults.css.prepend` and `defaults.js.prepend`: if present, they'll be appended to all css and js file paths to be injected

-  `config`: each key in the config represents a set of source files to be injected in a list of destination files. If this is used with Webpack, each entry here will represent a Webpack entry

-  `config.<entry name>`: a config set

- `config.<entry name>.prepend`: prepend value for all file paths under the assets field

-  `config.<entry name>.dest`: this is the view, the html or template that receives the script and link tags containing the files specified in the assets field

-  `config.<entry name>.assets.js`: any Javascript related configuration for this config set

-  `config.<entry name>.assets.js.src`: a list of Javascript files to be injected in the dest of this config set

-  `config.<entry name>.assets.js.regex`: regex to search for when injecting in the destination. If defined, this will overwrite the regex defined in the defaults key.

-  `config.<entry name>.assets.js.prepend`: value to prepend to Javascript files before injecting them

-  `config.<entry name>.assets.css`: any CSS related configuration for this config set

-  `config.<entry name>.assets.css.src`: a list of CSS files to be injected in the target of this config set

-  `config.<entry name>.assets.css.regex`: regex to search for when injecting in the destination. If defined, this will overwrite the regex defined in the defaults key.

-  `config.<entry name>.assets.css.prepend`: value to prepend to CSS files before injecting them


##  View
In the files that will receive the injected script and link tags, add html comments with the regex specified in the config file. For example:

    // file: app.html
    <head>
        //...
        <!-- app:css -->
        <!-- endinject -->
    </head>
    <body>
        //...
        <!-- app:js -->
        <!-- endinject -->
    </body>

What is important here is:
-  that `app:css` and `app:js` are defined as a regex in your config file. They could be the defaults applied to all pages or specific regex for app.html, for example.

- Follow this pattern `<!-- myRegex --><!-- endinject -->`.  Replace `myRegex` with the proper regex from the config file. Everything else should  match the pattern. Otherwise the place to inject the tags won't be found.



##  CLI

    $ fam  [options]

Options:

    -c, --config [value]  Path to the config file (defaults to "./assets.json")

    -h, --help Output usage information

    -v, --version Output the version number

Reads the config file and inject assets into views.

    $ fam-build-config

Creates a new config file with defaults in the current directory.



##  Webpack

1- Import the plugin

    const FAMPlugin = require('fam');

2 - Add to the plugins key of Webpack config


    plugins: [
        new FAMPlugin({
            config: "./src/assets.json"
        }),
        //...
    ],
If you don't pass the object with  the config key, it'll assume you have an assets.json file in the root or your project.

#### TODO:
- Support different views per asset type
- Support multiple inject config per config set

