import { PostType } from './post-type';
import { ITag } from './tag';

export interface IBlogPost {
  id: string;
  authorId: number;
  tags?: ITag[];
  type: PostType;
}
