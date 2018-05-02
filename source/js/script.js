const warningMinutes = 10;
const workDays = [1, 2, 3, 4, 5];
const workTimes = [
    {
        from: '9:00',
        to: '10:20',
    },
    {
        from: '10:30',
        to: '12:20',
    },
    {
        from: '12:30',
        to: '14:00',
    },
    {
        from: '14:30',
        to: '17:20',
    },
    {
        from: '17:30',
        to: '19:00',
    },
];
const holidays = [
    {
        month: 2,
        day: 6,
        message: 'Сегодня Международный день бариста! 🍷',
    },
    {
        month: 10,
        day: 1,
        message: 'Сегодня Международный день кофе! ☕',
    },
    {
        month: 7,
        day: 17,
        message: 'У Насти День Рождения 🎂! Не забудьте поздравить любимого бариста!',
    },
];

if (!document.head) {
    document.head = document.getElementsByTagName('head')[0];
}

class Day {
    constructor(messageElement) {
        this.messageElement = messageElement;
        this.messageWishElement = messageElement.querySelector('.message__wish');
        this.messageAdviceElement = messageElement.querySelector('.message__advice');
        this.messageHolidayElement = messageElement.querySelector('.message__holiday');
        this.balloonElement = messageElement.querySelector('.balloons');
        this.update();
    }

    dayOfWeek() {
        return this.date.getDay();
    }

    isWorkDay() {
        const day = this.dayOfWeek();
        return workDays.includes(day);
    }

    isWorkTime() {
        return this.isWorkDay() && workTimesParsed.some(workTime => {
            const isBetween = (this.minutesFromMidnight >= Day.getMinutesFromMidnight(workTime.from))
                && (this.minutesFromMidnight < Day.getMinutesFromMidnight(workTime.to));
            return isBetween;
        }, this);
    }

    getMinutesToNextEvent(eventName) {
        let result = Infinity;
        workTimesParsed.forEach(workTime => {
            const diff = Day.getMinutesFromMidnight(workTime[eventName]) - this.minutesFromMidnight;
            if (diff >= 0 && diff < result) {
                result = diff;
            }
        });
        return result;
    }

    getMinutesToNextBreakTime() {
        return this.getMinutesToNextEvent('to');
    }

    getMinutesToNextWorkTime() {
        return this.getMinutesToNextEvent('from');
    }

    getWish() {
        let wish = 'Доброго денёчка! ☀️';
        if (this.hours >= 22 || this.hours < 5) {
            wish = 'Доброй ночки! 😴';
        } else if (this.hours >= 17) {
            wish = 'Доброго вечерочка! 🎉';
        } else if (this.hours < 12) {
            wish = 'Доброго утречка! 🙂';
        }
        return wish;
    }

    getFavicon() {
        let favicon = eventsParams.default.favicon;
        if (day.isWorkDay()) {
            if (day.isWorkTime()) {
                const minutesToBreak = this.getMinutesToNextBreakTime();
                if (minutesToBreak <= warningMinutes) {
                    favicon = eventsParams.warning.favicon;
                } else {
                    favicon = eventsParams.success.favicon;
                }
            } else {
                favicon = eventsParams.danger.favicon;
            }
        } else {
            favicon = eventsParams.default.favicon;
        }
        return favicon;
    }

    getAdvice() {
        let advice = 'Кофе? ☕';
        if (day.isWorkDay()) {
            if (day.isWorkTime()) {
                const minutesToBreak = this.getMinutesToNextBreakTime();
                const minutesForm = numberForm(minutesToBreak, ['минута', 'минуты', 'минут']);
                if (minutesToBreak <= warningMinutes) {
                    advice = `До перерыва всего ${minutesToBreak} ${minutesForm}. ⚠️`;
                } else {
                    advice = 'Приходите за кофе ☕';
                }
            } else if (Day.getMinutesFromMidnight(minTime) > this.minutesFromMidnight) {
                advice = 'Рабочий день еще не начался 🤷';
            } else if (Day.getMinutesFromMidnight(maxTime) <= this.minutesFromMidnight) {
                advice = 'Рабочий день закончился 😉';
            } else {
                const minutesToCoffee = this.getMinutesToNextWorkTime();
                const minutesForm = numberForm(minutesToCoffee, ['минута', 'минуты', 'минут']);
                advice = `В Yummy перерыв ⏳ (ещё ${minutesToCoffee} ${minutesForm})`;
            }
        } else {
            advice = 'Сегодня выходной! 🏠';
        }
        return advice;
    }

    isHoliday() {
        return holidays.some(holiday => holiday.day === this.day && holiday.month === this.month);
    }

    getHoliday() {
        return holidays.find(holiday => holiday.day === this.day && holiday.month === this.month);
    }

    getHolidayText() {
        let text = 'С праздником!';
        if (this.isHoliday()) {
            text = this.getHoliday().message;
        }
        return text;
    }

    setHoliday() {
        const text = this.getHolidayText();
        const messageClass = 'message__holiday--hidden';
        const balloonsClass = 'balloons--hidden';
        if (this.isHoliday()) {
            this.messageHolidayElement.textContent = text;
            this.messageHolidayElement.classList.remove(messageClass);
            this.balloonElement.classList.remove(balloonsClass);
        } else {
            this.messageHolidayElement.classList.add(messageClass);
            this.balloonElement.classList.add(balloonsClass);
        }
    }

    setWish() {
        this.messageWishElement.textContent = this.getWish();
    }

    setAdvice() {
        this.messageAdviceElement.textContent = this.getAdvice();
        this.setColor();
    }

    setColor() {
        Object.values(eventsParams).forEach(messageClass => {
            if (messageClass.when(this)) {
                this.messageElement.classList.add(messageClass.cssClass);
            } else {
                this.messageElement.classList.remove(messageClass.cssClass);
            }
        });
    }

    update() {
        this.date = new Date();
        this.hours = this.date.getHours();
        this.minutes = this.date.getMinutes();
        this.minutesFromMidnight = Day.getMinutesFromMidnight({
            hours: this.hours,
            minutes: this.minutes,
        });
        this.month = this.date.getMonth() + 1;
        this.day = this.date.getDate();
    }

    static getMinutesFromMidnight(day) {
        return day.hours * 60 + day.minutes;
    }
}

const workTimesParsed = workTimes.map(workTime => {
    const fromParts = workTime.from.split(':');
    const toParts = workTime.to.split(':');
    const workTimeParsed = {
        from: {
            hours: +fromParts[0],
            minutes: +fromParts[1],
        },
        to: {
            hours: +toParts[0],
            minutes: +toParts[1],
        },
    };
    return workTimeParsed;
});

let minTime = workTimesParsed[0].from;
let maxTime = workTimesParsed[0].to;
workTimesParsed.forEach(workTime => {
    if (Day.getMinutesFromMidnight(workTime.from) < Day.getMinutesFromMidnight(minTime)) {
        minTime = workTime.from;
    }
    if (Day.getMinutesFromMidnight(workTime.to) > Day.getMinutesFromMidnight(maxTime)) {
        maxTime = workTime.to;
    }
});

const eventsParams = {
    default: {
        cssClass: 'message--default',
        favicon: 'images/coffee.png',
        when: (day) => !day.isWorkDay(),
    },
    success: {
        cssClass: 'message--success',
        favicon: 'images/success.png',
        when: (day) => day.isWorkDay() && day.isWorkTime() && day.getMinutesToNextBreakTime() > warningMinutes,
    },
    warning: {
        cssClass: 'message--warning',
        favicon: 'images/warning.png',
        when: (day) => day.isWorkDay() && day.isWorkTime() && day.getMinutesToNextBreakTime() <= warningMinutes,
    },
    danger: {
        cssClass: 'message--danger',
        favicon: 'images/danger.png',
        when: (day) => day.isWorkDay() && !day.isWorkTime(),
    },
};

function numberForm(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

const messageElement = document.querySelector('.message');
const day = new Day(messageElement);

function changeFavicon(src) {
    const link = document.createElement('link'),
        oldLink = document.getElementById('favicon');
    link.id = 'favicon';
    link.rel = 'shortcut icon';
    link.href = src;
    if (oldLink && !oldLink.href.includes(src)) {
        document.head.removeChild(oldLink);
        document.head.appendChild(link);
    }
}

function update() {
    day.update();
    day.setWish();
    day.setAdvice();
    day.setHoliday();
    const advice = `${day.getAdvice()} | iTechArt Yummy`;
    if (document.title !== advice) {
        document.title = advice;
    }
    changeFavicon(day.getFavicon());
}

setInterval(update, 5000);
update();
