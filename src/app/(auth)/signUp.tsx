import { Link } from 'expo-router'
import { View, Text } from 'react-native'

const signUp = () => {
  return (
    <View>
      <Text>signUp</Text>
      <Link href="/(auth)/signIn">Sign In</Link>
    </View>
  )
}

export default signUp