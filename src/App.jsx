import React from "react";
import Map, { Marker } from 'react-map-gl/mapbox';
import { collection, getDocs } from "firebase/firestore";
import { db } from "shared/api";

import "mapbox-gl/dist/mapbox-gl.css";

async function getUsersLocation () {
  const querySnapshot = await getDocs(collection(db, "location"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
}

function App() {

  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    getUsersLocation()
  }, [])

  return (
    <>
      <Map
        mapboxAccessToken={import.meta.env.VITE_APP_MAPBOX_TOKEN}
        initialViewState={{ latitude: 43.222, longitude: 76.851, zoom: 12 }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {/* {users.map((user, index) => ( */}
          <Marker scale={1} key={1} longitude={76.9251837} latitude={43.2302925} color="red">
            
          </Marker>
        {/* // ))} */}
      </Map>
    </>
  );
}

export default App;
