export interface BookType {
  id: string;
  title: string;
  author: string;
  release_date: string;
  available: number;
  image: {
    data: Buffer;
    contentType: String;
  };
  short_description: string;
  long_description: string;
  created_on: Date;
}
