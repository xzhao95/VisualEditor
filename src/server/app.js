import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import Home from '../containers/Home'

const app = express();
const content = renderToString(<Home />)
// 使用express提供的static中间件,中间件会将所有静态文件的路由指向public文件夹
app.use(express.static('public'))

app.get('/', (req, res) => res.send(`
<html>
    <head>
        <title>ssr demo</title>
    </head>
    <body>
        <div id="root">
        ${content}
        </div>
        <script src="/index.js"></script>
    </body>
</html>
`))

app.listen(3001, () => console.log('Exampleapp listening on port 3000'))