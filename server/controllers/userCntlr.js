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
    else res.status(201).send({ message: "User already registered" });
});

export const bookVisit = asyncHandler(async (req, res) => {
    const {email, date} = req.body;
    const {id} = req.params;

    try{
        const isBooked = await prisma.user.findUnique({
            where: {email},
            select: {bookedVisits: true}
        })
        /* After obtaining list of booked visits belong to user with specified email
        If residency to be booked ID passed in is found in arr of residency ID of bookedVisits, 
        then do nothing, else proceed with booking
        */
        if(isBooked.bookedVisits.some((visit) => visit.id === id)){
            res.status(400).json({message: "You have already booked a visit for this residency"})
        }
        else{
            await prisma.user.update({
                where: {email},
                data: {bookedVisits: { push: {id, date}}}
            })
        }
        res.send("Your visit is booked successfully")
    }catch(err) {
        throw new Error(err.message);
    }
});

export const allBookings = asyncHandler(async (req, res) => {
    const {email} = req.body;
    try{
        const bookings = await prisma.user.findUnique({
            where: {email},
            select: {bookedVisits: true}
        })
        res.status(200).send(bookings)
    }catch(err) {
        throw new Error(err.message);
    }
});