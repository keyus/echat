import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import user from './user'

export default configureStore({
    reducer: {
        user,
    },
    middleware: (getDefaultMiddleware) => {
        if (process.env.NODE_ENV === 'development') {
            return getDefaultMiddleware().concat(logger)
        }
        return getDefaultMiddleware()
    }
})