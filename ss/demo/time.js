module.exports = (req, res, next) => {
  res.json({ time: new Date().toLocaleString() })
}
