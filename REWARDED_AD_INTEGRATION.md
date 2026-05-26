# Intégration de l'Annonce Vidéo avec Récompense

## ✅ Changements effectués

### 1. Ajout de l'annonce vidéo avec récompense dans FocusScreen

L'annonce vidéo s'affiche automatiquement après que l'utilisateur ferme le popup "Excellent work" à la fin d'une session de focus.

#### Flow utilisateur :
1. ✅ User clique sur "Stop Focus"
2. ✅ Affichage du popup "Excellent work! 🎉" avec le temps de focus
3. ✅ User clique sur le bouton "close"
4. ✅ Le popup se ferme
5. ✅ **L'annonce vidéo avec récompense s'affiche automatiquement**
6. ✅ Après avoir regardé la vidéo, l'utilisateur retourne à l'écran Focus

### 2. Configuration technique

#### ID de l'annonce vidéo avec récompense :
- **Production** : `ca-app-pub-2359836796711365/1622918486`
- **Développement** : Utilise automatiquement les annonces de test de Google

#### Code ajouté dans [FocusScreen.tsx](src/app/FocusScreen.tsx) :

```typescript
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

// ID de l'annonce vidéo avec récompense
const REWARDED_AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-2359836796711365/1622918486';
```

#### Gestion de l'annonce :

1. **Chargement au démarrage** : L'annonce est chargée dès que l'écran Focus est monté
2. **État de chargement** : `rewardedAdLoaded` indique si l'annonce est prête
3. **Affichage automatique** : Lorsque l'utilisateur ferme le popup, l'annonce s'affiche après un délai de 500ms
4. **Rechargement automatique** : Une nouvelle annonce est chargée à chaque démarrage de l'écran

### 3. Événements gérés

```typescript
// Annonce chargée avec succès
RewardedAdEventType.LOADED → setRewardedAdLoaded(true)

// Utilisateur a gagné la récompense
RewardedAdEventType.EARNED_REWARD → console.log('User earned reward')
```

### 4. Fonctionnalité de sécurité

Si l'annonce n'est pas encore chargée quand l'utilisateur ferme le popup :
- Un message est loggé : `'Rewarded ad not ready yet'`
- L'utilisateur continue normalement sans voir l'annonce
- L'annonce sera disponible pour la prochaine session

## 🎯 Avantages de cette implémentation

1. ✅ **Non bloquant** : Si l'annonce n'est pas chargée, l'utilisateur peut continuer
2. ✅ **Timing parfait** : L'annonce s'affiche au moment naturel (après accomplissement)
3. ✅ **Expérience utilisateur** : L'utilisateur a déjà vu son temps de focus avant l'annonce
4. ✅ **Motivation** : Contexte positif (succès) avant de voir l'annonce

## 📱 Test de l'intégration

### En mode développement :
```bash
npx expo run:ios
# ou
npx expo run:android
```

En mode développement, vous verrez une annonce de test avec un label "Test Ad" clair.

### Pour tester avec de vraies annonces :

⚠️ **ATTENTION** : Ne cliquez JAMAIS sur vos propres annonces en production !

1. Changez temporairement `__DEV__` en `false` dans le code
2. Testez uniquement sur un appareil de test enregistré dans AdMob
3. Remettez `__DEV__` à sa valeur normale après le test

## 🔧 Dépannage

### L'annonce ne s'affiche pas ?

1. **Vérifiez les logs** :
   - `'Rewarded ad loaded'` → L'annonce est chargée avec succès
   - `'Rewarded ad not ready yet'` → L'annonce n'est pas encore chargée

2. **Causes possibles** :
   - Connexion internet lente
   - Première utilisation (les annonces peuvent prendre du temps à être disponibles)
   - En production, les nouvelles annonces peuvent prendre 24-48h pour être actives

3. **Solutions** :
   - Attendez quelques secondes après le chargement de l'écran
   - Vérifiez votre connexion internet
   - En production, attendez 24-48h après la création du bloc d'annonces

### L'utilisateur a gagné la récompense ?

L'événement `EARNED_REWARD` est déclenché quand l'utilisateur a regardé suffisamment de vidéo.
Vous pouvez utiliser cet événement pour :
- Débloquer du contenu premium temporairement
- Donner des points/crédits
- Offrir des fonctionnalités bonus

## 📊 Suivi des performances

Dans le dashboard AdMob, vous pourrez voir :
- Nombre d'impressions de l'annonce
- Taux de complétion de la vidéo
- Revenus générés par les annonces vidéo
- eCPM (coût par mille impressions)

Les annonces vidéo avec récompense génèrent généralement plus de revenus que les bannières car :
- Meilleur taux de complétion
- Plus d'engagement utilisateur
- CPM plus élevé

## 🎨 Personnalisation future

Vous pourriez ajouter :
- Un message "Regardez une vidéo pour débloquer X" avant l'annonce
- Une récompense concrète après avoir regardé (ex: statistiques détaillées)
- Un compteur de vidéos regardées dans le profil
- Des badges ou achievements pour avoir regardé X vidéos

## ⚠️ Règles AdMob à respecter

1. ✅ Ne forcez JAMAIS l'utilisateur à regarder l'annonce
2. ✅ L'utilisateur doit pouvoir fermer/passer si l'annonce ne charge pas
3. ✅ Ne décrivez pas le contenu de l'annonce
4. ✅ N'encouragez pas à cliquer sur les annonces
5. ✅ Respectez la limite de fréquence (pas trop d'annonces par session)

## 📝 Résumé de la configuration

| Élément | Valeur |
|---------|--------|
| **Type d'annonce** | Vidéo avec récompense (Rewarded Ad) |
| **Position** | Après le popup "Excellent work" |
| **Fréquence** | 1 fois par session de focus terminée |
| **ID Bloc d'annonces** | `ca-app-pub-2359836796711365/1622918486` |
| **Mode Test** | Automatique en développement |
| **Rechargement** | À chaque chargement de l'écran Focus |

---

**Date de mise à jour** : 26 Mai 2026
**Fichier modifié** : `src/app/FocusScreen.tsx`
