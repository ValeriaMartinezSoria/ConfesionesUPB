import React from "react";
import { View, StyleSheet } from "react-native";
import { Video, ResizeMode } from "expo-av";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Video
        source={require("../assets/splash.mp4")}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  video: { width: "100%", height: "100%" },
});
