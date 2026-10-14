import bcrypt from "bcryptjs";
import prisma from "./src/config/prisma.js";

const email = "admin@streamys.in";
const newPassword = "NewPassword123";

const user = await prisma.user.findUnique({
  where: { email },
});

if (!user) {
  console.log("USER NOT FOUND:", email);
} else {
  console.log("USER FOUND:", user.email);

  const hash = await bcrypt.hash(newPassword, 10);

  console.log("NEW HASH:", hash);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hash,
    },
  });

  console.log("UPDATED HASH:", updatedUser.password);

  const verify = await bcrypt.compare(
    newPassword,
    updatedUser.password
  );

  console.log("VERIFY AFTER DATABASE UPDATE:", verify);
}

await prisma.$disconnect();