import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className='flex flex-col'>
        <Link to={"login"}><button className='bg-black text-white'>Login</button> </Link> 
         <Link to={"signup"}><button>Signup</button> </Link> 
  
    </div>
  )
}

export default Home