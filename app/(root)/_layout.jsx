import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import {Stack} from "expo-router";

export default function Layout() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />; // Trimite doar dacă utilizatorul NU e logat
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
