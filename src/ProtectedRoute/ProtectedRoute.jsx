import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({children}) => {
    const uidAvailable = useSelector((state) => state.user.uid)
    const location =useLocation()

  return uidAvailable ? children : <Navigate to ='/login' state = {{from:location}} replace />
}

export default ProtectedRoute