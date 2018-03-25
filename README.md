# F.A.M - Frontend Assets Manager

## Config

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
	      "target": [],
	      "assets": {
	        "js": {
	          "sourcePaths": [],
	          "regex": "myjs",
	          "prepend": ""
	        },
	        "css": {
	          "sourcePaths": [],
	          "regex": "mycss",
	          "prepend": ""
	        }
	      }
	    }
	  }
	}

 - `defaults`: if not other more specific values are passed in the config key, the default values will be used.
 - `defaults.css.prepend` and `defaults.js.prepend`: if present, they'll be appended to all css and js file paths to be injected
 - `config`: each key in the config represents a set of source files to be injected in a list of target files. If this is used with webpack, each entry here will represent a webpack entry
 - `config.\<entry name\>`: a config set
 - `config.\<entry name\>.target`: a list of files to have the assets of this set injected
 - `config.\<entry name\>.assets.js`: everything about js
 - `config.\<entry name\>.assets.js.sourcePaths`: a list of Javascript files to inject in the target of this config set
 - `config.\<entry name\>.assets.js.regex`: regex to search for when injecting in the target. If defined, this will overwrite the regex defined in the defaults key.
 - `config.\<entry name\>.assets.js.prepend`: value to prepend to Javascript files before injecting them
 - `config.\<entry name\>.assets.css`: everything about css
  - `config.\<entry name\>.assets.css.sourcePaths`: a list of CSS files to inject in the target of this config set
 - `config.\<entry name\>.assets.css.regex`: regex to search for when injecting in the target. If defined, this will overwrite the regex defined in the defaults key.
 - `config.\<entry name\>.assets.css.prepend`: value to prepend to CSS files before injecting them


## CLI
`fam`
Reads the config file and inject assets into views.


`fam-build-config`
Creates a new config file with defaults.

## Webpack
`const FAMPlugin = require('fam')`;
