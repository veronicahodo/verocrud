import VeroCrud from "./verocrud";

let foo = new VeroCrud("veronica", "chaos1201", "god", "10.0.0.104");

/*foo.create("users", [
  {
    userId: 0,
    username: "miguelTheTigwelder",
    passwordHash: "hexisthebext",
    salt: "kosher",
  },
]);*/
//foo.read("users", [["userId", "=", "1"]]);
/*foo.update(
  "users",
  [
    {
      passwordHash: "Hexmaster 3000",
    },
  ],
  [["userId", "=", "2"]]
);*/

foo.delete("users", [["userId", "=", "31"]]);
