import * as React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Border, Color } from "../GlobalStyles";

export default function Logo() {
  return (
    <View style={styles.logoContainer}>
      <View style={styles.rectangle} />
      <Image
        source={require("@/assets/vector.png")}
        style={styles.vectorIcon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rectangle: {
    height: "100%",
    width: "100%",
    top: "0%",
    right: "0%",
    bottom: "0%",
    left: "0%",
    borderRadius: Border.br_xs,
    backgroundColor: Color.primary500,
    position: "absolute",
  },
  vectorIcon: {
    height: "33.44%",
    width: "66.56%",
    top: "33.44%",
    right: "16.88%",
    bottom: "33.13%",
    left: "16.56%",
    maxWidth: "100%",
    overflow: "hidden",
    maxHeight: "100%",
    position: "absolute",
    tintColor: Color.greyscale300,
  },
  logoContainer: {
    borderRadius: Border.br_341xl,
    width: 36,
    height: 36,
  },
});
