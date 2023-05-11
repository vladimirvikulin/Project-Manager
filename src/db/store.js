import { createStore } from 'redux'

let initialState = {
    groups: [],
    completed: 0,
    notCompleted: 0
}

const store = createStore((state = initialState, action) => {
    switch(action.type) {
        case 'SET_COMPLETED':
            let completed = action.completed
            return {...state, completed}
        case 'SET_NOT_COMPLETED':
            let notCompleted = action.notCompleted
            return {...state, notCompleted}
        case 'SET_GROUPS':
            let groups = action.groups
            return {...state, groups}
        default: return state
    }
})

export const setCompleted = (completed) => ({type: 'SET_COMPLETED', completed})
export const setNotCompleted = (notCompleted) => ({type: 'SET_NOT_COMPLETED', notCompleted})
export const setLocalGroups = (groups) => ({type: 'SET_GROUPS', groups})
window.store = store
export default store