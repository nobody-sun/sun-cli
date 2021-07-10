import inquirer from 'inquirer'
import path from 'path'
import fs from 'fs-extra'
import { appTypes } from '../appTypes/index'
import gitDownLoad from 'download-git-repo'
import loading from '../../utils/loading'
class Create {
    appName: string // 应用名称
    appType: number // 应用类型
    force: boolean // 是否强制执行
    target: string // 写入目录
    constructor() {
        this.appName = ''
        this.appType = null
        this.target = ''
        this.force = false
    }
    async downLoadTemplate() {
        const { repo } = appTypes.find((item) => item.value === this.appType)
        const isSuccess = await new Promise((resolve, reject) => {
            try {
                loading.start('download template...')
                gitDownLoad(repo, this.target, {}, (err) => {
                    if (err) {
                        console.log('err :>> ', err)
                        loading.error()
                        reject(err)
                    }
                    console.log('zouwanle :>> ')
                    loading.success()
                    resolve(true)
                })
            } catch (error) {
                console.log('error :>> ', error)
            }
        })
        if (isSuccess) {
            console.log('去修改模板 :>> ')
        }
    }
    async mkdirCwd() {
        // 询问、创建文件目录
        const cwd = process.cwd()
        const targetAir = (this.target = path.join(cwd, this.appName))
        console.log('this.target===', this.target)
        if (!fs.existsSync(targetAir)) {
            await fs.mkdirSync(targetAir)
        } else if (this.force) {
            await fs.remove(targetAir)
            fs.mkdirSync(targetAir)
        } else {
            // 目录已存在，并且没--force 询问是否覆盖
            this.force = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'force',
                    message: '检测到文件目录已存在，是否强制覆盖？',
                    choices: [
                        { name: '是(Y)', value: true },
                        { name: '否(N)', value: false },
                    ],
                },
            ])
            if (this.force) this.mkdirCwd()
            return
        }
        console.log('①文件目录创建成功！')
        this.downLoadTemplate()
    }
    async getAppInfo() {
        const answers = await inquirer.prompt([
            {
                type: 'input', //type： input, number, confirm, list, checkbox ...
                name: 'appName', // key 名
                message: '请输入应用名称：', // 提示信息
                default: path.basename(process.cwd()), // 默认当前文件夹名称
            },
            {
                type: 'list',
                name: 'appType',
                message: '请选择模板类型',
                choices: [...appTypes],
            },
        ])
        const { appType, appName } = answers
        this.appName = appName
        this.appType = appType
        console.log('拉代码 :>> ', this.appName, this.appType)
    }
    async createAction(options: { force?: boolean }) {
        this.force = !!options.force
        try {
            // 询问应用信息
            await this.getAppInfo()
            // 创建 || 检查文件目录
            await this.mkdirCwd()
        } catch (error) {
            console.log('createAction==', error)
        }
    }
}
export default new Create()
