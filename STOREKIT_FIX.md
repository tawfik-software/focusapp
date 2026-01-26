# Fix StoreKit Configuration in Xcode

## Problem
Error 23 when testing paywall: "there is an issue with your configuration check the underlying error for more details fetched from app store connect or the store kit"

## Root Cause
The `StoreKitConfig.storekit` file was deleted from the Xcode project, so the simulator cannot test IAP purchases.

## Solution

### Step 1: Add StoreKit Configuration File to Xcode
1. Open `ios/focusapp.xcworkspace` in Xcode (already open)
2. In the left sidebar, right-click on the **focusapp** folder
3. Select **"Add Files to focusapp..."**
4. Navigate to and select `ios/StoreKitConfig.storekit`
5. Make sure **"Copy items if needed"** is UNCHECKED
6. Make sure **"Create groups"** is selected
7. Click **Add**

### Step 2: Configure StoreKit for the Scheme
1. In Xcode, click on the **scheme dropdown** (next to the play button) → Select **focusapp**
2. Click **"Edit Scheme..."** (or press `Cmd + <`)
3. Select **"Run"** in the left sidebar
4. Go to the **"Options"** tab
5. Under **"StoreKit Configuration"**, select **StoreKitConfig.storekit** from the dropdown
6. Click **Close**

### Step 3: Clean and Rebuild
```bash
cd /Users/tawfik/Dev/focusapp
rm -rf ios/build
npx expo run:ios
```

## What Changed

### Before
- Onboarding flow (WhoAmIScreen) **forced** users to complete payment before continuing
- User was stuck if they cancelled the paywall
- StoreKit file was missing → simulator couldn't test purchases

### After
- Onboarding flow allows users to **skip** the payment and continue to Ready screen
- Users see the paywall later when they try to use **premium features** (Analytics, Volume Control, Premium Music)
- StoreKit file restored for testing in simulator
- Flow matches Apple's best practices: don't force payment during onboarding

## Testing the Fix

### Test 1: Onboarding Flow
1. Launch app in simulator
2. Go through Welcome → WhoAmI screens
3. Enter a name → Click Next
4. Should navigate directly to **Ready screen** (no paywall blocking)

### Test 2: Premium Features
1. From Home, navigate to Focus screen
2. Click on **"🔇"** (volume control) → Should show paywall
3. Click on **"📊"** (analytics when disabled) → Should show paywall
4. Select a premium music track → Should show paywall
5. You can test purchasing with StoreKit test mode

### Test 3: Profile Premium Features
1. Navigate to Profile screen
2. Try to view Statistics → Should show paywall
3. Try to view Analytics → Should show paywall
4. Click Upgrade button → Should show paywall

## Expected Behavior
- ✅ Users can complete onboarding without payment
- ✅ RevenueCat paywall displays correctly with StoreKit
- ✅ Test purchases work in simulator
- ✅ Premium features are locked behind paywall
- ✅ No Error 23

## App Store Submission Ready
This configuration is correct for both:
- **Testing** (simulator with StoreKit)
- **Production** (real App Store IAP)

The paywall will automatically use:
- StoreKit Config → in simulator/testing
- Real App Store Connect IAP → in production builds

## Next Steps
1. Test the fix in simulator (follow Test 1-3 above)
2. Once confirmed, build production: `npx eas-cli build --platform ios --profile production`
3. Submit to App Store with version 1.0.2
