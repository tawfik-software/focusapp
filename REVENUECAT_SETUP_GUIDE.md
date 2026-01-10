# RevenueCat Configuration Fix Guide
## Fixing "None of the products could be fetched" Error

**Error:** `There's a problem with your configuration. None of the products registered in the RevenueCat dashboard could be fetched from App Store Connect`

---

## 🔍 Root Cause

RevenueCat cannot fetch your products because:
1. Products are not properly synced between App Store Connect and RevenueCat
2. Bundle ID mismatch
3. Products not in "Ready to Submit" status in App Store Connect
4. StoreKit Configuration file not enabled in Xcode (for testing)

---

## ✅ IMMEDIATE FIX - Enable StoreKit Config for Testing

### For Simulator/Local Testing:

1. **Open Xcode:**
```bash
cd /Users/tawfik/Dev/focusapp/ios
open focusapp.xcworkspace
```

2. **Enable StoreKit Configuration:**
   - In Xcode, click on the scheme dropdown (next to the device selector)
   - Select "Edit Scheme..."
   - Select "Run" from the left sidebar
   - Go to "Options" tab
   - Under "StoreKit Configuration", select: **StoreKitConfig.storekit**
   - Click "Close"

3. **Clean and Rebuild:**
   - Press `Cmd + Shift + K` (Clean Build Folder)
   - Press `Cmd + R` (Run)

Now your app will use the local StoreKit configuration file and products should load!

---

## 🔧 PRODUCTION FIX - App Store Connect Configuration

### Step 1: Verify Bundle ID Matches

Your Bundle ID: `com.tawfikcodes.focusapp`

**Check in App Store Connect:**
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app "Ultra Focus Flow Study Timer"
3. Go to "App Information"
4. Verify Bundle ID is exactly: `com.tawfikcodes.focusapp`

**Check in RevenueCat:**
1. Go to [RevenueCat Dashboard](https://app.revenuecat.com)
2. Select your project
3. Go to "Project Settings" → "Apps"
4. Verify iOS Bundle ID is: `com.tawfikcodes.focusapp`

### Step 2: Configure Products in App Store Connect

1. **Go to App Store Connect** → Your App → In-App Purchases

2. **Verify Both Products Exist:**
   - `focusapp_monthly` - Monthly subscription at $9.99
   - `focusapp_yearly` - Yearly subscription at $79.99

3. **For EACH Product, Verify:**
   - ✅ **Product ID** matches exactly (case-sensitive)
   - ✅ **Status** is "Ready to Submit" or "Approved"
   - ✅ **Reference Name** is set (e.g., "Focus App Pro Monthly")
   - ✅ **Subscription Group** is created (e.g., "Focus App Subscriptions")
   - ✅ **Localization** added (at least English)
   - ✅ **Price** is set ($9.99 for monthly, $79.99 for yearly)
   - ✅ **Review Screenshot** uploaded
   - ✅ **Review Notes** added if needed

4. **Check Subscription Group:**
   - Go to "Subscriptions" section
   - Ensure both products are in the SAME subscription group
   - Group name should match what's in StoreKitConfig.storekit: `focusapp`

### Step 3: Configure Products in RevenueCat

1. **Go to RevenueCat Dashboard** → Your Project → Products

2. **Add/Verify Monthly Product:**
   - Click "+ New" or edit existing
   - **Product Identifier**: `focusapp_monthly`
   - **Store**: App Store (Apple)
   - **App**: Select your iOS app
   - **Type**: Subscription
   - **Duration**: 1 month
   - Save

3. **Add/Verify Yearly Product:**
   - Click "+ New" or edit existing
   - **Product Identifier**: `focusapp_yearly`
   - **Store**: App Store (Apple)
   - **App**: Select your iOS app
   - **Type**: Subscription
   - **Duration**: 1 year
   - Save

### Step 4: Configure Entitlements in RevenueCat

1. **Go to RevenueCat Dashboard** → Your Project → Entitlements

2. **Create/Verify Entitlement:**
   - **Identifier**: `focusapp Pro` (must match exactly with your code)
   - **Attached Products**: Add both `focusapp_monthly` AND `focusapp_yearly`
   - Save

3. **Verify in your code** (already correct):
   ```typescript
   // In src/services/revenueCat.ts
   customerInfo.entitlements.active['focusapp Pro']
   ```

### Step 5: Create Offering in RevenueCat

1. **Go to RevenueCat Dashboard** → Your Project → Offerings

2. **Check "Current" Offering:**
   - If no offering exists, click "+ New Offering"
   - **Identifier**: `default` or `current`
   - **Description**: "Focus App Premium"
   - Mark as "Current Offering"

3. **Add Packages:**
   - **Monthly Package:**
     - **Identifier**: `monthly` or `$rc_monthly`
     - **Package Type**: Monthly
     - **Product**: Select `focusapp_monthly`
   
   - **Yearly Package:**
     - **Identifier**: `annual` or `$rc_annual`
     - **Package Type**: Annual
     - **Product**: Select `focusapp_yearly`

4. **Save and Publish**

---

## 🧪 Testing Steps

### Test with StoreKit Configuration (Simulator/Device):

```bash
# Terminal 1 - Start metro
cd /Users/tawfik/Dev/focusapp
npm start

# Terminal 2 - Run iOS
npx expo run:ios
```

**Expected Result:**
- App launches
- Navigate to Paywall
- Should see: "✅ Packages disponibles: 2"
- Should see both subscription options with prices

### Test with Sandbox Account (Real Device):

1. **Create Sandbox Tester:**
   - App Store Connect → Users and Access → Sandbox Testers
   - Create a new tester account (use a unique email)

2. **Sign Out of Real Apple ID:**
   - On your iPhone/iPad: Settings → App Store → Sign Out

3. **Run App on Real Device:**
```bash
npx expo run:ios --device
```

4. **Test Purchase:**
   - Open app
   - Go to Paywall
   - Tap "Subscribe Now"
   - Sign in with sandbox account when prompted
   - Complete purchase (you won't be charged)
   - Verify you get redirected to Ready screen

---

## 🚨 Common Issues & Solutions

### Issue: "Products not available"
**Solution:** 
- Wait 2-4 hours after creating products in App Store Connect
- Clear RevenueCat cache: Dashboard → Project Settings → Clear Cache
- Re-sync products

### Issue: "Invalid product identifier"
**Solution:**
- Product IDs are case-sensitive: `focusapp_monthly` NOT `FocusApp_Monthly`
- No spaces or special characters allowed
- Must match EXACTLY in all three places: App Store Connect, RevenueCat, StoreKitConfig

### Issue: "Agreements not accepted"
**Solution:**
- Go to App Store Connect → Agreements, Tax, and Banking
- Accept "Paid Apps Agreement"
- Complete all banking and tax information

### Issue: "Products work in StoreKit but not in production"
**Solution:**
- Ensure products are "Ready to Submit" in App Store Connect
- Products must be attached to your app version
- Submit products for review along with your app

### Issue: "RevenueCat returns empty offerings"
**Solution:**
- Verify "Current" offering is set in RevenueCat Dashboard
- Ensure offering contains packages
- Packages must reference valid product IDs
- Wait a few minutes for cache to clear

---

## 📋 Pre-Submission Checklist

Before submitting to App Store, verify:

- [ ] Bundle IDs match in: app.json, App Store Connect, RevenueCat
- [ ] Both products exist in App Store Connect with status "Ready to Submit"
- [ ] Products are in a subscription group
- [ ] Products have localizations, prices, and screenshots
- [ ] Products are configured in RevenueCat Dashboard
- [ ] Entitlement "focusapp Pro" exists with both products attached
- [ ] Current offering exists in RevenueCat with both packages
- [ ] Tested successfully with sandbox account on real device
- [ ] Paid Apps Agreement signed in App Store Connect
- [ ] Banking and tax info complete in App Store Connect

---

## 🔑 Your Configuration Summary

```
Bundle ID: com.tawfikcodes.focusapp
RevenueCat API Key: appl_JBFPYikrbpbLOfRGsrwRfIEobly

Products:
  - focusapp_monthly ($9.99/month)
  - focusapp_yearly ($79.99/year)

Entitlement: focusapp Pro

Offering: Current/Default
  - Monthly Package → focusapp_monthly
  - Annual Package → focusapp_yearly
```

---

## 📞 Still Having Issues?

1. **Check RevenueCat Logs:**
   - Dashboard → Activity → Recent Events
   - Look for API errors or sync issues

2. **Enable Debug Mode:**
   Your app already has verbose logging enabled:
   ```typescript
   Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
   ```

3. **Contact RevenueCat Support:**
   - Email: support@revenuecat.com
   - Include: Bundle ID, Product IDs, Error messages

4. **Check RevenueCat Status:**
   - https://status.revenuecat.com

---

## 🎯 Next Steps

1. **Immediate:** Enable StoreKit Configuration in Xcode scheme (see top of guide)
2. **Short-term:** Verify all products in App Store Connect are "Ready to Submit"
3. **Medium-term:** Test with sandbox account on real device
4. **Long-term:** Submit for App Store review with corrected configuration

Once products are loading successfully:
- Increment build number to 8 in app.json
- Create new build: `eas build --platform ios`
- Submit to App Store

---

Good luck! 🚀
