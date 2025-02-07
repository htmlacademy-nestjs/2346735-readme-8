// развернуть mongo db для users
// docker compose --file ./apps/user-service/docker-compose.dev.yml --project-name "typoteka-user" --env-file ./apps/user-service/.env up -d

// развернуть postgres для posts
// docker compose --file ./apps/blog-service/docker-compose.dev.yml --env-file ./apps/blog-service/.env --project-name typoteka-blog" up -d

// Создать ресурс nest
// nest generate resource <resource-name>

// Создать библиотеку nx
// nx generate @nx/node:library libs/<lib-name>

// Создать микросервис nx
// npx nx g @nx/nest:app --directory apps/app-name

// Сгенерировать prisma client и просидировать базу
// cd project/apps/blog-service
// npx prisma generate
// node prisma/seed/seed.ts
