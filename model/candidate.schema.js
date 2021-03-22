var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var candidateSchema =new Schema({
    candidate_id:
    {
        type:String,
        required:true,
        max:200 
    },
    candidate_name:
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
	tot_votes:
	{
	   type:Number,
	   required:true,
	   max:200
	 }
})

candidateSchema.set("collection", "candidates");

module.exports = mongoose.model("candidates",candidateSchema);;