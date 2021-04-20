// Challenge:
// Write an algorithm, that takes 2 peoples calendars
// and returns free slots of time, where those 2 could have a meeting

// Additional info:
// Calendar Format: Calendar = [[12:00, 13:00], [15:00, 16:30]]
// Daily Bounds: [8:00, 18:00]

// Sample Input:
// [["9:00", "10:30"], ["12:00", "13:00"], ["16:00", "18:00"]]
// ["9:00", "20:00"]
// [["10:00", "11:30"], ["12:30", "14:30"], ["14:30", "15:00"], ["16:00", "17:00"]]
// ["10:00", "18:30"]
// 30
// Sample Output:
// [["11:30", "12:00"], ["15:00", "16:00"], ["18:00", "18:30"]]


// Process:
// (1) Merge both calendars
// (2) Check for Daily Bounds [max, min] -> add artificial meetings
// (3) Check NextStartTime < CurrEndTime -> max(CurrEndTime, NextEndTme)
// (4) Check for free slots of time, where NextStartTime - CurrEndTime > Duration -> add to output


class Calendar {
    blockedTimes: string[][];
    dailyBounds: string[];
}

let c1 = new Calendar;
c1.blockedTimes = [["9:00", "10:30"], ["12:00", "13:00"], ["16:00", "18:00"]];
c1.dailyBounds = ["9:00", "20:00"];
let c2 = new Calendar;
c2.blockedTimes = [["10:00", "11:30"], ["12:30", "14:30"], ["14:30", "15:00"], ["16:00", "17:00"]];
c2.dailyBounds = ["10:00", "18:30"];
let duration: number = 30;

let getIntTime = (str: string): number => {

    let output: number;

    let hour: string = str.split(":")[0];
    let minute: string = str.split(":")[1];

    output = parseInt(hour) * 60 + parseInt(minute);

    return output;
}

let compareTime = (str1: string, str2: string): number => {

    let output: number;
    
    let time1: number = getIntTime(str1);
    let time2: number = getIntTime(str2);

    if (time1 < time2) output = -1;
    else output = 1;

    return output;
}

let mergeTimes = (c1: Calendar, c2: Calendar): string[][] => {

    let output: string[][] = [];

    let pointer1: number = 0;
    let pointer2: number = 0;

    while (pointer1 < c1.blockedTimes.length || pointer2 < c2.blockedTimes.length) {
        
        let tb1: string[] = c1.blockedTimes[pointer1];
        let tb2: string[] = c2.blockedTimes[pointer2];

        if (!(pointer1 < c1.blockedTimes.length && pointer2 < c2.blockedTimes.length)) {
            if (!(pointer1 < c1.blockedTimes.length)) {
                output.push(tb2);
                pointer2++;
            }
            else {
                output.push(tb1);
                pointer1++;
            }
            continue;
        }
        else {
            if (compareTime(tb1[0], tb2[0]) == -1) {
                output.push(tb1);
                pointer1++;
            }
            else {
                output.push(tb2);
                pointer2++;
            }
        }
    }

    return output;
}

let addBounds = (c1: Calendar, c2: Calendar): string[][] => {

    let output: string[][] = [];
    let arr: string[][] = mergeTimes(c1, c2);
    let startArr: string[];
    let endArr: string[];

    let start1 = c1.dailyBounds[0];
    let start2 = c2.dailyBounds[0];
    let end1 = c1.dailyBounds[1];
    let end2 = c2.dailyBounds[1];

    if (compareTime(start1, start2) == -1) startArr = [start2, start2];
    else startArr = [start1, start1];

    if (compareTime(end1, end2) == -1) endArr = [end1, end1];
    else endArr = [end2, end2];

    output.push(startArr);
    arr.forEach(block => output.push(block));
    output.push(endArr);

    return output;
}

let flattenCalendar = (c1: Calendar, c2: Calendar): string[][] => {

    let output: string[][] = addBounds(c1, c2);

    for (let i = 1; i < output.length; i++) {
        if (compareTime(output[i-1][0], output[i][0]) == 1) output[i][0] = output[i-1][0];
        if (compareTime(output[i-1][1], output[i][0]) == 1) {
            if (compareTime(output[i-1][1], output[i][1]) == -1) output[i-1][1] = output[i][1];
            
            output.splice(i, 1);
            i--;
        }
    }

    return output;
}

let calcFreeSlots = (c1: Calendar, c2: Calendar): string[][] => {

    let output: string[][] = [];

    let flatC: string[][] = flattenCalendar(c1, c2);

    for (let i = 1; i < flatC.length; i++) {
        if (getIntTime(flatC[i][0]) - getIntTime(flatC[i-1][1]) >= duration)
            output.push([flatC[i-1][1], flatC[i][0]]);
    }

    return output;
}

const o1 = addBounds(c1, c2);
console.log(o1);
const o2 = flattenCalendar(c1, c2);
console.log(o2);
const o3 = calcFreeSlots(c1, c2);
console.log(o3);
