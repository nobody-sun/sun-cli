interface AppType {
    id: number
    value: number
    name: string
    repo: string
}
// 应用类型
export const appTypes: AppType[] = [
    {
        id: 1,
        name: 'rollup开发',
        value: 1,
        repo: 'nobody-sun/template-rollup#master',
    },
    {
        id: 2,
        value: 2,
        name: 'vue3+vite(pc模板)',
        repo: 'nobody-sun/template-rollup#master',
    },
]
