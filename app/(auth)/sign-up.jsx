import * as React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { styles } from "../../styles/auth.styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS } from "../../constants/colors";
import { Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    console.log(emailAddress, password);

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
      setError(""); // Clear any previous errors
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      if (err.errors?.[0]?.code === "form_email_address_already_exists") {
        setError("Email address already exists. Please sign in.");
      }
      else if (err.errors?.[0]?.code === "form_password_too_short") {
        setError("Password is too short. Please use at least 8 characters.");
      }
      else if (err.errors?.[0]?.code === "form_email_address_invalid") {
        setError("Invalid email address. Please enter a valid email.");
      }
      else if (err.errors?.[0]?.code === "form_email_address_not_verified") {
        setError("Email address not verified. Please check your inbox.");
      }
      else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/(root)/index"); // Redirect to the home page
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <>
        <View style={styles.verificationContainer}>
          <Text style={styles.verificationTitle}>Verify your email</Text>
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons
                name="alert-circle"
                size={24}
                color={COLORS.expense}
                onPress={() => setError("")}
              />
              <Text style={styles.errorText}>{error}</Text>

              <TouchableOpacity onPress={() => setError("")}>
                <Ionicons name="close" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          ) : null}
          <TextInput
            style={[styles.verificationInput, error && styles.errorInput]}
            value={code}
            placeholder="Enter your verification code"
            placeholderTextColor={COLORS.textLight}
            onChangeText={(code) => setCode(code)}
          />
          <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <KeyboardAwareScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} enableOnAndroid={true} enableAutomaticScroll={true} extraScrollHeight={50}>
      <View style={styles.container}>
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/burakorkmez/wallet-app-assets/refs/heads/master/revenue-i2.png",
          }}
          style={styles.illustration} // ✅ asigură dimensiuni
          contentFit="contain"
        />
        <Text style={styles.title}>Create Account</Text>
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons
              name="alert-circle"
              size={24}
              color={COLORS.expense}
              onPress={() => setError("")}
            />
            <Text style={styles.errorText}>{error}</Text>

            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor={COLORS.textLight}
          onChangeText={(email) => setEmailAddress(email)}
        />
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          placeholderTextColor={COLORS.textLight}
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity onPress={onSignUpPress} style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row" , justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/sign-in">
            <Text style={styles.linkText}>Sign in</Text>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
