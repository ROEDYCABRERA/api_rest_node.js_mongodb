import { UserController } from "../controller/UserController";
import { Router } from "express";
import { checkJwt } from "../middlewares/jwt";
import { checkRole } from "../middlewares/roles";
const router= Router();

// Get all users
router.get('/',UserController.getAll);
// Get one user
router.get('/:id',[checkJwt,checkRole(['admin'])],UserController.getById);
// Create a new User
router.post('/',UserController.newUser);
// Edit users
router.patch('/:id',[checkJwt,checkRole(['admin'])],UserController.editUser);
// Delete  users
router.delete('/:id',[checkJwt,checkRole(['admin'])],UserController.deleteUser);

export default router;
