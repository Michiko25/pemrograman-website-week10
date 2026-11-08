import prisma from "../src/config/prisma";

async function main() {
  await prisma.$executeRaw`TRUNCATE "Product" RESTART IDENTITY`;

  await prisma.product.createMany({
    data: [
      { name: "Buku", price: 15000 },
      { name: "Pulpen", price: 5000 },
    ],
  });

  console.log(await prisma.product.findMany({ orderBy: { id: "asc" } }));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());