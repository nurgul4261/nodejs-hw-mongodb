export const notFoundHandler = ((req, res) => {
    res.status(404).send({
      status: 404,
      message: 'Not found',
    });
  });