/*
    This API slices are belongs to Core
*/


import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

// Types
import {
    Person,
    CameraStats,
    EventStats,
    PersonStats,
    EventStatusReport,
    EventHistory,
    Event,
    Camera
} from "../../types/models.tsx";
import {ListResponse, DataResponse} from "../../types/response.tsx";
import {ListArgs} from "../../types/args.tsx";

interface CameraArgs extends ListArgs{
    type: string;
}

const baseQuery = fetchBaseQuery(
    {
        baseUrl: `http://localhost:8080/api/v1/`,
        credentials: 'include',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json'); // Add this line
            return headers;
        },

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

        // Camera List
        getCameraList: builder.query<ListResponse<Camera>,CameraArgs>({
            query: (args) => ({url: `/cameras?page=${args.page}&page_size=${args.page_size}&type=${args.type}`})
        }),

        // Get Camera by I'd
        getCameraByPrime: builder.query<DataResponse<Camera>,{CameraId:string}>({
            query: ({CameraId})=>({url:`/cameras/camera/${CameraId}`})
        }),

        // Get Camera Stats
        getCameraStats: builder.query<DataResponse<CameraStats>, void>({
            query:()=>{
                return {url: '/cameras/stats'}
            }
        }),

        // Get Camera

        // Get Event Stats
        getEventStats: builder.query<DataResponse<EventStats>, void>({
            query: ()=>{
                return {url: '/events/stats'}
            }
        }),

        // Get Persons Stats
        getPersonStats: builder.query<DataResponse<PersonStats>,void>({
           query: ()=>{
               return {url: '/persons/stats'}
           }
        }),

        // get Event Status Report
        getEventStatusReport: builder.query<DataResponse<EventStatusReport>,void>({
            query: ()=>{return {url:'/events/statusReport'}}
        }),

        // Get Event Week History
        getEventWeekHistory: builder.query<DataResponse<EventHistory[]>,void>({
            query: ()=>{return {url:'/events/weekHistory'}}
        }),


        // get Events
        getEventList: builder.query<ListResponse<Event>,ListArgs>({
            query: ({page, page_size})=>({url: `/events?page=${page}&page_size=${page_size}`})
        }),

        // Create New Person
        createPerson: builder.mutation({
            query: ({data})=>(
                {
                    url: '/persons',
                    method: 'POST',
                    body: data
                }
            )
        }),


        // Create New Enrollment for a person
        createEnrollment: builder.mutation({
           query: ({data,personId})=> (
               {
                   url: `/persons/person/${personId}/enrollments`,
                   method: 'POST',
                   body: data
               }
           )
        }),

        // create camera
        createCamera: builder.mutation({
            query: ({data})=>({
                url: '/cameras',
                method: 'POST',
                body: data
            })
        }),

        deleteCamera: builder.mutation({
            query: ({cameraId})=>({
                url: `/cameras/camera/${cameraId}`,
                method: 'DELETE',
            })
        }),

        reloadCamera: builder.mutation({
            query: ({cameraId})=> ({
                url: `/cameras/camera/${cameraId}/reload`,
                method: 'GET'
            })
        })


    })
})

export const {
    // Mutation
    useCreatePersonMutation,
    useCreateEnrollmentMutation,
    useCreateCameraMutation,
    useDeleteCameraMutation,
    useReloadCameraMutation,

    // Query
    useListPersonsQuery,
    usePersonByPrimeQuery,
    useGetCameraStatsQuery,
    useGetEventStatsQuery,
    useGetPersonStatsQuery,
    useGetEventStatusReportQuery,
    useGetEventWeekHistoryQuery,
    useGetCameraByPrimeQuery,
    useGetCameraListQuery,
    useGetEventListQuery
} = coreApi;