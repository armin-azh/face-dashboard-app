import { configureStore} from "@reduxjs/toolkit";

import {coreApi} from "./api/core.tsx";

export const store = configureStore({
    reducer: {
        [coreApi.reducerPath]: coreApi.reducer,
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(coreApi.middleware),
});

// Export types
export type RootState = ReturnType<(typeof store)['getState']>;
export type AppDispatch = (typeof store)['dispatch'];