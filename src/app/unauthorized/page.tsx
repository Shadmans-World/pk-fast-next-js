import { Ban } from 'lucide-react'
import React from 'react'


export default function page() {
  return (
    <div className=' flex flex-col items-center justify-center h-screen bg-gray-100'>
       <h1 className='text-3xl font-bold text-red-600 flex items-center gap-2 justify-center'>Access Denied <Ban className='font-extrabold text-black'/></h1>
       <p className='mt-2 text-gray-700'>You can not access this page.</p>
    </div>
  )
}
