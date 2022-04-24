import React from "react"
import HeroImg from '../assets/hero.svg'
import FeaturesImg from '../assets/features.svg'
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div className='md:mx-28 mx-4 text-white pt-10 pb-12'>

            <div className='md:grid md:grid-cols-2 items-center pt-10'>
                <div className=''>
                    <h1 className='text-3xl md:text-6xl'>Who we are</h1>
                    <p className='text-xl md:text-2xl py-4 tracking-wider text-justify'>In the era of a pandemic, it is harder than ever to connect with your co-workers. When things are Zoom it's just an excuse to be just less curious. People pay less attention to Zoom than in in-person meetings. And many companies suffer as a result. To tackle this problem we are creating a new way to connect with your co-workers. Our goal of the project is to overcome communication on zoom via interactive media chatroom.</p>

                    <Link to="/meet">
                        <button className='bg-secondary py-2 px-8 rounded-md text-xl md:text-2xl'>Join Meet</button>
                    </Link>

                </div>
                <div className="grid place-items-center py-4 drop-shadow-3xl shadow-black">
                    <img src={HeroImg} alt="img" width="400" height="400" />
                </div>
            </div>

            <div className='md:grid md:grid-cols-2 mt-20 items-center'>
                <div className="grid place-items-center py-4 drop-shadow-3xl shadow-black">
                    <img src={FeaturesImg} alt="img" width="500" height="500" />
                </div>
                <div className=''>
                    <h1 className='text-3xl md:text-6xl'>What else do we have</h1>
                    <ul className="text-xl">
                        <li className="list-disc">PACT is a video-conferencing application that occasionally prompts users to answer ML-generated questions based on the meeting topics/discussion</li>
                        <li className="list-disc">PACT is also an automatic note-taker: it listens to and records action items from the meeting</li>
                        <li className="list-disc">This will boost teamwork and inclusion among coworkers by ensuring that everyone is paying attention to each other's voices</li>
                        <li className="list-disc">This will help the employees to have more engaging small talk with coworkers in virtual meetings.</li>
                        <li className="list-disc">This will help employees across the country to get a better understanding of the company culture.</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
