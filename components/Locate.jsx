import React from "react";
import styled from "styled-components";

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid white;
  color: white;
  padding: 0.25em 1em;
`;

const Locate = ({ panTo }) => {
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

  export default Locate;