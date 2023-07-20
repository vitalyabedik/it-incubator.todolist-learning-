import {instance} from './instance';
import {AxiosResponse} from 'axios/index';

import {ResponseType, TodolistType} from './todolist-api';

// auth api
export const authAPI = {
    me() {
        return instance.get<ResponseType<UserData>>(`auth/me`)
    },
    login(data: LoginParamsType) {
        return instance.post<ResponseType<{ item: TodolistType }>, AxiosResponse<ResponseType<{ item: TodolistType }>>, LoginParamsType>('auth/login', data);
    },
    logout() {
        return instance.delete<ResponseType>(`auth/login`)
    }
}

// types
export type UserData = {
    id: number
    email: string
    login: string
}

export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
}


