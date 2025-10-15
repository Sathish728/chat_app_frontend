import { ShipWheelIcon} from 'lucide-react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { replace, useNavigate } from 'react-router';
import {loginUser, clearError, clearMessage} from '../slice/authSlice'
import { Link } from 'react-router';
import { toast } from 'react-toastify';


const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({
    email:"",
    password:""
  })

  const {user, error, isLoading, isAuthenticated, message } =useSelector((state)=> state.auth)

  useEffect(()=>{
    if(error){
      toast.error(error)
      dispatch(clearError())
    }

     if (message) {
      toast.success(message);
    dispatch(clearMessage()); 
     
  }
  },[error, message, dispatch])

  useEffect(()=>{
    if(isAuthenticated){
      navigate('/',{replace:true})
    }
  },[isAuthenticated, navigate])

  const onChange = (e) => {
    setLoginData((prev)=> ({...prev,
      [e.target.name]: e.target.value
    }))
  }
 const handleLogin = (e) => {
    e.preventDefault()
    try {
      const {email, password} = loginData
      const userData = { email, password}

      // toast.success("Login successfully");
      dispatch(loginUser(userData))
    } catch (error) {
      console.error(error)
      toast.error(error)
    }
 }

const togglePasswordVisibility  = (field) =>{
  if(field === "password"){
    return setShowPassword(!showPassword)
  }
}

  return (
    <div className='h-screen flex items-center justify-center p-4 md:p-6 sm:p-8'>
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>

      {/*LEFT SIDE LOGIN FORM */}
       <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">

      {/* LOGO */}
        <div className="mb-4 flex items-center justify-start gap-2">
          <ShipWheelIcon className="size-9 text-primary"/>
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Streamify
          </span>
        </div>
        {/* form */}
        <div className="w-full">
          <form onSubmit={handleLogin}>
            <div className='space-y-6'>

              <div>
                <h2 className='text-xl font-semibold'>Welcome Back</h2>
                <p className='text-sm opacity-70'>
                  Sign in to your account to continue your language journey
                </p>
              </div>
              
              <div className='flex flex-col gap-3'>

                <div className='form-control w-full space-y-2'>
                  <label className='label'>
                    <span className='label-text'>Email</span>
                  </label>
                  <input 
                   type="email"
                   name='email'
                   placeholder='john@email.com'
                   className='input input-bordered w-full'
                   value={loginData.email}
                   onChange={onChange}
                   required
                   disabled={isLoading}
                   />
                </div>

                <div className='form-control w-full space-y-2'>
                  <label className='label'>
                    <span className='label-text'>
                      Password
                    </span>
                  </label>

              <div className="mt-1 relative">
                 <input 
                 type={showPassword ?'text':'password'}
                 name='password'
                 placeholder='*******'
                 className='input input-bordered w-full'
                 value={loginData.password}
                 onChange={onChange}
                 required
                 disabled={isLoading}
                />

                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility('password')}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
                </div>
                </div>

                <button 
                  type='submit'
                  className='btn btn-primary w-full mt-10'
                  disabled={isLoading}>
                  {isLoading ? (
                    <>
                    <span className='loading loading-spinner loading-lg'></span>
                    Signing in....
                    </>
                  ):("Sign In")}
                </button>

                <div className='text-center mt-4'>
                <p className='text-sm'>
                  Don't have an account?{""}
                  <Link to="/signup" className='text-primary hover:underline'>Create one</Link>
                </p>
                </div>
              </div>
            </div>
          </form>
        </div>
       </div>

       {/*RIGHT SIDE LOGIN FORM */}
       <div className="hidden lg:flex flex-row bg-base-200 w-1/2 p-4 sm:p-8">
        <div className='max-w-md p-8'>
          {/* ILLUSTRATION */}
          <div className='relative aspect-square max-w-sm mx-auto'>
            <img src="i.png" alt="language connection illustration" 
            className='w-full h-full'/>
          </div>

          {/* Content */}
          <div className='text-center space-y-3 mt-6'>
            <h2 className='text-xl font-semibold'>
              Connect with language partners worldwide
            </h2>
            <p className='opacity-70'>
              Practice conversation, make friends, and improve your language skills together
            </p>
          </div>
        </div>
       </div>

      </div>
    </div>
  )
}

export default LoginPage