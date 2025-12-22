import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

const IOS_API_KEY = 'test_LusyeczVoCZIvyxDVgfmjlFbjeS';
const ANDROID_API_KEY = 'test_LusyeczVoCZIvyxDVgfmjlFbjeS';

export const configureRevenueCat = () => {
  Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

  if (Platform.OS === 'ios') {
    Purchases.configure({ apiKey: IOS_API_KEY });
  } else if (Platform.OS === 'android') {
    Purchases.configure({ apiKey: ANDROID_API_KEY });
  }
};

export const checkEntitlement = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return typeof customerInfo.entitlements.active['focusapp Pro'] !== 'undefined';
  } catch (e) {
    console.error('Error fetching customer info:', e);
    return false;
  }
};
