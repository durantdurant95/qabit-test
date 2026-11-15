export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: { lat: string; lng: string };
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
};

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type NewPost = Pick<Post, "userId" | "title" | "body">;

/**
 * A post created in this session. The API always answers with `id: 101`,
 * so it gets a client-generated id instead.
 */
export type CreatedPost = Omit<Post, "id"> & { id: string };
