import {PrismaClient} from '@prisma/client'

import sampleData from './sample-data'

const main = async() => {
    const prisma = new PrismaClient();

    try {
        await prisma.product.deleteMany({});

        await prisma.product.createMany({data: sampleData.products});

        console.log('Product Seeded Successfully')
    } catch (error) {
        console.log("Error Accured")
        console.log(error)
    }
}

main();