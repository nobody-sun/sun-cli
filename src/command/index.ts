import { Command } from 'commander'
import createCmd from './create'
import chalk from 'chalk'
import pkg from '../../package.json'
import figlet from 'figlet'
const program = new Command()
// 创建命令
export const create = () => {
    program
        .version(pkg.version)
        .command('create')
        // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
        .option('-f, --force', 'overwrite target directory if it exist')
        .description('create a new project from template')
        .action((options) => {
            console.log('options123==', options)
            createCmd.createAction(options)
        })
}

// test
export const test = () => {
    program
        .version(pkg.version)
        .command('test')
        .description(chalk.green('hahha'))
        .action(() => {
            console.log(
                `\r\nRun ${chalk.cyan(
                    `zr <command> --help`,
                )} for detailed usage of given command\r\n`,
            )
        })
}
// 监听help命令
export const help = () => {
    program.on('--help', () => {
        console.log(
            '\r\n' +
                figlet.textSync('SUN-CLI', {
                    font: '3D Diagonal',
                    horizontalLayout: 'default',
                    verticalLayout: 'default',
                    width: 80,
                    whitespaceBreak: false,
                }),
        )
        console.log(
            `\r\nRun ${chalk.cyanBright(
                `sun-cli <command> --help`,
            )} for detailed usage of given command\r\n`,
        )
    })
}
const run = () => {
    const taskList = [create, help, test]
    taskList.forEach((task) => task())
    program.parse(process.argv)
}
export default run
