const initialState =  null;

 const reducer = (state = initialState, action) => {
    switch (action.type) {
       case 'SAVE_THEME':
          return Object.assign({}, state, action.payload)
       default:
          return state;
    }
 }
 export default reducer;