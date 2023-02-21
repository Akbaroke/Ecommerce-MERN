const rupiahFormat = num => {
  const format = new Intl.NumberFormat('id-ID', {
    currency: 'IDR',
    style: 'currency',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num)
  return format
}

export default rupiahFormat
