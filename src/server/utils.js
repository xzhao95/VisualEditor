import React from 'react'
import { renderToString } from 'react-dom/server'
import { matchPath, Route, StaticRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import getStore from '../store'
import routers from '../Router'

export const render = (req, res) => {
    const store = getStore();
    const matchRoutes = [];
    const promises = [];
    routers.some(route => {
        matchPath(req.path, route) ? matchRoutes.push(route) : ''
    })
    
    matchRoutes.forEach(item => {
        if(item.loadData) {
            promises.push(item.loadData(store))
        }
        
    })
    Promise.all(promises).then(() => {
        const content = renderToString((
            <Provider store={store}>
                <StaticRouter location={req.path} context={{}}>
                    <div>
                        {routers.map(router => (
                            <Route {...router}/>
                        ))}
                    </div>
                </StaticRouter>
            </Provider>
        ))
        res.send(`
        <html>
            <head>
                <title>ssr demo</title>
            </head>
            <body>
                <div id="root">${content}</div>
                <script src="/index.js"></script>
            </body>
        </html>
        `)
    })
}