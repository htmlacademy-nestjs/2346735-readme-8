export class CreateBlogPostDto {
  title: string;
  description: string;
  content: string;
  userId: string;
  categoryIds: string[];
}
