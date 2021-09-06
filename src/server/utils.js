import React from 'react'
import { renderToString } from 'react-dom/server'
import { matchPath, Route, StaticRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import getStore from '../store'
import routers from '../Router'

const serverRender = (req, store, context) => {
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
    // 注入数据
    const initialState = `<script>
        window.context = {
            INITIAL_STATE: ${JSON.stringify(store.getState())}
        }
    </script>`
}

export const render = (req, res) => {
    const store = getStore();
    const matchRoutes = [];
    const promises = [];
    routers.some(route => {
        matchPath(req.path, route) ? matchRoutes.push(route) : ''
    })
    
    matchRoutes.forEach(item => {
        if(item.loadData) {
            const promise = new Promise((resolve, reject) => {
                item.loadData(store).then(resolve).catch(resolve)
            })
            promises.push(promise)
        }
        
    })
    Promise.all(promises).then(() => {
        
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