import { Sequelize, DataTypes, Model, UUIDV4 } from "sequelize";
import { sequelize } from "../database/main.db";
import { IModelWHook } from "../interfaces/models.interfaces";

export class WHookStat extends Model<IModelWHook> implements IModelWHook
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

WHookStat.init({
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
  })

export default WHookStat;