import { prisma } from '../prisma.js';

export const registerError = async (error) => {
  const errorMessage = typeof error === 'string' ? error : error.message;

  console.error('\n-----------------------------------------------');
  console.error('💨 ERROR!');
  console.error(error);
  console.error('\n💨 SAVING IN DB...');
  console.error('-----------------------------------------------');

  try {
    await prisma.error_logs.create({
      data: {
        error_message: errorMessage,
      },
    });
  } catch (e) {
    console.error('\n-----------------------------------------------');
    console.error('💥 ----- ERROR REGISTERING ERROR IN DB ----- 💥');
    console.error(e);
    console.error('-----------------------------------------------');
  }
};
