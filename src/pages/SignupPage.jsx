import  { useEffect, useState } from 'react'
import { ShipWheelIcon} from 'lucide-react'
import { Link } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router'
import {signupUser, clearError, clearMessage} from '../slice/authSlice.js'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';



const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false);
  const [signupData ,setSignupData] = useState({
    fullName:"",
    email:"",
    password:"",  
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()

 const {user,error, isLoading, isAuthenticated, message} = useSelector((state) => state.auth)

 useEffect(() => {
  if (error) {
    toast.error(error);
    dispatch(clearError()); 
  }
  if (message) {
    toast.success(message);
    dispatch(clearMessage()); 
  }
}, [error, message, dispatch]);

useEffect(() => {
  if (isAuthenticated) {
    navigate('/', { replace: true });
  }
}, [isAuthenticated, navigate]);

  const onChange = (e) => {
    setSignupData((prevState) => ({
      ...prevState,
      [e.target.name]:e.target.value
    }))
  }

 const handleSignup = async(e) => {
  e.preventDefault()
  try {
     const { fullName, email, password } = signupData  
     const userData = { fullName, email, password }
     
     dispatch(signupUser(userData))
     
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



 

if (showSpinner) {
  return <Spinner />;
}
  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8'>
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-xl overflow-hidden'>

      {/* Signup form left side */}
       <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col '>

       {/* logo */}
       <div className='mb-4 flex items-center justify-start gap-2'>
          <ShipWheelIcon className='size-9 text-primary'/>
          <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
          Streamyfy
          </span>
       </div>

       {error && (
        <div className='alert alert-error mb-4'>
            <span>{error}</span>
        </div>
       )}

       <div className='w-full'>
        <form onSubmit={handleSignup}>
          <div className='space-y-4'>
            <div>
              <h2 className='text-xl font-semibold'>Create An Account</h2>
              <p className='text-sm opacity-70'>
                Join Streamyfy and Start Your Language Learning Adventure!
              </p>
            </div>

            {/* FULL NAME */}
            <div className='space-y-3'>
              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text'>Full Name</span>
                </label>
                <input 
                 type='text'
                 name='fullName'
                 placeholder='john david'
                 className='input input-bordered w-full'
                 value={signupData.fullName}
                 onChange={onChange}
                 required
                 disabled={isLoading}
                />
              </div>
            </div>

            {/* EMAIL */}

             <div className='space-y-3'>
              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text'>Email</span>
                </label>
                <input 
                 type='email'
                 name='email'
                 placeholder='john@email.com'
                 className='input input-bordered w-full'
                 value={signupData.email}
                 onChange={onChange}
                 required
                 disabled={isLoading}
                />
              </div>
            </div>
            
            {/* PASSWORD */}

             <div className='space-y-3'>
              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text'>Password</span>
                </label>

                <div className="mt-1 relative">
                 <input 
                 type={showPassword ?'text':'password'}
                 name='password'
                 placeholder='*******'
                 className='input input-bordered w-full'
                 value={signupData.password}
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

                <p className='text-xs opacity-70 mt-1'>
                  Password must be atleast 6 characters long
                </p>
              </div>

              <div className='form-control'>
              <label className='label cursor-pointer justify-start gap-2'>
                <input type='checkbox' className=' checkbox checkbox-sm' required/>
                <span className='text-xs leading-tight'>agree to the{""}
                  <span className='text-primary hover:underline'>terms of service</span>and{""}
                  <span className='text-primary hover:underline'>privacy policy</span>
                </span>
              </label>
              </div>
            </div>

            <button 
              className={`btn w-full ${isLoading ? 'skeleton  text-primary':" btn-primary"}`} 
              type='submit' 
              disabled={isLoading}
              >
              {isLoading ? (
                <>
                 <span className='loading loading-spinner loading-sm'>
                 </span>
                 Creating Account....
                </>
              ):('Create Account')}
            </button>

            <div className='text-center mt-4'>
              <p className='text-sm'>
                Already have an account?{" "}
                <Link to="/login" className='text-primary hover:underline'>
                Sign In
                </Link>
              </p>
            </div>

          </div>
        </form>
       </div>
       </div>

      {/* Signup form right side */}
      <div className='hidden lg:flex flex-col bg-base-200 w-1/2 p-4 sm:p-8'>
       <div className='max-w-md p-8'>
        {/* Illustration */}
        <div className='relative aspect-square max-w-sm mx-auto'>
          <img src="i.png" alt="language connection illustration" className='w-full h-full' />
        </div>

        <div className='text-center space-y-3 mt-6'>
           <h2 className='text-xl font-semibold'>Connect with language partners worldwide</h2>
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

export default SignupPage