import React from 'react'
import { Hero } from './components/Hero'
import { ProblemSection } from './components/ProblemSection'
import { HowItWorks } from './components/HowItWorks'
import { FeaturedProducts } from './components/FeaturedProducts'
import { WhyKurate } from './components/WhyKurate'
import { CTASeller } from './components/CTASeller'

const page = () => {
  return (
    <>
     <Hero />
     <ProblemSection />
     <HowItWorks />
     <FeaturedProducts />
     <WhyKurate />
     <CTASeller />
    </>
  )
}

export default page