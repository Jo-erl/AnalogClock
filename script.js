var intVal, myclock;

$(window).resize(function () {
  window.location.reload(); // Reload the page when the window is resized
});
$(document).ready(function () {
  var audioElement = new Audio(""); // Create a new Audio element (you need to provide the audio source)

  $("#myclock").thooClock({
    size: $(document).height() / 1.4, // Set the size of the clock based on the height of the document
    sweepingMinutes: true, // Enable the sweeping motion for minutes hand
    sweepingSeconds: true, // Enable the sweeping motion for seconds hand

    showNumerals: true, // Indicates whether to show numerals on the clock
    brandText: "JoErl Clock", // Text to display as the brand name of the clock
    brandText2: "Analog", // Additional brand text to display
    onEverySecond: function () {}, // Function to be executed on every second
  });
});

(function ($) {
  $.fn.thooClock = function (options) {
    this.each(function () {
      var cnv,
        ctx,
        el,
        defaults,
        settings,
        radius,
        dialColor,
        dialBackgroundColor,
        secondHandColor,
        minuteHandColor,
        hourHandColor,
        timeCorrection,
        x,
        y;

       defaults = {
         size: 250, // Default size of the clock
         dialColor: "#D6D3D3", // Color of the clock's dial
         dialBackgroundColor: "transparent", // Background color of the clock's dial
         secondHandColor: "#d50000", // Color of the second hand
         minuteHandColor: "#D6D3D3", // Color of the minute hand
         hourHandColor: "#D6D3D3", // Color of the hour hand
         timeCorrection: {
           operator: "+",
           hours: 0,
           minutes: 0,
         }, // Time correction settings for the clock
         showNumerals: true, // Indicates whether to show numerals on the clock
         numerals: [
           { 1: 1 },
           { 2: 2 },
           { 3: 3 },
           { 4: 4 },
           { 5: 5 },
           { 6: 6 },
           { 7: 7 },
           { 8: 8 },
           { 9: 9 },
           { 10: 10 },
           { 11: 11 },
           { 12: 12 },
         ], // Numerals to be displayed on the clock
         sweepingMinutes: true, // Indicates whether the minute hand should sweep smoothly
         sweepingSeconds: false, // Indicates whether the second hand should sweep smoothly
         numeralFont: "arial", // Font for the numerals on the clock
         brandFont: "arial", // Font for the brand name of the clock
       };

      settings = $.extend({}, defaults, options);

      el = this;

      el.size = settings.size;
      el.dialColor = settings.dialColor;
      el.dialBackgroundColor = settings.dialBackgroundColor;
      el.secondHandColor = settings.secondHandColor;
      el.minuteHandColor = settings.minuteHandColor;
      el.hourHandColor = settings.hourHandColor;
      el.timeCorrection = settings.timeCorrection;
      el.showNumerals = settings.showNumerals;
      el.numerals = settings.numerals;
      el.numeralFont = settings.numeralFont;
      el.brandText = settings.brandText;
      el.brandText2 = settings.brandText2;
      el.brandFont = settings.brandFont;
      el.onEverySecond = settings.onEverySecond;
      el.sweepingMinutes = settings.sweepingMinutes;
      el.sweepingSeconds = settings.sweepingSeconds;
      x = 0;
      cnv = document.createElement("canvas");
      ctx = cnv.getContext("2d");
      cnv.width = this.size;
      cnv.height = this.size;
      $(cnv).appendTo(el);
      radius = parseInt(el.size / 2, 10);
      ctx.translate(radius, radius);


      function toRadians(deg) {
        return (Math.PI / 180) * deg;
      }

      function drawDial(color, bgcolor) {
        var dialRadius,
          dialBackRadius,
          i,
          ang,
          sang,
          cang,
          sx,
          sy,
          ex,
          ey,
          nx,
          ny,
          text,
          textSize,
          textWidth,
          brandtextWidth,
          brandtextWidth2;

        dialRadius = parseInt(radius - el.size / 50, 10);
        dialBackRadius = radius - el.size / 400;

        ctx.beginPath();
        ctx.arc(0, 0, dialBackRadius, 0, 360, false);
        ctx.fillStyle = bgcolor;
        ctx.fill();

        for (i = 1; i <= 60; i += 1) {
          ang = (Math.PI / 30) * i;
          sang = Math.sin(ang);
          cang = Math.cos(ang);
          //hour marker/numeral
          if (i % 5 === 0) {
            ctx.lineWidth = parseInt(el.size / 50, 10);
            sx = sang * (dialRadius - dialRadius / 9);
            sy = cang * -(dialRadius - dialRadius / 9);
            ex = sang * dialRadius;
            ey = cang * -dialRadius;
            nx = sang * (dialRadius - dialRadius / 4.2);
            ny = cang * -(dialRadius - dialRadius / 4.2);
            marker = i / 5;

            ctx.textBaseline = "middle";
            textSize = parseInt(el.size / 13, 10);
            ctx.font = "100 " + textSize + "px " + el.numeralFont;
            ctx.beginPath();
            ctx.fillStyle = color;

            if (el.showNumerals && el.numerals.length > 0) {
              el.numerals.map(function (numeral) {
                if (marker == Object.keys(numeral)) {
                  textWidth = ctx.measureText(numeral[marker]).width;
                  ctx.fillText(numeral[marker], nx - textWidth / 2, ny);
                }
              });
            }
          } else {
            ctx.lineWidth = parseInt(el.size / 100, 10);
            sx = sang * (dialRadius - dialRadius / 20);
            sy = cang * -(dialRadius - dialRadius / 20);
            ex = sang * dialRadius;
            ey = cang * -dialRadius;
          }

          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineCap = "round";
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }

        if (el.brandText !== undefined) {
          ctx.font = "100 " + parseInt(el.size / 28, 10) + "px " + el.brandFont;
          brandtextWidth = ctx.measureText(el.brandText).width;
          ctx.fillText(el.brandText, -(brandtextWidth / 2), el.size / 6);
        }

        if (el.brandText2 !== undefined) {
          ctx.textBaseline = "middle";
          ctx.font = "100 " + parseInt(el.size / 44, 10) + "px " + el.brandFont;
          brandtextWidth2 = ctx.measureText(el.brandText2).width;
          ctx.fillText(el.brandText2, -(brandtextWidth2 / 2), el.size / 5);
        }
      }

      function twelvebased(hour) {
        if (hour >= 12) {
          hour = hour - 12;
        }
        return hour;
      }

      function drawHand(length) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, length * -1);
        ctx.stroke();
      }

      function drawSecondHand(milliseconds, seconds, color) {
        var shlength = radius - el.size / 40;

        ctx.save();
        ctx.lineWidth = parseInt(el.size / 150, 10);
        ctx.lineCap = "round";
        ctx.strokeStyle = color;

        ctx.rotate(toRadians(milliseconds * 0.006 + seconds * 6));

        ctx.shadowColor = "rgba(0,0,0,.5)";
        ctx.shadowBlur = parseInt(el.size / 80, 10);
        ctx.shadowOffsetX = parseInt(el.size / 200, 10);
        ctx.shadowOffsetY = parseInt(el.size / 200, 10);

        drawHand(shlength);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, shlength / 15);
        ctx.lineWidth = parseInt(el.size / 30, 10);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, parseInt(el.size / 30, 10), 0, 360, false);
        ctx.fillStyle = color;

        ctx.fill();
        ctx.restore();
      }

      function drawMinuteHand(minutes, color) {
        var mhlength = el.size / 2.2;
        ctx.save();
        ctx.lineWidth = parseInt(el.size / 50, 10);
        ctx.lineCap = "round";
        ctx.strokeStyle = color;

        if (!el.sweepingMinutes) {
          minutes.isInteger ? minutes : (minutes = parseInt(minutes));
        }
        ctx.rotate(toRadians(minutes * 6));

        ctx.shadowColor = "rgba(0,0,0,.5)";
        ctx.shadowBlur = parseInt(el.size / 50, 10);
        ctx.shadowOffsetX = parseInt(el.size / 250, 10);
        ctx.shadowOffsetY = parseInt(el.size / 250, 10);

        drawHand(mhlength);
        ctx.restore();
      }

      function drawHourHand(hours, color) {
        var hhlength = el.size / 3;
        ctx.save();
        ctx.lineWidth = parseInt(el.size / 25, 10);
        ctx.lineCap = "round";
        ctx.strokeStyle = color;
        ctx.rotate(toRadians(hours * 30));

        ctx.shadowColor = "rgba(0,0,0,.5)";
        ctx.shadowBlur = parseInt(el.size / 50, 10);
        ctx.shadowOffsetX = parseInt(el.size / 300, 10);
        ctx.shadowOffsetY = parseInt(el.size / 300, 10);

        drawHand(hhlength);
        ctx.restore();
      }

      function timeToDecimal(time) {
        var h, m;
        if (time !== undefined) {
          h = twelvebased(time.getHours());
          m = time.getMinutes();
        }
        return parseInt(h, 10) + m / 60;
      }

      function drawAlarmHand(alarm, color, tipcolor) {
        var ahlength = el.size / 2.4;

        ctx.save();
        ctx.lineWidth = parseInt(el.size / 30, 10);
        ctx.lineCap = "butt";
        ctx.strokeStyle = color;

     

        ctx.shadowColor = "rgba(0,0,0,.5)";
        ctx.shadowBlur = parseInt(el.size / 55, 10);
        ctx.shadowOffsetX = parseInt(el.size / 300, 10);
        ctx.shadowOffsetY = parseInt(el.size / 300, 10);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, (ahlength - el.size / 10) * -1);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = tipcolor;
        ctx.moveTo(0, (ahlength - el.size / 10) * -1);
        ctx.lineTo(0, ahlength * -1);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, parseInt(el.size / 24, 10), 0, 360, false);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
      }

      if (el.onAlarm !== undefined) {
        $(el).on("onAlarm", function (e) {
          el.onAlarm();
          e.preventDefault();
          e.stopPropagation();
        });
      }

      if (el.onEverySecond !== undefined) {
        $(el).on("onEverySecond", function (e) {
          el.onEverySecond();
          e.preventDefault();
        });
      }

      if (el.offAlarm !== undefined) {
        $(el).on("offAlarm", function (e) {
          el.offAlarm();
          e.stopPropagation();
          e.preventDefault();
        });
      }

      y = 0;

      function startClock(x) {
        var theDate,
          ms,
          s,
          m,
          hours,
          mins,
          h,
          exth,
          extm,
          allExtM,
          allAlarmM,
          atime;

        theDate = new Date();

        if (el.timeCorrection) {
          if (el.timeCorrection.operator === "+") {
            theDate.setHours(theDate.getHours() + el.timeCorrection.hours);
            theDate.setMinutes(
              theDate.getMinutes() + el.timeCorrection.minutes
            );
          }
          if (el.timeCorrection.operator === "-") {
            theDate.setHours(theDate.getHours() - el.timeCorrection.hours);
            theDate.setMinutes(
              theDate.getMinutes() - el.timeCorrection.minutes
            );
          }
        }

        s = theDate.getSeconds();
        el.sweepingSeconds ? (ms = theDate.getMilliseconds()) : (ms = 0);
        mins = theDate.getMinutes();
        m = mins + s / 60;
        hours = theDate.getHours();
        h = twelvebased(hours + m / 60);

        ctx.clearRect(-radius, -radius, el.size, el.size);

        drawDial(el.dialColor, el.dialBackgroundColor);

        if (el.alarmTime !== undefined) {
          el.alarmTime = checkAlarmTime(el.alarmTime);
          drawAlarmHand(el.alarmTime, el.alarmHandColor, el.alarmHandTipColor);
        }
        drawHourHand(h, el.hourHandColor);
        drawMinuteHand(m, el.minuteHandColor);
        drawSecondHand(ms, s, el.secondHandColor);

        if (y !== s) {
          $(el).trigger("onEverySecond");
          y = s;
        }

        window.requestAnimationFrame(function () {
          startClock(x);
        });
      }

      startClock(x);
    });
  };
})(jQuery);
