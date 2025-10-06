import {PrismaClient} from '@prisma/client'

import sampleData from './sample-data'

const main = async() => {
    const prisma = new PrismaClient();

    try {
        await prisma.product.deleteMany({});
        await prisma.account.deleteMany({});
        await prisma.session.deleteMany({});
        await prisma.verificationToken.deleteMany({});
        await prisma.user.deleteMany({});

        await prisma.product.createMany({data: sampleData.products});
        await prisma.user.createMany({data: sampleData.users});

        console.log('Product Seeded Successfully')
    } catch (error) {
        console.log("Error Accured")
        console.log(error)
    }
}

main();