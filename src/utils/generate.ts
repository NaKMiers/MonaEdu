export const generateRandomString = (length: number, c: string = '', n: number = 0) => {
  if (c.length > 1) {
    c = c.charAt(0)
  }

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
    if (c && n && i % n === n - 1 && i !== length - 1) {
      result += c
    }
  }

  return result
}
