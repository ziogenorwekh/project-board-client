import {configureStore, createSlice} from '@reduxjs/toolkit';

let user = createSlice(
    {
        name: 'user',
        initialState: {username: '', userId: '', admin: ''},
        reducers: {
            setUsername(state, data) {
                state.username = data.payload;
            },
            setUserId(state, data) {
                state.userId = data.payload;
            },
            setAdmin(state, data) {
                state.admin = data.payload;
            },
            logout(stats) {
                stats.username = '';
                stats.userId = '';
                stats.admin = '';
            },
        }
    }
)


export let {setUsername, setUserId, logout, setAdmin} = user.actions;
export default configureStore({
    reducer: {
        user: user.reducer,
    }
})
