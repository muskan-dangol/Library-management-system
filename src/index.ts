import app from './server';
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

export default server;