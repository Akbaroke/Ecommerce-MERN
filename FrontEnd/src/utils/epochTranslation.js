export const countforwardTime = epoch_time => {
  const date = new Date(epoch_time)
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }
  return new Intl.DateTimeFormat(window.navigator.language, options)
    .format(date)
    .replace(',', '')
}

export const countdownTime = (epoch_time = 0, now) => {
  const date = new Date(epoch_time)
  const diff = now - date

  const diff_seconds = diff / 1000
  const diff_minutes = diff / 1000 / 60
  const diff_hours = diff / 1000 / 60 / 60
  const diff_days = diff / 1000 / 60 / 60 / 24

  if (diff_seconds < 60) {
    return Math.floor(diff_seconds) + ' seconds ago'
  } else if (diff_minutes < 60) {
    return Math.floor(diff_minutes) + ' minutes ago'
  } else if (diff_hours < 24) {
    return Math.floor(diff_hours) + ' hours ago'
  } else {
    return Math.floor(diff_days) + ' days ago'
  }
}
