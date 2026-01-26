'use client'
import RegisterForm from '@/src/components/RegisterForm';
import Welcome from '@/src/components/Welcome'
import React, { useState } from 'react'

export default function Register() {
  const [step,setStep] = useState(1);
  return (
    <div className='bg-linear-to-b from-green-100 to-white'>
      {
        step ==1 ? <Welcome nextStep={setStep}/> : <RegisterForm previousStep = {setStep}/>
      }
      
    </div>
  )
}
