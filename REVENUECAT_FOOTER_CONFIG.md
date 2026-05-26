# RevenueCat Paywall Configuration - Quick Guide

## 🎯 Objective

Add Terms of Service and Privacy Policy links to your RevenueCat paywall footer so Apple can approve your app.

---

## 📋 Step-by-Step Instructions

### Step 1: Access RevenueCat Dashboard

1. Go to https://app.revenuecat.com
2. Log in with your credentials
3. Select your project: **focusapp**

### Step 2: Navigate to Paywalls

1. In the left sidebar, click **"Paywalls"**
2. You should see your default paywall listed
3. Click on the paywall to edit it (usually named "default" or "Default offering")

### Step 3: Edit Paywall Configuration

1. Click **"Edit Paywall"** or the edit/pencil icon
2. You'll see the paywall visual editor

### Step 4: Add Footer/Legal Block

**Option A: If you see a Footer section:**
1. Scroll to the bottom of the paywall blocks
2. Look for **"Footer"** or **"Legal"** section
3. Click **"Add Block"** or **"+"**
4. Select **"Footer"** or **"Legal Links"** from the block types

**Option B: If no Footer option exists:**
1. Look for **"Add Block"** button at the bottom
2. Select **"Text"** or **"Custom"** block
3. Add this text manually:
   ```
   Terms of Service | Privacy Policy
   ```
4. Make these text clickable/linkable

### Step 5: Configure Legal URLs

Add these URLs:

**Terms of Service:**
```
https://tawfik-software.github.io/focusapp/terms.html
```

**Privacy Policy:**
```
https://tawfik-software.github.io/focusapp/privacy-policy.html
```

### Step 6: Save and Publish

1. Click **"Save"** or **"Save Changes"**
2. Make sure the paywall status is **"Published"** or **"Active"**
3. If there's a "Publish" button, click it

---

## 🔍 What It Should Look Like

Your paywall should have:

```
┌─────────────────────────────┐
│   Premium Features          │
│                             │
│   Monthly: $9.99/month      │
│   Annual: $79.99/year       │
│                             │
│   [Subscribe Button]        │
│                             │
│   Terms | Privacy           │  ← THIS IS WHAT'S MISSING
└─────────────────────────────┘
```

The footer should show **clickable links** to Terms and Privacy Policy.

---

## 📱 Alternative: Use Default Template with Footer

If your current paywall doesn't support footer easily:

1. **Create a New Paywall:**
   - In RevenueCat Dashboard → Paywalls
   - Click **"Create Paywall"**
   
2. **Choose a Template:**
   - Select a template that includes **footer/legal links**
   - Templates like "Simple", "Minimalist", or "Standard" usually have this
   
3. **Configure the Template:**
   - Add your packages (monthly, annual)
   - Scroll to footer configuration
   - Add Terms and Privacy URLs
   
4. **Set as Default:**
   - Once configured, set this as your default offering
   - Make sure it's published

---

## ✅ Verification

After configuring:

1. **In RevenueCat Dashboard:**
   - Preview the paywall
   - Verify footer shows Terms and Privacy links
   
2. **In Your App:**
   - Run the app in simulator/device
   - Trigger the paywall (try to use a premium feature)
   - Verify the links appear at the bottom
   - Click the links to ensure they open correctly

---

## 🆘 If You Can't Find Footer Configuration

### Option 1: Check RevenueCat Version

Your paywall might be using an older format. To fix:

1. Create a **new paywall** with a modern template
2. Modern templates always include footer configuration
3. Set it as your default offering

### Option 2: Use Custom Blocks

If no footer block exists:

1. Add a **"Text Block"** at the bottom
2. Enter this text:
   ```
   By subscribing, you agree to our Terms of Service and Privacy Policy
   ```
3. Make "Terms of Service" and "Privacy Policy" clickable
4. Link them to the respective URLs

### Option 3: Contact RevenueCat Support

If you still can't add footer:

1. Go to RevenueCat Dashboard
2. Click support/help icon
3. Ask: "How do I add Terms of Service and Privacy Policy links to my paywall footer?"

---

## 📊 Current URLs

**Terms of Service:**
- URL: https://tawfik-software.github.io/focusapp/terms.html
- Status: ✅ Already created and hosted

**Privacy Policy:**
- URL: https://tawfik-software.github.io/focusapp/privacy-policy.html
- Status: ✅ Already created and hosted

---

## ⏱️ Estimated Time

- Finding the paywall settings: **2-3 minutes**
- Adding footer configuration: **3-5 minutes**
- Testing and verification: **5-10 minutes**
- **Total: ~15 minutes**

---

## 🎯 After Configuration

Once you've added the footer in RevenueCat:

1. ✅ Test the app thoroughly
2. ✅ Verify links work
3. ✅ Update App Store Connect description (see main document)
4. ✅ Build and submit new version
5. ✅ Reply to Apple's review team

---

## 📞 Need Help?

- **RevenueCat Docs:** https://docs.revenuecat.com/docs/displaying-paywalls
- **RevenueCat Support:** support@revenuecat.com
- **RevenueCat Community:** https://community.revenuecat.com

---

**Quick Tip:** If you're having trouble finding the footer configuration, try creating a brand new paywall with a fresh template - it's often easier than modifying an old one.
