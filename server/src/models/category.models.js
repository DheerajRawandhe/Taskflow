import mongoose, { model, Schema } from "mongoose";

const categorySchema = new mongoose.Schema(
    {
       name:{
        type:String,
        required:[true,'Category name is required'],
        trim:true,
        maxlength:[30,'category name cannot exceed 30 characters']
       },
       color:{
        type:String,
        match:[/^#[0-9A-F]{6}$/i,'Color must be a valid hex color'],
        default:'#007bff'
       },
       userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,'User Id is required']
       },
       todoCount:{
        type:Number,
        default:0,
       }
    },
    {
        timestamps: true
    }
)

categorySchema.index({userId:1,name:1},{unique:true})

const Category = mongoose.model("Category", categorySchema);
export default Category;