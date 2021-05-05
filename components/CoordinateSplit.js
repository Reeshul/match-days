export let latCoord = "";
export let longCoord = "";

const CoordinateSplit = ({props}) => {
        let longNLat = props.fixtureVenues[0].coordinates.split(",");
        latCoord += longNLat[0];
        longCoord += longNLat[1];
}

export default CoordinateSplit