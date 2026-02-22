import app from './app';

const port = 5000;

const bootstrap = () => {
  try {
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log('failed to start server', error);
  }
};

bootstrap();
