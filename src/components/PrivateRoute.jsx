import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'
import { useAuthStatus } from '../hooks/useAuthStatus'
import Spinner from './Spinner'





const PrivateRoute = () => {

   const {loggedIn,checkingStatus}=useAuthStatus()


    if(checkingStatus)
 {
     return  <Spinner/>
 }
//    outlet is a nested route

  return loggedIn ? <Outlet/> : <Navigate to='/sign-in'/>




}





export default PrivateRoute
