// user data
const users = [
  {
    name: "dashcode",
    email: "dashcode@codeshaper.net",
    password: "password",
    image: "/images/users/user-1.jpg",
  },
  {
    name: "DESY",
    email: "desy@ifca.co.id",
    password: "password",
    image: "/images/users/user-2.jpg",
  },
  {
    name: "ADHI",
    email: "adhi@ifca.co.id",
    password: "password",
    image: "/images/users/user-3.jpg",
  },
  {
    name: "VERA",
    email: "vera@ifca.co.id",
    password: "password",
    image: "/images/users/user-4.jpg",
  },
  {
    name: "ANGELA GUNAWAN",
    email: "angela.gunawan@ifca.co.id",
    password: "password",
    image: "/images/users/user-5.jpg",
  },
  {
    name: "RANDO",
    email: "rando@ifca.co.id",
    password: "password",
    image: "/images/users/user-6.jpg",
  },
  {
    name: "ANGELA",
    email: "angela@ifca.co.id",
    password: "password",
    image: "/images/users/user-1.jpg",
  },
  {
    name: "CAROLIN",
    email: "carolin@ifca.co.id",
    password: "password",
    image: "/images/users/user-2.jpg",
  },
  {
    name: "YOSEPH ARIBAWA",
    email: "yoseph.aribawa@ifca.co.id",
    password: "password",
    image: "/images/users/user-3.jpg",
  },
  {
    name: "GLEN",
    email: "glen@ifca.co.id",
    password: "password",
    image: "/images/users/user-4.jpg",
  },
];

export type User = (typeof users)[number];

export const getUserByEmail = (email: string) => {
  return users.find((user) => user.email === email);
};
