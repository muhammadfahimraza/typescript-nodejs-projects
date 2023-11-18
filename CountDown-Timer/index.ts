import inquirer from "inquirer"

const questions = [
    {
        type: "input",
        name: "date",
        message: "Please enter start date in format YYYY-MM-DD",
        validate: (value: string) => {
            const isValid = /^\d{4}-\d{2}-\d{2}$/.test(value)
            return isValid ? true : "Please enter valid date"
        }
    },
    {
        type: "input",
        name: "time",
        message: "Please enter start date in HH:MM:SS",
        validate: (value: string) => {
            const isValid = /^\d{2}:\d{2}:\d{2}$/.test(value)
            return isValid ? true : "Please enter valid date"
        }
    }
]

async function askForQuestions() {
    const results = await inquirer.prompt(questions)

    if (results.date && results.time) {
        let date: Date = new Date(results.date)
        let splittedTime: string[] = results.time.split(":")
        let hours: string = splittedTime[0]
        let minutes: string = splittedTime[1]
        let seconds: string = splittedTime[2]

        date.setHours(Number(hours))
        date.setMinutes(Number(minutes))
        date.setSeconds(Number(seconds))

        if (date.getTime() < new Date().getTime()) {
            console.log("Please enter a bigger date")

            askForQuestions()
        } else {
            let interval = setInterval(() => {
                let message = calculateTimer(date.getTime())

                if (message === "Not Valid") {
                    console.log("\nTimer Ended")
                    clearInterval(interval)
                } else {
                    process.stdout.write('\r' + message);
                }
            }, 1000)
        }
    }
}

function calculateTimer(timeStamp: number) {
    var date = new Date(timeStamp);

    let dateFuture = date.getTime();

    let dateNow = new Date().getTime();

    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

    let days: number | string = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;

    let hours: number | string = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;

    let minutes: number | string = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;

    let seconds: number | string = diffInMilliSeconds % 60;

    if (days < 10) {
        days = `0${days}`;
    } else {
        days = `${days}`;
    }

    if (hours < 10) {
        hours = `0${hours}`;
    } else {
        hours = `${hours}`;
    }

    if (minutes < 10) {
        minutes = `0${minutes}`;
    } else {
        minutes = `${minutes}`;
    }

    if (seconds < 9) {
        seconds = `0${Math.ceil(seconds)}`;
    } else {
        seconds = `${Math.ceil(seconds)}`;
    }

    let message = ""

    if (dateFuture > dateNow) {
        message = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`
    } else {
        message = "Not Valid"
    }


    return message
}

askForQuestions()