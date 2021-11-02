import React, { useState } from "react";
import MapView from "react-native-maps";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import useMarkers from "../../Hooks/useMarkers";
import { TouchableOpacity } from "react-native-gesture-handler";
import RequestLocationData from "../../utils/RequestLocationData";

export default function MapScreen() {
  const { markerArray, mapToggle, setMapToggle,lastLocation } = useMarkers();

  console.log(markerArray, "marker in map");
  const initRegion = {
    latitude: lastLocation.latitude,
    latitudeDelta: 0.008,
    longitude: lastLocation.longitude,
    longitudeDelta: 0.0008,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={initRegion}>
        {markerArray}
      </MapView>
      <TouchableOpacity
        onPress={() => {
          RequestLocationData();
        }}
      >
        <Text>Set Location</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
