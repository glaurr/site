import bcrypt from "bcryptjs";

/*
  Turns a password into the value for ADMIN_PASSWORD_HASH.

    node scripts/hash-password.mjs "the password"

  Cost 12 takes a few hundred milliseconds to verify, which is slow enough to
  make guessing expensive and fast enough that logging in feels instant.
*/
const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.mjs "the password"');
  process.exit(1);
}

console.log(await bcrypt.hash(password, 12));
