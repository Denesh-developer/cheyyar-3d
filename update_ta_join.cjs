const fs = require('fs');
let code = fs.readFileSync('public/assets/ta-CUxBAER_.js', 'utf8');

const p = code.indexOf('joinText:"');
if (p !== -1) {
  const end = code.indexOf('"', p + 10);
  console.log('Old joinText:', code.slice(p, end + 1));
  code = code.slice(0, p) + 'joinText:"செய்யாறு நகரத்தை 3Dயில் சுற்றிப் பாருங்கள்! செய்யாறு டாக்கீஸ், வேதபுரீஸ்வரர் கோயில், மணிக்கூண்டு, பேருந்து நிலையம் ஆகியவற்றை அனுபவியுங்கள்."' + code.slice(end + 1);
  fs.writeFileSync('public/assets/ta-CUxBAER_.js', code, 'utf8');
  console.log('Successfully replaced joinText in ta-CUxBAER_.js!');
}
