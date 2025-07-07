import { useEffect, useState } from 'react'

import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import  LandingPage  from './pages/LandingPage'
import LoginPage from './pages/Login'
import { useDispatch, useSelector } from 'react-redux'
import DashboardPage from './pages/Dashboard'
import RegisterPage from './pages/register'
import CreateWalletPage from './pages/CreateWallet'
import { checkAuth } from './authSlice'
import axiosClient from './utils/axiosClient'

function App() {
  
  const {isAuthenticated,user}=useSelector(state=>state.auth)
  const dispatch=useDispatch();
  const [hasWallet,sethasWallet]=useState(false)
  const [isWalletCheckDone, setWalletCheckDone] = useState(false);


  useEffect(()=>{
    dispatch(checkAuth())
  },[dispatch])
  useEffect(()=>{
    if(isAuthenticated){
      const check=async()=>{
          try{
          const response = await axiosClient.get("/wallet/getWallet")
          console.log(response)
          if (response.data.wallet) {
              sethasWallet(true)// Wallet exists
          }

      }
      catch(err){
          sethasWallet(false)
      }
      finally {
        setWalletCheckDone(true);
      }
    
    }
    check();
        
    }
  else {
    setWalletCheckDone(true); // if not logged in, we’re done too
  }
  

},[isAuthenticated])
    
  if (!isWalletCheckDone) return <div className="text-white p-4">Loading...</div>;

  return (
    <>
      <Routes>
        <Route path='/' element={isAuthenticated&&hasWallet?<Navigate to='/dashboard'></Navigate>:isAuthenticated?<Navigate to='/createWallet'></Navigate>:<LandingPage></LandingPage>}></Route>
        <Route path='/login' element={<LoginPage></LoginPage>}></Route>
        <Route path='/register' element={<RegisterPage></RegisterPage>}></Route>
        <Route path='/dashboard' element={isAuthenticated?<DashboardPage></DashboardPage>:<Navigate to="/"></Navigate>}></Route>
        <Route path='/createWallet' element={isAuthenticated&&!hasWallet?<CreateWalletPage></CreateWalletPage>:<Navigate to="/"></Navigate>}></Route>
      </Routes>
    </>
  )
}

export default App
