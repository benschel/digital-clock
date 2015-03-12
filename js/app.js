$(document).ready(function() {

    var DigitalClock = (function() {
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

        var app = {
            init: function() {
                var self = this;
                this.render();

                delay = (60 - seconds) * 1000;
                setTimeout(function() {
                    self.render();

                    setInterval(function() {
                        self.render();
                    }, 60000);
                }, delay);
            },

            render: function() {
                this._getLatestTime();

                hourDigit1 = hour > 9 || hour === 0 ? 1 : null;
                hourDigit2 = hour > 9 ? hour - 10 : (hour === 0 ? 2 : hour);

                minDigit1 = minutes > 9 ? this._splitNumber(minutes)[0] : 0;
                minDigit2 = minutes > 9 ? this._splitNumber(minutes)[1] : minutes;

                // Clear all active segments
                $('.number span').removeClass('active');

                this._renderNumber(hourDigit1, 'hour-1');
                this._renderNumber(hourDigit2, 'hour-2');
                this._renderNumber(minDigit1, 'min-1');
                this._renderNumber(minDigit2, 'min-2');

                // Clear am or pm
                $('.am-pm p').removeClass('active');

                $('.' + amOrPm).addClass('active');
            },

            _getLatestTime: function() {
                var date = new Date();
                hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
                amOrPm = date.getHours() >= 12 ? 'pm' : 'am';
                minutes = date.getMinutes();
                seconds = date.getSeconds();
            },

            _splitNumber: function(number) {
                return number.toString().split('').map(Number);
            },

            _renderNumber: function(number, digitPosition) {
                if (number === null) {
                    return;
                }

                var matrix = numberData[number];

                for (var i = 0; i < matrix.length; i++) {
                    if (matrix[i]) {
                        $('.' + digitPosition + ' span').eq(i).addClass('active');
                    }
                }
            }
        };

        return app;
    })();

    var AnalogClock = (function() {

        var app = {
            init: function() {
                var date    = new Date();
                var hours   = date.getHours();
                var minutes = date.getMinutes();
                var seconds = date.getSeconds();

                this.hands = [
                    {
                        hand    : 'hours',
                        angle   : (hours * 30) + (minutes / 2)
                    },
                    {
                        hand    : 'minutes',
                        angle   : (minutes * 6)
                    },
                    {
                        hand    : 'seconds',
                        angle   : (seconds * 6)
                    }
                ];

                this.render();
            },

            render: function() {
                for (var i = 0; i < this.hands.length; i++) {
                    var $elements = $('.' + this.hands[i].hand);

                    for (var j = 0; j < $elements.length; j++) {
                        $($elements[j]).css('-webkit-transform', 'rotateZ(' + this.hands[i].angle + 'deg)');

                        if (this.hands[i].hand === 'minutes') {
                            $($elements[j]).parent().data('second-angle', this.hands[i + 1].angle);
                        }
                    }
                }

                this.setUpMinuteHand();
                this.moveSecondsHand();
            },

            setUpMinuteHand: function() {
                var self = this;
                var $minuteContainer = $('.minutes-container');
                var secondAngle      = $minuteContainer.data('second-angle');

                if (secondAngle > 0) {
                    var delay = (((360 - secondAngle) / 6) + 0.1) * 1000;
                    setTimeout(function() {
                        self.moveMinuteHand($minuteContainer);
                    }, delay);
                }
            },

            moveMinuteHand: function($minutesContainer) {
                $minutesContainer.css('-webkit-transform', 'rotateZ(6deg)');

                setInterval(function() {
                    if (!$minutesContainer.angle) {
                        $minutesContainer.angle = 12;
                    } else {
                        $minutesContainer.angle += 6;
                    }

                    $minutesContainer.css('-webkit-transform', 'rotateZ(' + $minutesContainer.angle + 'deg)');
                }, 60000);
            },

            moveSecondsHand: function() {
                var self = this;
                var $secondsContainer = $('.seconds-container');

                setInterval(function() {
                    if (!$secondsContainer.angle) {
                        $secondsContainer.angle = 6;
                    } else {
                        $secondsContainer.angle +=6;
                    }

                    $secondsContainer.css('-webkit-transform', 'rotateZ(' + $secondsContainer.angle + 'deg)');
                }, 1000);
            }
        };

        return app;
    })();

    var $clockContainers = $('#digital-clock, #analog-clock');
    var $digitalClock    = $('#digital-clock');
    var $analogClock     = $('#analog-clock');

    var $digitalBtn      = $('.nav .digital');
    var $analogBtn       = $('.nav .analog');

    var $options         = $('#options');
    var $optionSwitch    = $('#options .label-switch input');

    var animationClasses = 'fade-in-right fade-in-left fade-out-right fade-out-left';

    DigitalClock.init();
    AnalogClock.init();

    $digitalBtn.on('click', function() {

        $clockContainers.removeClass(animationClasses);
        $digitalClock.addClass('fade-in-left');
        $analogClock.addClass('fade-out-right');

        $digitalBtn.addClass('active');
        $('.nav .analog').removeClass('active');

        $options.removeClass();
        $options.addClass('fade-out');
    });

    $analogBtn.on('click', function() {
        $clockContainers.removeClass(animationClasses);
        $analogClock.addClass('fade-in-right');
        $digitalClock.addClass('fade-out-left');

        $analogBtn.addClass('active');
        $digitalBtn.removeClass('active');

        $options.removeClass();
        $options.addClass('fade-in');
    });

    $optionSwitch.on('click', function() {
        if ($optionSwitch.is(':checked')) {
            $analogClock.addClass('clock-face');
        } else {
            $analogClock.removeClass('clock-face');
        }
    });

});