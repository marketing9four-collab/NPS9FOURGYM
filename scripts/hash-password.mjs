import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Uso: npm run hash-password -- <contraseña>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log(hash);
