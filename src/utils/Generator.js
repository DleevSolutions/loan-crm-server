const { randomBytes, randomInt } = require('node:crypto');

async function generateRandomBytes(length) {
  return new Promise((resolve, reject) => {
    randomBytes(length, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
}

async function generateUniqueID(length = 16) {
  const bytes = await generateRandomBytes(length);
  const timestamp = Date.now().toString(16); // Get the current timestamp as a hexadecimal string
  const uniqueID = bytes.toString('hex') + timestamp; // Append the timestamp to the generated random bytes
  return uniqueID;
}

async function generatePassword(length = 16) {
  const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,.-{}+!"#$%/()=?';
  const randomChar = () => charset[Math.floor(Math.random() * charset.length)];

  const requiredChars = [
    charset.substring(0, 10), // Digits
    charset.substring(10, 36), // Lowercase letters
    charset.substring(36, 62), // Uppercase letters
    charset.substring(62, 77), // Special characters
  ].map((set) => set[Math.floor(Math.random() * set.length)]);

  let password = requiredChars.join('');

  for (let i = password.length; i < length; i++) {
    password += randomChar();
  }

  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

module.exports = { generateUniqueID, generatePassword };
