import {StyleSheet} from 'react-native';

export const FontWeights = {
  thin: '100',
  ultraLight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
  black: '900',
};

export const TypographyStyles = StyleSheet.create({
  // Logo and stuffs
  header: {
    fontSize: 34,
    fontWeight: FontWeights.regular,
  },
  // Title variants
  title1: {
    fontSize: 28,
    fontWeight: FontWeights.regular,
  },
  title2: {
    fontSize: 22,
    fontWeight: FontWeights.regular,
  },
  title3: {
    fontSize: 20,
    fontWeight: FontWeights.regular,
  },

  // Tab view
  headline: {
    fontSize: 17,
    fontWeight: FontWeights.regular,
  },
  // Normal text
  body1: {
    fontSize: 16,
    fontWeight: FontWeights.regular,
  },
  body2: {
    fontSize: 14,
    fontWeight: FontWeights.regular,
  },

  // Small footnotes
  footnote: {
    fontSize: 13,
    fontWeight: FontWeights.regular,
  },
  // Small text variants
  caption1: {
    fontSize: 12,
    fontWeight: FontWeights.regular,
  },
  caption2: {
    fontSize: 11,
    fontWeight: FontWeights.regular,
  },
});
