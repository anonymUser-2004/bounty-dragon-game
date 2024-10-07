import React from 'react'

const Navbar = () => {
  return (
   <nav className='bg-darkPurple h-14 flex items-center p-2'>
    <div className="hamberger rounded-sm h-fit bg-yellow-400 w-fit">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
    <path d="M4 5L20 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M4 12L20 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M4 19L20 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>
    </div>
   </nav>
  )
}

export default Navbar
