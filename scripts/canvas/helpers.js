String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function mapRange(value, low1, high1, low2, high2){
    return low2 + (high2 - low2) * ((value - low1) / (high1 - low1));
}

//returns the size of an assosciative array
function getAssocSize(array){
    var size = 0, key;
    for (key in array) {
        if (array.hasOwnProperty(key)) size++;
    }
    return size;
}