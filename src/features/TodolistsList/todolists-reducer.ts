import {Dispatch} from 'redux';

import {ErrorType, ResultCode, todolistAPI, TodolistType} from 'api/todolist-api';
import {appActions, RequestStatusType} from 'app/app-reducer';
import {AxiosError} from 'axios';
import {handleServerAppError, handleServerNetworkError} from 'utils/error-utils';
import {fetchTasksTC} from './Task/tasks-reducer';
import {AppDispatch} from 'app/store';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: TodolistDomainType[] = []

const slice =  createSlice({
    name: 'todo',
    initialState,
    reducers: {
        removeTodolist: (state, action: PayloadAction<{todolistId: string}>) => {
            // return state.filter(t => t.id !== action.payload.todolistId)

            const index = state.findIndex(todo => todo.id === action.payload.todolistId)
            if (index !== -1) state.splice(index, 1)
        },
        addTodolist: (state, action: PayloadAction<{todolist: TodolistType}>) => {
            const newTodolist: TodolistDomainType = {...action.payload.todolist, filter: 'all', entityStatus: 'idle'}
            state.unshift(newTodolist)
        },
        changeTodolistTitle: (state, action: PayloadAction<{todolistId: string, title: string}>) => {
            const todo = state.find(todo => todo.id === action.payload.todolistId)
            if (todo) {
                todo.title = action.payload.title
            }
        },
        changeTodolistFilter: (state, action: PayloadAction<{todolistId: string, filter: FilterValuesType}>) => {
            const todo = state.find(todo => todo.id === action.payload.todolistId)
            if (todo) {
                todo.filter = action.payload.filter
            }
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{todolistId: string, entityStatus: RequestStatusType}>) => {
            const todo = state.find(todo => todo.id === action.payload.todolistId)
            if (todo) {
                todo.entityStatus = action.payload.entityStatus
            }
        },
        setTodolists: (state, action: PayloadAction<{todolists: TodolistType[]}>) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        },
        clearTodolistsData: (state, action: PayloadAction) => {
            return []
        },
    },
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions

// thunks creators
export const fetchTodolistsTC = () => (dispatch: AppDispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    todolistAPI.getTodolists()
        .then(res => {
            dispatch(todolistsActions.setTodolists({todolists: res.data}))
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return res.data
        })
        .then((todos) => {
            todos.forEach((tl) => {
                dispatch(fetchTasksTC(tl.id))
            })
        })
        .catch((e: AxiosError<ErrorType>) => {
            const error = e.response ? e.response?.data.messages[0].message : e.message
            handleServerNetworkError(dispatch, error)
        })
}

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    dispatch(todolistsActions.changeTodolistEntityStatus({todolistId, entityStatus: 'loading'}))
    todolistAPI.deleteTodolist(todolistId)
        .then(res => {
            if (res.data.resultCode === ResultCode.SUCCESS) {
                dispatch(todolistsActions.removeTodolist({todolistId}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch((e: AxiosError<ErrorType>) => {
            const error = e.response ? e.response?.data.messages[0].message : e.message
            handleServerNetworkError(dispatch, error)
        })
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    todolistAPI.createTodolist(title)
        .then(res => {
            if (res.data.resultCode === ResultCode.SUCCESS) {
                dispatch(todolistsActions.addTodolist({todolist: res.data.data.item}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch((e: AxiosError<ErrorType>) => {
            const error = e.response ? e.response?.data.messages[0].message : e.message
            handleServerNetworkError(dispatch, error)
        })
}

export const changeTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    dispatch(todolistsActions.changeTodolistEntityStatus({todolistId, entityStatus: 'loading'}))
    todolistAPI.updateTodolist(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(todolistsActions.changeTodolistTitle({todolistId, title}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
                dispatch(todolistsActions.changeTodolistEntityStatus({todolistId, entityStatus: 'succeeded'}))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch((e: AxiosError<ErrorType>) => {
            const error = e.response ? e.response?.data.messages[0].message : e.message
            handleServerNetworkError(dispatch, error)
        })
}

// types
export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}


