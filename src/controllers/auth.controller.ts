import { Request, Response } from "express";
import User from "../models/user.model";
import { Op } from "sequelize";
import { IAuthData } from "../interfaces/controllers.interfaces";
import { comparePassword } from "../utils/main.utils";
import { generate_token } from "../utils/main.utils";

const SERVICE: string = "AUTH";

const login_user = async (req: Request, res: Response) => {

    const { username, password }: IAuthData = req.body;

    if(!username || !password)
    {
        return res.status(400).json({
            status: 400,
            service: SERVICE,
            message: "All fields are required."
        })
    }

    try
    {
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username: username },
                    { email: username }
                ]
            }
        });

        if(!user)
        {
            return res.status(400).json({
                status: 400,
                service: SERVICE,
                message: "Username or email doesn't exists."
            })
        }

        const pwd_match = await comparePassword(password, user.password);

        if(!pwd_match)
        {
            return res.status(400).json({
                status: 400,
                service: SERVICE,
                message: "Your information does not match."
            })
        }

        return res.status(200).json({
            status: 200,
            service: SERVICE,
            message: "User logged in successfully.",
            data: {
                access_token: generate_token(user),
                uuid: user.uuid,
                username: user.username,
                email: user.email,
                enterprise: user.enterprise,
            }
        })

    }
    catch(error)
    {
        return res.status(500).json({
            status: 500,
            service: SERVICE,
            message: "Internal server error."
        })
    }
};

export {
    login_user
}