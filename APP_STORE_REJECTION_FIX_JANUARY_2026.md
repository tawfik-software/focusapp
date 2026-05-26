# App Store Rejection Fix - January 20, 2026

## ❌ Rejection Reason

**Guideline 3.1.2 - Business - Payments - Subscriptions**

Apple rejected the app because it's missing a **functional link to Terms of Use (EULA)** in the subscription purchase flow.

**Submission Details:**
- Submission ID: d21bce5a-5b84-4f08-aa6d-6ece2e1f93eb
- Review Date: January 20, 2026
- Device: iPad Air 11 inches (M3)
- Version: 1.0.1
- iOS Version: iPadOS 26.2

## ✅ Solution Overview

You need to add Terms of Service and Privacy Policy links in **TWO** places:

1. **In the App** - Via RevenueCat paywall configuration
2. **In App Store Connect** - In the app metadata

---

## 📱 PART 1: Fix the App (RevenueCat Configuration)

### Option A: Configure in RevenueCat Dashboard (RECOMMENDED)

1. **Go to RevenueCat Dashboard**
   - Visit: https://app.revenuecat.com
   - Navigate to your project

2. **Configure Paywall Footer**
   - Go to **Paywalls** section
   - Select your active paywall (usually "default")
   - Click **Edit Paywall**
   
3. **Add Legal Links Block**
   - Scroll to the bottom of the paywall editor
   - Look for **"Footer"** or **"Legal"** section
   - Add a new **"Footer"** block or **"Legal Links"** block
   
4. **Configure the Legal Links:**
   ```
   Terms of Service URL: https://tawfik-software.github.io/focusapp/terms.html
   Privacy Policy URL: https://tawfik-software.github.io/focusapp/privacy-policy.html
   ```

5. **Save and Publish**
   - Save the paywall changes
   - Make sure the paywall is published and active

### Option B: Update Paywall Template

If your RevenueCat paywall doesn't show footer links:

1. In RevenueCat Dashboard, go to **Paywalls**
2. Create a new paywall or edit existing one
3. Choose a template that includes **legal links** (most templates have this)
4. Ensure the template has a footer section
5. Add the legal URLs as shown above

### Option C: Use Native iOS Paywall (Alternative)

If RevenueCat paywalls continue to have issues, you can switch to using Apple's native StoreKit paywall:

This requires implementing `StoreKit 2` with `SubscriptionStoreView` which automatically includes all required legal links. However, this is a bigger change.

---

## 🌐 PART 2: Fix App Store Connect Metadata

1. **Log in to App Store Connect**
   - Visit: https://appstoreconnect.apple.com
   - Navigate to your app

2. **Update App Description**
   - Go to **App Information** > **App Description**
   - Add at the end of your description:
   
   ```
   Terms of Service: https://tawfik-software.github.io/focusapp/terms.html
   Privacy Policy: https://tawfik-software.github.io/focusapp/privacy-policy.html
   ```

3. **OR Add Custom EULA** (Alternative)
   - Instead of adding to description, you can:
   - Go to **Pricing and Availability** section
   - Scroll to **License Agreement**
   - Upload your custom EULA if you have one
   - Or use Apple's Standard License Agreement and link to your terms in the description

---

## 🔍 Verification Steps

### Test the App:

1. Build and run the app in Xcode
2. Navigate to a premium feature to trigger the paywall
3. **Verify the paywall shows:**
   - ✅ Subscription pricing
   - ✅ Terms of Service link (clickable)
   - ✅ Privacy Policy link (clickable)
   - ✅ Links open in Safari or in-app browser

4. Test the links:
   - Click on Terms of Service link → should open the terms page
   - Click on Privacy Policy link → should open the privacy page
   - Verify both pages load correctly

### Test in Production Mode:

1. Create a TestFlight build
2. Install on a real device
3. Test the paywall thoroughly
4. Ensure links work on actual devices (not just simulator)

---

## 📝 Response to Apple Review Team

**Reply in App Store Connect with:**

---

**Subject: Resolution - Terms of Service Links Added**

Dear App Review Team,

Thank you for your feedback regarding Guideline 3.1.2.

We have now updated the application and metadata to include functional links to our Terms of Service (EULA) and Privacy Policy.

**In the App:**
- We have configured our subscription paywall (RevenueCat) to display legal links in the footer
- Terms of Service link is now visible during the purchase flow
- Privacy Policy link is also included

**In App Store Metadata:**
- We have added links to our Terms of Service and Privacy Policy in the app description

**Legal URLs:**
- Terms of Service: https://tawfik-software.github.io/focusapp/terms.html
- Privacy Policy: https://tawfik-software.github.io/focusapp/privacy-policy.html

Both links are functional and accessible. We have tested the subscription flow on iPad Air and iPhone devices to ensure compliance.

Please feel free to contact us if you need any additional information.

Best regards,
Focus App Team

---

## 🚀 Resubmission Checklist

Before resubmitting:

- [ ] RevenueCat paywall configured with legal links
- [ ] Tested paywall shows Terms and Privacy links
- [ ] Links are clickable and load correctly
- [ ] App Store Connect description updated with legal links
- [ ] Version number bumped (1.0.1 → 1.0.2 or higher)
- [ ] Build number incremented
- [ ] Created new build in Xcode
- [ ] Uploaded to App Store Connect
- [ ] Submitted for review with response message

---

## 📊 Current Status

✅ Code updated - paywall.ts now includes legal URL constants
✅ Terms and Privacy hosted at:
   - https://tawfik-software.github.io/focusapp/terms.html
   - https://tawfik-software.github.io/focusapp/privacy-policy.html

⚠️ **ACTION REQUIRED:**
1. Configure RevenueCat Dashboard to show legal links in paywall footer
2. Update App Store Connect metadata
3. Test thoroughly
4. Resubmit

---

## 🆘 Troubleshooting

### If links still don't show in paywall:

1. **Check RevenueCat Version:**
   - Make sure you're using a recent version of `react-native-purchases-ui`
   - Update if needed: `npm update react-native-purchases-ui`

2. **Check Paywall Configuration:**
   - In RevenueCat dashboard, verify the paywall is published
   - Check that the paywall has a footer or legal block
   - Try using a different paywall template

3. **Test in Sandbox Mode:**
   - Make sure StoreKit configuration is correct
   - Test with sandbox accounts

4. **Consider Custom Paywall:**
   - If RevenueCat paywalls continue to have issues, you may need to build a custom subscription screen that explicitly shows these links

---

## 📞 Support Resources

- **RevenueCat Documentation:** https://docs.revenuecat.com
- **Apple Developer Forums:** https://developer.apple.com/forums
- **App Store Connect Support:** Use "Contact Us" in App Store Connect
- **Meet with Apple:** Request a review consultation on Tuesdays/Thursdays

---

## 🎯 Expected Timeline

1. Configure RevenueCat: **10-15 minutes**
2. Update App Store Connect: **5 minutes**
3. Build and test: **30 minutes**
4. Upload to App Store Connect: **15-30 minutes**
5. **Submit for review**
6. Review time: **24-48 hours typically**

---

**Last Updated:** January 2026
**Status:** Action Required - RevenueCat Configuration Needed
