import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { googleApi } from "../app.config.js";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import usePlacesAutocomplete from "use-places-autocomplete";
import styled from "styled-components";
import styles from "./map.module.css";

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid white;
  color: white;
  padding: 0.25em 1em;
`;

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

  let latCoord = "";
  let longCoord = "";

  function coordinateSplit() {
    let longNLat = props.fixtureVenues[0].coordinates.split(",");
    latCoord += longNLat[0];
    longCoord += longNLat[1];
  }
  coordinateSplit();

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
        <Search panTo={panTo} />
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

function Locate({ panTo }) {
  return (
    <Button
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      Use Location
    </Button>
  );
}

function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 51.5074, lng: () => 0.12789 },
      radius: 50 * 1000,
    },
  });

  return (
    <Combobox
      onSelect={async (address) => {
        setValue(address, false);
        clearSuggestions();
        try {
          const results = await getGeocode({ address });
          const { lat, lng } = await getLatLng(results[0]);
          panTo({ lat, lng });
        } catch (error) {
          console.log(error);
        }
      }}
    >
      <ComboboxInput
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        disabled={!ready}
        placeholder="Enter an address"
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ id, description }) => (
              <ComboboxOption key={id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
}
