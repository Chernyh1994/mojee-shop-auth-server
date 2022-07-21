import express, { Router } from 'express';

const router: Router = express.Router();

router.post('auth/registration');
router.post('auth/login');
router.post('auth/logout');
router.get('auth/verify/:link');
router.post('auth/forgot-password');
router.post('auth/reset-password');
router.get('auth/refresh');

export default router;
