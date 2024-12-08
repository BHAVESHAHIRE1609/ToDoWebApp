function createError(error){
    return {status:"error",error}
}
function createSuccess(data){
    return {status:"Success",data}
}
function createResult(error,data){
    return error?createError(error):createSuccess(data)
}

module.exports={
    createError,createSuccess,createResult
}