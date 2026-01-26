# Ultra Focus Flow Study Timer

A minimalist focus and study timer app built with React Native and Expo.

## 📱 App Store

- **Bundle ID:** `com.tawfikcodes.focusapp`
- **Version:** 1.0.1
- **Platform:** iOS 15.1+

## 🔗 Important Links

### Legal Documents (Required by App Store)
- **Terms of Service:** https://tawfik-software.github.io/focusapp/terms.html
- **Privacy Policy:** https://tawfik-software.github.io/focusapp/privacy-policy.html

> These URLs are hosted on GitHub Pages and are accessible publicly for App Store review.

## 🚀 Features

- ⏱️ Customizable focus timer
- 📊 Session history and analytics
- 🎵 Background music options
- 🌍 Multi-language support (English, French, Spanish, Italian, Arabic)
- 💎 Pro subscription with RevenueCat

## 🛠️ Tech Stack

- **Framework:** React Native (0.81.5) with Expo (54.0.32)
- **Navigation:** React Navigation 7
- **Styling:** NativeWind (Tailwind CSS)
- **Payments:** RevenueCat (react-native-purchases)
- **Internationalization:** i18next
- **Audio:** expo-audio

## 📦 Installation

```bash
# Install dependencies
npm install

# iOS
npx expo run:ios

# Android
npx expo run:android
```

## 🔧 Configuration

### RevenueCat Setup
1. Configure products in App Store Connect
2. Set up offerings in RevenueCat Dashboard
3. Ensure products are "Ready to Submit" status
4. API Key is configured in `src/services/revenueCat.ts`

### Environment
- iOS Deployment Target: 15.1
- Android Min SDK: 24
- Node: 18+

## 📝 App Store Submission Checklist

✅ **Guideline 3.1.2 - Subscriptions**
- [x] Terms of Service link in app
- [x] Privacy Policy link in app
- [x] Terms of Service link in App Description
- [x] Auto-renewable subscription disclosure

✅ **Guideline 2.1 - Performance**
- [x] Products configured in App Store Connect
- [x] Products in "Ready to Submit" status
- [x] RevenueCat offering configured
- [x] StoreKit config for testing

## 🧪 Testing Subscriptions

### Sandbox Testing
1. Create sandbox tester in App Store Connect
2. Sign out of App Store on device
3. Launch app and attempt purchase
4. Sign in with sandbox account

### TestFlight Testing
- Products must be "Ready to Submit"
- RevenueCat automatically uses production environment
- Subscription renewals are accelerated (1 month = 5 minutes)

## 📄 License

© 2026 Tawfik Software. All rights reserved.
