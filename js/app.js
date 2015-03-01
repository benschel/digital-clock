$(document).ready(function() {
    var hourDigit1, hourDigit2, minDigit1, minDigit2, hour, amOrPm, minutes, seconds, delay;
    
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
        if (number === null) {
            return;
        }

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

    var getLatestTime = function() {
        var date = new Date();
        hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
        amOrPm = date.getHours() >= 12 ? 'pm' : 'am';
        minutes = date.getMinutes();
        seconds = date.getSeconds();
    };

    var renderClock = function() {
        getLatestTime();

        hourDigit1 = hour > 9 || hour === 0 ? 1 : null;
        hourDigit2 = hour > 9 ? hour - 10 : (hour === 0 ? 2 : hour);

        minDigit1 = minutes > 9 ? splitNumber(minutes)[0] : 0;
        minDigit2 = minutes > 9 ? splitNumber(minutes)[1] : minutes;

        // Clear all active segments
        $('.number span').removeClass('active');

        renderNumber(hourDigit1, 'hour-1');
        renderNumber(hourDigit2, 'hour-2');
        renderNumber(minDigit1, 'min-1');
        renderNumber(minDigit2, 'min-2');

        // Clear am or pm 
        $('.am-pm p').removeClass('active');
        
        $('.' + amOrPm).addClass('active');
    };

    // Initial Render
    renderClock();

    delay = (60 - seconds) * 1000;
    setTimeout(function() {
        renderClock();

        setInterval(function() {
            renderClock();
        }, 60000);
    }, delay);
});