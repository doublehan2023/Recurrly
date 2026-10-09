import { useSignUp } from "@clerk/expo";
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

type FieldErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function SignUp() {
  const { signUp, fetchStatus } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const isSubmitting = fetchStatus === "fetching";

  const handleSignUp = async () => {
    if (isSubmitting) return;

    const nextErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword:
        password === confirmPassword ? "" : "Passwords do not match.",
    };
    setFieldErrors(nextErrors);
    setSubmitError("");
    if (nextErrors.email || nextErrors.password || nextErrors.confirmPassword)
      return;

    try {
      const { error } = await signUp.password({
        emailAddress: email.trim(),
        password,
      });
      if (error) {
        setSubmitError(getAuthErrorMessage(error));
        return;
      }
      const { error: emailCodeError } =
        await signUp.verifications.sendEmailCode();
      if (emailCodeError) {
        setSubmitError(getAuthErrorMessage(emailCodeError));
        return;
      }
      setIsVerifying(true);
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
      const { error } = await signUp.verifications.verifyEmailCode({
        code: code.trim(),
      });
      if (error) {
        setSubmitError(getAuthErrorMessage(error));
        return;
      }
      if (signUp.status === "complete") {
        await signUp.finalize();
        return;
      }
      setSubmitError("We could not complete verification. Please try again.");
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error));
    }
  };

  const resendCode = async () => {
    setSubmitError("");
    try {
      const { error } = await signUp.verifications.sendEmailCode();
      if (error) setSubmitError(getAuthErrorMessage(error));
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error));
    }
  };

  if (isVerifying) {
    return (
      <AuthScreen
        title="Verify your email"
        subtitle={`Enter the code we sent to ${email.trim()}.`}
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
            disabled={isSubmitting}
            onPress={resendCode}
          >
            <Text className="auth-secondary-button-text">Resend code</Text>
          </Pressable>
        </View>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      title="Make subscriptions simple"
      subtitle="Create your private space for clearer recurring spending."
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
          <Text className="auth-label">Create a password</Text>
          <TextInput
            accessibilityLabel="Create a password"
            autoComplete="new-password"
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
            placeholder="At least 8 characters"
            placeholderTextColor="rgba(0, 0, 0, 0.45)"
            secureTextEntry
            textContentType="newPassword"
            value={password}
          />
          {fieldErrors.password ? (
            <Text className="auth-error">{fieldErrors.password}</Text>
          ) : (
            <Text className="auth-helper">
              Use 8 or more characters to protect your account.
            </Text>
          )}
        </View>
        <View className="auth-field">
          <Text className="auth-label">Confirm password</Text>
          <TextInput
            accessibilityLabel="Confirm password"
            autoComplete="new-password"
            className={
              fieldErrors.confirmPassword
                ? "auth-input auth-input-error"
                : "auth-input"
            }
            onChangeText={(value) => {
              setConfirmPassword(value);
              setFieldErrors((current) => ({
                ...current,
                confirmPassword: undefined,
              }));
            }}
            onSubmitEditing={handleSignUp}
            placeholder="Repeat your password"
            placeholderTextColor="rgba(0, 0, 0, 0.45)"
            secureTextEntry
            textContentType="newPassword"
            value={confirmPassword}
          />
          {fieldErrors.confirmPassword ? (
            <Text className="auth-error">{fieldErrors.confirmPassword}</Text>
          ) : null}
        </View>
        {submitError ? <Text className="auth-error">{submitError}</Text> : null}
        <Pressable
          accessibilityRole="button"
          className={
            isSubmitting ? "auth-button auth-button-disabled" : "auth-button"
          }
          disabled={isSubmitting}
          onPress={handleSignUp}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#081126" />
          ) : (
            <Text className="auth-button-text">Create account</Text>
          )}
        </Pressable>
        <Text className="auth-helper">
          By continuing, you agree to receive account and security emails.
        </Text>
        <View nativeID="clerk-captcha" />
      </View>
      <View className="auth-link-row">
        <Text className="auth-link-copy">Already have an account?</Text>
        <Link href="/(auth)/signIn" asChild>
          <Text className="auth-link">Sign in</Text>
        </Link>
      </View>
    </AuthScreen>
  );
}
