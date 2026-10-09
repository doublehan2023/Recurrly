import { View, Text, Image, Pressable } from "react-native";
import {
  formatCurrency,
  formatStatusLabel,
  formatSubscriptionDateTime,
} from "../lib/utils";
import clsx from "clsx";

const getDisplayValue = (value?: string, fallback = "Not provided") =>
  value?.trim() || fallback;

const SubscriptionCard = ({
  name,
  price,
  currency,
  icon,
  billing,
  color,
  category,
  plan,
  startDate,
  renewalDate,
  expanded,
  onPress,
  paymentMethod,
  status,
}: SubscriptionCardProps) => {
  const categoryValue =
    getDisplayValue(category, "") || getDisplayValue(plan, "Uncategorized");
  const renewalDateValue = formatSubscriptionDateTime(renewalDate);

  return (
    <Pressable
      onPress={onPress}
      className={clsx("sub-card", expanded ? "sub-card-expanded" : "bg-card")}
      style={!expanded && color ? { backgroundColor: color } : undefined}
    >
      <View className="sub-head">
        <View className="sub-main">
          <Image source={icon} className="sub-icon" />
          <View className="sub-copy">
            <Text numberOfLines={1} className="sub-title">
              {getDisplayValue(name, "Unnamed subscription")}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" className="sub-meta">
              {getDisplayValue(category, "") ||
                getDisplayValue(plan, "") ||
                renewalDateValue}
            </Text>
          </View>
        </View>
        <View className="sub-price-box">
          <Text className="sub-price">{formatCurrency(price, currency)}</Text>
          <Text className="sub-billing">
            {getDisplayValue(billing, "Not specified")}
          </Text>
        </View>
      </View>

      {expanded && (
        <View className="sub-body">
          <View className="sub-details">
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Payment:</Text>
                <Text
                  className="sub-value"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {getDisplayValue(paymentMethod, "Not set")}
                </Text>
              </View>
            </View>
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Category:</Text>
                <Text
                  className="sub-value"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {categoryValue}
                </Text>
              </View>
            </View>
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Started:</Text>
                <Text
                  className="sub-value"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {formatSubscriptionDateTime(startDate)}
                </Text>
              </View>
            </View>
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Renewal date:</Text>
                <Text
                  className="sub-value"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {renewalDateValue}
                </Text>
              </View>
            </View>
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Status:</Text>
                <Text
                  className="sub-value"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {formatStatusLabel(status?.trim())}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
};

export default SubscriptionCard;
