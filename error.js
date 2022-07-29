const ERR_CODE = 400;

const errorCallback = (err, res) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(ERR_CODE).send({ message: 'Данные некорректны' });
  } return res.status(500).send({ message: 'Произошла ошибка' });
};

module.exports = errorCallback;
