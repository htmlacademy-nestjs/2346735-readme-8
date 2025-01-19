import { IBlogPost } from './post';
import { PostType } from './post-type';

export interface ILinkPost extends IBlogPost {
  type: PostType.Link;
  url: string;
  description: string;
}
