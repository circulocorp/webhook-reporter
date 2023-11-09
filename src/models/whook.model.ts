import { Sequelize, DataTypes, Model, UUIDV4 } from "sequelize";
import { sequelize } from "../database/main.db";
import { IModelWHook } from "../interfaces/models.interfaces";

export class WHook extends Model<IModelWHook> implements IModelWHook
{
    public uuid!: string;
    public event!: string;
    public category!: string;
    public message_id!: string;
    public email!: string;
    public timestamp!: number;
    public event_id!: string;
    public reason?: string;
}

WHook.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    event: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    timestamp: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    event_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Without reason (SPAM)"
    }
},
{
    sequelize,
    modelName: "WHook"
})

export default WHook;