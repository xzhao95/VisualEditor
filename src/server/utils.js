import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import Router from '../Router'

export const render = (req) => {
    const content = renderToString((
        <StaticRouter location={req.path} context={{}}>
            {Router}
        </StaticRouter>
    ))
    return `
        <html>
            <head>
                <title>ssr demo</title>
            </head>
            <body>
                <div id="root">${content}</div>
                <script src="/index.js"></script>
            </body>
        </html>
    `
}