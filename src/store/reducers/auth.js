const initialState =  null;

 const reducer = (state = initialState, action) => {
    switch (action.type) {
       case 'LOGIN':
          return Object.assign({}, state, action.payload)
       default:
          return state;
    }
 }
 export default reducer;