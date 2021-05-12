export let latCoord = [];
export let longCoord = [];

const CoordinateSplit = ({ props }) => {
  for (let i = 0; props.fixtureVenues.length > i; i++) {
    let longNLat = props.fixtureVenues[i].coordinates.split(",");
    isEven(i) ? latCoord.push(longNLat[i]) : (longCoord += longNLat[i]);
  }
};

function isEven(n) {
  return n % 2 === 0;
}

export default CoordinateSplit;
