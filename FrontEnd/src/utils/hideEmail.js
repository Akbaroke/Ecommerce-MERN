const hideEmail = email => {
  const [username, domain] = email.split('@')
  const obscuredUsername =
    username.slice(0, 3) + '***' + username[username.length - 1]
  const formattedEmail = obscuredUsername + '@' + domain
  return formattedEmail
}

export default hideEmail
