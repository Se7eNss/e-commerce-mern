class APIFeatures{
    constructor(query,queryStr){
        this.query=query,
        this.queryStr=queryStr
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options:'i'
            }
        }:{}
        this.query =this.query.find({...keyword});
        return this

    }

    filter(){
        const queryCopy ={...this.queryStr};
        //removing the fields from query
        const removeFields=['keyword','limit','page']
        removeFields.forEach(el => delete queryCopy[el]);
       
        //advance filter for price , ratings

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

        this.query = this.query.find(JSON.parse(queryStr));
        return this
    }
    pagination(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage *(currentPage-1);
        this.query =this.query.limit(resPerPage).skip(skip);
        return this
    }
}

module.exports = APIFeatures;