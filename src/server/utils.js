import React from 'react'
import fs from 'fs'
import { renderToString } from 'react-dom/server'
import { matchPath, Route, StaticRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import getStore from '../store/serverStore'
import routers from '../Router'

const serverRender = (req, store, context) => {
    const template = fs.readFileSync(process.cwd() + '/public/static/index.html', "utf8")
    const content = renderToString((
        <Provider store={store}>
            <StaticRouter location={req.path} context={context}>
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
    
    return template.replace("<!--app-->", content)
        .replace("<!--initial-state-->", initialState);
}

export const render = (req, res) => {
    const context = {css: []}
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
        res.send(serverRender(req, store, context))
    })
}