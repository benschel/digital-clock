$(document).ready(function() {
    var hourDigit1, hourDigit2, minDigit1, minDigit2;
    var date = new Date();
    var hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    var amOrPm = date.getHours() >= 12 ? 'pm' : 'am';
    var minutes = date.getMinutes();

    var numberData = {
        1 : [0, 1, 1, 0, 0, 0, 0],
        2 : [1, 1, 0, 1, 1, 0, 1],
        3 : [1, 1, 1, 1, 0, 0, 1],
        4 : [0, 1, 1, 0, 0, 1, 1],
        5 : [1, 0, 1, 1, 0, 1, 1],
        6 : [1, 0, 1, 1, 1, 1, 1],
        7 : [1, 1, 1, 0, 0, 0, 0],
        8 : [1, 1, 1, 1, 1, 1, 1],
        9 : [1, 1, 1, 0, 0, 1, 1],
        0 : [1, 1, 1, 1, 1, 1, 0]
    };

    var renderNumber = function(number, digitPosition) {
        var matrix = numberData[number];

        for (i = 0; i < matrix.length; i++) {
            if (matrix[i]) {
                $('.' + digitPosition + ' span').eq(i).addClass('active');
            }
        }
    };

    var splitNumber = function(number) {
        return number.toString().split('').map(Number);
    };

    if (hour > 9) {
        hourDigit1 = splitNumber(hour)[0];
        hourDigit2 = splitNumber(hour)[1];
    } else if (hour === 0) {
        hourDigit1 = 1;
        hourDigit2 = 2;
    } else {
        hourDigit1 = 0;
        hourDigit2 = hour;
    }

    if (minutes > 9) {
        minDigit1 = splitNumber(minutes)[0];
        minDigit2 = splitNumber(minutes)[1];
    } else {
        minDigit1 = 0;
        minDigit2 = minutes;
    }

    renderNumber(hourDigit1, 'hour-1');
    renderNumber(hourDigit2, 'hour-2');
    renderNumber(minDigit1, 'min-1');
    renderNumber(minDigit2, 'min-2');

    $('.' + amOrPm).addClass('active');

});