import { combineReducers } from 'redux';
import theme from './theme'
import auth from './auth'

const rootReducer = combineReducers ({
   theme,
   auth
});

export default rootReducer;