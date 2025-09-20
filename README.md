# ZH Upload App

Egy webalkalmazás hallgatói ZH-k (zh) feltöltésére és kezelésére, React frontenddel és Node.js/Express backenddel.

## Funkciók

- Hallgatói ZH-feltöltés ( kód (.c .cpp .py, .ipynb) és csv támogatás)
- Tanári autentikáció és védett nézet
- ZH-kezelés (hozzáadás, aktiválás, beadások megtekintése)
- Fájl előnézet (kód és CSV)
- JWT-alapú tanári bejelentkezés

## Projekt felépítése

```
ZH_APP.bat           # Batch script mindkét szerver indításához
Frontend/            # React + Vite frontend
Server/              # Node.js/Express backend
```

## Előfeltételek

A Node.js letöltése:

- Látogass el a [nodejs.org](https://nodejs.org) oldalra.
- Kattints a "LTS" verzió letöltésére (ajánlott).
- Futtasd a letöltött telepítőt, és kövesd az utasításokat.

## Telepítés

1. Klónozd a repót:
   ```sh
   git clone https://github.com/TMartin005/ZH_Upload_APP.git
   cd ZH_Upload_APP
   ```

2. Állítsd be a környezeti változókat:

    Másold át a `.env.example` fájlokat `.env` néven:

       - `Frontend/.env.example` → `Frontend/.env`
       - `Server/.env.example` → `Server/.env`
 
    Töltsd ki a szükséges értékeket tetszés szerint:

   - **Frontend/.env**
     - `VITE_BACKEND_PORT=3000`
     - `VITE_FRONTEND_PORT=3101`
     - `VITE_SERVER=your_server_ip`
     - `VITE_HOST=localhost`
   - **Server/.env**
     - `JWT_SECRET=your_jwt_secret`
     - `TEACHER_PASSWORD=your_teacher_password`

3. Csomagok telepítése és szerverek indítása:
   
 Ha a ZH_APP.bat fájlt futtatod, automatikusan telepíti a szükséges npm csomagokat (ha még nincsenek letöltve), majd elindítja a frontend és backend szervereket. 

 Manuális indítás esetén a következő parancsokat használd:
   ```sh
 cd Frontend && npm install && npm run dev -- --host
   ```
  ```sh
 cd Server && npm install && node server.js
   ```

## Használat

- A `/student` oldalon tölthetnek fel a hallgatók.
- A `/teacher` oldalon érhető el a tanári nézet (jelszó szükséges).

## Elrendezés
### Hallgatói oldal (`/student`)

<img width="690" height="609" alt="kép" src="https://github.com/user-attachments/assets/7bfa63cb-3460-4c61-8418-c9bc9e2b3aff" />


A hallgatói oldalon a felhasználók a következőket tudják megtenni:

- Név és Neptun kód megadása
- Aktív ZH kiválasztása a listából
- Nyilatkozatok elfogadása (saját kód, AI használat)
- Programfájl feltöltése (.c .cpp .py, .ipynb)
- Opcionális CSV fájl feltöltése
- Feltöltött fájlok előnézete (Megtekintés gombbal)
- Beadás gombbal a fájlok beküldése
- A feltöltés után visszajelzés a sikeres beadásról.

### Tanári oldal (`/teacher`)

<img width="382" height="160" alt="kép" src="https://github.com/user-attachments/assets/59bd3c82-24c0-4748-b3d5-65e55aaefd5f" />

A belépéshez a tanárnak meg kell adnia a jelszót, amit a backend ellenőriz. 

<img width="1013" height="576" alt="kép" src="https://github.com/user-attachments/assets/e6b40c49-e214-498a-879b-225781b10b02" />

Sikeres bejelentkezés után a következő funkciók érhetők el: 

- ZH-k hozzáadása, aktiválása
- Beadott ZH-k és fájlok megtekintése
- Fájlok előnézete (kód és CSV)


## Hibakeresés

- Ellenőrizd, hogy mindkét szerver fut-e.
- Nézd meg a `.env` fájlokat, hogy helyesen vannak-e kitöltve.
- A feltöltött fájlok a `Server/uploads/` mappába kerülnek.
