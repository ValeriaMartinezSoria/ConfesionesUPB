import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Video, ResizeMode } from "expo-av";

type Props = {
  onFinish?: () => void;
  durationMs?: number; 
};

export default function SplashScreen({ onFinish, durationMs = 3000 }: Props) {
  const videoRef = useRef<Video | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish?.();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [onFinish, durationMs]);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require("../assets/splash.mp4")}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        isLooping={false}
        shouldPlay
        onPlaybackStatusUpdate={(status) => {
          // @ts-ignore
          if (status?.didJustFinish) {
            onFinish?.();
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  video: { width: "100%", height: "100%" },
});
