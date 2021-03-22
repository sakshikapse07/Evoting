var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var userSchema =new Schema({
    fullname:
	{
       type:String,
       required:true,
       max:200
    },
	username:
	{
       type:String,
       required:true,
       max:200
    },
	password:
	{
	   type:String,
	   required:true,
	   max:200
	 },
	 role:
	{
	   type:String,
	   required:true,
	   max:200
	},
	is_verified:
	{
		type:String,
		required:true,
		max:200
	}
})

userSchema.set("collection", "users");

module.exports = mongoose.model("users",userSchema);;