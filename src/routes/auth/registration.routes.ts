import { Router } from 'express';
import { registerController } from '../../controller/auth/registration.controller';
import { validate } from '../../middleware/validate';
import { registrationSchema } from '../../schemas/auth/registration.schema';
import { prisma } from '../../lib/db';
import { ResponseHandler } from '../../utils/responseHandler';

const router = Router();

router.post('/register', validate(registrationSchema, 'body'), registerController);


export default router;
