import app from './app';
import { envVars } from './app/config/env';

const bootstrap = () => {
  try {
    // Start the server
    app.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.log('failed to start server', error);
  }
};

bootstrap();
