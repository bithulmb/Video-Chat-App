import { ACCESS_TOKEN, REFRESH_TOKEN, USER } from '@/utils/constants/constants'
import React, { createContext, useReducer, useState } from 'react'


export const AuthContext = createContext()

const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
  };

  const reducer = (state,action)=> {
    switch(action.type){
        case "LOGIN":
            return {
                user : action.payload.user,
                accessToken : action.payload.access,
                isAuthenticated : true
            };
        case "LOGOUT":
            return {
                user : null,
                accessToken : null,
                isAuthenticated : false,
            };
        default : 
            return state
    }
  }



export const AuthProvider = ({children}) => {
   
    const [state, dispatch] = useReducer(reducer,initialState, () => {
        
        const storedUser = localStorage.getItem(USER)
        const storedToken = localStorage.getItem(ACCESS_TOKEN)

        if(storedUser && storedToken){
            return {
                user : JSON.parse(storedUser),
                accessToken : storedToken,
                isAuthenticated : true
            }
        }
        return initialState;
    })

    const login = (user, access, refresh) => {
        localStorage.setItem(USER, JSON.stringify(user) || null)
        localStorage.setItem(ACCESS_TOKEN,access)
        localStorage.setItem(REFRESH_TOKEN,refresh)

        dispatch({
            type : "LOGIN",
            payload : {user, access}
        })
    }

    const logout = () => {
        localStorage.clear()
        dispatch({type : "LOGOUT"})
    }
    
    return (
        <AuthContext.Provider value={{...state, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
 }