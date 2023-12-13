import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

export const createResidency = asyncHandler(async (req, res) => {

    const {title, description, price, address, country,
          city, image, facilities, userEmail} = req.body.data;
    console.log(req.body.data);
    try {
        const residency = await prisma.residency.create({
            data: {
                // Connect the residency being created to the user whose email is equal to the value of userEmail
                title, description, price, address, country,
                city, image, facilities, owner : {connect: {email: userEmail}}
            }
        });
        res.send({
            message: "Residency created successfully",
            residency: residency,
        });
    }catch(error) {
        // P2002 returns when a unique identifier is violated
        if (error.code === "P2002") {
            throw new Error("A residency with address already exists");
        }
        throw new Error(error.message)
    }

});