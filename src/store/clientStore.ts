import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducer'

const defaultStore = (window as any).context && (window as any).context.INITIAL_STATE;
const clientStore = createStore(
    rootReducer, 
    defaultStore, 
    applyMiddleware(thunk)
)

export default clientStore;