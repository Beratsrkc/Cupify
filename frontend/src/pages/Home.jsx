import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import TelGrubu from '../components/Tel-Grubu'
import ManetGrubu from '../components/Manet-ve-Gaz-Kolu'
import BalataGrubu from '../components/BalataCesitleri'
import MuhtelifGrubu from '../components/MuhtelifCesitleri'
import KampanyaliUrunler from '../components/Kampanyali-Urunler'

const Home = () => {
  return (
    <div>
        <Hero/>
      
        <KampanyaliUrunler/>
        <TelGrubu/>
        <ManetGrubu/>
        <BalataGrubu/>
        <MuhtelifGrubu/>
        <BestSeller/>
        <LatestCollection/>
        <OurPolicy/>
        <NewsletterBox/>

    </div>
  )
}

export default Home