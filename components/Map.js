import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { googleApi } from "../app.config.js";

import styles from "./map.module.css";
import CoordinateSplit from './CoordinateSplit'
import { latCoord, longCoord } from './CoordinateSplit'
import EnterAddress from "./EnterAddress.jsx";
import Locate from "./Locate.jsx";



const libraries = ["places"];
const mapContainerStyle = {
  width: "60vw",
  height: "60vw",
};
const center = {
  lat: 51.5074,
  lng: 0.1278,
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

export default function Mappy(props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleApi,
    libraries,
  });

  
  CoordinateSplit({props})

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  if (loadError) return "Error loading";
  if (!isLoaded) return "Loading Maps";

  return (
    <div>
      <h1 style={{ fontFamily: "Bungee Shade" }}>
        {" "}
        Games{" "}
        <span role="img" aria-label="football">
          ⚽️
        </span>
      </h1>
      <div className={styles.location}>
        <EnterAddress panTo={panTo} />
        <Locate panTo={panTo} />
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        <Marker
          position={{ lat: parseFloat(latCoord), lng: parseFloat(longCoord) }}
        />
        <Marker position={{ lat: 10, lng: 10 }} />
      </GoogleMap>
    </div>
  );
  }

<Mappy isMarkerShown />; // Map with a Marker

