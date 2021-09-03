import express from 'express'
import { render } from './utils'

const app = express();
// 使用express提供的static中间件,中间件会将所有静态文件的路由指向public文件夹
app.use(express.static('public'))

app.get('*', (req, res) =>  {
    res.send(render(req));
})

app.listen(3001, () => console.log('Exampleapp listening on port 3000'))