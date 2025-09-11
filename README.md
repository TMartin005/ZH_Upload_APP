# ZH Upload App

Egy webalkalmazás hallgatói ZH-k (zh) feltöltésére és kezelésére, React frontenddel és Node.js/Express backenddel.

## Funkciók

- Hallgatói ZH-feltöltés ( kód (.c .cpp .py) és csv támogatás)
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

- Node.js
- npm

## Telepítés

1. Klónozd a repót:
   ```sh
   git clone https://github.com/yourusername/ZH_Upload_APP.git
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


## Hibakeresés

- Ellenőrizd, hogy mindkét szerver fut-e.
- Nézd meg a `.env` fájlokat, hogy helyesen vannak-e kitöltve.
- A feltöltött fájlok a `Server/uploads/` mappába kerülnek.
