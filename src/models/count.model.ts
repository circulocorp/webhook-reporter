import { Sequelize, DataTypes, Model, UUIDV4 } from "sequelize";
import { sequelize } from "../database/main.db";
import { IModelWHookStat } from "../interfaces/models.interfaces";

export class Stats extends Model<IModelWHookStat> implements IModelWHookStat
{
    public uuid!: string;
    public event!: string;
    public count!: number;
}

Stats.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    event: {
        type: DataTypes.STRING,
        allowNull: false
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    event_two: {
        type: DataTypes.STRING,
        allowNull: false
    },
    count_two: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, 
{
    sequelize,
    modelName: "Stats"
})

export default Stats;