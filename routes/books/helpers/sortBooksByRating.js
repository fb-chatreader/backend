module.exports = books => {
  return [...books].sort((a, b) => {
    return b.rating_qty - a.rating_qty;
  });
};
