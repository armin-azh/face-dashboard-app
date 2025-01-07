/*
    This API slices are belongs to Core
*/


import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";


const baseQuery = fetchBaseQuery(
    {
        baseUrl: `http://localhost:8000/api/v1/`,
        credentials: 'include'
    }
)

export const coreApi = createApi({
    reducerPath: 'coreAPI',
    baseQuery,
    refetchOnReconnect: true,
    endpoints:builder => ({

        newContact: builder.mutation({
            query:({data})=>(
                {
                    url: `/contact/`,
                    method: 'POST',
                    body: data
                }
            )
        }),

    })
})

export const {
    // Mutation

    // Query
} = coreApi;