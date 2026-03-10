# Resultatmallar

Webbverktyg for att skapa och skriva ut resultatblad for skyttetavlingar.

## Tavlingsformer

- **Springskytte** - Resultatblad for springskytte
- **Magnumprecision** - Resultatblad for magnumprecision
- **Nationell Helmatch** - Resultatblad for nationell helmatch
- **Milsnabb** - Resultatblad for milsnabb
- **Precision** - Resultatblad for precision (6 eller 10 serier)

## Funktioner

- Automatisk namnsokning fran inladdad medlemslista (CSV)
- Valfri logotyp i PDF-header
- Fritext med formatering (fet, kursiv, understruken)
- PDF-generering for utskrift
- Cache-busting sa att senaste version alltid laddas

## Anvandning

Oppna `index.html` i en webblasare eller hosta filerna via GitHub Pages. Valj tavlingsform i sidomenyn.

### Ladda medlemmar

Forvantad CSV-format: en rad per namn.

### Ladda logotyp

Valfri PNG/JPEG-bild som visas i PDF-headern.

## Teknik

Statiska HTML-filer med inline CSS och JavaScript. Inga externa beroenden eller byggsteg.

## Licens

MIT License - se [LICENSE](LICENSE).
