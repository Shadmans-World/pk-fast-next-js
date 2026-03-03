import mongoose from "mongoose";


interface IOrder{
    _id?:mongoose.Types.ObjectId,
    user:mongoose.Types.ObjectId,
    items:[
        {
            grocery:mongoose.Types.ObjectId,
            quantity:number,
            name:string,
            price:string,
            unit:string,
            image:string
        }
    ],
    totalAmount:number,
    paymentMethod: "cod" | "online",
    address:{
        fullName: string,
        city:string,
        state:string,
        pinCode:string,
        fullAddress: string,
        mobile:string,
        latitude:number,
        longitude:number
    },
    status: "pending" | "out of delivery" | "delivered",
    createdAt?:Date,
    updatedAt?:Date
}

const orderSchema = new mongoose.Schema<IOrder>({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    items:[
        {
            grocery:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Grocery",
                required:true
            },
            name:String,
            price:String,
            unit:String,
            quantity:Number,
            image:String
        }
    ],
    totalAmount:Number,
    paymentMethod:{
        type:String,
        enum:['cod','online'],
        default:'cod'
    },
    address:{
        fullName: String,
        city:String,
        state:String,
        pinCode:String,
        fullAddress: String,
        mobile:String,
        latitude:Number,
        longitude:Number
    },
    status:{
        type:String,
        enum:[ "pending" , "out of delivery" , "delivered"],
        default:"pending"
    }
},{timestamps:true})

const Order = mongoose.models.Order || mongoose.model("order",orderSchema);
export default Order;