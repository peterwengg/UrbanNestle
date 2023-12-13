import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

export const createUser = asyncHandler(async (req, res) => {
console.log("Creating a User");
let { email } = req.body;

// Check if user exists before creating
const userExists = await prisma.user.findUnique({ where: { email } });

if (!userExists) {
    const user = await prisma.user.create({ data: req.body });
    res.send({
    message: "User registered successfully",
    user: user,
    });
}
else res.send(201).json({ message: "User already registered" });
});
