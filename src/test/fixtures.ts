import type { Post, User } from "@/lib/types";

function makeUser(id: number, name: string, username: string): User {
  return {
    id,
    name,
    username,
    email: `${username.toLowerCase()}@example.test`,
    phone: "555-0100",
    website: `${username.toLowerCase()}.example.test`,
    address: {
      street: "Main Street",
      suite: "Apt. 1",
      city: "Springfield",
      zipcode: "00000",
      geo: { lat: "0", lng: "0" },
    },
    company: { name: "Acme", catchPhrase: "Testing things", bs: "tests" },
  };
}

export const users: User[] = [
  makeUser(1, "Leanne Graham", "Bret"),
  makeUser(2, "Ervin Howell", "Antonette"),
  makeUser(3, "Clementine Bauch", "Samantha"),
];

export const posts: Post[] = [
  { userId: 1, id: 1, title: "First post by Leanne", body: "Hello there." },
  { userId: 1, id: 2, title: "Second post by Leanne", body: "Still here." },
  { userId: 2, id: 3, title: "Only post by Ervin", body: "Hi." },
];
