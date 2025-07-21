const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
        "path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        colors: {
            white: {
                bg: "#D7D5D5",
                bg_hover: "#c7c6c6",
                bg2: "#E5E5E5",
                bg3: "#979797",
            },
            black: {
                comun: "#252525",
                hover: "#373737",
            },
            button: {
                red: "#D64747",
                red_hover: "#E16D6D",
                green: "#86C394",
                green_2: "#bfd2c4",
                green_hover: "#A1D2AD",
                yellow: "#d6d447",
                yellow_hover: "#f0ee57",
            },
        },
        fontFamily: {
            NS: ["Gabarito", "sans-serif"],
        },
        extend: {},
    },
    plugins: [],
});
