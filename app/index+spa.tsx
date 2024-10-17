import { H1 } from "tamagui";
import { Link, useLoader } from "one";
import { HeadInfo } from "@/components/HeadInfo";
import { ReactNativeExample } from "@/components/evolu/components/ReactNativeExample";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export async function loader() {
  return {
    hello: "world",
  };
}

export default function TamaguiHomePage() {
  const { hello } = useLoader(loader);

  return (
    <>
      <HeadInfo
        title="Tamagui"
        description="React style library and UI kit that unifies React Native and React web"
      />
      <H1>Hello {hello}</H1>
      <Link href="/login">Login</Link>
      <ErrorBoundary>
        <ReactNativeExample />
      </ErrorBoundary>
    </>
  );
}
