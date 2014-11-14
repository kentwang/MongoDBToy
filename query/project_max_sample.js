db.foo.aggregate([    
    { $match: { "data.buildResult" : { $ne : null } } },
    { $group: {          
        _id: {              
            month: { $month: "$time" },             
            day: { $dayOfMonth: "$time" },             
            year: { $year: "$time" },                       
        },         
        Aborted: { $sum: { $cond :  [{ $eq : ["$data.buildResult", "ABORTED"]}, 1, 0]} },
        Failure: { $sum: { $cond :  [{ $eq : ["$data.buildResult", "FAILURE"]}, 1, 0]} },
        Unstable: { $sum: { $cond : [{ $eq : ["$data.buildResult", "UNSTABLE"]}, 1, 0]} },
        Success: { $sum: { $cond :  [{ $eq : ["$data.buildResult", "SUCCESS"]}, 1, 0]} },
        Total: { $sum: 1 }
    } }, 
    {$project:{
        Aborted:1, 
        Failure:1, 
        Unstable:1, 
        Success:1, 
        Total:1, 
        FailPercent: { 
            $divide: [ "$Failure", "$Total" ]
        }
    }},
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } } 
])