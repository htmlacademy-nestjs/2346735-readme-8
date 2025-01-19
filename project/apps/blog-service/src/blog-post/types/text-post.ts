import { IBlogPost } from './post';
import { PostType } from './post-type';

export interface ITextPost extends IBlogPost {
  type: PostType.Text;
  text: string;
  announcement: string;
}
