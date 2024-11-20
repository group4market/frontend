import { color, extendTheme } from "@chakra-ui/react";
import "@fontsource/inter";

const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)",
};

const theme = extendTheme({
  styles: {
    global: ({ colorMode }: any) => ({
      body: {
        bg: "#000",
        color: 'white',
      },
      "::-webkit-scrollbar": {
        width: "5px",
      },
      "::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "::-webkit-scrollbar-thumb": {
        background: "#444",
      },
    }),
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  components: {
    Modal: {
      baseStyle: {
        dialog: {
          bg: "#000",
          borderWidth: "1px",
          borderRadius: 'lg',
          p: 4,
          motionPreset: 'slideInBottom'
        },
      },
    },
  },
});

export default theme;