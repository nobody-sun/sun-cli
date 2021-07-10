import ora, { Ora } from 'ora'
class loading {
    spiner: Ora
    constructor() {
        this.spiner = null
    }
    start(msg: string) {
        this.spiner = ora({ text: msg, color: 'blue' }).start()
    }
    stop() {
        this.spiner.stop()
    }
    success(msg: string | undefined = 'success') {
        this.spiner.succeed(msg)
    }
    error(errorMsg: string | undefined = 'failed') {
        this.spiner.fail(errorMsg)
    }
}
export default new loading()
