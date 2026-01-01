import app from "./app";
import { prisma } from "./lib/prisma";
const port = process.env.PORT || 3000

async function main() {
    try {
        await prisma.$connect()
        console.log("Connect database successfully");
        app.listen(port, () => {
            console.log(`Prisma Blog application Running on ${port} port`);
        })
    } catch (error) {
        console.log("An error occurred", error);
        prisma.$disconnect()
        process.exit(1)

    }
}
main()
