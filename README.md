<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Express-5.2-000000?logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudinary-CDN-3448C5?logo=cloudinary&logoColor=white" />
  <img src="https://img.shields.io/badge/Vitest-Tested-6E9F18?logo=vitest&logoColor=white" />
</p>

<h1 align="center">🎮 Gamminity</h1>
<p align="center"><i>Fedezd fel, értékeld és beszéld meg kedvenc játékaidat — egy helyen.</i></p>

---

## 📖 Tartalomjegyzék

- [a) Az alkalmazás célja](#a-az-alkalmazás-célja)
- [b) Funkciók és menüpontok](#b-funkciók-és-menüpontok)
- [c) Reszponzív megjelenés](#c-reszponzív-megjelenés)
- [d) Adattárolás](#d-adattárolás)
- [e) Backend végpontok](#e-backend-végpontok)
- [f) Tesztelés](#f-tesztelés)

---

## a) Az alkalmazás célja

A **Gamminity** egy modern, sötét témájú közösségi webalkalmazás gamerek számára. A platform célja, hogy egyetlen helyre összpontosítsa mindazt, amire egy játékosnak szüksége van:

| Probléma | Gamminity megoldása |
|---|---|
| Nehéz releváns játékokat találni | Kategorizált játékkatalógus szűréssel és kereséssel |
| Nincs hova véleményt írni | Értékelési és like/dislike rendszer minden játékhoz |
| Nehéz csapattársakat találni | **Finder** — valós idejű lobby-rendszer beépített chattel |
| Szétszórt kommunikáció | Privát üzenetküldés és fórumrendszer egy helyen |

Az alkalmazás a **Firebase** ökoszisztémára épül (hitelesítés, adatbázis), kiegészítve egy **Node.js/Express** backenddel a képfeltöltés, email-küldés és rendszermonitorozás kezelésére.

---

## b) Funkciók és menüpontok

### 🏠 Home (Kezdőlap)

A kezdőlap a platform belépési pontja. Tartalmazza:
- **Hero szekció** — animált háttér, bemutatkozó szöveg, CTA gombok
- **Szerver státusz jelvény** — valós időben jelzi a backend állapotát (`All Systems Operational` / `Service Currently Unavailable`)
- **Legutóbb hozzáadott játékok** — vízszintesen görgethető kártyák
- **CTA szekciók** — a Finder, Discussions és FAQ felé irányítanak

<!-- 📸 KÉPERNYŐKÉP: A Home oldal hero szekciója a szerver státusszal -->
> ![Home oldal](screenshots/home.png)

---

### 🎮 Games (Játékok)

A teljes játékkatalógus, fejlett szűrési és rendezési lehetőségekkel:
- **Keresés** — valós idejű szöveges keresés név alapján
- **Műfaj szűrő** — többszörös genre kiválasztása
- **Rendezés** — legújabb, legrégebbi, legtöbb like, ABC sorrend
- **Játék részletek** — kattintásra megnyíló modal: leírás, kép, értékelések, like/dislike
- **Új játék kérése** — felhasználók új játékot javasolhatnak az adminnak
- **Admin funkciók** — játékok hozzáadása/szerkesztése/törlése képfeltöltéssel

<!-- 📸 KÉPERNYŐKÉP: A játéklista szűrőkkel -->
> ![Games oldal](screenshots/games.png)

<!-- 📸 KÉPERNYŐKÉP: Egy játék részletes nézete (modal) -->
> ![Játék részletek](screenshots/game_details.png)

---

### 💬 Discussions (Fórum)

Közösségi fórum, ahol bármely bejelentkezett felhasználó új témát indíthat:
- **Téma létrehozása** — cím (kötelező) és opcionális leírás megadásával
- **Hozzászólások** — minden témához valós idejű kommentszekció
- **Felhasználói profil megjelenítés** — profilkép és felhasználónév a kártyákon

<!-- 📸 KÉPERNYŐKÉP: A Discussions lista és egy megnyitott téma -->
> ![Discussions](screenshots/discussions.png)

---

### 🔍 Finder (Csapattárskereső)

Egy egyedi funkció, amellyel a játékosok valós időben kereshetnek társakat:
- **Lobby létrehozása** — játék kiválasztása, leírás, opcionális létszámkorlát
- **Valós idejű chat** — a szobán belül a tagok azonnal kommunikálhatnak (Firebase `onSnapshot`)
- **Tagkezelés** — a szoba létrehozója kirúghat inaktív tagokat
- **Státusz jelzés** — `FULL` felirat, ha a szoba megtelt

<!-- 📸 KÉPERNYŐKÉP: A Finder lobbik listája és egy megnyitott szoba chattel -->
> ![Finder](screenshots/finder.png)

---

### 👤 Profile (Profil)

Személyre szabható profil négy füllel:

| Fül | Funkció |
|---|---|
| **Favourite Games** | Kedvenc játékok hozzáadása/eltávolítása a katalógusból |
| **My Discussions** | Saját témák szerkesztése, törlése |
| **Peoples** | *(Admin)* Felhasználók listája és kezelése |
| **My Profile** | Felhasználónév és profilkép módosítása (URL vagy fájlfeltöltés) |

<!-- 📸 KÉPERNYŐKÉP: A profil oldal a fülek egyikével -->
> ![Profile](screenshots/profile.png)

---

### ✉️ Private Messages (Privát üzenetek)

Globálisan elérhető chat rendszer, amely a képernyő jobb alsó sarkában lebeg:
- **Direct Messages** — korábbi beszélgetések listája, legfrissebb felül
- **Others** — új beszélgetés indítása bármely felhasználóval
- **Olvasatlan jelzés** — piros badge a még nem látott üzenetekről
- **Valós idejű** — Firebase `onSnapshot` listener, azonnal megjelenik az új üzenet

<!-- 📸 KÉPERNYŐKÉP: A megnyitott chat ablak egy beszélgetéssel -->
> ![Messages](screenshots/messages.png)

---

### ❓ FAQ (Gyakran Ismételt Kérdések)

Accordion stílusú segédoldal 10 kérdéssel a platform használatáról (pl. Finder működése, kedvencek hozzáadása, jelszókezelés).

---

### 🔐 Login / Signup (Bejelentkezés / Regisztráció)

- **Email + jelszó** alapú regisztráció és bejelentkezés (Firebase Auth)
- **Google bejelentkezés** — egykattintásos belépés Google fiókkal
- **Email validáció** — a backend ellenőrzi a formátumot regisztráció előtt
- **Üdvözlő email** — sikeres regisztrációnál automatikus, stílusos HTML levél (Nodemailer)

<!-- 📸 KÉPERNYŐKÉP: A Login oldal -->
> ![Login](screenshots/login.png)

---

### 🛡️ Admin felület

Csak admin jogosultságú felhasználók számára elérhető:
- Új játékok hozzáadása képpel, műfajokkal, leírással
- Új műfajok létrehozása
- Játék-kérések (game requests) jóváhagyása vagy elutasítása
- Felhasználók kezelése a Profile → Peoples fülön

---

## c) Reszponzív megjelenés

Az alkalmazás **mobile-first** szemlélettel készült. A felhasználói felület CSS media query-k segítségével dinamikusan alkalmazkodik a képernyőmérethez.

### Főbb különbségek mobilon:

| Elem | Desktop | Mobil |
|---|---|---|
| **Navigáció** | Vízszintes menüsor | Hamburger menü (☰) lenyíló listával |
| **Játékkártyák** | Több oszlopos grid | Egy oszlopos, teljes szélességű lista |
| **Chat ablak** | Lebegő ablak a sarokban | Teljes képernyős megjelenés |
| **Finder lobbik** | Kétoszlopos elrendezés | Egymás alatti kártyák |
| **Modálok** | Középre igazított popup | Teljes szélességű alsó lap |

<!-- 📸 KÉPERNYŐKÉP: A mobil nézet – hamburger menü nyitva -->
> ![Mobil navigáció](screenshots/mobile_nav.png)

<!-- 📸 KÉPERNYŐKÉP: A mobil nézet – játékok listája -->
> ![Mobil játékok](screenshots/mobile_games.png)

<!-- 📸 KÉPERNYŐKÉP: A mobil nézet – chat ablak -->
> ![Mobil chat](screenshots/mobile_chat.png)

---

## d) Adattárolás

Az alkalmazás a **Google Firebase Firestore** NoSQL felhőadatbázisát használja, kiegészítve a **Cloudinary** CDN-nel a képek tárolásához.

### Firestore gyűjtemények (collections) és kapcsolataik

```mermaid
erDiagram
    USER_DATA {
        string email PK
        string username
        string picture
        string picturePublicId
        boolean disabled
        array favouriteGames
    }

    GAMES {
        string id PK
        string name
        string description
        string picture
        string picturePublicId
        array genres
        int likes
        int dislikes
        timestamp createdAt
    }

    GENRES {
        string id PK
        string name
    }

    DISCUSSIONS {
        string id PK
        string creatoremail FK
        string title
        string description
    }

    COMMENTS {
        string id PK
        string discussionId FK
        string email FK
        string text
        timestamp time
    }

    PRIVATE_MESSAGES {
        string id PK
        string sender FK
        string receiver FK
        string text
        timestamp time
    }

    FINDER_POSTS {
        string id PK
        string creatoremail FK
        string game
        string description
        int limit
        array members
    }

    FINDER_MESSAGES {
        string id PK
        string finderPostId FK
        string sender FK
        string text
        timestamp time
    }

    LIKES {
        string id PK
        string gameId FK
        string email FK
        string type
    }

    GAME_REQUESTS {
        string id PK
        string email FK
        string gameName
    }

    READ_TIMESTAMPS {
        string id PK
        string userEmail FK
        string convKey
        timestamp readAt
    }

    USER_DATA ||--o{ DISCUSSIONS : "létrehozza"
    USER_DATA ||--o{ COMMENTS : "hozzászól"
    USER_DATA ||--o{ PRIVATE_MESSAGES : "küld/fogad"
    USER_DATA ||--o{ FINDER_POSTS : "létrehozza"
    USER_DATA ||--o{ LIKES : "szavaz"
    USER_DATA ||--o{ GAME_REQUESTS : "kérvényez"
    DISCUSSIONS ||--o{ COMMENTS : "tartalmazza"
    GAMES ||--o{ LIKES : "kap"
    FINDER_POSTS ||--o{ FINDER_MESSAGES : "tartalmazza"
    USER_DATA ||--o{ READ_TIMESTAMPS : "nyilvántartja"
```

### Képtárolás

A felhasználói profilképek és játékborítóképek a **Cloudinary** felhőszolgáltatáson keresztül töltődnek fel. A Firestore-ban csak a kép URL-je (`picture`) és a törléshez szükséges azonosító (`picturePublicId`) kerül mentésre.

---

## e) Backend végpontok

A backend egy **Node.js + Express** szerver, amely a képfeltöltést, email-küldést és rendszermonitorozást kezeli.

> 🔗 **Backend repository:** [github.com/Laci5555/2026-Vizsgaremek-Backend](https://github.com/Laci5555/2026-Vizsgaremek-Backend)

### Képfeltöltés (Cloudinary)

#### `POST /uploadFile`
Játékborítókép feltöltése a Cloudinary `gameImages` mappájába.

| Paraméter | Típus | Leírás |
|---|---|---|
| `file` | `FormData` | A feltöltendő képfájl (multipart) |

**Válaszok:**
| Kód | Válasz | Leírás |
|---|---|---|
| `201` | `{ url, public_id }` | Sikeres feltöltés, visszaadja a Cloudinary URL-t |
| `400` | `{ msg: "Error missing file" }` | Nem lett fájl csatolva |
| `500` | `{ error: "..." }` | Cloudinary vagy szerverhiba |

---

#### `POST /uploadPfp`
Profilkép feltöltése a Cloudinary `profilePictures` mappájába. Működése megegyezik a `/uploadFile`-lal, de más célmappába tölt fel.

| Kód | Válasz | Leírás |
|---|---|---|
| `201` | `{ url, public_id }` | Sikeres feltöltés |
| `400` | `{ msg: "Error missing file" }` | Hiányzó fájl |

---

#### `DELETE /deleteImage`
Kép törlése a Cloudinary-ról a `public_id` alapján.

| Paraméter | Típus | Leírás |
|---|---|---|
| `public_id` | `string` | A Cloudinary által adott azonosító |

| Kód | Válasz | Leírás |
|---|---|---|
| `200` | `{ msg: "Succesful Deletion!" }` | Sikeres törlés |
| `400` | `{ msg: "Image not found" }` | Hiányzó `public_id` |

---

### Email szolgáltatások

#### `POST /check-email`
Regisztráció előtti email-formátum ellenőrzés regex segítségével.

| Paraméter | Típus | Leírás |
|---|---|---|
| `email` | `string` | Az ellenőrizendő email cím |

| Kód | Válasz | Leírás |
|---|---|---|
| `200` | `{ valid: true }` | Érvényes email formátum |
| `400` | `{ valid: false, message: "..." }` | Érvénytelen formátum |
| `400` | `{ error: "Email is required" }` | Hiányzó email mező |

---

#### `POST /welcome-email`
Automatikus üdvözlő email küldése regisztráció után (Nodemailer + Gmail SMTP). A levél egy stílusos, HTML formátumú sablon a Gamminity arculatával.

| Paraméter | Típus | Leírás |
|---|---|---|
| `email` | `string` | A címzett email címe |
| `username` | `string` | A felhasználó választott neve |

| Kód | Válasz | Leírás |
|---|---|---|
| `200` | `{ msg: "Welcome email sent successfully" }` | Sikeres küldés |
| `400` | `{ error: "Email and username are required" }` | Hiányzó adatok |
| `500` | `{ error: "Failed to send welcome email" }` | SMTP hiba |

---

### Rendszer monitorozás

#### `GET /health`
Szerver állapot lekérdezése. A frontend 30 másodpercenként kérdezi le, ami egyrészt vizuális státuszt biztosít, másrészt „keep-alive" funkcióként megakadályozza, hogy az ingyenes hosting (pl. Render) elaltatja a szervert.

| Kód | Válasz | Leírás |
|---|---|---|
| `200` | `{ status: "online", uptime: 12345, timestamp: "..." }` | A szerver fut |

---

## f) Tesztelés

Mind a frontend, mind a backend automatizált tesztekkel rendelkezik.

### Frontend tesztek

**Technológia:** Vitest + React Testing Library + jsdom

A tesztek a `tests/` mappában találhatók. Összesen **11 tesztfájl, 23 teszteset**, amelyek minden oldal renderelését és a legfontosabb interakciókat ellenőrzik.

| Tesztfájl | Mit tesztel |
|---|---|
| `Navbar.test.jsx` | Navigációs linkek megjelenése, admin link, kattintásra navigáció |
| `Home.test.jsx` | Hero szekció renderelése, FAQ gombra navigáció |
| `Games.test.jsx` | Játéklista renderelése, kereső megjelenése |
| `Login.test.jsx` | Bejelentkezési űrlap, email/jelszó mezők kitöltése |
| `Profile.test.jsx` | Profil fülek megjelenése, felhasználói adatok |
| `Discussions.test.jsx` | Fórumlista megjelenése, új téma gomb |
| `Discussion.test.jsx` | Egyedi téma renderelése, kommentek |
| `Finder.test.jsx` | Finder lobbik listája |
| `Faq.test.jsx` | FAQ accordion megnyitása/zárása |
| `Admin.test.jsx` | Admin felület renderelése |
| `Message.test.jsx` | Chat rendszer megjelenése |

**Futtatás:**
```bash
cd 2026-Vizsgaremek-Frontend
pnpm test
```

> 💡 **Tipp:** A `tests/run_tests.bat` fájl dupla kattintással is futtatható — automatikusan lefuttatja az összes tesztet, nincs szükség parancssori ismeretekre.

<!-- 📸 KÉPERNYŐKÉP: A frontend tesztek sikeres futtatása a terminálban (pnpm test) -->
> ![Frontend tesztek](screenshots/frontend_tests.png)

---

### Backend tesztek

**Technológia:** Vitest + Supertest

A tesztek a `tests/endpoints.test.js` fájlban találhatók. A **Cloudinary** és a **Nodemailer** mock-olva van, így a tesztek külső szolgáltatások nélkül is futtathatók.

| Teszt | Mit ellenőriz |
|---|---|
| `GET /health` | 200-as válaszkód, `status: "online"` mező |
| `POST /check-email` (valid) | 200-as válasz, `valid: true` |
| `POST /uploadFile` | 201-es válasz, Cloudinary URL és public_id visszaadása |
| `POST /uploadFile` (no file) | 400-as hiba, `"Error missing file"` üzenet |
| `POST /uploadPfp` | 201-es válasz, sikeres profilkép feltöltés |
| `DELETE /deleteImage` | 200-as válasz, `"Succesful Deletion!"` |
| `POST /welcome-email` | 200-as válasz, mock-olt email küldés |

**Futtatás:**
```bash
cd 2026-Vizsgaremek-Backend
pnpm test
```

> 💡 **Tipp:** A `tests/run_tests.bat` fájl dupla kattintással is futtatható — automatikusan lefuttatja az összes tesztet, nincs szükség parancssori ismeretekre.

<!-- 📸 KÉPERNYŐKÉP: A backend tesztek sikeres futtatása a terminálban (pnpm test) -->
> ![Backend tesztek](screenshots/backend_tests.png)

---

<p align="center">
  <b>Gamminity</b> — 2026 Vizsgaremek
</p>
