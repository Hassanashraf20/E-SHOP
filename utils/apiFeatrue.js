class ApiFeatrue{
    constructor(mongooseQuery,queryString){
        this.mongooseQuery=mongooseQuery
        this.queryString=queryString
    }

    filter(){
    const queryStringObj = { ...this.queryString }
    const excludesFields = ['page', 'sort', 'limit', 'fields']
    excludesFields.forEach((field) => delete queryStringObj[field])

    //2)Apply filtration using [gte, gt, lte, lt]
    let queryStr = JSON.stringify(queryStringObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        this.mongooseQuery=this.mongooseQuery.find(JSON.parse(queryStr))
        return this
    }

    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(",").join(" ")
            this.mongooseQuery = this.mongooseQuery.sort(sortBy)
        }else {
            this.mongooseQuery = this.mongooseQuery.sort("-createdAt") 
        }  
        return this 
    
    }

    search(modelName){
        if(this.queryString.keyword){
            let query={}
            if(modelName=="products"){               
             query.$or= [
                { title: { $regex: this.queryString.keyword, $options: 'i' } },
                { description: { $regex: this.queryString.keyword, $options: 'i' } },
                ]
                
            }else {
                query = { name: { $regex: this.queryString.keyword, $options: 'i' } }
             
          }
          this.mongooseQuery=this.mongooseQuery.find(query)
        }
          return this
      
    }
    fields(){
        if(this.queryString.fields){
            const fieldsBy=this.queryString.fields.split(",").join(" ")
            this.mongooseQuery=this.mongooseQuery.select(fieldsBy)
        }else{
            this.mongooseQuery=this.mongooseQuery.select("-__v")
        }
        return this

    }

    paginate(countDoc){
    const page = this.queryString.page *1 ||1
    const limit = this.queryString.limit *1 ||50
    const skip = (page-1)*limit
    const endIndex=page * limit

    const pagination={}
    pagination.currentPage=page
    pagination.limit=limit
    pagination.numberOfPages=Math.ceil(countDoc/limit)

    //next Page
    if(endIndex<countDoc){
        pagination.next=page+1
    }
    //prev Page
    if(skip>0){
        pagination.next=page-1
    }


    this.mongooseQuery=this.mongooseQuery.skip(skip).limit(limit)
    this.paginationResult=pagination
    return this
    }
    

}
  
module.exports = ApiFeatrue