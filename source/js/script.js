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
const messageClasses = {
    success: {
        cssClass: 'message--success',
        when: (day) => day.isWorkDay() && day.isWorkTime() && day.getMinutesToNextBreakTime() > warningMinutes,
    },
    warning: {
        cssClass: 'message--warning',
        when: (day) => day.isWorkDay() && day.isWorkTime() && day.getMinutesToNextBreakTime() <= warningMinutes,
    },
    danger: {
        cssClass: 'message--danger',
        when: (day) => day.isWorkDay() && !day.isWorkTime(),
    },
};

function numberForm(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

class Day {
    constructor(messageElement) {
        this.messageElement = messageElement;
        this.messageWishElement = messageElement.querySelector('.message__wish');
        this.messageAdviceElement = messageElement.querySelector('.message__advice');
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

    getMinutesToNextBreakTime() {
        let result = Infinity;
        workTimesParsed.forEach(workTime => {
            const diff = Day.getMinutesFromMidnight(workTime.to) - this.minutesFromMidnight;
            if (diff >= 0 && diff < result) {
                result = diff;
            }
        });
        return result;
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
            } else {
                advice = 'В Yummy перерыв ⏳';
            }
        } else {
            advice = 'Сегодня выходной! 🏠';
        }
        return advice;
    }

    setWish() {
        this.messageWishElement.textContent = this.getWish();
    }

    setAdvice() {
        this.messageAdviceElement.textContent = this.getAdvice();
        this.setColor();
    }

    setColor() {
        Object.values(messageClasses).forEach(messageClass => {
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
    }

    static getMinutesFromMidnight(day) {
        return day.hours * 60 + day.minutes;
    }
}

const messageElement = document.querySelector('.message');
const day = new Day(messageElement);
function update() {
    day.update();
    day.setWish();
    day.setAdvice();
    const advice = `${day.getAdvice()} | iTechArt Yummy`;
    if (document.title !== advice) {
        document.title = advice;
    }
}
setInterval(update, 5000);
update();
