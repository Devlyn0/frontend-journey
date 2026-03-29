function getSumOfTripledEvens(array) {
    let allEvens = array.filter(number => number%2 === 0 ? true : false)

    let allTripledEvens = allEvens.map(number => {
        return number*3;
    })
    
    let sumOfTripledEvens = allTripledEvens.reduce((sum, number) => {
        return sum+=number;
    })

    return sumOfTripledEvens
}


let myArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
console.log(getSumOfTripledEvens(myArray))