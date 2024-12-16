import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ComfirmRide from '../components/ComfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';

const Home = () => {
  const[pickup,setPickup]=useState('')
  const[destination,setDestination]=useState('')
  const[panelOpen,setPanelOpen]=useState(false)
  const vehiclePanelRef=useRef(null)
  const confirmRidePanelRef=useRef(null)
  const vehicleFoundRef=useRef(null)
  const waitingForDriverRef=useRef(null)
  const panelRef=useRef(null)
  const panelCloseRef=useRef(null)
  const[vehiclePanel,setVehiclePanel]=useState(false)
  const[confirmRidePanel,setConfirmRidePanel]=useState(false)
  const[vehicleFound,setVehicleFound]=useState(false)
  const[waitingForDriver,setWaitingForDriver]=useState(false)
  const[pickupSuggestions,setPickupSuggestions]=useState([])
  const[destinationSuggestions,setDestinationSuggestions]=useState([])
  const[activeField,setActiveField]=useState(null) 
  const[fare,setFare]=useState({})
  const[vehicleType,setVehicleType]=useState(null)
  const[ride,setRide]=useState(null)

  const navigate=useNavigate()

  const { socket }=useContext(SocketContext)
  const { user }=useContext(UserDataContext)

  useEffect(()=>{
    socket.emit("join",{userType: "user", userId:user._id})
  },[ user ])

  socket.on('ride-confirmed',ride=>{
    setVehicleFound(false)
    setWaitingForDriver(true)
    setRide(ride)
  }
  )

  socket.on('ride-started',ride=>{
    console.log('ride')
    setWaitingForDriver(false)
    navigate('/riding',{state:{ride}})
  })

  const handlePickupChange=async(e)=>{
    setPickup(e.target.value)
    try{
      const response=await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,{
        params:{input:e.target.value},
        header:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
      setPickupSuggestions(response.data)
    }catch{}
  }

  const handleDestinationChange=async(e)=>{
    setDestination(e.target.value)
    try{
      const response=await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,{
        params:{input:e.target.value},
        header:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
      setDestination(response.data)
    }catch{}
  }

  const submitHandler=(e)=>{
    e.preventDefault()
  }

  useGSAP(function(){
    if(panelOpen){
      gsap.to(panelRef.current,{
        height:'70%',
        padding:24
      })
      gsap.to(panelCloseRef.current,{
        opacity:1
      })
    }else{
      gsap.to(panelRef.current,{
        height:'0%',
        padding:0
      })
      gsap.to(panelCloseRef.current,{
        opacity:0
      })
    }
  },[panelOpen])
  
  
  useGSAP(function(){
    if(vehiclePanel){
      gsap.to(vehiclePanelRef.current,{
        transform:'translateY(0)'
      })
    }else{
      gsap.to(vehiclePanelRef.current,{
        transform:'translateY(100%)'
      })
    }
  },[vehiclePanel])

  useGSAP(function(){
    if(confirmRidePanel){
      gsap.to(confirmRidePanelRef.current,{
        transform:'translateY(0)'
      })
    }else{
      gsap.to(confirmRidePanelRef.current,{
        transform:'translateY(100%)'
      })
    }
  },[confirmRidePanel])

  useGSAP(function(){
    if(vehicleFound){
      gsap.to(vehicleFoundRef.current,{
        transform:'translateY(0)'
      })
    }else{
      gsap.to(vehicleFoundRef.current,{
        transform:'translateY(100%)'
      })
    }
  },[vehicleFound])

  useGSAP(function(){
    if(waitingForDriver){
      gsap.to(waitingForDriverRef.current,{
        transform:'translateY(0)'
      })
    }else{
      gsap.to(waitingForDriverRef.current,{
        transform:'translateY(100%)'
      })
    }
  },[waitingForDriver])

  async function findTrip(){
    setVehiclePanel(true)
    setPanelOpen(false)

    const response=await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`,{
      params:{pickup,destination},
      header:{
        Authorization:`Bearer ${localStorage.getItem('token')}`
      }
    })
    setFare(response.data)
  }

  async function createRide() {
    const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create}`,{
      pickup,
      destination,
      vehicleType
    },{
      header:{
        Authorization:`Bearer ${localStorage.getItem('token')}`
      }
    })
  }

  return (
    <div className='h-screen relative overflow-hidden'>
      <img className='w-16 absolute left-5 top-5' src='uber.webp'></img>
      <div className='h-screen w-screen'>
        <LiveTracking />
      </div>
      <div className='bg-white flex flex-col justify-end h-screen top-0 absolute w-full'>
        <div className='h-[30%] p-6 bg-white relative'>
          <h5 ref={panelCloseRef} onClick={()=>{
            setPanelOpen(false)
          }}
          className='absolute opacity-0 top-6 right-6 text-2xl'><i className='ri-arrow-down-wide-line'></i></h5>
          <h4 className='text-2xl font-semibold'>Find a trip</h4>
          <form onSubmit={(e)=>{
            submitHandler(e)
          }}>
            <div className='line absolute h-16 w-1 top-[31%] left-10 bg-gray-700 rounded-full'></div>
            <input
            onClick={()=>{
              setPanelOpen(true)
              setActiveField('pickup')
            }}
            value={pickup}
            onChange={handlePickupChange} 
            className='bg-[#eeeeee] px-12 py-2 text-lg rounded-lg w-full mt-5' type='text' placeholder='Add a pick-up location'></input>
            <input 
            onClick={()=>{
              setPanelOpen(true)
              setActiveField('pickup')
            }}
            value={destination}
            onChange={destination} 
            className='bg-[#eeeeee] px-12 py-2 text-lg rounded-lg w-full mt-3' type='text' placeholder='Enter your destination'></input>
          </form>
          <button
            onClick={findTrip}
            className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'>Find Trip</button>
        </div>
        <div ref={panelRef} className=' bg-white h-0'>
            <LocationSearchPanel suggestions={activeField ==='pickup'?pickupSuggestions:destinationSuggestions} setPanelOpen={setPanelOpen} setVehiclePanel={setVehiclePanel} setPickup={setPickup} activeField={activeField}/>
        </div>
      </div>
      <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white p-3 py-10 pt-12'>
        <VehiclePanel selectVehicle={setActiveField} fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
      </div>
      <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white p-3 py-6 pt-12'>
        <ComfirmRide createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound}/>
      </div>
      <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white p-3 py-6 pt-12'>
       <LookingForDriver createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setVehicleFound={setVehicleFound}/>
      </div>
      <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white p-3 py-6 pt-12'>
       <WaitingForDriver ride={ride}  setVehicleFound={setVehicleFound} setWaitingForDriver={setWaitingForDriver} waitingForDriver={waitingForDriver}/>
      </div>

    </div>
  )
}

export default Home
