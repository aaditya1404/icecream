import AddFlavorRequestForm from '@/components/Forms/AddFlavorRequestForm'
import FlavorRequest from '@/components/FlavorRequest'
import React from 'react'

const page = () => {
  return (
    <div className='w-full h-[100vh] flex items-center justify-center flex-col'>
      <FlavorRequest />
      <AddFlavorRequestForm />
    </div>
  )
}

export default page
