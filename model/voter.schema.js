var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var voterSchema =new Schema({
    voter_id:
    {
        type:String,
        required:true,
        max:200 
    },
    voter_name:
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
    },
	has_voted:
	{
	   type:String,
	   required:true,
	   max:200
	 }
})

voterSchema.set("collection", "voters");

module.exports = mongoose.model("voters",voterSchema);;