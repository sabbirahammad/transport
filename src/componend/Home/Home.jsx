import React from 'react'
import HomeNavbar from './HomeNavbar'
import Card from './Card'
import Track from './Track'
import PeopleReview from './PeopleReview'
import Map from './Map'
import Footer from './Footer'

const Home = () => {
  return (
    <div className='bg-gray-900'>
     <HomeNavbar/>
     <Card/>
     <Track/>
     <Map/>
     <PeopleReview/>
     <Footer/>
    </div>
  )
}

export default Home
