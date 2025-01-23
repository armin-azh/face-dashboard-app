/*
    This API slices are belongs to Core
*/


import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

// Types
import {Person, CameraStats} from "../../types/models.tsx";
import {ListResponse, DataResponse} from "../../types/response.tsx";

const baseQuery = fetchBaseQuery(
    {
        baseUrl: `http://localhost:8080/api/v1/`,
        credentials: 'include'
    }
)

export const coreApi = createApi({
    reducerPath: 'coreAPI',
    baseQuery,
    refetchOnReconnect: true,
    endpoints:builder => ({

        listPersons: builder.query<ListResponse<Person>, void>({
            query: ()=>{
                return {url:'/persons'}
            }
        }),

        personByPrime: builder.query<DataResponse<Person>,{prime:string}>({
           query({prime}) {
               return {url:`/persons/person/${prime}`}
           }
        }),

        getCameraStats: builder.query<DataResponse<CameraStats>, void>({
            query:()=>{
                return {url: '/cameras/stats'}
            }
        }),

        createPerson: builder.mutation({
            query: ({data})=>(
                {
                    url: '/persons',
                    method: 'POST',
                    body: data
                }
            )
        }),


    })
})

export const {
    // Mutation
    useCreatePersonMutation,

    // Query
    useListPersonsQuery,
    usePersonByPrimeQuery,
    useGetCameraStatsQuery
} = coreApi;