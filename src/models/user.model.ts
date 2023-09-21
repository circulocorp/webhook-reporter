import { Sequelize, DataTypes, Model, UUIDV4 } from "sequelize";
import { sequelize } from "../database/main.db";
import { IModelUser } from "../interfaces/models.interfaces";

export class User extends Model<IModelUser> implements IModelUser
{
    public uuid!: string;
    public username!: string;
    public email!: string;
    public password!: string;
    public name!: string;
    public lastname!: string;
    public enterprise!: string;
    public createdAt?: Date;
    public updatedAt?: Date;
}

User.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    enterprise: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "Circulocorp"
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now()
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now()
    }
}, 
{
    sequelize,
    tableName: "users"
}
)

// User.sync({alter: true})

export default User;