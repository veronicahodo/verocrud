"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verocrud_1 = __importDefault(require("./verocrud"));
let foo = new verocrud_1.default("veronica", "chaos1201", "god", "10.0.0.104");
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
foo.delete("users", [["userId", "=", "3"]]);
