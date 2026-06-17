import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { updateProfile, reset } from '../features/auth/authSlice'

const ROLES = [
  "MERN Stack Developer",
  "MEAN Stack Developer",
  "Full Stack Python",
  "Full Stack Java",
  "Frontend Developer",
  "Backend Developer",
  "Data Scientist",
  "Data Analyst",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Cloud Engineer (AWS/Azure/GCP)",
  "Cybersecurity Engineer",
  "Blockchain Developer",
  "Mobile Developer (iOS/Android)",
  "Game Developer",
  "UI/UX Designer",
  "QA Automation Engineer",
  "Product Manager"
];
const inputBase = 'w-full px-4 py-3 glass-input rounded-xl text-sm font-semibold text-slate-300';
const Profile = () => {
  const dispatch = useDispatch();
  const { user, isSuccess, isError, message, isProfileLoading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    preferredRole: user?.preferredRole || '',
  })

  useEffect(() => {
    if (!isError && !isSuccess) return
    if (isError) toast.error(message)
    if (isSuccess) toast.success('Profile Updated Successfully')
    dispatch(reset())
  }, [isError, isSuccess, message, dispatch])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        preferredRole: user?.preferredRole || '',
      });
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name === user.name && formData.preferredRole === user.preferredRole) {
      toast.info('No changes to save.')
      return
    }
    dispatch(updateProfile(formData))
  }
  return (
    <div className='max-w-3xl mx-auto px-4 py-6 sm:py-12 pb-24 font-sans'>
      <div className='glass-card rounded-[2rem] p-6 sm:p-10 shadow-2xl'>
        <header className='mb-8 border-b border-white/5 pb-5'>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-white'>Edit Profile</h1>
          <p className='text-xs sm:text-sm text-slate-400 mt-1.5 font-medium'>
            Update your professional details and preferences
          </p>
        </header>

        <form onSubmit={handleSubmit} className='space-y-6' >

          <FormField label="Full Name">
            <input
              type="text"
              className={inputBase}
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder='Enter your name'
            />
          </FormField>

          <FormField label="Email Address (Fixed)" muted>
            <input
              type="email"
              className='w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-slate-500 text-sm cursor-not-allowed font-medium'
              disabled
              value={formData.email}
              onChange={handleChange}
            />
          </FormField>

           <FormField label="Target Role">
            <div className='relative'>
              <select name="preferredRole" value={formData.preferredRole} onChange={handleChange} className={`${inputBase} appearance-none`}>
                {
                  ROLES.map((role) => (
                    <option className="bg-slate-950 text-slate-300 text-sm" key={role} value={role}>{role}</option>
                  ))
                }
              </select>
              <SelectArrow />
            </div>
          </FormField>

          <div className='pt-4'>
            <button
              type='submit'
              disabled={isProfileLoading}
              className={`w-full flex items-center justify-center gap-2 py-3.5 font-extrabold text-sm rounded-xl transition-all active:scale-[0.99] ${isProfileLoading ? 'bg-slate-800 text-slate-500 cursor-wait border border-white/5' : 'bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white shadow-lg shadow-teal-500/10'}`}>
              {
                isProfileLoading ? <Loader /> : 'Save Changes'
              }
              </button>
          </div>
        </form>
      </div>

    </div>
  )
}

export default Profile

function FormField({ label, children, muted }) {

  return (
    <div className={`space-y-1.5 ${muted ? 'opacity-60' : ''}`}>
      <label className='ml-1 text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest'>{label}</label>
      {children}
    </div>

  )
}

function SelectArrow() {
  return (
    <div className='absolute right-4 top-1/2  -translate-y-1/2 pointer-events-none text-slate-400'>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  )
}

function Loader() {
  return (
    <>
      <span className='w-5 h-5 border-2 border-slate-400 border-t-transparent animate-spin rounded-full' />
      <span>Saving...</span>
    </>
  )
}