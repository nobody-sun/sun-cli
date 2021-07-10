'use strict';

var commander = require('commander');
var _asyncToGenerator = require('@babel/runtime/helpers/asyncToGenerator');
var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var inquirer = require('inquirer');
var path = require('path');
var fs = require('fs-extra');
var gitDownLoad = require('download-git-repo');
var ora = require('ora');
var chalk = require('chalk');
var figlet = require('figlet');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _asyncToGenerator__default = /*#__PURE__*/_interopDefaultLegacy(_asyncToGenerator);
var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);
var inquirer__default = /*#__PURE__*/_interopDefaultLegacy(inquirer);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var gitDownLoad__default = /*#__PURE__*/_interopDefaultLegacy(gitDownLoad);
var ora__default = /*#__PURE__*/_interopDefaultLegacy(ora);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var figlet__default = /*#__PURE__*/_interopDefaultLegacy(figlet);

// 应用类型
var appTypes = [{
  id: 1,
  name: 'rollup开发',
  value: 1,
  repo: 'nobody-sun/template-rollup#master'
}, {
  id: 2,
  value: 2,
  name: 'vue3+vite(pc模板)',
  repo: 'nobody-sun/template-rollup#master'
}];

class loading {
  constructor() {
    _defineProperty__default['default'](this, "spiner", void 0);

    this.spiner = null;
  }

  start(msg) {
    this.spiner = ora__default['default']({
      text: msg,
      color: 'blue'
    }).start();
  }

  stop() {
    this.spiner.stop();
  }

  success() {
    var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'success';
    this.spiner.succeed(msg);
  }

  error() {
    var errorMsg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'failed';
    this.spiner.fail(errorMsg);
  }

}

var loading$1 = new loading();

class Create {
  // 应用名称
  // 应用类型
  // 是否强制执行
  // 写入目录
  constructor() {
    _defineProperty__default['default'](this, "appName", void 0);

    _defineProperty__default['default'](this, "appType", void 0);

    _defineProperty__default['default'](this, "force", void 0);

    _defineProperty__default['default'](this, "target", void 0);

    this.appName = '';
    this.appType = null;
    this.target = '';
    this.force = false;
  }

  downLoadTemplate() {
    var _this = this;

    return _asyncToGenerator__default['default'](function* () {
      var {
        repo
      } = appTypes.find(item => item.value === _this.appType);
      var isSuccess = yield new Promise((resolve, reject) => {
        try {
          loading$1.start('download template...');
          gitDownLoad__default['default'](repo, _this.target, {}, err => {
            if (err) {
              console.log('err :>> ', err);
              loading$1.error();
              reject(err);
            }

            console.log('zouwanle :>> ');
            loading$1.success();
            resolve(true);
          });
        } catch (error) {
          console.log('error :>> ', error);
        }
      });

      if (isSuccess) {
        console.log('去修改模板 :>> ');
      }
    })();
  }

  mkdirCwd() {
    var _this2 = this;

    return _asyncToGenerator__default['default'](function* () {
      // 询问、创建文件目录
      var cwd = process.cwd();
      var targetAir = _this2.target = path__default['default'].join(cwd, _this2.appName);
      console.log('this.target===', _this2.target);

      if (!fs__default['default'].existsSync(targetAir)) {
        yield fs__default['default'].mkdirSync(targetAir);
      } else if (_this2.force) {
        yield fs__default['default'].remove(targetAir);
        fs__default['default'].mkdirSync(targetAir);
      } else {
        // 目录已存在，并且没--force 询问是否覆盖
        _this2.force = yield inquirer__default['default'].prompt([{
          type: 'list',
          name: 'force',
          message: '检测到文件目录已存在，是否强制覆盖？',
          choices: [{
            name: '是(Y)',
            value: true
          }, {
            name: '否(N)',
            value: false
          }]
        }]);
        if (_this2.force) _this2.mkdirCwd();
        return;
      }

      console.log('①文件目录创建成功！');

      _this2.downLoadTemplate();
    })();
  }

  getAppInfo() {
    var _this3 = this;

    return _asyncToGenerator__default['default'](function* () {
      var answers = yield inquirer__default['default'].prompt([{
        type: 'input',
        //type： input, number, confirm, list, checkbox ...
        name: 'appName',
        // key 名
        message: '请输入应用名称：',
        // 提示信息
        default: path__default['default'].basename(process.cwd()) // 默认当前文件夹名称

      }, {
        type: 'list',
        name: 'appType',
        message: '请选择模板类型',
        choices: [...appTypes]
      }]);
      var {
        appType,
        appName
      } = answers;
      _this3.appName = appName;
      _this3.appType = appType;
      console.log('拉代码 :>> ', _this3.appName, _this3.appType);
    })();
  }

  createAction(options) {
    var _this4 = this;

    return _asyncToGenerator__default['default'](function* () {
      _this4.force = !!options.force;

      try {
        // 询问应用信息
        yield _this4.getAppInfo(); // 创建 || 检查文件目录

        yield _this4.mkdirCwd();
      } catch (error) {
        console.log('createAction==', error);
      }
    })();
  }

}

var createCmd = new Create();

var name = "sun-cli";
var version = "1.0.0";
var description = "Improve the convenience of personal development";
var main = "bin/index.js";
var bin = "bin/index.js";
var scripts = {
	test: "dev",
	build: "rollup -c",
	watch: "rollup -c --watch",
	eslint: "eslint . --ext .jsx,.js,.tsx,.ts",
	"eslint:fix": "eslint . --ext .jsx,.js,.tsx,.ts --fix"
};
var repository = {
	type: "git",
	url: "git+https://github.com/nobody-sun/sun-cli.git"
};
var author = "sun76";
var license = "ISC";
var bugs = {
	url: "https://github.com/nobody-sun/sun-cli/issues"
};
var homepage = "https://github.com/nobody-sun/sun-cli#readme";
var dependencies = {
	"@babel/polyfill": "^7.12.1",
	inquirer: "^8.1.1",
	ora: "^5.4.1"
};
var devDependencies = {
	"@babel/cli": "^7.14.5",
	"@babel/core": "^7.14.6",
	"@babel/plugin-proposal-class-properties": "^7.14.5",
	"@babel/plugin-transform-runtime": "^7.14.5",
	"@babel/preset-env": "^7.14.7",
	"@babel/preset-typescript": "^7.14.5",
	"@rollup/plugin-json": "^4.1.0",
	"@typescript-eslint/parser": "^4.28.2",
	chalk: "^4.1.1",
	commander: "^8.0.0",
	"download-git-repo": "^3.0.2",
	eslint: "^7.30.0",
	"eslint-plugin-prettier": "^3.4.0",
	figlet: "^1.5.0",
	prettier: "^2.3.2",
	"rollup-plugin-babel": "^4.4.0",
	"rollup-plugin-node-resolve": "^5.2.0",
	"rollup-plugin-typescript2": "^0.30.0",
	typescript: "^4.3.5"
};
var pkg = {
	name: name,
	version: version,
	description: description,
	main: main,
	bin: bin,
	scripts: scripts,
	repository: repository,
	author: author,
	license: license,
	bugs: bugs,
	homepage: homepage,
	dependencies: dependencies,
	devDependencies: devDependencies
};

var program = new commander.Command(); // 创建命令

var create = () => {
  program.version(pkg.version).command('create') // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
  .option('-f, --force', 'overwrite target directory if it exist').description('create a new project from template').action(options => {
    console.log('options123==', options);
    createCmd.createAction(options);
  });
}; // test

var test = () => {
  program.version(pkg.version).command('test').description(chalk__default['default'].green('hahha')).action(() => {
    console.log("\r\nRun ".concat(chalk__default['default'].cyan("zr <command> --help"), " for detailed usage of given command\r\n"));
  });
}; // 监听help命令

var help = () => {
  program.on('--help', () => {
    console.log('\r\n' + figlet__default['default'].textSync('SUN-CLI', {
      font: '3D Diagonal',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: false
    }));
    console.log("\r\nRun ".concat(chalk__default['default'].cyanBright("sun-cli <command> --help"), " for detailed usage of given command\r\n"));
  });
};

var run = () => {
  var taskList = [create, help, test];
  taskList.forEach(task => task());
  program.parse(process.argv);
};

run();
