import { DataTypes } from "sequelize";
import db from "../config/db.js";

const employeeMasterModels=db.define('employeeMaster',{
    employeeId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    employeeName:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    employeeEmail:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    employeePhone:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    employeeAddress:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    employeeDepartment:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    employeeDesignation:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    employeeSalary:{
        type:DataTypes.FLOAT,
        allowNull:false,
    },
    employeeJoiningDate:{

        type:DataTypes.DATE,
        allowNull:false,
    },
    employeeStatus:{
       type: DataTypes.ENUM("Active", "Inactive"),
        allowNull:false,
    },
},{
    timestamps:true,
    freezeTableName:true,
});
export default employeeMasterModels;