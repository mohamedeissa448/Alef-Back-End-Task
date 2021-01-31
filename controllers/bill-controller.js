const Joi = require('joi');
const products =require("../models/products.json"); 
const users =require("../models/users.json"); 
const userTypes =require("../models/user-types.json");
const productCategories =require("../models/product-categories.json");

module.exports={

    addBill:(req,res)=>{
        //validation user input provided in request body
        const schema = Joi.object({
            User_ID : Joi.number().min(1).required(),
            Cart    : Joi.array().min(1).required().items(Joi.object({
                // Object schema
                Product_ID     : Joi.number().min(1).required(),
                Product_Amount : Joi.number().min(1).required(),
            }))
        });

        const result = schema.validate(req.body)
        if(result.error){
            return res.status(400).json({message : result.error.details[0].message})
        }else{
            const {User_ID ,Cart : cartProducts} = req.body;

            //check if provided User_ID exist in users.json file
            const userFound = users.find((element)=> element.User_ID == User_ID);
            if(userFound === undefined){
                return res.status(404).json({message : "No user is found with provided user ID."})
            }
            const userIDType = userFound.User_Type;
            const { Type_Name  : userTypeName } = userTypes.find((type)=>type.Type_ID == userIDType );
            console.log("userTypeName",userTypeName)
            let discount = 0 ;
            if(userTypeName === 'Employee')
                discount = 0.3;
            else if(userTypeName === 'Affiliate')        
                discount = 0.1 
            // 730 is the total sum of 365 + 365 which means 2 years
            else if(userTypeName === 'Customer' && Math.ceil(Math.abs(new Date() -  new Date(userFound.Created_At)) / (1000 * 60 * 60 * 24)) > 730)        
                discount = 0.05;    
            
            let foundProduct = undefined;
            let totalNetBillBeforeDiscount = 0;
            let totalNetBillBeforeDiscountWithoutGrocery = 0;
            //check if provided cart products exist in products.json file
            cartProducts.forEach((productCart,index) => {
               foundProduct = products.find((element)=> element.Product_ID == productCart.Product_ID);
               if(foundProduct === undefined){
                   return res.status(404).json({message : `Product number ${index + 1} you entered is not found.`})
               }else if(foundProduct.Product_Stock_Amount < productCart.Product_Amount){
                   return res.status(400).json({message : `Amount of product number ${index + 1} you entered is greater than stock amount.`}) 
               }else{
                    const productCategoryFound = productCategories.find((e)=> e.Category_ID == foundProduct.Product_Category);
                    if(!productCategoryFound){
                    return res.status(400).json({message : `product number ${index + 1} you entered doesn't belong to a category.`}) 
                    }

                   //calc price and discount amount for each product
                   cartProducts [index].Total_Price = foundProduct.Product_Unit_Price * productCart.Product_Amount;
                   totalNetBillBeforeDiscount += cartProducts [index].Total_Price;

                   if(productCategoryFound.Category_Name === 'Grocery')
                        cartProducts [index].discount = 0 ;
                    else{
                        totalNetBillBeforeDiscountWithoutGrocery += foundProduct.Product_Unit_Price * productCart.Product_Amount;
                    }    
               }
            });
            //next,I assume that I write code to store bill in database

            //determine total bill discount
            let totalBillAfterDiscount = 0 ;
            if(!discount){
                //we go to option 4 which is : For every 100$ on the bill, there would be a 5$ discount (e.g. for a 990$ bill, you
                //get 45$ as a discount).
                let reduce = 0
                totalNetBillBeforeDiscountWithoutGrocery >= 100 ? reduce = ((totalNetBillBeforeDiscountWithoutGrocery / 100) * 5 ) : 1==1
                totalBillAfterDiscount = totalNetBillBeforeDiscount - reduce; 
            }else{
                // we are from number 1 to number 3 in discount options
                totalBillAfterDiscount = totalNetBillBeforeDiscount - totalNetBillBeforeDiscountWithoutGrocery * discount ;
            }
            
            //return response indicates success of storing bill in Database with information about bill is provided
            return res.status(201).json({
                totalNetBillBeforeDiscount ,
                totalNetBillBeforeDiscountWithoutGrocery ,
                totalBillAfterDiscount  ,
                cartProducts
            })

        }
    }

}