import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducer'

const defaultStore = window.context && window.context.INITIAL_STATE;
const clientStore = createStore(
    rootReducer, 
    defaultStore, 
    applyMiddleware(thunk)
)

export default clientStore;