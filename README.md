<div align="center">

# 🎮 Gamminity
### Gaming Community Platform

*Your best platform for communication about gaming!*

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router_v6-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

</div>

---

## 📋 Tartalomjegyzék

- [a) Az alkalmazás célja](#a-az-alkalmazás-célja)
- [b) Funkciók – menüpontok](#b-funkciók--menüpontok)
- [c) Reszponzív megjelenés mobilon](#c-reszponzív-megjelenés-mobilon)
- [d) Adattárolás](#d-adattárolás)
- [e) Backend végpontok](#e-fontosabb-backend-végpontok)
- [f) Tesztelés](#f-tesztelés)

---

## a) Az alkalmazás célja

A **Gamminity** egy játékosok számára tervezett közösségi webalkalmazás, amelynek célja, hogy egyetlen helyen biztosítson platformot a videojátékokkal kapcsolatos kommunikációra, felfedezésre és közösségi élményre.

A felhasználók az alkalmazásban:

- 🎮 böngészhetik és értékelhetik a játékok adatbázisát
- 💬 fórumszerű témákat (discussion-öket) indíthatnak és kommentelhetnek
- 🔍 csapatokat kereshetnek és csatlakozhatnak más játékosokhoz valós idejű csevegéssel
- 👤 személyre szabhatják profiljukat és nyomon követhetik kedvenc játékaikat

Az alkalmazás **React** alapú frontenddel és **Firebase** (Authentication + Firestore) backenddel működik, és teljes mértékben reszponzív – mobilon és asztali gépen egyaránt használható.

---

## b) Funkciók – menüpontok

### 🔐 Login / Signup

Bejelentkezés e-mail + jelszó kombinációval, vagy Google-fiókkal. Regisztrációkor felhasználónév és jelszó megadása szükséges.

| | Bejelentkezés | Regisztráció |
|---|:---:|:---:|
| **E-mail + jelszó** | ✅ | ✅ |
| **Google-fiók** | ✅ | ✅ |

> **📸 Képernyőkép helye:** *A bejelentkezési oldalt fotózd le – látszódjon az e-mail + jelszó mező és a Google-gomb*

> **📸 Képernyőkép helye:** *A regisztrációs oldalt fotózd le – látszódjon a négy mező (név, e-mail, jelszó, jelszó ismét)*

---

### 🏠 Home

A főoldal bejelentkezett felhasználók belépőpontja. Innen érhető el az összes funkció a navigációs sávon keresztül.

> **📸 Képernyőkép helye:** *A főoldalt fotózd le a navbarral együtt, bejelentkezve*

---

### 🎮 Games

A játékok böngészésének és értékelésének oldala.

| Funkció | Leírás |
|---|---|
| 🃏 Kártyás lista | Játékok névvel, képpel, műfajokkal |
| 🔎 Keresés | Játéknév alapján szűrés |
| 🏷️ Műfajszűrő | Egy vagy több genre kijelölése |
| 📊 Rendezés | Legújabb / A–Z / Legtöbb like |
| 👍 Like / Dislike | Szavazás, váltás és visszavonás |
| 📋 Részletek | Leírás, kép, szavazatok megnyitható panelben |
| 📨 Kérelem | Nem létező játék esetén admin-kérelem küldése |
| ✏️ Szerkesztés | Admin: név, kép, leírás, műfajok módosítása, törlés |

> **📸 Képernyőkép helye:** *A Games oldalt fotózd le – látszódjon a kártyás játéklista és a szűrő/kereső sor*

> **📸 Képernyőkép helye:** *Nyiss meg egy játékkártyát – látszódjon a részletes nézet a like/dislike gombokkal*

---

### 💬 Discussions

Fórum jellegű témák (discussion-ok) oldala.

- Az összes téma listázása (létrehozó avatárjával, nevével, témacímmel, leírással)
- Új téma létrehozása (cím max. 80, leírás max. 300 karakter)
- Témára kattintva a hozzászólások megtekintése és új komment írása
- Profiloldalon saját témák szerkesztése és törlése

> **📸 Képernyőkép helye:** *A Discussions listát fotózd le a téma-kártyákkal és a „+" gombbal*

> **📸 Képernyőkép helye:** *Nyiss meg egy discussion-t – látszódjon a kommentlista és az új komment mező*

---

### 🔍 Finder

Csapatkeresési oldal – segít más játékosokkal összekapcsolódni.

- Elérhető csoportok listája: játéknév, leírás, létszámlimit, tagok száma
- Csatlakozás csoporthoz → valós idejű csevegőszoba nyílik meg (`onSnapshot`)
- Kilépés a csoportból; csoportgazda eltávolíthatja a tagokat
- Új csoport létrehozása (játék, leírás, opcionális létszámlimit)
- Inaktív (3+ napos) vagy letiltott felhasználó csoportjai automatikusan törlődnek

> **📸 Képernyőkép helye:** *A Finder oldalt fotózd le a csoport-kártyákkal és a „+" gombbal*

> **📸 Képernyőkép helye:** *Lépj be egy csoportba – fotózd le a megnyílt csevegőszobát üzenetekkel*

---

### 👤 Profile

A felhasználói profil kezelésének oldala, négy fülre osztva:

| Fül | Elérhető kinek | Tartalom |
|---|:---:|---|
| **Favourite Games** | Mindenki | Kedvenc játékok listája; keresés, hozzáadás, eltávolítás |
| **My Discussions** | Mindenki | Saját témák megtekintése, leírás szerkesztése, törlés |
| **Peoples** | Csak admin | Az összes felhasználó; letiltás / engedélyezés |
| **My Profile** | Mindenki | Felhasználónév, profilkép (URL vagy fájl) módosítása; kijelentkezés |

> **📸 Képernyőkép helye:** *A Profile oldal „My Profile" fülét fotózd le a szerkesztő mezőkkel*

> **📸 Képernyőkép helye:** *A „Favourite Games" fület fotózd le a kedvenc játékok listájával*

---

### 🛠️ Admin

Kizárólag adminisztrátori jogosultságú felhasználóknak elérhető oldal.

- Új játék felvitele (név, kép URL vagy feltöltés, műfajok, leírás)
- Új műfaj (genre) hozzáadása és törlése
- Felhasználóktól érkező játékkérelmek megtekintése, jóváhagyása / elutasítása

> **📸 Képernyőkép helye:** *Az Admin oldalt fotózd le az „Add Game" űrlappal és a kérelmek listájával*

---

## c) Reszponzív megjelenés mobilon

Az alkalmazás teljes mértékben reszponzív. Minden komponensnek van dedikált mobil- és tablet-nézete.

| Törésipont | Érintett komponensek |
|---|---|
| `≤ 600px` | Navbar, Games, Finder, Discussion |
| `≤ 768px` | Profile |
| `601px – 900px` | Navbar (tablet) |

---

### 📱 Navigációs sáv

| | Asztali nézet | Mobil nézet (≤ 600px) |
|---|---|---|
| Menü | Vízszintes linksor bal oldalon | ☰ Hamburger ikon → bal oldali drawer panel |
| Profil | Profilnév + profilkép | Csak profilkép (név rejtve) |

> **📸 Képernyőkép helye:** *Chrome DevTools → 390px szélesség → fotózd le a hamburgert a navbaron*

> **📸 Képernyőkép helye:** *Nyomd meg a hamburgert → fotózd le a kinyílt oldalsó drawer menüt*

---

### 📱 Games oldal

| | Asztali nézet | Mobil nézet |
|---|---|---|
| Elrendezés | Többoszlopos kártyarács, oldalsó részletpanel | Kártyák teljes szélességen (`96vw`), részletpanel modálként |

> **📸 Képernyőkép helye:** *Games oldal mobilon – kártyák egymás alatt, teljes szélességben*

---

### 📱 Finder oldal

| | Asztali nézet | Mobil nézet |
|---|---|---|
| Elrendezés | Kártyás lista + csevegőablak egymás mellett | Lista és chat egymás alatt, beviteli sor az aljára kerül |

> **📸 Képernyőkép helye:** *Finder oldal mobilon, a csevegőszobával*

---

### 📱 Profile oldal

| | Asztali nézet | Mobil nézet (≤ 768px) |
|---|---|---|
| Elrendezés | Széles kártyás nézet, vízszintes fülek | Fülek és tartalmak egymás alá rendeződnek |

> **📸 Képernyőkép helye:** *Profile oldal mobilon – látszódjon a fülváltó és a tartalom*

---

### 📱 Discussion oldal

| | Asztali nézet | Mobil nézet (≤ 600px) |
|---|---|---|
| Elrendezés | Kártyák normál szélességgel | Komment kártyák és írómező teljes szélességre nőnek |

> **📸 Képernyőkép helye:** *Egy megnyitott discussion mobilon, kommentekkel*

---

## d) Adattárolás

Az alkalmazás **Firebase Firestore** NoSQL felhőadatbázist használ. A hitelesítést a **Firebase Authentication** végzi; a felhasználók azonosítása e-mail-cím alapján történik.

### Kollekciók és kapcsolataik

```
┌──────────────────────────────────────────────────────────────────────┐
│                          FIRESTORE                                   │
│                                                                      │
│   ┌─────────────┐              ┌─────────────┐                       │
│   │  user-data  │              │    games    │                       │
│   ├─────────────┤              ├─────────────┤                       │
│   │ email  (PK) │              │ name        │                       │
│   │ username    │  favourites  │ img         │                       │
│   │ picture     │─────────────▶│ likes       │                       │
│   │ favourites[]│              │ dislikes    │                       │
│   │ disabled    │              │ genre[]     │                       │
│   └──────┬──────┘              │ description │                       │
│          │                     │ createdAt   │                       │
│          │                     └──────┬──────┘                       │
│          │                            │ 1:N                          │
│          │                     ┌──────┴──────┐                       │
│          │                     │ user-votes  │                       │
│          │                     ├─────────────┤                       │
│          │                     │ uid_gameId  │  (összetett kulcs)    │
│          │                     │ vote        │  like | dislike       │
│          │                     └─────────────┘                       │
│          │                                                           │
│          │  1:N   ┌─────────────┐   1:N   ┌──────────────────┐      │
│          └───────▶│ discussions │────────▶│ discussion-msgs  │      │
│                   ├─────────────┤         ├──────────────────┤      │
│                   │ creatoremail│         │ discussionId (FK)│      │
│                   │ title       │         │ senderemail      │      │
│                   │ description │         │ text             │      │
│                   └─────────────┘         │ createdAt        │      │
│                                           └──────────────────┘      │
│                                                                      │
│   ┌─────────────────┐  1:N  ┌──────────────────┐                    │
│   │  finder-groups  │──────▶│ finder-messages  │                    │
│   ├─────────────────┤       ├──────────────────┤                    │
│   │ creatoremail    │       │ finderid (FK)    │                    │
│   │ game            │       │ senderemail      │                    │
│   │ description     │       │ text             │                    │
│   │ members[]       │       │ createdAt        │                    │
│   │ limit           │       └──────────────────┘                    │
│   │ limitEnabled    │                                                │
│   │ createdAt       │                                                │
│   │ lastActivity    │                                                │
│   └─────────────────┘                                                │
│                                                                      │
│   ┌──────────┐        ┌──────────────────┐                           │
│   │  genres  │        │  game-requests   │                           │
│   ├──────────┤        ├──────────────────┤                           │
│   │ name     │        │ name             │                           │
│   └──────────┘        │ requesteremail   │                           │
│                        └──────────────────┘                          │
└──────────────────────────────────────────────────────────────────────┘
```

### Kollekciók összefoglalója

| Kollekció | Leírás |
|---|---|
| `user-data` | Felhasználói profiladatok: email, felhasználónév, profilkép URL, kedvenc játékok (tömb), letiltás státusz |
| `games` | Játékok adatbázisa: név, kép, leírás, műfajok, like/dislike számláló, létrehozás időbélyege |
| `genres` | Elérhető játékműfajok listája |
| `user-votes` | Szavazatok: `uid_gameId` összetett kulcs → dupla szavazás megelőzésére |
| `discussions` | Fórum témák: létrehozó e-mail, cím, leírás |
| `discussion-msgs` | Egy-egy discussion alá tartozó hozzászólások |
| `finder-groups` | Csoportkereső posztok: játék, leírás, tagok tömbje, limit |
| `finder-messages` | Finder csoportokhoz tartozó valós idejű chat üzenetek |
| `game-requests` | Felhasználók által kért, még fel nem vett játékok |

> **Firebase Authentication** kezeli a bejelentkezést. Az auth `uid` és az e-mail-cím köti össze az `user-data` rekordokat.

---

## e) Fontosabb backend végpontok

> [!NOTE]
> Az alkalmazás **Firebase Firestore SDK**-n keresztül kommunikál közvetlenül az adatbázissal – nincs hagyományos REST API szerver. Az alábbi „végpontok" a Firestore-hívások logikai egységeit képviselik.

> 🔗 **Backend repository:** `[IDE ILLESZD BE A REPO LINKJÉT]`

---

### 1. 🔐 Felhasználó regisztrálása / Google-login

**Hívás helye:** `Login.jsx`, `Signup.jsx`

| Mező | Érték |
|---|---|
| **Metódus** | `createUserWithEmailAndPassword` / `signInWithPopup` (Firebase Auth) |
| **Paraméterek** | `email: string`, `password: string` — e-mail+jelszó esetén; Google popup — Google esetén |
| **Működés** | Létrehozza az auth-felhasználót, majd ellenőrzi, hogy létezik-e már `user-data` rekord az e-mailhez. Ha nem, létrehozza alapértelmezett profiladatokkal. |
| **Visszatérési érték** | Sikeres belépés → navigálás a főoldalra (`/`) |
| **Hibakezelés** | Firebase auth hibakód jelenik meg a UI-ban (`err.message`) |

---

### 2. 🎮 Játék hozzáadása *(admin)*

**Hívás helye:** `Admin.jsx` → `addGame()`

| Mező | Érték |
|---|---|
| **Metódus** | `addDoc(collection(db, 'games'), {...})` |
| **Paraméterek** | `name: string`, `img: string`, `likes: 0`, `dislikes: 0`, `genre: string[]`, `description: string`, `createdAt: Timestamp` |
| **Működés** | Normalizált névvel ellenőrzi, hogy a játék már létezik-e. Ha igen, nem veszi fel újra. Ha érkezett hozzá game-request, azt törli. |
| **Visszatérési érték** | — *(UI frissül, form ürül)* |
| **Hibakezelés** | Duplikátum esetén konzol-figyelmeztetés; üres név esetén a függvény nem fut le |

---

### 3. 👍 Játék szavazás (like / dislike)

**Hívás helye:** `Games.jsx` → `handleVote(type)`

| Mező | Érték |
|---|---|
| **Metódus** | `updateDoc` → `games` + `setDoc` → `user-votes` |
| **Paraméterek** | `type: 'like' \| 'dislike'`, `user.uid`, `selectedGame.id` |
| **Működés** | Az `user-votes/{uid}_{gameId}` dokumentumban tárolja a szavazatot. Visszavonás: ha ugyanarra kattint újra. Váltás: régi érték csökkentése + új növelése atomikus `increment()`-tel. |
| **Visszatérési érték** | Frissített like/dislike számok a UI-ban |
| **Hibakezelés** | Bejelentkezés nélkül a függvény kilép: `if (!user \|\| !selectedGame) return` |

---

### 4. 💬 Discussion létrehozása

**Hívás helye:** `Discussions.jsx` → `createDiscussion()`

| Mező | Érték |
|---|---|
| **Metódus** | `addDoc(collection(db, 'discussions'), {...})` |
| **Paraméterek** | `creatoremail: string`, `title: string` *(min. 3, max. 80 kar.)*, `description: string` *(max. 300 kar.)* |
| **Visszatérési érték** | Modal bezárása, lista automatikus frissítése |
| **Hibakezelés** | Üres / rövid cím → hibaüzenet a UI-ban; Firebase-hiba → általános hibaüzenet |

---

### 5. 🔍 Finder csoport – létrehozás és csatlakozás

**Hívás helye:** `Finder.jsx`

| Művelet | Firestore-hívás |
|---|---|
| **Létrehozás** | `addDoc(collection(db, 'finder-groups'), { game, description, limit, limitEnabled, members: [], creatoremail, createdAt })` |
| **Csatlakozás** | `updateDoc(groupRef, { members: arrayUnion(user.email) })` |
| **Kilépés** | `updateDoc(groupRef, { members: arrayRemove(user.email) })` |
| **Tag eltávolítása** | `updateDoc(groupRef, { members: arrayRemove(targetEmail) })` *(csak csoportgazda)* |
| **Valós idejű chat** | `onSnapshot(query(finder-messages, ...))` – élő frissítés |

| Mező | Érték |
|---|---|
| **Visszatérési érték** | UI frissítés, csevegőszoba megnyitása |
| **Hibakezelés** | Teli csoport → Join gomb nem jelenik meg; letiltott felhasználók csoportjai betöltéskor automatikusan törlődnek (üzeneteikkel együtt) |

---

### 6. 🚫 Felhasználó letiltása *(admin)*

**Hívás helye:** `Profile.jsx` → Peoples fül

| Mező | Érték |
|---|---|
| **Metódus** | `updateDoc(doc(db, 'user-data', id), { disabled: true \| false })` |
| **Paraméterek** | Felhasználó Firestore dokumentum ID-ja |
| **Működés** | `disabled: true` beállítása után a `ProtectedRoute` automatikusan kijelentkezteti az érintett felhasználót és a `/login` oldalra irányítja |
| **Hibakezelés** | — |

---

## f) Tesztelés

### 🖥️ Frontend tesztek

A frontend komponensek manuális tesztelése Chrome DevTools segítségével történt, különösen a reszponzív nézetek ellenőrzésekor.

**Tesztelt esetek:**

- [x] Bejelentkezés helyes adatokkal
- [x] Bejelentkezés helytelen adatokkal (hibaüzenet megjelenése)
- [x] Google-bejelentkezés
- [x] Játék keresés és műfajszűrő működése
- [x] Like/dislike szavazás (első szavazat, váltás, visszavonás)
- [x] Discussion létrehozása validációval (üres cím, rövid cím)
- [x] Finder csoport létrehozása, csatlakozás, kilépés, tag eltávolítás
- [x] Profil adatok szerkesztése (felhasználónév, profilkép)
- [x] Admin: játék és műfaj hozzáadása, kérelem jóváhagyása
- [x] Letiltott felhasználó automatikus kijelentkezése
- [x] 404 oldal ismeretlen URL-en

> **📸 Képernyőkép helye:** *Fotózd le a bejelentkezési hibát – pl. rossz jelszó esetén megjelenő hibaüzenet*

> **📸 Képernyőkép helye:** *Fotózd le a Discussion form validációs hibaüzenetét (üres cím esetén)*

> **📸 Képernyőkép helye:** *Fotózd le a like/dislike gombokat aktív (kattintott) állapotban egy játéknál*

> **📸 Képernyőkép helye:** *Chrome DevTools mobilnézet (390px szélesség) a Games oldalon*

---

### 🔧 Backend tesztek

A Firestore adatbázis-műveletek tesztelése a **Firebase Console** segítségével történt, ahol közvetlenül ellenőrizhetők a kollekciókban lévő dokumentumok.

**Tesztelt esetek:**

- [x] `user-data` rekord automatikus létrehozása Google-login után
- [x] `games` kollekció frissítése admin által (hozzáadás, törlés)
- [x] `user-votes` dokumentum helyessége: egy user + egy játék = egy rekord
- [x] `finder-groups` `members` tömbjének frissülése join/leave műveletnél
- [x] 3 napnál régebbi finder csoportok automatikus törlése betöltéskor
- [x] `disabled: true` mező hatása a `ProtectedRoute`-ra

> **📸 Képernyőkép helye:** *Firebase Console → Firestore → `games` kollekció, egy játék dokumentuma kinyitva*

> **📸 Képernyőkép helye:** *Firebase Console → Firestore → `user-votes` kollekció, egy szavazat-dokumentum*

> **📸 Képernyőkép helye:** *Firebase Console → Authentication → Users lista*

---

## 🛠️ Technológiai stack

| Réteg | Technológia |
|---|---|
| Frontend framework | React 18 + Vite |
| Routing | React Router v6 |
| Adatbázis | Firebase Firestore (NoSQL) |
| Hitelesítés | Firebase Authentication |
| Ikonok | react-icons |
| Stílus | Plain CSS (komponensenként) |

---

<div align="center">

*README összeállítva a forráskód alapján.*  
*A* `📸 Képernyőkép helye` *jelzéseknél saját képernyőfelvételeket illessz be.*

</div>
