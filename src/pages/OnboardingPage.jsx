import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { clearError, clearMessage, onBoard } from '../slice/authSlice'
import { useNavigate } from 'react-router'
import { LANGUAGES } from '../constants/Index'

const OnboardingPage = () => {
  const {user, isLoading, error, message} = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: user ?.fullName || "",
    bio: user ?.bio || "",
    nativeLanguage: user ?.nativeLanguage || "",
    learningLanguage: user ?.learningLanguage || "",
    location: user ?.location || "",
    profilePic: user ?.profilePic || "",
  })
  const Languages = LANGUAGES

  useEffect(() => {
    if(error){
      toast.error(error)
      dispatch(clearError())
    }

    if(message){
      toast.success(message)
      dispatch(clearMessage())
    }
  },[error, message, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      const {fullName, bio, nativeLanguage, learningLanguage, location, profilePic } = formData
      const userData = {fullName, bio, nativeLanguage, learningLanguage, location, profilePic }

      dispatch(onBoard(userData))
      navigate('/')
    } catch (error) {
      console.error(error)
      toast.error(error)
    }
  }

  const handleRandomAvatar = () => {
      const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
      const randomAvatar = decodeURIComponent(`https://avatar.iran.liara.run/public/${idx}.png`);
      setFormData({ ...formData, profilePic: randomAvatar });
      toast.success("Random profile picture generated!");
    };

    



  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]:e.target.value
    }))
  }
  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
        <div className='card-body p-6 sm:p-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>
            Complete Profile
          </h1>

          {/* FORM */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Profil pic container */}
            <div className='flex flex-col items-center justify-center space-y-4'>
            {/* Image preview */}
            <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
              {formData.profilePic ? (
                <img 
                src={formData.profilePic}
                alt="Profile Pic" 
                className='w-full h-full object-cover'
              />
              ):(
                <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
              )}
              
            </div>

            {/* Generate rnadom avatar BTN */}
            <div className='flex items-center gap-2'>
              <button type='button' onClick={handleRandomAvatar} className='btn btn-accent'>
                <ShuffleIcon className='size-4 mr-2'/>
                Generate Random Avatar
              </button>
            </div>
            </div>

            {/* Full Name */}
            <div className='form-control'>
              <label className="label">
                <span className='label-text'>Full Name</span>
              </label>
              <input 
                type="text"
                name='fullName'
                value={formData.fullName}
                onChange={onChange}
                className='input input-bordered w-full'
                placeholder='Your Full Name'
              />
            </div>

            {/* Bio */}
            <div className='form-control'>
              <label className="label">
                <span className='label-text'>Bio</span>
              </label>
              <textarea 
                type="text"
                name='bio'
                value={formData.bio}
                onChange={onChange}
                className='textarea textarea-bordered h-24'
                placeholder='Tell others about yourself and your language learning goals'
              />
            </div>

            {/* Languages */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            
              {/* Native languages */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Native Language</span>
                </label>
                <select 
                name="nativeLanguage"
                value={formData.nativeLanguage}
                onChange={onChange}
                className='select select-bordered w-full'>
                  <option value="">Select your native language</option>
                  {Languages.map((lang)=>(
                  <option key={`native-${lang}`} value={lang.toLowerCase()}>  {lang}
                  </option>
                  ))}
                </select>
              </div>

              {/* Learning languages */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Learning Language</span>
                </label>
                <select 
                name="learningLanguage"
                value={formData.learningLanguage}
                onChange={onChange}
                className='select select-bordered w-full'>
                  <option value="">Select your learning language</option>
                  {Languages.map((lang)=>(
                  <option key={`native-${lang}`} value={lang.toLowerCase()}>  {lang}
                  </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div className='form-control'>
              <label className="label">
                <span className='label-text'>Location</span>
              </label>
              <div className='relative'>
                <MapPinIcon className='absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70' />
                <input 
                 type="text"
                 name='location'
                 value={formData.location}
                 onChange={onChange}
                 className="input input-bordered w-full pl-10"
                 placeholder="City, Country" />
              </div>
            </div>

          {/* Submit button */}
          <button 
           className='btn btn-primary w-full '
           type='submit'
           disabled={isLoading}
          >
            {isLoading ? (
              <>
               <LoaderIcon className='animate-spin size-5 mr-2'/>
               Onboarding...
              </>
            ):(
              <>
               <ShipWheelIcon className='size-5 mr-2'/>
               Complete Onboarding
              </>
            )}
          </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage