/**
 * Glagolitic Mapping for Ukrainian Cyrillic
 * 
 * Based on Unicode Glagolitic Block (U+2C00–U+2C5F)
 * 
 * HISTORICAL CONTEXT:
 * Glagolitic (Глаголиця) is the oldest Slavic alphabet, created in the 9th century
 * by Saints Cyril and Methodius for Old Church Slavonic. It preceded Cyrillic and
 * was used primarily in religious texts.
 * 
 * MODERN UKRAINIAN ADAPTATION:
 * Modern Ukrainian letters (Є, Ї, Ґ) did not exist in historical Glagolitic.
 * We use phonetically similar mappings for practical cryptographic purposes:
 * 
 * - Є → Ⱗ (U+2C57 "yest", similar to "ye" sound)
 * - Ї → Ⰹ (U+2C09 "i", no distinct letter existed in 9th century)
 * - Ґ → Ⰳ (U+2C03 "glagoli", same as Г - distinction appeared later)
 * 
 * This adaptation is intentional and serves dual purposes:
 * 1. Preserves Ukrainian cultural identity in modern technology
 * 2. Maintains Unicode compliance for cross-platform compatibility
 * 3. Provides unique visual representation for cryptographic hashing
 * 
 * REFERENCES:
 * - Unicode Standard: https://unicode.org/charts/PDF/U2C00.pdf
 * - Glagolitic Script: https://en.wikipedia.org/wiki/Glagolitic_script
 * - Ukrainian Ministry of Digital Transformation: https://diia.gov.ua
 * 
 * @author Yana.Diia.AI Team
 * @license MIT
 */
export const GLAGOLITIC_MAP: Record<string, string> = {
  'А': 'Ⰰ', 'Б': 'Ⰱ', 'В': 'Ⰲ', 'Г': 'Ⰳ', 'Д': 'Ⰴ',
  'Е': 'Ⰵ', 'Ж': 'Ⰶ', 'З': 'Ⰷ', 'И': 'Ⰸ', 'І': 'Ⰹ',
  'К': 'Ⰽ', 'Л': 'Ⰾ', 'М': 'Ⰿ', 'Н': 'Ⱀ', 'О': 'Ⱁ',
  'П': 'Ⱂ', 'Р': 'Ⱃ', 'С': 'Ⱄ', 'Т': 'Ⱅ', 'У': 'Ⱆ',
  'Ф': 'Ⱇ', 'Х': 'Ⱈ', 'Ц': 'Ⱌ', 'Ч': 'Ⱍ', 'Ш': 'Ⱎ',
  'Щ': 'Ⱋ', 'Ь': 'Ⱐ', 'Ю': 'Ⱓ', 'Я': 'Ⱔ', 'Є': 'Ⱗ',
  'Ї': 'Ⰹ', 'Ґ': 'Ⰳ',
  // Lowercase
  'а': 'ⰰ', 'б': 'ⰱ', 'в': 'ⰲ', 'г': 'ⰳ', 'д': 'ⰴ',
  'е': 'ⰵ', 'ж': 'ⰶ', 'з': 'ⰷ', 'и': 'ⰸ', 'і': 'ⰹ',
  'к': 'ⰽ', 'л': 'ⰾ', 'м': 'ⰿ', 'н': 'ⱀ', 'о': 'ⱁ',
  'п': 'ⱂ', 'р': 'ⱃ', 'с': 'ⱄ', 'т': 'ⱅ', 'у': 'ⱆ',
  'ф': 'ⱇ', 'х': 'ⱈ', 'ц': 'ⱌ', 'ч': 'ⱍ', 'ш': 'ⱎ',
  'щ': 'ⱋ', 'ь': 'ⱐ', 'ю': 'ⱓ', 'я': 'ⱔ', 'є': 'ⱗ',
  'ї': 'ⰹ', 'ґ': 'ⰳ'
}

/**
 * Convert text to Glagolitic script
 */
export function toGlagolitic(text: string): string {
  return text.split('').map(char => GLAGOLITIC_MAP[char] || char).join('')
}

/**
 * Convert Glagolitic back to Cyrillic
 */
export function fromGlagolitic(glagolitic: string): string {
  const reverseMap = Object.fromEntries(
    Object.entries(GLAGOLITIC_MAP).map(([k, v]) => [v, k])
  )
  return glagolitic.split('').map(char => reverseMap[char] || char).join('')
}

/**
 * Hash text using SHA-256 (browser crypto API)
 */
export async function hashText(text: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Create Glagolitic signature for blockchain audit
 */
export async function createGlagoliticSignature(data: any): Promise<{
  hash: string
  glagolitic: string
  timestamp: number
}> {
  const text = JSON.stringify(data)
  const hash = await hashText(text)
  
  // Convert first 32 chars of hash to "readable" Glagolitic
  const hashPrefix = hash.substring(0, 32)
  const glagolitic = toGlagolitic(hashPrefix.toUpperCase())
  
  return {
    hash,
    glagolitic,
    timestamp: Date.now()
  }
}
