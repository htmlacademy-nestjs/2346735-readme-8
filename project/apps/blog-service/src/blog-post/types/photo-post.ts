import { IBlogPost } from './post';
import { PostType } from './post-type';

export interface IPhotoPost extends IBlogPost {
  type: PostType.Photo;
  photoSrc: string;
}
