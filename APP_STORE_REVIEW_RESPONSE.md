# Response to App Store Review - Submission ID: d21bce5a-5b84-4f08-aa6d-6ece2e1f93eb

## Date: January 26, 2026
## Version: 1.0.2 (Build 9)

---

## Response to Guideline 3.1.2 - Business - Payments - Subscriptions

### Issue: Missing Terms of Use (EULA) and Privacy Policy links

**Resolution:**

We have addressed all requirements for auto-renewable subscriptions:

### ✅ In-App Links (Within Purchase Flow)

**Location:** Paywall Screen (src/app/PaywallScreen.tsx)

The app now displays **prominent, functional links** to both required documents directly on the subscription purchase screen:

1. **Terms of Service:** 
   - Link: https://tawfik-software.github.io/focusapp/terms.html
   - Displayed as clickable, underlined text above pricing options
   - Font size increased to 14pt for better visibility

2. **Privacy Policy:**
   - Link: https://tawfik-software.github.io/focusapp/privacy-policy.html
   - Displayed alongside Terms of Service
   - Same visibility and accessibility

3. **Additional Disclosure:**
   - Clear text: "Auto-renewable subscription. Cancel anytime in Settings."
   - Positioned directly below pricing

**Screenshot Locations:**
- Main paywall screen with visible links
- Links are functional and open in Safari browser

### ✅ App Store Metadata

**App Description includes:**
```
Ultra Focus Flow Study Timer - Boost your productivity with focused study sessions.

Terms of Service: https://tawfik-software.github.io/focusapp/terms.html
Privacy Policy: https://tawfik-software.github.io/focusapp/privacy-policy.html

Auto-renewable subscriptions available. Cancel anytime through your Apple ID settings.
```

**Documents are publicly accessible and hosted on GitHub Pages.**

---

## Response to Guideline 2.1 - Performance - App Completeness

### Issue: Error occurred when attempting to purchase subscription

**Root Cause:**

The error occurred because our In-App Purchase products were in **"Waiting for Review"** status in App Store Connect at the time of the review (January 20, 2026). This prevented the products from being available for purchase, even in the sandbox environment during App Review.

**Resolution:**

### ✅ App Store Connect Configuration

1. **Products Status:**
   - `focusapp_monthly`: Now "Ready to Submit" and "Approved"
   - `focusapp_yearly`: Now "Ready to Submit" and "Approved"

2. **Product Details:**
   - Both products are properly configured with:
     - Pricing tiers
     - Localized names and descriptions
     - Auto-renewable subscription settings
     - Attached to app version 1.0.2

3. **Paid Apps Agreement:**
   - ✅ Confirmed active and accepted in App Store Connect
   - ✅ Banking and tax information complete

### ✅ RevenueCat Configuration

1. **Offering Setup:**
   - "default" offering configured with both products
   - Products mapped correctly:
     - Monthly: `focusapp_monthly` → $9.99/month
     - Yearly: `focusapp_yearly` → $79.99/year ($6.67/month)

2. **Entitlements:**
   - "focusapp Pro" entitlement created
   - Linked to both subscription products

### ✅ Code Improvements

**Enhanced Error Handling** (src/app/PaywallScreen.tsx):
```typescript
// Clear, actionable error messages for reviewers
if (packages.length === 0) {
  Alert.alert(
    'Configuration Required',
    'Subscription packages are not available. This may be due to:\n\n' +
    '1. Products not configured in App Store Connect\n' +
    '2. RevenueCat offering not set up\n' +
    '3. Network connectivity issue\n\n' +
    'Please ensure products are "Ready to Submit" in App Store Connect...'
  );
}
```

**Better Product Matching:**
- App now searches for products by both `packageType` (MONTHLY/ANNUAL) and `productIdentifier`
- Detailed console logs for debugging
- Graceful fallback if specific package not found

### ✅ Testing Verification

**Sandbox Testing Completed:**
- ✅ Products load successfully
- ✅ Product titles and prices display correctly
- ✅ Purchase flow completes without errors
- ✅ Subscription status updates in real-time
- ✅ Restore purchases works correctly

**StoreKit Configuration:**
- ✅ StoreKitConfig.storekit file configured for simulator testing
- ✅ All products defined in config match App Store Connect

---

## Additional Improvements

### 1. Enhanced User Experience
- Improved error messages for better diagnostics
- Added "Try Again" button when products fail to load
- Clear subscription terms displayed

### 2. Compliance
- All App Store guidelines addressed
- Legal documents publicly accessible
- Clear cancellation instructions

### 3. Stability
- Better error handling throughout purchase flow
- Network retry logic
- Graceful degradation if services unavailable

---

## Testing Instructions for Reviewers

### To Test In-App Purchases:

1. **Launch App** on iPad Air 11-inch (M3) or any test device
2. **Create/View Profile** to access paywall
3. **Navigate to Paywall** (tap "Maybe Later" on welcome, then go to Profile)
4. **Verify Legal Links:**
   - Tap "Terms of Service" → Opens in Safari
   - Tap "Privacy Policy" → Opens in Safari
   - Both pages load with full content
5. **Select a Plan** (Monthly or Yearly)
6. **Tap Subscribe Button**
7. **Complete Purchase** using sandbox tester account
8. **Verify Success:** App should navigate to main screen with Pro access

### Expected Behavior:
- ✅ Products load with correct prices ($9.99/month, $79.99/year)
- ✅ Purchase sheet displays with Apple payment UI
- ✅ Purchase completes successfully
- ✅ App unlocks Pro features
- ✅ No error messages or crashes

---

## Contact Information

**Developer:** Tawfik Software
**Email:** support@tawfikcodes.com
**App Store Connect Team ID:** [Your Team ID]

If you encounter any issues during review, please reply to this message in App Store Connect. We are available to assist immediately.

---

## Summary

All issues from the previous review (January 20, 2026) have been resolved:

1. ✅ **Terms of Use link** added to app and App Store metadata
2. ✅ **Privacy Policy link** added to app and App Store metadata
3. ✅ **IAP products** configured and approved in App Store Connect
4. ✅ **Error handling** improved with clear, diagnostic messages
5. ✅ **Purchase flow** tested and verified in sandbox

**Version 1.0.2 (Build 9)** is ready for review.

Thank you for your thorough review process. We appreciate your guidance in making our app compliant with App Store guidelines.
