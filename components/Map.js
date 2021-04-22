import React from 'react'
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api'
import { formatRelative } from 'date-fns'
import { googleApi } from '../app.config.js'
import mapStyles from './snazzyMaps'
import UsePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete'
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox'
import usePlacesAutocomplete from 'use-places-autocomplete'

const libraries = ['places']
const mapContainerStyle = {
  width: '60vw',
  height: '60vw',
}
const center = {
  lat: 51.5074,
  lng: 0.1278
}
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
}

export default function Mappy() {
  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: googleApi,
    libraries,
  })

  const mapRef = React.useRef()
  const onMapLoad = React.useCallback(map => {
    mapRef.current = map
  }, [])

  const panTo = React.useCallback(({lat,lng}) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, [])

  if (loadError) return 'Error loading'
  if (!isLoaded) return 'Loading Maps'
 
  return (
    <div>
      <h1> Games <span role='img' aria-label='football'>⚽️</span></h1>
      <Search panTo={panTo}/>
      <Locate panTo={panTo} />
      <GoogleMap 
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
        options={options}
        onLoad={onMapLoad}
      ></GoogleMap>
    </div>
  )
}

function Locate({panTo}) {
  return (
    <button onClick={()=>{
      navigator.geolocation.getCurrentPosition(
        position => {
          panTo({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
      }, 
      () => null)
    }}>
      Use Location
    </button>
  )
}

function Search({panTo}){
  const {
    ready, 
    value, 
    suggestions: {status, data}, 
    setValue, 
    clearSuggestions,} = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 51.5074, lng: () => 0.12789 },
      radius: 50 * 1000,
    },
  })

  return (
    <Combobox 
      onSelect={ async address => {
        setValue(address, false)
        clearSuggestions()
        try {
          const results = await getGeocode({ address });
          const { lat, lng } = await getLatLng(results[0]);
          panTo({ lat, lng });
        } catch (error) {
          console.log(error)
        }
      }}
    >
      <ComboboxInput 
        value={value} 
        onChange={(e) => {
          setValue(e.target.value)
        }} 
        disabled={!ready}
        placeholder='Enter an address'
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === 'OK' && data.map(({id, description}) => (
            <ComboboxOption key={id} value={description} />
          ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  )
}
