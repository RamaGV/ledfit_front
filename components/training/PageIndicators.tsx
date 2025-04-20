import React from "react";
import { View, Animated, StyleSheet } from "react-native";

interface PageIndicatorsProps {
  items: any[];
  scrollX: Animated.Value;
  currentIndex: number;
  cardWidth: number;
  spacing: number;
  accentColor: string;
}

const PageIndicators = ({
  items,
  scrollX,
  currentIndex,
  cardWidth,
  spacing,
  accentColor,
}: PageIndicatorsProps) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 16,
    },
    dot: {
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
  });

  return (
    <View style={styles.container}>
      {items.map((_, idx) => {
        const inputRange = [
          (idx - 1) * (cardWidth + spacing * 2),
          idx * (cardWidth + spacing * 2),
          (idx + 1) * (cardWidth + spacing * 2),
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 16, 8],
          extrapolate: "clamp",
        });

        const dotOpacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.4, 1, 0.4],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={idx}
            style={[
              styles.dot,
              {
                width: dotWidth,
                opacity: dotOpacity,
                backgroundColor:
                  idx === currentIndex
                    ? accentColor
                    : "rgba(255, 255, 255, 0.3)",
              },
            ]}
          />
        );
      })}
    </View>
  );
};

export default PageIndicators;
