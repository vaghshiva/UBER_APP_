import React from 'react'

const LocationSearchPanel = (props) => {

  const locations=[
    '2/18, Bhaktinagar- Ahir Boading, Rajkot',
    '2/20, Kalyan Nagar- Ahir Boading, Rajkot',
    '2/22, Manohar plot- Ahir Boading, Rajkot',
    '2/88, Race course- Ahir Boading, Rajkot',
  ]
  return (
    <div>
      {
        locations.map(function(elem,idx){
          return <div key={idx} onClick={()=>{
            props.setVehiclePanel(true)
            props.setPanelOpen(false)
          }} className='flex gap-4 border-2 border-gray-50 active:border-black p-3 rounded-xl items-center my-2 justify-start'>
          <h2 className='bg-[#eee] h-8 w-112 flex items-center justify-center rounded-full'><i className='ri-map-pin-fill '></i></h2>
          <h4 className='font-medium'>{elem}</h4>
        </div>
        })
      }

    </div>
  )
}

export default LocationSearchPanel
