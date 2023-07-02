import Layout from "@/components/Layout";
import { getError } from "@/utils/error";
import { Store } from "@/utils/Store";
import useStyles from "@/utils/styles";
import { Box, CircularProgress } from "@mui/material";
import {
  GoogleMap,
  LoadScript,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useContext, useEffect, useState, useRef } from "react";

const defaultLocation = { lat: 45.516, lng: -73.56 };
const libs = ["places"];
function Map() {
  const router = useRouter();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [center, setCenter] = useState(defaultLocation);
  const [location, setLocation] = useState(center);
  const mapRef = useRef(null);
  const placeRef = useRef(null);
  const markerRef = useRef(null);
  useEffect(() => {
    const fetchGoogleApiKey = async () => {
      try {
        const { data } = await axios.get("api/keys/google", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        setGoogleApiKey(data);
        getUserCurrentLocation();
      } catch (error) {
        enqueueSnackbar(getError(error), { variant: "error" });
      }
    };
    fetchGoogleApiKey();
  }, []);
  const getUserCurrentLocation = () => {
    if (!navigator.geolocation) {
      enqueueSnackbar("Geolocation is not supported by this browser", {
        variant: "error",
      });
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  };
  const onIdle = () => {
    setLocation({
      lat: mapRef.current.center.lat(),
      lng: mapRef.current.center.lng(),
    });
  };
  const onLoad = (map) => {
    mapRef.current = map;
  };
  const onLoadPlaces = (place) => {
    placeRef.current = place;
  };
  const onPlacesChanged = () => {
    const place = placeRef.current.getPlaces()[0].geometry.location;
    setCenter({ lat: place.lat(), lng: place.lng() });
    setLocation({ lat: place.lat(), lng: place.lng() });
  };
  const onMarkerLoad = (marker) => {
    markerRef.current = marker;
  };
  const onConfirm = () => {
    const places = placeRef.current.getPlaces();
    if (places && places.length === 1) {
      dispatch({
        type: "SAVE_SHIPPING_ADDRESS_MAP_LOCATION",
        payload: {
          lat: location.lat,
          lng: location.lng,
          address: places[0].formatted_address,
          name: places[0].name,
          vicinity: places[0].vicinity,
          googleAddressId: places[0].id,
        },
      });
      enqueueSnackbar("location selected successfully", {
        variant: "success",
      });
      router.push("/shipping");
    }
  };
  return googleApiKey ? (
    <div className={classes.fullContainer}>
      <LoadScript libraries={libs} googleMapsApiKey={googleApiKey}>
        <GoogleMap
          id="sample-map"
          mapContainerStyle={{ height: "100%", width: "100%" }}
          center={center}
          zoom={15}
          onLoad={onLoad}
          onIdle={onIdle}
        >
          <StandaloneSearchBox
            onLoad={onLoadPlaces}
            onPlacesChanged={onPlacesChanged}
          >
            <Box className={classes.mapInputBox}>
              <input type="text" placeholder="Enter your address"></input>
              <button type="button" onClick={onConfirm}>
                Confirm
              </button>
            </Box>
          </StandaloneSearchBox>
          <Marker position={location} onLoad={onMarkerLoad}></Marker>
        </GoogleMap>
      </LoadScript>
    </div>
  ) : (
    <CircularProgress />
  );
}

export default dynamic(() => Promise.resolve(Map), { ssr: false });
