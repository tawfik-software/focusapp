# Migration RevenueCat vers Google AdMob

## ✅ Changements effectués

### 1. Suppression complète de RevenueCat

#### Fichiers supprimés :
- `src/services/revenueCat.ts`
- `src/services/paywall.ts`
- `src/providers/RevenueCatProvider.tsx`

#### Dépendances supprimées du package.json :
- `react-native-purchases`
- `react-native-purchases-ui`

#### Code nettoyé dans les fichiers :
- **App.tsx** : Suppression de `RevenueCatProvider`
- **HomeScreen.tsx** : Suppression de `checkEntitlement` et `presentPaywall`
- **FocusScreen.tsx** : Suppression de toute la logique premium (musique, volume, analytics)
- **ProfileScreen.tsx** : Suppression des boutons de subscription et restoration

### 2. Intégration de Google AdMob

#### Installation :
```bash
npm install react-native-google-mobile-ads
```

#### Configuration iOS (`ios/focusapp/Info.plist`) :
```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-2359836796711365~5809575502</string>
```

#### Configuration Android (`android/app/src/main/AndroidManifest.xml`) :
```xml
<meta-data 
  android:name="com.google.android.gms.ads.APPLICATION_ID" 
  android:value="ca-app-pub-2359836796711365~5809575502"/>
```

#### Code ajouté :

**App.tsx** - Initialisation :
```typescript
import mobileAds from 'react-native-google-mobile-ads';

const initializeAds = async () => {
  await mobileAds().initialize();
};
```

**HomeScreen.tsx** - Bannière publicitaire :
```typescript
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const BANNER_AD_UNIT_ID = __DEV__ 
  ? TestIds.ADAPTIVE_BANNER 
  : 'ca-app-pub-2359836796711365/7844407987';

// Dans le render :
<BannerAd
  unitId={BANNER_AD_UNIT_ID}
  size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
  requestOptions={{
    requestNonPersonalizedAdsOnly: true,
  }}
/>
```

### 3. Fonctionnalités maintenant gratuites

Toutes les fonctionnalités sont maintenant accessibles sans premium :
- ✅ Toutes les musiques (14 pistes)
- ✅ Contrôle du volume
- ✅ Analytics et statistiques
- ✅ Historique des sessions

## 📱 Prochaines étapes

### 1. Installer les dépendances natives
```bash
cd ios && pod install && cd ..
```

### 2. Nettoyer et rebuild
```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

### 3. Test en développement
En mode développement (`__DEV__ = true`), la bannière utilisera l'ID de test de Google.

### 4. Test en production
Avant de publier sur les stores, testez avec les vrais IDs :
- **App ID** : `ca-app-pub-2359836796711365~5809575502`
- **Banner Unit ID** : `ca-app-pub-2359836796711365/7844407987`

## 🎯 Configuration AdMob

### IDs utilisés :
- **Application ID** : `ca-app-pub-2359836796711365~5809575502`
- **Banner Ad Unit ID** : `ca-app-pub-2359836796711365/7844407987`
- **Rewarded Ad Unit ID** : `ca-app-pub-2359836796711365/1622918486` ⭐ NEW

### Types d'annonces intégrées :

#### 1. Bannière (HomeScreen)
Position : En bas de l'écran d'accueil
- Taille : `ANCHORED_ADAPTIVE_BANNER` (s'adapte à la largeur de l'écran)
- Position : Bas de l'écran (`absolute bottom-0`)
- Background : Blanc semi-transparent pour visibilité

#### 2. Vidéo avec récompense (FocusScreen) ⭐ NEW
Position : Après le popup "Excellent work" à la fin d'une session de focus
- Type : Vidéo avec récompense (Rewarded Ad)
- Timing : Affichage automatique après fermeture du popup de succès
- Fréquence : 1 fois par session de focus terminée
- Rechargement : Automatique à chaque chargement de l'écran Focus

Voir [REWARDED_AD_INTEGRATION.md](REWARDED_AD_INTEGRATION.md) pour plus de détails.

## ⚠️ Important

### Règles AdMob à respecter :
1. ✅ Ne pas cliquer sur vos propres annonces
2. ✅ Ne pas encourager les utilisateurs à cliquer sur les annonces
3. ✅ Respecter les politiques de contenu de Google
4. ✅ Afficher les annonces de manière non intrusive

### Test des annonces :
- En développement : utilisez les annonces de test (automatique avec `__DEV__`)
- Pour tester les vraies annonces : changez `__DEV__` en `false` temporairement
- **NE JAMAIS** publier avec les annonces de test

## 📊 Statistiques de monétisation

Vous pouvez suivre vos revenus dans :
- Dashboard AdMob : https://apps.admob.com/
- Rapport de performances : Impressions, clics, revenus par jour

## 🔧 Dépannage

### Si la bannière ne s'affiche pas :
1. Vérifiez que les IDs sont corrects dans Info.plist et AndroidManifest.xml
2. Assurez-vous d'avoir installé les pods : `cd ios && pod install`
3. Rebuild complètement l'app
4. Les nouvelles annonces peuvent prendre 24-48h pour être actives

### Logs utiles :
```typescript
// Dans App.tsx, la console affiche :
console.log('Google Mobile Ads initialized');
```

## 📝 Notes supplémentaires

- L'application est maintenant 100% gratuite avec publicité
- Toutes les fonctionnalités premium sont accessibles
- La bannière s'affiche uniquement sur le HomeScreen
- Format responsive qui s'adapte à tous les appareils
