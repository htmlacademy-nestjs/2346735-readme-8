import { IBlogPost } from './post';
import { PostType } from './post-type';

export interface IVideoPost extends IBlogPost {
  type: PostType.Video;
  videoUrl: string;
}
