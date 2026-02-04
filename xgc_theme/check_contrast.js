const goldColors = {
  'gold': '#9c7a10',
  'gold-light': '#b8941f',
  'gold-lighter': '#d4af37',
  'gold-dark': '#7a5e0d',
  'gold-darker': '#5a4609'
};

const bgColor = '#ffffff';

function getRelativeLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
}

function getContrastRatio(color1, color2) {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

console.log('Gold color contrast ratios against white background:');
console.log('');
for (const [name, color] of Object.entries(goldColors)) {
  const ratio = getContrastRatio(color, bgColor);
  const passesAA_Large = ratio >= 3.0 ? '✓' : '✗';
  const passesAA_Normal = ratio >= 4.5 ? '✓' : '✗';
  console.log(`${name.padEnd(15)} ${color}  Ratio: ${ratio.toFixed(2)}  AA Large: ${passesAA_Large}  AA Normal: ${passesAA_Normal}`);
}
