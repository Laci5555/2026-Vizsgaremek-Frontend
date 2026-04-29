🎮 Gamminity – Gaming Community Platform

Your best platform for communication about gaming!


a) Az alkalmazás célja
A Gamminity egy játékosok számára tervezett közösségi webalkalmazás, amelynek célja, hogy egyetlen helyen biztosítson platformot a videojátékokkal kapcsolatos kommunikációra, felfedezésre és közösségi élményre.
A felhasználók képesek:

böngészni és értékelni a játékok adatbázisát,
fórumszerű témákat (discussion-öket) indítani és kommentelni,
csapatokat keresni és csatlakozni más játékosokhoz valós idejű csevegéssel,
személyre szabni a profiljukat és nyomon követni kedvenc játékaikat.

Az alkalmazás React alapú frontend-del és Firebase (Authentication + Firestore) backend-del működik, és teljes mértékben reszponzív – mobilon és asztali gépen egyaránt használható.

b) Funkciók (menüpontok)
A navigációs sávban az alábbi fő oldalak érhetők el:
🔐 Login / Signup
Bejelentkezés e-mail + jelszó kombinációval vagy Google-fiókkal. Regisztrációkor a felhasználónak felhasználónevet és jelszót kell megadnia.

📸 [Képernyőkép: a bejelentkezési oldal, az e-mail + jelszó mezőkkel és a Google-gombbal]


📸 [Képernyőkép: a regisztrációs oldal a négy mezővel (név, e-mail, jelszó, jelszó ismét)]


🏠 Home
A főoldal az alkalmazás belépőpontja bejelentkezett felhasználók számára. Innen elérhető az összes többi funkció a navigációs sávon keresztül.

📸 [Képernyőkép: a főoldal a navbarral együtt, bejelentkezve]


🎮 Games
A játékok böngészésének és értékelésének oldala.
Funkciók:

Játékok listázása kártyás nézetben, névvel, képpel, műfajokkal
Szűrés műfaj szerint (filter panel)
Keresés játéknév alapján
Rendezés: legújabb, A–Z, legtöbb like
Játékkártya megnyitásakor részletes leírás, like/dislike szavazás
Nem létező játék esetén „kérelem" küldése az adminnak
Admin számára: játék szerkesztése (név, kép, leírás, műfajok), törlése


📸 [Képernyőkép: a Games oldal a kártyás játéklistával és a szűrő/kereső sorral]


📸 [Képernyőkép: egy megnyitott játékkártya részletes nézettel, like/dislike gombokkal]


💬 Discussions
Fórum jellegű témák (discussion-ok) oldala.
Funkciók:

Az összes téma listázása (létrehozó avatárjával, nevével, témacímmel, leírással)
Új téma létrehozása (cím + leírás, max. 80/300 karakter)
Témára kattintva a hozzászólások megtekintése és új komment írása
Profiloldalon saját témák szerkesztése és törlése


📸 [Képernyőkép: a Discussions lista oldala a téma-kártyákkal és a „+" gombbal]


📸 [Képernyőkép: egy megnyitott discussion belseje a kommentekkel és az új komment mezővel]


🔍 Finder
Csapatkeresési oldal – segít más játékosokkal összekapcsolódni.
Funkciók:

Elérhető csoportok (posztok) listája: játéknév, leírás, létszámlimit, tagok száma
Csatlakozás csoporthoz; belépve valós idejű csevegőszoba nyílik meg (Firebase onSnapshot)
Kilépés a csoportból; csoportgazda eltávolíthatja a tagokat
Új csoport létrehozása (játék kiválasztása legördülőből, leírás, opcionális létszámlimit)
Inaktív (3 napnál régebbi) vagy letiltott felhasználó által létrehozott csoportok automatikusan törlődnek


📸 [Képernyőkép: a Finder oldal a csoport-kártyákkal és a „+" gombbal]


📸 [Képernyőkép: egy megnyitott csevegőszoba a Finder-ben, üzenetekkel]


👤 Profile
A felhasználói profil kezelésének oldala, négy fülre osztva:
FülTartalomFavourite GamesKedvenc játékok listája; játék hozzáadása/eltávolítása keresésselMy DiscussionsSaját témák megtekintése, leírás szerkesztése, téma törlésePeoples (csak admin)Az összes felhasználó listája; felhasználó letiltása/engedélyezéseMy ProfileFelhasználónév és profilkép (URL vagy fájl feltöltés) módosítása; kijelentkezés

📸 [Képernyőkép: a Profile oldal „My Profile" füle a szerkesztő mezőkkel]


📸 [Képernyőkép: a Profile oldal „Favourite Games" füle a kedvenc játékok listájával]


🛠️ Admin
Csak adminisztrátori jogosultságú felhasználóknak elérhető oldal.
Funkciók:

Új játék felvitele (név, kép URL vagy feltöltés, műfajok, leírás)
Új műfaj (genre) hozzáadása és törlése
Felhasználóktól érkező játékkérelmek (game requests) megtekintése és jóváhagyása/elutasítása


📸 [Képernyőkép: az Admin oldal az „Add Game" űrlappal és a kérelmek listájával]


c) Reszponzív megjelenés mobilon
Az alkalmazás teljes mértékben reszponzív, minden komponensnek van mobil (max-width: 600px) és tablet (max-width: 768–900px) nézete.
Navigációs sáv

Asztali: vízszintes menüsor linkekkel bal oldalon, profil névvel és képpel jobb oldalon
Mobil (≤600px): a menüpontok rejtve vannak; egy hamburger ikon (☰) megnyomásával előcsúszik egy oldalsó drawer panel balról; a profilnév elrejtve, csak a kép látható


📸 [Képernyőkép: a hamburger menü ikont mutasd mobilon (Chrome DevTools → 390px szélesség)]


📸 [Képernyőkép: a kinyílt drawer/oldalsó menü mobilon a navigációs linkekkel]

Games oldal

Asztali: több kártyás rács, oldalsó részletpanel
Mobil: a kártyák teljes szélességre nőnek (96vw), a részletpanel modálként nyílik meg, az edit modal mérete csökken


📸 [Képernyőkép: a Games oldal mobilon (kártyák egymás alatt, teljes szélességben)]

Finder oldal

Asztali: kártyás lista + csevegőablak egymás mellett
Mobil: a lista és a csevegőablak egymás alatt jelenik meg, az üzenetmező és a beviteli sor az aljára kerül


📸 [Képernyőkép: a Finder oldal mobilon, a csevegőszobával]

Profile oldal

Asztali: széles kártyás elrendezés, fülek vízszintesen
Mobil (≤768px): a fülek és tartalmak egymás alá rendeződnek, kisebb betűméretek


📸 [Képernyőkép: a Profile oldal mobilon]

Discussion oldal

Mobil (≤600px): a komment kártyák és az űrlap teljes szélességre nőnek, kisebb padding


📸 [Képernyőkép: egy discussion mobilon, kommentekkel]


d) Adattárolás
Az alkalmazás Firebase Firestore NoSQL adatbázist használ. Az adatok kollekciókba (táblákba) szervezve tárolódnak.
Firestore kollekciók és kapcsolataik
┌─────────────────────────────────────────────────────────────────┐
│                        FIRESTORE                                │
│                                                                 │
│  ┌──────────────┐        ┌──────────────┐                       │
│  │  user-data   │        │    games     │                       │
│  ├──────────────┤        ├──────────────┤                       │
│  │ email (PK)   │        │ name         │                       │
│  │ username     │        │ img          │                       │
│  │ picture      │        │ likes        │                       │
│  │ favourites[] │──────▶ │ dislikes     │                       │
│  │ disabled     │        │ genre[]      │                       │
│  └──────┬───────┘        │ description  │                       │
│         │                │ createdAt    │                       │
│         │                └──────┬───────┘                       │
│         │                       │                               │
│         │              ┌────────┴────────┐                      │
│         │              │   user-votes    │                      │
│         │              ├─────────────────┤                      │
│         │              │ id: uid_gameId  │                      │
│         │              │ vote (like/dis) │                      │
│         │              └─────────────────┘                      │
│         │                                                       │
│         │   ┌──────────────┐    ┌──────────────────┐           │
│         └──▶│ discussions  │    │  discussion-msgs  │           │
│             ├──────────────┤    ├──────────────────┤           │
│             │ creatoremail │    │ discussionId (FK) │           │
│             │ title        │───▶│ senderemail       │           │
│             │ description  │    │ text              │           │
│             └──────────────┘    │ createdAt         │           │
│                                 └──────────────────┘           │
│                                                                 │
│  ┌──────────────────┐   ┌──────────────────────┐               │
│  │  finder-groups   │   │  finder-messages      │               │
│  ├──────────────────┤   ├──────────────────────┤               │
│  │ creatoremail     │   │ finderid (FK)         │               │
│  │ game             │──▶│ senderemail           │               │
│  │ description      │   │ text                  │               │
│  │ members[]        │   │ createdAt             │               │
│  │ limit            │   └──────────────────────┘               │
│  │ limitEnabled     │                                           │
│  │ createdAt        │                                           │
│  │ lastActivity     │                                           │
│  └──────────────────┘                                           │
│                                                                 │
│  ┌──────────────┐    ┌──────────────────┐                       │
│  │   genres     │    │  game-requests   │                       │
│  ├──────────────┤    ├──────────────────┤                       │
│  │ name         │    │ name             │                       │
│  └──────────────┘    │ requesteremail   │                       │
│                       └──────────────────┘                      │
└─────────────────────────────────────────────────────────────────┘
Kollekciók leírása
KollekcióLeírásuser-dataFelhasználói profiladatok (email, felhasználónév, profilkép, kedvenc játékok, letiltás státusz)gamesJátékok adatbázisa (név, kép, leírás, műfajok, like/dislike számláló, létrehozás dátuma)genresElérhető játékműfajok listájauser-votesFelhasználói szavazatok játékokra (uid_gameId összetett kulccsal, dupla szavazás megelőzéséhez)discussionsFórum témák (létrehozó e-mail, cím, leírás)discussion-msgsEgy-egy discussion alá tartozó hozzászólásokfinder-groupsCsoportkereső posztok (játék, leírás, tagok tömbje, limit)finder-messagesEgy-egy finder csoporthoz tartozó valós idejű chat üzenetekgame-requestsFelhasználók által kért, de még nem felvett játékok
Firebase Authentication kezeli a bejelentkezést; az auth UID és az e-mail-cím köti össze az user-data kollekció rekordjait.

e) Fontosabb backend végpontok

ℹ️ Az alkalmazás Firebase Firestore SDK-n keresztül kommunikál közvetlenül az adatbázissal – nincs hagyományos REST API szerver. Az alábbi „végpontok" a Firestore-hívások logikai egységeit képviselik.


🔗 Backend repository: [IDE ILLESZD BE A BACKEND / FIREBASE FUNCTIONS REPO LINKJÉT]


1. Felhasználó regisztrálása / Google-login
Hívás helye: Login.jsx, Signup.jsx
MetóduscreateUserWithEmailAndPassword / signInWithPopup (Firebase Auth)Paraméterekemail: string, password: string (email+pass esetén); Google popup (Google esetén)MűködésLétrehozza az auth-felhasználót, majd ellenőrzi, hogy létezik-e már user-data rekord az e-mailhez. Ha nem, létrehozza az alapértelmezett profiladatokkal.Visszatérési értékSikeres bejelentkezés esetén navigálás a főoldalraHibakezelésFirebase auth hibakód jelenik meg a UI-ban (err.message)

2. Játék hozzáadása (admin)
Hívás helye: Admin.jsx → addGame()
MetódusaddDoc(collection(db, 'games'), {...})Paraméterekname: string, img: string (URL), likes: 0, dislikes: 0, genre: string[], description: string, createdAt: TimestampMűködésNormalizált névvel ellenőrzi, hogy a játék már létezik-e. Ha igen, nem veszi fel. Ha érkezett hozzá game-request, azt törli.Visszatérési érték— (UI frissül)HibakezelésDuplikátum esetén csak konzol-figyelmeztetés

3. Játék szavazás (like / dislike)
Hívás helye: Games.jsx → handleVote(type)
MetódusupdateDoc a games kollekción + setDoc a user-votes kollekciónParaméterek`type: 'like'MűködésAz user-votes/{uid}_{gameId} dokumentumban tárolja az aktuális szavazatot. Ha ugyanarra szavaz újra, visszavonja. Ha másikra vált, a régi értéket csökkenti és az újat növeli. increment() atomikus növeléssel.Visszatérési értékFrissített like/dislike számok a UI-banHibakezelésNincs bejelentkezett user esetén a függvény nem fut le (`if (!user

4. Discussion létrehozása
Hívás helye: Discussions.jsx → createDiscussion()
MetódusaddDoc(collection(db, 'discussions'), {...})Paraméterekcreatoremail: string, title: string (min 3, max 80 kar.), description: string (max 300 kar.)Visszatérési értékModal bezárása, lista frissítéseHibakezelésÜres/rövid cím esetén hibaüzenet a UI-ban; Firebase-hiba esetén általános hibaüzenet

5. Finder csoport létrehozása és csatlakozás
Hívás helye: Finder.jsx
LétrehozásaddDoc(collection(db, 'finder-groups'), {...}) – game, description, limit, limitEnabled, members[], creatoremail, createdAtCsatlakozásupdateDoc(groupRef, { members: arrayUnion(user.email) })KilépésupdateDoc(groupRef, { members: arrayRemove(user.email) })Tag eltávolításaupdateDoc(groupRef, { members: arrayRemove(targetEmail) }) (csak a csoportgazdának)Valós idejű chatonSnapshot(query(...finder-messages...)) – élő frissítésVisszatérési értékUI frissítés, csevegőszoba megnyitásaHibakezelésTeli csoport esetén a „Join" gomb nem jelenik meg; letiltott felhasználók csoportjai automatikusan törlődnek betöltéskor

6. Felhasználó letiltása (admin)
Hívás helye: Profile.jsx (Peoples fül)
MetódusupdateDoc(doc(db, 'user-data', id), { disabled: true/false })ParaméterekFelhasználó Firestore dokumentum ID-jaMűködésA disabled: true mező beállítása után a ProtectedRoute komponens a következő oldalletöltésnél automatikusan kijelentkezteti az érintett felhasználót és átirányítja a login oldalraHibakezelés—

f) Tesztelés
Frontend tesztek
A frontend komponensek manuális tesztelése Chrome DevTools segítségével történt, különösen a reszponzív nézetek ellenőrzésekor.
Tesztelt esetek:

Bejelentkezés helyes és helytelen adatokkal
Google-bejelentkezés
Játék kereső és szűrő működése
Like/dislike szavazás (váltás, visszavonás)
Discussion létrehozása validációval (üres cím, rövid cím)
Finder csoport létrehozása, csatlakozás, kilépés
Profil adatok szerkesztése
Admin: játék és műfaj hozzáadása, kérelem kezelése
Letiltott felhasználó automatikus kijelentkezése
404 oldal ismeretlen URL-en


📸 [Képernyőkép: a bejelentkezési hibát mutató állapot (pl. rossz jelszó hiba)]


📸 [Képernyőkép: a Discussion form validációs hibaüzenettel (üres cím)]


📸 [Képernyőkép: a like/dislike gombok aktív állapotban egy játéknál]


📸 [Képernyőkép: Chrome DevTools mobilnézet (390px) a Games oldalon]


Backend tesztek
A Firebase Firestore adatbázis-műveletek tesztelése a Firebase Console segítségével történt, ahol közvetlenül ellenőrizhetők a kollekciókban lévő dokumentumok.
Tesztelt esetek:

user-data rekord automatikus létrehozása Google-login után
games kollekció frissítése admin által (hozzáadás, törlés)
user-votes dokumentum helyessége (egy user, egy játék = egy rekord)
finder-groups members tömbjének frissülése join/leave műveletnél
3 napnál régebbi finder csoportok automatikus törlése betöltéskor
disabled mező hatása a ProtectedRoute-ra


📸 [Képernyőkép: Firebase Console → Firestore → games kollekció egy játék dokumentumával]


📸 [Képernyőkép: Firebase Console → Firestore → user-votes kollekció egy szavazat dokumentummal]


📸 [Képernyőkép: Firebase Console → Authentication → felhasználók listája]


Technológiai stack
RétegTechnológiaFrontend frameworkReact 18 + ViteRoutingReact Router v6Backend / DBFirebase Firestore (NoSQL)HitelesítésFirebase AuthenticationIkonokreact-iconsStílusPlain CSS (komponensenként)

README összeállítva a forráskód alapján. A képernyőképek helyett a jelzett helyeken saját képernyőfelvételeket illessz be.
