-- This runs as a placeholder seed script, can be deleted if not needed using:
--   DELETE FROM "Project" WHERE slug LIKE 'sample-%';

-- Run with: npx prisma db execute --file prisma/seed.sql
--
-- Plain SQL rather than a TypeScript seed script: the generated Prisma client
-- uses extensionless imports that Node cannot resolve on its own, and that
-- would mean adding tsx purely to insert two rows.

INSERT INTO "Project" (
  "id", "slug",
  "titleEn", "titleRo",
  "summaryEn", "summaryRo",
  "bodyEn", "bodyRo",
  "role", "startDate", "endDate", "tags",
  "published", "sortOrder", "updatedAt"
)
VALUES
  (
    gen_random_uuid()::text,
    'glaurr-site',
    'This site',
    'Acest site',
    'Placeholder project. Replace it once the admin panel can create real ones.',
    'Proiect de test. Înlocuiește-l după ce panoul de administrare poate crea proiecte reale.',
    E'This is placeholder body text.\n\nIt exists so the list page has more than one row.',
    E'Acesta este text de test.\n\nExistă pentru ca pagina de listă să aibă mai mult de un rând.',
    'Full-stack developer',
    '2026-08-01T00:00:00.000Z',
    NULL,
    ARRAY['Next.js', 'TypeScript', 'Prisma'],
    true,
    0,
    NOW()
  ),
  (
    gen_random_uuid()::text,
    'glr-maps',
    'Hybrid-Offline maps without tracking',
    'Hartă hybrid-offline fără tracking',
    'A hybrid-offline GPS navigation app built with zero big-tech tracking, using vector tiles and open-source routing.',
    'O aplicație GPS hibrid-offline creată fără sisteme de urmărire, folosind tile-uri vectoriale și rute open-source.',
    E'## The problem\n\nMainstream map applications rely on heavy telemetry, proprietary location services, and massive background data usage that track user movements.\n\n## What I built\n\nA privacy-first navigation system for Android. It completely bypasses Google Play Services by communicating directly with the native \`LocationManager\`. To minimize bandwidth, it relies on MapLibre and mathematically drawn PMTiles for rendering, combined with a Valhalla routing engine for highly compressed, tile-based offline navigation.',
    E'## Problema\n\nAplicațiile de hărți obișnuite se bazează pe telemetrie masivă, servicii de localizare proprietare și un consum mare de data în fundal pentru a urmări utilizatorii.\n\n## Ce am construit\n\nUn sistem de navigație pentru Android axat pe confidențialitate. Evită complet serviciile Google comunicând direct cu \`LocationManager-ul\` nativ. Pentru a minimiza consumul de date, folosește MapLibre și PMTiles (tile-uri vectoriale) pentru randare, combinate cu motorul Valhalla pentru navigație offline ultra-comprimată.',
    'Android developer',
    '2026-07-27T00:00:00.000Z',
    NULL,
    ARRAY['Kotlin', 'Android SDK'],
    true,
    1,
    NOW()
  )

ON CONFLICT ("slug") DO UPDATE SET
  "titleEn"   = EXCLUDED."titleEn",
  "titleRo"   = EXCLUDED."titleRo",
  "summaryEn" = EXCLUDED."summaryEn",
  "summaryRo" = EXCLUDED."summaryRo",
  "bodyEn"    = EXCLUDED."bodyEn",
  "bodyRo"    = EXCLUDED."bodyRo",
  "updatedAt" = NOW();
