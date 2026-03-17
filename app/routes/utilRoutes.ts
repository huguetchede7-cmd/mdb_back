import express from 'express'
import { TestDemoController } from '../controllers/common/TestDemoController';

const router = express.Router()


//test email queue
router.get("/test-email-send", TestDemoController.testEmailSend);

//test email queue
router.get("/test-google-sheet-reader", TestDemoController.getSheetByCode);

export default router
