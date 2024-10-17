import { tamaguiExtractPlugin } from "@tamagui/vite-plugin";
import type { UserConfig } from "vite";
import { removeReactNativeWebAnimatedPlugin, one } from "one/vite";

const PROD = process.env.NODE_ENV === "production";

// @ts-ignore
if (!import.meta.dirname) {
  throw new Error(`Not on Node 22`);
}

export default {
  optimizeDeps: {
    exclude: ["@evolu/react", "@evolu/common-web", "@sqlite.org/sqlite-wasm"],
  },
  resolve: {
    dedupe: [
      "react",
      "react-dom",
      "@tamagui/core",
      "@tamagui/web",
      "@tamagui/animations-moti",
      "@tamagui/toast",
      "tamagui",
      "@tamagui/use-presence",
      "react-native-reanimated",
    ],
  },

  plugins: [
    one({
      web: {
        defaultRenderMode: "ssg",
      },

      // this is a simpler way to optimize deps on server
      deps: {
        swr: true,
        "@supabase/ssr": true,
        "is-buffer": true,
        extend: true,
        minimatch: true,
        "gray-matter": true,
        hsluv: true,
        "rehype-parse": true,
        refractor: true,
        glob: true,
        "reading-time": true,
        unified: true,
        "@evolu/react": true,
        "@evolu/react-native": true,
      },
    }),

    removeReactNativeWebAnimatedPlugin(),

    process.env.TAMAGUI_EXTRACT || PROD
      ? tamaguiExtractPlugin({
          logTimings: true,
        })
      : null,
  ],
} satisfies UserConfig;
