class Util {

    public capitalize(text: string) : string {
        return text.charAt(0).toLocaleUpperCase().concat(text.substring(1).toLocaleLowerCase());
    }

    public getDateDisplay(date: Date): string {
        return date.toString().split('-').reverse().join('/');
    }

    public getEndOfDay(value: Date) {
        const currDate: Date = new Date(Date.parse(value.toString()));
        const [month, day, year] = [currDate.getMonth(), currDate.getDate(), currDate.getFullYear()];
        const [hour, minutes, seconds] = [23, 59, 59];
        const date: Date = new Date(year, month, day, hour, minutes, seconds);
        return date;
    }
}
const util = new Util();

export default util;