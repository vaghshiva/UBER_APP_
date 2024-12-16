import React from 'react'

const LocationSearchPanel = ({suggestions,setVehiclePanel,setPanelOpen,setPickup,setDestination,activeField}) => {

  const handleSuggestionClick=(suggestion)=>{
    if(activeField === 'pickup'){
      setPickup(suggestion)
    }
    else if(activeField === 'destination'){
      setDestination(suggestion)
    }
  }
  return (
    <div>
      {
        suggestions.map((elem,idx)=>(
          <div key={idx} className='flex gap-4 border-2 border-gray-50 active:border-black p-3 rounded-xl items-center my-2 justify-start'>
          <h2 className='bg-[#eee] h-8 w-112 flex items-center justify-center rounded-full'><i className='ri-map-pin-fill '></i></h2>
          <h4 className='font-medium'>{elem}</h4>
        </div>
        )) 
      }

    </div>
  )
}

export default LocationSearchPanel
