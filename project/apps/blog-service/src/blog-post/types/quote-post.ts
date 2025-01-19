import { IBlogPost } from './post';
import { PostType } from './post-type';

export interface IQuotePost extends IBlogPost {
  type: PostType.Quote;
  text: string;
  author: string;
}
