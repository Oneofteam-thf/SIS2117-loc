import React from "react";

import { pb } from "shared/api";
import { Avatar, Button, LoadingOverlay } from "@mantine/core";

import { useAuth } from "useAuth";
import { useNavigate } from "react-router-dom";
import Map, { Marker } from 'react-map-gl/mapbox';

import 'mapbox-gl/dist/mapbox-gl.css';

async function getUsersLocation () {
  return await pb.collection('locations').getFullList({
    expand: "user"
  })
}

export const App = () => {

  const {user, logout, loading} = useAuth()

  const navigate = useNavigate()

  const [locations, setLocations] = React.useState([]);

  if (loading) {
    <LoadingOverlay visible={loading} />
  }

  React.useEffect(() => {
    if (!loading) {
      if (user?.id) {
        getUsersLocation()
        .then((locations) => {
          setLocations(locations);
        })
      }
      else navigate('/login')
    }
  }, [loading])

  React.useEffect(() => {
    pb.collection('locations').subscribe('*', async () => {
      getUsersLocation()
      .then((locations) => {
        setLocations(locations);
      })
    })
  }, [user])

  return (
    <>
      <div className="fixed z-50 flex justify-between w-full p-3">
        <Button
          onClick={() => navigate('/users')}
          variant="light"
        >
          Пользователи
        </Button>
        <Button
          variant="light"
          onClick={() => {
            logout()
            window.location.reload()
          }}
        >
          Выйти
        </Button>
      </div>
        <Map
          mapboxAccessToken={import.meta.env.VITE_APP_MAPBOX_TOKEN}
          initialViewState={{
            longitude: 76.9252157,
            latitude: 43.2302982,
            zoom: 13
          }}
          style={{ width: "100vw", height: "100vh", zIndex: 10, }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          {locations?.map((q, index) => {
            console.log(q, 'q')
            return (
              <Marker scale={5} key={index} longitude={q?.current?.longitude ?? 90} latitude={q?.current?.latitude ?? 90} >
                <div className="flex flex-col items-center">
                  <Avatar
                    src={pb.files.getURL(q?.expand?.user, q.expand?.user?.avatar)}
                    alt={q.expand?.user?.name}
                    radius="xl"
                    color="blue"
                  />
                  <span className="font-bold">
                    {q.expand?.user?.name ?? 'Неизвестный'}
                  </span>
                </div>
              </Marker>
            )}
          )}
        </Map>
    </>
  );
}
