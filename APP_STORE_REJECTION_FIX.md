# App Store Rejection - Fix Guide
## Ultra Focus Flow Study Timer

**Date:** January 8, 2026  
**Review Date:** January 7, 2026  
**Submission ID:** d21bce5a-5b84-4f08-aa6d-6ece2e1f93eb

---

## Issues Summary

Your app was rejected for 3 main reasons:

1. **Guideline 2.3.2** - Promotional image is the same as app icon
2. **Guideline 3.1.2** - Missing Terms of Use and Privacy Policy links
3. **Guideline 2.1** - In-App Purchase error during testing

---

## ✅ FIXED IN CODE

### 1. Terms of Service & Privacy Policy Links

**What was done:**
- ✅ Created `terms.html` with complete Terms of Service
- ✅ Created `TERMS_OF_SERVICE.md` for reference
- ✅ Updated `PaywallScreen.tsx` to include clickable links to:
  - Terms of Service
  - Privacy Policy
- ✅ Added auto-renewal disclosure text
- ✅ Added all required subscription information (title, duration, price)
- ✅ Updated all localization files (English, French, Spanish, Arabic, Italian)

**The app now shows:**
- Subscription title (Monthly Plan / Yearly Plan)
- Duration (1 month / 1 year)
- Price ($9.99/month or $79.99/year)
- Auto-renewal information
- Clickable "Terms of Service" link
- Clickable "Privacy Policy" link

### 2. Improved RevenueCat Error Handling

**What was done:**
- ✅ Added better error messages for different purchase failure scenarios
- ✅ Added validation to check if packages are loaded before purchase
- ✅ Added detailed console logging for debugging
- ✅ Added specific error codes handling:
  - PRODUCT_NOT_AVAILABLE_FOR_PURCHASE
  - PURCHASE_NOT_ALLOWED
  - PAYMENT_PENDING

---

## 🔧 ACTIONS YOU NEED TO TAKE

### Action 1: Upload Terms of Service HTML

You need to upload the `terms.html` file so it's accessible via URL.

**Option A: Upload to GitHub (Recommended)**
```bash
# In your terminal
cd /Users/tawfik/Dev/focusapp
git add terms.html TERMS_OF_SERVICE.md
git commit -m "Add Terms of Service"
git push origin main
```

After pushing, the Terms will be accessible at:
```
https://raw.githubusercontent.com/tawfik-software/focusapp/main/terms.html
```

**Option B: Upload to OneDrive**
1. Upload `terms.html` to your OneDrive
2. Get a shareable link
3. Update the link in `PaywallScreen.tsx` at line ~269

### Action 2: Create Unique Promotional Image

Apple requires a UNIQUE promotional image (not the same as your app icon).

**Steps in App Store Connect:**
1. Go to App Store Connect → Your App → In-App Purchases
2. Select your subscription (focusapp_monthly or focusapp_yearly)
3. Scroll to "Promotional Image"
4. Create a NEW image that shows:
   - Visual representation of what users get with the subscription
   - Benefits of subscribing
   - Could include screenshots of premium features
   - Must be DIFFERENT from your app icon

**Design Recommendations:**
- Size: 1024x1024 pixels minimum
- Show premium features visually (e.g., music tracks, analytics, ad-free badge)
- Use your app's color scheme (#91908b, #e8ddd0)
- Include text like "Premium Access" or "Unlock All Features"
- **DO NOT just use your app icon**

**Tools to create the image:**
- Canva (canva.com) - Easy online tool
- Figma (figma.com) - Professional design tool
- Photoshop or Sketch
- Even PowerPoint/Keynote can work

### Action 3: Fix RevenueCat Configuration

The purchase error during Apple's review suggests a configuration issue.

**Check these in App Store Connect:**

1. **Subscriptions Status**
   - Go to App Store Connect → In-App Purchases
   - Ensure both `focusapp_monthly` and `focusapp_yearly` are:
     - ✅ Status: "Ready to Submit"
     - ✅ Approved for sale
     - ✅ Attached to your app version 1.0

2. **Pricing**
   - Monthly: $9.99 USD
   - Yearly: $79.99 USD
   - Verify prices are set for all territories

3. **Bundle ID Match**
   - App Store Connect Bundle ID: `com.tawfiksoftware.focusapp` (or similar)
   - Xcode Bundle ID: Must match exactly
   - RevenueCat Project Settings → Bundle ID: Must match exactly

**Check RevenueCat Dashboard:**

1. Go to RevenueCat Dashboard → Products
2. Verify both products are configured:
   - Product ID: `focusapp_monthly` (Apple: `focusapp_monthly`)
   - Product ID: `focusapp_yearly` (Apple: `focusapp_yearly`)

3. Go to Entitlements
   - Entitlement name: `focusapp Pro` (must match exactly with your code)
   - Both products attached to this entitlement

4. Test in Sandbox:
   - Create a sandbox tester account in App Store Connect
   - Test purchases on a real device (not simulator)
   - Verify purchases complete successfully

### Action 4: Update App Store Connect Metadata

**App Description:**
Add at the end of your app description:

```
Terms of Service: https://raw.githubusercontent.com/tawfik-software/focusapp/main/terms.html
Privacy Policy: https://1drv.ms/w/c/1d76045b040cc6c0/IQCVPalKvNAeRZjqx-XsoArEASOvboHjtSBoD6zm1FC9F0Y
```

**Privacy Policy Field:**
In App Store Connect, under "App Information":
1. Find "Privacy Policy URL" field
2. Enter: `https://1drv.ms/w/c/1d76045b040cc6c0/IQCVPalKvNAeRZjqx-XsoArEASOvboHjtSBoD6zm1FC9F0Y`

### Action 5: Rebuild and Test

```bash
cd /Users/tawfik/Dev/focusapp

# Install dependencies if needed
npm install

# Build for iOS
npx expo prebuild --platform ios
cd ios
pod install
cd ..

# Test on a real device with sandbox account
npx expo run:ios --device
```

**Testing Checklist:**
- [ ] App launches successfully
- [ ] Paywall shows subscription prices
- [ ] Auto-renewal text is visible
- [ ] "Terms of Service" link is clickable and opens browser
- [ ] "Privacy Policy" link is clickable and opens browser
- [ ] Can complete purchase with sandbox account
- [ ] After purchase, app navigates to Ready screen
- [ ] Subscription appears in sandbox account settings

### Action 6: Resubmit to App Store

Once all fixes are done:

1. Increment build number in `app.json`:
```json
{
  "expo": {
    "version": "1.0.1",
    "ios": {
      "buildNumber": "2"
    }
  }
}
```

2. Build and upload:
```bash
# Using EAS
eas build --platform ios --profile production
```

3. In App Store Connect:
   - Upload the new build
   - Update promotional images for subscriptions
   - Verify Terms of Service link in description
   - Verify Privacy Policy URL is set
   - Submit for review

4. **In the "Review Notes" section, add:**

```
Dear App Review Team,

Thank you for your feedback. We have addressed all the issues:

1. Promotional Image: We have uploaded a unique promotional image that showcases our premium subscription features. It is no longer the same as our app icon.

2. Terms & Privacy Links: 
   - Terms of Service: https://raw.githubusercontent.com/tawfik-software/focusapp/main/terms.html
   - Privacy Policy: https://1drv.ms/w/c/1d76045b040cc6c0/IQCVPalKvNAeRZjqx-XsoArEASOvboHjtSBoD6zm1FC9F0Y
   
   Both links are now prominently displayed in the app's paywall screen and are functional.

3. Subscription Information: The app now clearly displays:
   - Subscription titles (Monthly Plan / Yearly Plan)
   - Duration (1 month / 1 year)
   - Prices ($9.99/month, $79.99/year)
   - Auto-renewal terms
   - Links to Terms of Service and Privacy Policy

4. In-App Purchase: We have improved error handling and verified our RevenueCat configuration. All products are properly configured in App Store Connect and RevenueCat dashboard.

Sandbox Test Account: [provide your sandbox test email]

Please let us know if you need any additional information.

Thank you!
```

---

## 🧪 Testing Recommendations

### Before Resubmitting:

1. **Test on iPad** (since rejection was on iPad Air):
```bash
npx expo run:ios --device
# Select iPad from device list
```

2. **Test Purchase Flow:**
   - Launch app
   - Navigate to Paywall
   - Verify all text is visible
   - Click "Terms of Service" → Should open browser with terms
   - Click "Privacy Policy" → Should open browser with privacy policy
   - Tap "Subscribe Now" → Should show Apple purchase dialog
   - Complete purchase with sandbox account → Should succeed and navigate to Ready screen

3. **Test Different Languages:**
   - Change device language to French/Spanish/Arabic/Italian
   - Verify paywall text appears correctly
   - Verify links still work

4. **Test Offline:**
   - Turn off WiFi and cellular
   - Launch app
   - Try to view subscription screen
   - Verify graceful error messages (not crashes)

---

## 📋 Checklist Before Resubmission

- [ ] Terms of Service HTML is uploaded and accessible via URL
- [ ] Unique promotional image created and uploaded to App Store Connect
- [ ] Both subscription products are "Ready to Submit" in App Store Connect
- [ ] RevenueCat products are configured correctly
- [ ] Bundle IDs match across Xcode, App Store Connect, and RevenueCat
- [ ] Tested purchase flow with sandbox account on real device
- [ ] Tested on iPad (the device used in rejection)
- [ ] Privacy Policy URL added to App Store Connect
- [ ] Terms of Service link added to app description
- [ ] Build number incremented
- [ ] Code changes committed and pushed to repository
- [ ] New build uploaded to App Store Connect
- [ ] Review notes added explaining fixes

---

## 📞 Need Help?

If you encounter issues:

1. **RevenueCat Issues:**
   - Check RevenueCat Dashboard logs
   - Verify API keys in `src/services/revenueCat.ts`
   - Test with sandbox account first

2. **App Store Connect Issues:**
   - Verify all agreements are signed (Paid Apps Agreement)
   - Check that bank/tax information is complete
   - Ensure contracts are active

3. **Build Issues:**
   - Run `npx expo doctor` to check for issues
   - Clean build: `cd ios && xcodebuild clean && pod install`
   - Update dependencies: `npm update`

---

## 📝 Files Modified

- ✅ `/src/app/PaywallScreen.tsx` - Added Terms/Privacy links, improved error handling
- ✅ `/src/locales/en.json` - Added new translation keys
- ✅ `/src/locales/fr.json` - Added new translation keys
- ✅ `/src/locales/es.json` - Added new translation keys
- ✅ `/src/locales/ar.json` - Added new translation keys
- ✅ `/src/locales/it.json` - Added new translation keys
- ✅ `/terms.html` - Created Terms of Service HTML page
- ✅ `/TERMS_OF_SERVICE.md` - Created Terms of Service markdown

---

Good luck with your resubmission! 🚀
