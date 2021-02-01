const {request} = require('./utils.js');

describe('Test add bill', ()=>{
	beforeEach(async() => {
	})

	test(`Test input validation 1`, async()=>{
		let res = await request('bills',"POST",{
            "User_ID":2
        });
		expect(res.status).toBe(400);

    });
    
    test(`Test input validation 2`, async()=>{
		let res = await request('bills',"POST",{
            "User_ID":2,
            "Cart":[]
        });
		expect(res.status).toBe(400);

    });

    test(`Test input validation 3`, async()=>{
		let res = await request('bills',"POST",{
            User_ID:2,
            Cart:[
                {
                    "Product_ID" : 1,
                    "Product_Amount":1
                }
            ]
        });
		expect(res.status).toBe(201);

    });
    
    test(`Test if user exist`, async()=>{
		let res = await request('bills',"POST",{
            User_ID:100,
            Cart:[
                {
                    "Product_ID" : 1,
                    "Product_Amount":1
                }
            ]
        });
		expect(res.status).toBe(404);

    });
    
    test(`Test if products of array exist`, async()=>{
		let res = await request('bills',"POST",{
            User_ID:1,
            Cart:[
                {
                    "Product_ID" : 100,
                    "Product_Amount":1
                }
            ]
        });
		expect(res.status).toBe(404);

    });
    
    test(`Test if product amount is greater than stock amount `, async()=>{
		let res = await request('bills',"POST",{
            User_ID:1,
            Cart:[
                {
                    "Product_ID" : 1,
                    "Product_Amount":101
                }
            ]
        });
		expect(res.status).toBe(400);

    });
    
    test(`Test if product amount is equal to stock amount `, async()=>{
		let res = await request('bills',"POST",{
            User_ID:1,
            Cart:[
                {
                    "Product_ID" : 1,
                    "Product_Amount":100
                }
            ]
        });
		expect(res.status).toBe(201);

    });
    
    test(`Test if product amount is less than stock amount `, async()=>{
		let res = await request('bills',"POST",{
            User_ID:1,
            Cart:[
                {
                    "Product_ID" : 1,
                    "Product_Amount":99
                }
            ]
        });
		expect(res.status).toBe(201);

    });
    
    test(`Test if user gets correct discount if he buys only grocery which is zero discount`, async()=>{
		let res = await request('bills',"POST",{
            User_ID:1,
            Cart:[
                {
                    "Product_ID" : 1,
                    "Product_Amount":1
                }
            ]
        });
        expect(res.status).toBe(201);
        expect(res.body.totalNetBillBeforeDiscount).toEqual(res.body.totalBillAfterDiscount)

    });
    
    test(`Test if user is Employee and gets correct discount if he buys  grocery and another product `, async()=>{
		let res = await request('bills',"POST",{
            User_ID:1,
            Cart:[
                {
                    "Product_ID" : 1,
                    "Product_Amount":1
                },
                {
                    "Product_ID" : 2,
                    "Product_Amount":2
                }
            ]
        });
        expect(res.status).toBe(201);
        expect(res.body.totalNetBillBeforeDiscount).toBe(50)
        expect(res.body.totalBillAfterDiscount).toBe(38)

    });
    
    test(`Test if user is Affiliate and gets correct discount if he buys  grocery and another product `, async()=>{
		let res = await request('bills',"POST",{
            User_ID:2,
            Cart:[
                {
                    "Product_ID" : 1,
                    "Product_Amount":1
                },
                {
                    "Product_ID" : 2,
                    "Product_Amount":2
                }
            ]
        });
        expect(res.status).toBe(201);
        expect(res.body.totalNetBillBeforeDiscount).toBe(50)
        expect(res.body.totalBillAfterDiscount).toBe(46)

    });
    
    test(`Test if user is Customer less than 2 years and gets correct discount 0 if total bill is less than $100`, async()=>{
		let res = await request('bills',"POST",{
            "User_ID":3,
            "Cart":[
                {
                    "Product_ID" : 1,
                    "Product_Amount":1
                },
                {
                    "Product_ID" : 2,
                    "Product_Amount":1
                }
            ]
        });
        expect(res.status).toBe(201);
        expect(res.body.totalNetBillBeforeDiscount).toBe(30)
        expect(res.body.totalBillAfterDiscount).toBe(30)

    });
    
    test(`Test if user is Customer less than 2 years and gets correct discount  if total bill is greater than $100`, async()=>{
		let res = await request('bills',"POST",{
            "User_ID":3,
            "Cart":[
                {
                    "Product_ID" : 1,
                    "Product_Amount":1
                },
                {
                    "Product_ID" : 2,
                    "Product_Amount":6
                }
            ]
        });
        expect(res.status).toBe(201);
        expect(res.body.totalNetBillBeforeDiscount).toBe(130)
        expect(res.body.totalBillAfterDiscount).toBe(125)

	});

});