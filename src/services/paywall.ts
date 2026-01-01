import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import Purchases from 'react-native-purchases';
import { Alert } from 'react-native';

export const presentPaywall = async (): Promise<boolean> => {
  try {
    // Check if offerings are available
    const offerings = await Purchases.getOfferings();
    console.log('Current offering:', offerings.current);
    console.log('All offerings:', offerings.all);

    
    if (!offerings.current) {
      Alert.alert(
        'Configuration Error',
        'No default offering found. Please configure a "default" offering in RevenueCat Dashboard.\n\nVisit: https://app.revenuecat.com/projects/3f809dce/product-catalog',
        [{ text: 'OK' }]
      );
      return false;
    }

    console.log('Available packages:', offerings.current.availablePackages);

    const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall();

    switch (paywallResult) {
      case PAYWALL_RESULT.NOT_PRESENTED:
        console.log('Paywall not presented');
        return false;
      case PAYWALL_RESULT.ERROR:
        console.log('Paywall error');
        return false;
      case PAYWALL_RESULT.CANCELLED:
        console.log('Paywall cancelled by user');
        return false;
      case PAYWALL_RESULT.PURCHASED:
        console.log('Purchase successful!');
        return true;
      case PAYWALL_RESULT.RESTORED:
        console.log('Purchase restored!');
        return true;
      default:
        return false;
    }
  } catch (e: any) {
    console.error('Error presenting paywall:', e);
    Alert.alert(
      'Paywall Error',
      `Error ${e.code || 'unknown'}: ${e.message || 'Could not display paywall'}`,
      [{ text: 'OK' }]
    );
    return false;
  }
};
