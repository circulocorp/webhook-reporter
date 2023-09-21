import { Request, Response } from "express";
import User from "../models/user.model";
import { IUserData } from "../interfaces/controllers.interfaces";
import { hashPassword } from "../utils/main.utils";
import { Op } from "sequelize";

const SERVICE: string = "USERS";

const create_user = async (req: Request, res: Response) => {

    const { username, email, password, name, lastname }: IUserData = req.body;

    const { authorization } = req.body;

    if(!authorization || authorization !== process.env.AUTHORIZATION_KEY)
    {
        return res.status(401).json({
            status: 401,
            service: SERVICE,
            message: "Unauthorized."
        })
    }

    if(!username || !email || !password || !name || !lastname )
    {
        return res.status(400).json({
            status: 400,
            service: SERVICE,
            message: "All fields are required."
        })
    }

    try
    {
        const existingUser = await User.findOne({
            where: {
              [Op.or]: [
                { username: username },
                { email: email }
              ]
            }
        });

        if(existingUser)
        {
            return res.status(400).json({
                status: 400,
                service: SERVICE,
                message: "Username or email already exists."
            })
        }

        const user = await User.create({
            username,
            email,
            password: await hashPassword(password),
            name,
            lastname,
        },
        {
            fields: ["username", "email", "password", "name", "lastname"]
        });


        return res.status(201).json({
            status: 201,
            service: SERVICE,
            message: "User created successfully.",
            data: user
        })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            status: 500,
            service: SERVICE,
            message: "Internal server error."
        })
    }

}

export {
    create_user
}