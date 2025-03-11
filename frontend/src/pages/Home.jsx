import React from 'react'
import Hero from '../components/Hero'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import CategorySlider from '../components/BalataCesitleri'

import References from '../components/References'
import BlogList from '../components/BlogList'



const Home = () => {
  return (
    <div>
        <Hero/>
        <CategorySlider/>
        <BestSeller/>
     
        <NewsletterBox/>
        <References/>
        <BlogList />
        <OurPolicy/>
       
        

    </div>
  )
}

export default Home