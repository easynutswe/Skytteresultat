# EasyResultat

Webbverktyg för att skapa, fylla i och skriva ut resultatblad för skyttetävlingar. Körs direkt i webbläsaren utan installation – perfekt för klubbar som vill ha ett enkelt digitalt resultathanteringssystem.

## Tävlingsformer

| Tävlingsform | Beskrivning |
|---|---|
| **Springskytte** | 6 stationer med tid, missar och strafftid |
| **Magnumsprecision** | Precisionsskytte med vapenval, 6 eller 10 serier |
| **Nationell Helmatch** | 12 serier per skytt |
| **Milsnabb** | 12 serier uppdelade i tre tidsintervall (10s, 8s, 6s) med delsummor |
| **Precision** | 6 eller 10 serier med poängvalidering |
| **Fältskytte** | Upp till 8 stationer med konfigurerbart antal mål, särskiljning och maxvärden per station |

## Funktioner

- **PDF-generering** – Skapa utskriftsklara resultatblad i liggande A4-format
- **Namnförslag** – Börja skriva ett namn så visas matchande förslag från inladdad medlemslista
- **Logotyp** – Ladda upp en PNG/JPEG-bild som visas överst i genererade PDF-rapporter
- **Fritext** – Lägg till formaterad text (fet, kursiv, understruken) i resultatbladet
- **Lösenordsskydd** – Valfri kryptering (AES-256-GCM) av sparad data i webbläsaren
- **Exportera resultat** – Ladda ner resultat som CSV och PDF, eller skicka via mail
- **Validering** – Automatisk kontroll att inmatade värden inte överstiger max
- **Select-on-focus** – Klicka på en ruta för att direkt kunna skriva över befintligt värde

## Kom igång

1. Öppna `index.html` i en webbläsare eller besök sidan via GitHub Pages
2. Konfigurera mailadress, logotyp och medlemslista på startsidan
3. Välj tävlingsform i menyn till vänster
4. Fyll i skyttarnas namn och resultat
5. Klicka **Skapa PDF** för utskrift eller **Skicka resultat** för export via mail

### Medlemslista

Ladda en CSV- eller textfil (.csv/.txt) med ett namn per rad. Namnen används för automatiska namnförslag när du fyller i resultat. Tomma rader ignoreras.

### Logotyp

Ladda upp en valfri PNG- eller JPEG-bild (rekommenderad bredd 300–600 px). Bilden visas överst i genererade PDF-rapporter och skalas automatiskt.

## Teknik

- Statiska HTML-filer med inline CSS och JavaScript
- Inga externa beroenden, ramverk eller byggsteg
- [jsPDF](https://github.com/parallax/jsPDF) för PDF-generering
- Web Crypto API (AES-256-GCM) för valfri kryptering
- `localStorage` för att spara inställningar mellan sessioner
- Versionshanterad cache – undersidor laddas om först när versionen uppdateras

## Licens

MIT License – se [LICENSE](LICENSE).
