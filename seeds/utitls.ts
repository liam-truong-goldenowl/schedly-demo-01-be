export function getRandomWholeHourInterval(maxLength = 4): {
  startTime: string;
  endTime: string;
} {
  const startHour = Math.floor(Math.random() * 23);
  const maxEndHour = Math.min(startHour + maxLength, 24);
  const endHour =
    Math.floor(Math.random() * (maxEndHour - startHour)) + startHour + 1;

  const format = (h: number) => `${h.toString().padStart(2, '0')}:00`;

  return {
    startTime: format(startHour),
    endTime: format(endHour),
  };
}
