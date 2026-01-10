'use client'
import RegisterForm from '@/src/components/RegisterForm';
import Welcome from '@/src/components/Welcome'
import React, { useState } from 'react'

export default function Register() {
  const [step,setStep] = useState(1);
  return (
    <div>
      {
        step ==1 ? <Welcome nextStep={setStep}/> : <RegisterForm/>
      }
      
    </div>
  )
}
