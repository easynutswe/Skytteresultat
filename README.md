# EasyResultat

Webbverktyg för att skapa, fylla i och skriva ut resultatblad för skyttetävlingar. Byggt för att köras direkt i webbläsaren utan installation – perfekt för klubbar som vill ha ett enkelt digitalt resultathanteringssystem.

## Tävlingsformer

| Tävlingsform | Beskrivning |
|---|---|
| **Springskytte** | 6 stationer med tid, missar och strafftid |
| **Magnumsprecision** | Precisionsskytte med vapenval, 6 eller 10 serier |
| **Nationell Helmatch** | 12 serier per skytt |
| **Milsnabb** | Stationsbaserat med träff, mål och särskiljning per station |
| **Precision** | 6 eller 10 serier med poängvalidering |
| **Fältskytte** | Upp till 8 stationer med konfigurerbart antal mål, särskiljning och maxvärden per station |

## Funktioner

- **PDF-generering** – Skapa utskriftsklara resultatblad i liggande A4-format
- **Namnförslag** – Automatisk sökning och autocomplete från inladdad medlemslista (CSV)
- **Valfri logotyp** – Ladda upp en PNG/JPEG-bild som visas i PDF-huvudet
- **Fritext** – Lägg till formaterad text (fet, kursiv, understruken) i resultatbladet
- **Lösenordsskydd** – Valfri kryptering (AES-256-GCM) av sparad data i webbläsaren
- **Spara och ladda** – Exportera/importera resultat som CSV-filer
- **Validering** – Automatisk kontroll att inmatade värden inte överstiger max
- **Select-on-focus** – Klicka på en ruta för att direkt kunna skriva över befintligt värde

## Kom igång

1. Öppna `index.html` i en webbläsare eller besök sidan via GitHub Pages
2. Välj tävlingsform i sidomenyn
3. Fyll i skyttarnas namn och resultat
4. Klicka **Skapa PDF** för att generera ett utskriftsklart resultatblad

### Ladda medlemslista

Ladda en CSV-fil med en rad per namn. Namnen används för automatisk autocomplete i namnfälten.

### Ladda logotyp

Ladda upp en valfri PNG- eller JPEG-bild som visas i övre vänstra hörnet på genererade PDF:er.

## Teknik

- Statiska HTML-filer med inline CSS och JavaScript
- Inga externa beroenden, ramverk eller byggsteg
- [jsPDF](https://github.com/parallax/jsPDF) för PDF-generering
- Web Crypto API (AES-256-GCM) för valfri kryptering
- `localStorage` för att spara inställningar mellan sessioner
- Versionshanterad cache – undersidor laddas om först när versionen uppdateras

## Licens

MIT License – se [LICENSE](LICENSE).
