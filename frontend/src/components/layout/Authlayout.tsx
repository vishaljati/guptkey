import React, { useEffect, useState } from 'react'
import { useAppSelector } from '@/hooks/redux-hooks'


import { useNavigate } from 'react-router-dom'

export default function AuthLayout({ children, authentication = true }) {

    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useAppSelector(state => state.auth.isLoggedIn)

    useEffect(() => {
        if (authentication && authStatus !== authentication) {
            navigate("/login")
        } else if (!authentication && authStatus !== authentication) {
            navigate("/")
        }
        setLoader(false)
    }, [authStatus, navigate, authentication])

    return loader ? <h1>Loading...</h1> : <>{children}</>
}