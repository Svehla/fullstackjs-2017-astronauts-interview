
const c = console.log

/**
 * check if param is Array (i have this function becouse =>  typeof [] === "object")
 */
const isArray = param => (
  Object.prototype.toString.call(param) == "[object Array]"
)

/**
 * check if param is Object => { } => (Key: value array === object, not array)
 */
const isJSONObject = param => (
  Object.prototype.toString.call(param) == "[object Object]"
)


const getNestedPathInitData = finalData => path => data => {
  path = [...path] //fix for changing state of array
  if(path.length === 0){
    if(isArray(data)){
      //dont support compare arrays
      data.forEach( item => {
        finalData.push(item)
      })
    }else{
      finalData.push(data)
    }
  }else{
    if(path[0] == ['']){
      c('něco je špatněě')
      throw new Error('Emtpy Path, remove "/"')
    }

    if(isArray(data)){
      data.map( item => getNestedPathInitData(finalData)([...path])(item))
    }else if(isJSONObject(data)){
      const newPath = path.splice(1)
      const actualPath = path[0]

      if(data[actualPath] || data[actualPath] == null){
        getNestedPathInitData(finalData)(newPath)(data[actualPath])
      }else{
        c(data)
        c(actualPath)
        throw new Error('nevalidní cesta')
      }
    }
  }
  return finalData
}


/**
 * helper function for nicer API of
 */
const getNestedPath = (path, data) => getNestedPathInitData([])(path)(data)


export {
  getNestedPath
}


//
