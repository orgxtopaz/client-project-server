//schema represents the structure of a particular document

const mongoose =require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  
    email:{

        type:String,
        required:true,
        trim:true , // removing the first space in value input   
        unique:true //

    },
   
   
    password:{

        type:String,
        required:true,
        trim:true  // removing the first space in value input     

    },
    verified:{

        type:String,
        required:true,
        trim:true  // removing the first space in value input     
    },
    code:{

        type:String,
        required:true,
        trim:true  // removing the first space in value input     
    },


    ////////////////////////////////////////////////////////////////

    image:{
   
            type: String,
       
        required:false,

    },
    fullname:{
        type:String,
        trim:true  // removing the first space in value input 

    },
    bio:{

        type:String,
        trim:true , // removing the first space in value input   

    },

    ////////SOCIAL LINKS

          fb:{

            type:String,
            required:false,
            trim:true , // removing the first space in value input   

        },
        instagram:{

            type:String,
            required:false,
            trim:true , // removing the first space in value input   

        },
        telegram:{

            type:String,
            required:false,
            trim:true , // removing the first space in value input   

        },
        linkedin:{

            type:String,
            required:false,
            trim:true , // removing the first space in value input   

        },
        youtube:{

            type:String,
            required:false,
            trim:true , // removing the first space in value input   

        },
        viber:{

            type:String,
            required:false,
            trim:true , // removing the first space in value input   

        },
        tiktok:{

            type:String,
            required:false,
            trim:true , // removing the first space in value input   

        },
        gcash:{

            type:String,
            required:false,
            trim:true , // removing the first space in value input   

        },

        ///////EXPERIENCE ////////////
        title:{

            type:String,
            required:false,
            trim:true , // removing the first space in value input   

        },
        company:{

            type:String,
            required:false,
            trim:true , // removing the first space in value input   

        },
        website:{

            type:String,
            required:false,
            trim:true , // removing the first space in value input   

        },
        officeno:{

            type:String,
            required:false,
            trim:true , // removing the first space in value input   

        },
        address:{

            type:String,
            required:false,
            trim:true , // removing the first space in value input   

        },

        ///////////////CONTACT///////////
        contactWebsite:{

            type:String,
            required:false,
            trim:true , // removing the first space in value input   

        },
        contactNumber:{

            type:String,
            required:false,
            trim:true , // removing the first space in value input   

        },



   
  
  

},{timestamps:true})// date  and time of the data being passed

      
   


const User= mongoose.model('user',userSchema);

module.exports = User;
