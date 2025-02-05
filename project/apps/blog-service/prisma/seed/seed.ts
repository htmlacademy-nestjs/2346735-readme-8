const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const crypto = require('node:crypto');

const userIds = [
  '679aa361b3003cc659259425',
  '679aa43ab3003cc65925942c',
  '679aa5bab3003cc659259432',
];

async function main() {
  try {
    const categoryA = await prisma.tag.create({
      data: { id: crypto.randomUUID(), title: 'Technology' },
    });

    const categoryB = await prisma.tag.create({
      data: { id: crypto.randomUUID(), title: 'Health' },
    });

    const categoryC = await prisma.tag.create({
      data: { id: crypto.randomUUID(), title: 'Entertainment' },
    });

    const categoryD = await prisma.tag.create({
      data: { id: crypto.randomUUID(), title: 'Science' },
    });

    const categoryE = await prisma.tag.create({
      data: { id: crypto.randomUUID(), title: 'Lifestyle' },
    });

    const postTypes = ['text', 'video', 'photo', 'link', 'quote'];

    const categoryIds = [
      categoryA.id,
      categoryB.id,
      categoryC.id,
      categoryD.id,
      categoryE.id,
    ];

    for (let i = 0; i < 20; i++) {
      const randomStatus = Math.random() > 0.5 ? 'PUBLISHED' : 'DRAFT';
      const randomType =
        postTypes[Math.floor(Math.random() * postTypes.length)];

      const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];

      const postData = {
        title: `Post Title ${i + 1}`,
        description: `Description of post ${i + 1}`,
        content: `Content for post ${i + 1}`,
        userId: randomUserId,
        status: randomStatus,
        tags: {
          connect: [
            { id: categoryIds[Math.floor(Math.random() * categoryIds.length)] },
          ],
        },

        type: randomType.toUpperCase(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (randomType === 'video') {
        postData.videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      } else if (randomType === 'text') {
        postData.announcement = 'This is an announcement for text post';
      } else if (randomType === 'quote') {
        postData.author = 'John Doe';
      } else if (randomType === 'photo') {
        postData.photoSrc = 'https://via.placeholder.com/150';
      } else if (randomType === 'link') {
        postData.url = 'https://example.com';
      }

      // Создание поста без комментариев и избранных
      await prisma.post.create({
        data: {
          ...postData,
          // Убираем связи с комментариями и избранными
          comments: {
            create: [],
          },
          favorite: {
            create: [],
          },
        },
      });
    }

    console.log('Seeding completed.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
