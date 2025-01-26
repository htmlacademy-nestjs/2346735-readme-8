const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// const

async function main() {
  try {
    await prisma.category.upsert({
      where: { id: 'cat1' },
      update: {},
      create: { id: 'cat1', title: 'Technology' },
    });
    await prisma.category.upsert({
      where: { id: 'cat2' },
      update: {},
      create: { id: 'cat2', title: 'Health' },
    });
    await prisma.category.upsert({
      where: { id: 'cat3' },
      update: {},
      create: { id: 'cat3', title: 'Entertainment' },
    });

    await prisma.post.upsert({
      where: { id: 'post1' },
      update: {},
      create: {
        id: 'post1',
        title: 'Latest Tech Trends',
        description: 'Overview of the latest in tech.',
        content: 'Content about tech.',
        userId: 'user1',
      },
    });
    await prisma.post.upsert({
      where: { id: 'post2' },
      update: {},
      create: {
        id: 'post2',
        title: 'Health Tips',
        description: 'Daily health tips.',
        content: 'Content about health.',
        userId: 'user2',
      },
    });
    await prisma.post.upsert({
      where: { id: 'post3' },
      update: {},
      create: {
        id: 'post3',
        title: 'Movie Reviews',
        description: 'Latest movie reviews.',
        content: 'Content about movies.',
        userId: 'user3',
      },
    });

    await prisma.post.update({
      where: { id: 'post1' },
      data: { categories: { connect: [{ id: 'cat1' }] } },
    });
    await prisma.post.update({
      where: { id: 'post2' },
      data: { categories: { connect: [{ id: 'cat2' }] } },
    });
    await prisma.post.update({
      where: { id: 'post3' },
      data: { categories: { connect: [{ id: 'cat3' }] } },
    });

    await prisma.comment.upsert({
      where: { id: 'comm1' },
      update: {},
      create: {
        id: 'comm1',
        message: 'Great post!',
        userId: 'user4',
        postId: 'post1',
      },
    });
    await prisma.comment.upsert({
      where: { id: 'comm2' },
      update: {},
      create: {
        id: 'comm2',
        message: 'Very helpful!',
        userId: 'user5',
        postId: 'post2',
      },
    });
    await prisma.comment.upsert({
      where: { id: 'comm3' },
      update: {},
      create: {
        id: 'comm3',
        message: 'Loved it!',
        userId: 'user6',
        postId: 'post3',
      },
    });

    await prisma.favorite.upsert({
      where: { id: 'fav1' },
      update: {},
      create: { id: 'fav1', postId: 'post1', userId: 'user7' },
    });
    await prisma.favorite.upsert({
      where: { id: 'fav2' },
      update: {},
      create: { id: 'fav2', postId: 'post2', userId: 'user8' },
    });

    console.log('Seeding completed.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
