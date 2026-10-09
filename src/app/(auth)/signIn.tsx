import { useSignIn } from "@clerk/expo";
import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import AuthScreen from "../../../components/AuthScreen";
import {
  getAuthErrorMessage,
  validateEmail,
  validatePassword,
} from "../../../lib/auth";

type FieldErrors = { email?: string; password?: string };

export default function SignIn() {
  const { signIn, fetchStatus } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const isSubmitting = fetchStatus === "fetching";

  const handleSignIn = async () => {
    if (isSubmitting) return;

    const nextErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setFieldErrors(nextErrors);
    setSubmitError("");
    if (nextErrors.email || nextErrors.password) return;

    try {
      const { error } = await signIn.password({
        emailAddress: email.trim(),
        password,
      });
      if (error) {
        setSubmitError(getAuthErrorMessage(error));
        return;
      }
      if (signIn.status === "complete") {
        await signIn.finalize();
        return;
      }
      if (signIn.status === "needs_client_trust") {
        const emailCodeFactor = signIn.supportedSecondFactors.find(
          (factor) => factor.strategy === "email_code",
        );
        if (!emailCodeFactor) {
          setSubmitError(
            "This account needs an additional verification method.",
          );
          return;
        }
        const { error: codeError } = await signIn.mfa.sendEmailCode();
        if (codeError) {
          setSubmitError(getAuthErrorMessage(codeError));
          return;
        }
        setNeedsVerification(true);
        return;
      }
      setSubmitError("This sign-in needs an additional verification step.");
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error));
    }
  };

  const handleVerify = async () => {
    if (code.trim().length < 4) {
      setSubmitError("Enter the verification code we emailed you.");
      return;
    }
    setSubmitError("");
    try {
      const { error } = await signIn.mfa.verifyEmailCode({ code: code.trim() });
      if (error) {
        setSubmitError(getAuthErrorMessage(error));
        return;
      }
      if (signIn.status === "complete") {
        await signIn.finalize();
        return;
      }
      setSubmitError("We could not complete verification. Please try again.");
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error));
    }
  };

  const startOver = async () => {
    try {
      await signIn.reset();
      setSubmitError("");
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error));
    } finally {
      setCode("");
      setNeedsVerification(false);
    }
  };

  if (needsVerification) {
    return (
      <AuthScreen
        title="Check your inbox"
        subtitle={`We sent a security code to ${email.trim()}.`}
      >
        <View className="auth-form">
          <View className="auth-field">
            <Text className="auth-label">Verification code</Text>
            <TextInput
              accessibilityLabel="Verification code"
              autoFocus
              className="auth-input"
              keyboardType="number-pad"
              maxLength={6}
              onChangeText={setCode}
              placeholder="Enter 6-digit code"
              placeholderTextColor="rgba(0, 0, 0, 0.45)"
              value={code}
            />
          </View>
          {submitError ? (
            <Text className="auth-error">{submitError}</Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            className={
              isSubmitting ? "auth-button auth-button-disabled" : "auth-button"
            }
            disabled={isSubmitting}
            onPress={handleVerify}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#081126" />
            ) : (
              <Text className="auth-button-text">Verify and continue</Text>
            )}
          </Pressable>
          <Pressable
            accessibilityRole="button"
            className="auth-secondary-button"
            onPress={startOver}
          >
            <Text className="auth-secondary-button-text">
              Use a different account
            </Text>
          </Pressable>
        </View>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      title="Welcome back"
      subtitle="Sign in to continue managing your subscriptions."
    >
      <View className="auth-form">
        <View className="auth-field">
          <Text className="auth-label">Email address</Text>
          <TextInput
            accessibilityLabel="Email address"
            autoCapitalize="none"
            autoComplete="email"
            className={
              fieldErrors.email ? "auth-input auth-input-error" : "auth-input"
            }
            keyboardType="email-address"
            onChangeText={(value) => {
              setEmail(value);
              setFieldErrors((current) => ({ ...current, email: undefined }));
            }}
            placeholder="Enter your email"
            placeholderTextColor="rgba(0, 0, 0, 0.45)"
            textContentType="emailAddress"
            value={email}
          />
          {fieldErrors.email ? (
            <Text className="auth-error">{fieldErrors.email}</Text>
          ) : null}
        </View>
        <View className="auth-field">
          <Text className="auth-label">Password</Text>
          <TextInput
            accessibilityLabel="Password"
            autoComplete="current-password"
            className={
              fieldErrors.password
                ? "auth-input auth-input-error"
                : "auth-input"
            }
            onChangeText={(value) => {
              setPassword(value);
              setFieldErrors((current) => ({
                ...current,
                password: undefined,
              }));
            }}
            onSubmitEditing={handleSignIn}
            placeholder="Enter your password"
            placeholderTextColor="rgba(0, 0, 0, 0.45)"
            secureTextEntry
            textContentType="password"
            value={password}
          />
          {fieldErrors.password ? (
            <Text className="auth-error">{fieldErrors.password}</Text>
          ) : null}
        </View>
        {submitError ? <Text className="auth-error">{submitError}</Text> : null}
        <Pressable
          accessibilityRole="button"
          className={
            isSubmitting ? "auth-button auth-button-disabled" : "auth-button"
          }
          disabled={isSubmitting}
          onPress={handleSignIn}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#081126" />
          ) : (
            <Text className="auth-button-text">Sign in</Text>
          )}
        </Pressable>
      </View>
      <View className="auth-link-row">
        <Text className="auth-link-copy">New to Recurrly?</Text>
        <Link href="/(auth)/signUp" asChild>
          <Text className="auth-link">Create an account</Text>
        </Link>
      </View>
    </AuthScreen>
  );
}
