import createApp from './main'

export default (context: any) => {
    return new Promise((resolve, reject) => {
        resolve(createApp())
    })
}
