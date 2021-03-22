var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var configurationSchema =new Schema({
    election_id:
	{
       type:String,
       required:true,
       max:200
    },
	is_election_started:
	{
       type:String,
       required:true,
       max:200
    }
})

configurationSchema.set("collection", "configuration");

module.exports = mongoose.model("configuration",configurationSchema);