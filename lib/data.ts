// user data
const users = [
  {
    name: "dashcode",
    email: "dashcode@codeshaper.net",
    password: "password",
    image:
      "https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?resize=256%2C256&quality=100&ssl=1",
  },
  {
    name: "DESY",
    email: "desy@ifca.co.id",
    password: "password",
    image:
      "https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?resize=256%2C256&quality=100&ssl=1",
  },
  {
    name: "ADHI",
    email: "adhi@ifca.co.id",
    password: "password",
    image:
      "https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?resize=256%2C256&quality=100&ssl=1",
  },
  {
    name: "VERA",
    email: "vera@ifca.co.id",
    password: "password",
    image:
      "https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?resize=256%2C256&quality=100&ssl=1",
  },
  {
    name: "ANGELA GUNAWAN",
    email: "angela.gunawan@ifca.co.id",
    password: "password",
    image:
      "https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?resize=256%2C256&quality=100&ssl=1",
  },
  {
    name: "RANDO",
    email: "rando@ifca.co.id",
    password: "password",
    image:
      "https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?resize=256%2C256&quality=100&ssl=1",
  },
  {
    name: "ANGELA",
    email: "angela@ifca.co.id",
    password: "password",
    image:
      "https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?resize=256%2C256&quality=100&ssl=1",
  },
  {
    name: "CAROLIN",
    email: "carolin@ifca.co.id",
    password: "password",
    image:
      "https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?resize=256%2C256&quality=100&ssl=1",
  },
  {
    name: "YOSEPH ARIBAWA",
    email: "yoseph.aribawa@ifca.co.id",
    password: "password",
    image:
      "https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?resize=256%2C256&quality=100&ssl=1",
  },
  {
    name: "GLEN",
    email: "glen@ifca.co.id",
    password: "password",
    image:
      "https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?resize=256%2C256&quality=100&ssl=1",
  },
];

export type User = (typeof users)[number];

export const getUserByEmail = (email: string) => {
  return users.find((user) => user.email === email);
};
