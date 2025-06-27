module.exports = function(api) {
  api.cache(true);
  return {
    ignore: ["hell-app/**"],
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel"
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
            // Alias react-dom to react-native
            "react-dom": "react-native"
          },
          extensions: [".js", ".jsx", ".ts", ".tsx"]
        }
      ]
     ]
   };
 };