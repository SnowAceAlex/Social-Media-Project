import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/en'; 

dayjs.extend(isToday);
dayjs.extend(localizedFormat);
dayjs.locale('en');

export function formatSmartTime(dateStr) {
    const d = dayjs(dateStr);
    return d.isToday()
    ? d.format('HH:mm')
    : d.format('HH:mm DD/MM/YYYY');
}