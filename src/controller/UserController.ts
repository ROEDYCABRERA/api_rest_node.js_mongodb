import { Request, Response } from "express"
import { User } from "../entity/User"
import { validate } from 'class-validator'
import { getRepository } from 'typeorm'

export class UserController {

   static getAll= async(req:Request, res:Response)=>{
    const userRepository=getRepository(User);
    const users=await userRepository.find();

    if (users.length> 0) {
     res.send(users);
    } else {
      res.status(404).json({message:'Not result!'});
    }

   };

   static getById= async(req:Request, res:Response)=>{
    const {id}=req.params;
    const userRepository=getRepository(User);

    try {
        const users=await userRepository.findOneOrFail(id);
        res.send(users);
    } catch (error) {
        res.status(404).json({message:'Not result!'});
    }


   };

   static newUser= async(req:Request, res:Response)=>{
    
    const {username,password,role}=req.body;
    const user = new User();

    user.username=username;
    user.password=password;
    user.role=role;

    // Validate
    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(user, validationOpt);
    if (errors.length > 0) {
     return res.status(400).json(errors);
    }

    // TODO:HASH PASWORD

    const userRepository= getRepository(User);

    try {
        user.hashPassword();
        await userRepository.save(user);

    } catch (error) {
        return  res.status(409).json({message:'Username already existe'});
    }

    // ALL ok
    res.send('User Created')
    

   };

   static editUser= async(req:Request, res:Response)=>{
    let user;
    const {id}=req.params;
    const {username,role}=req.body;

    const userRepository= getRepository(User);

    try {
       
       user= await userRepository.findOneOrFail(id);
       user.username=username;
       user.role=role;
   
    } catch (error) {
         return res.status(404).json({message:'User not found'});
    }

    // Validate
    const errors = await validate(user,{validationError:{target:false,value:false}});
    if (errors.length> 0) {
        return res.status(400).json({message:errors});
    }

    try {
    await userRepository.save(user);
    } catch (error) {
    return res.status(409).json({message:'Username already in use'})
    }
    res.status(201).json({message:'User update'})
   };

   static deleteUser= async(req:Request, res:Response)=>{
    const {id}=req.params;
    const userRepository=getRepository(User);
    let user:User;

    try {
         user=await userRepository.findOneOrFail(id);
        
    } catch (error) {
       return res.status(404).json({message:'User Not found!'});
    }
    //Remove user
    userRepository.delete(id);
    res.status(201).json({message:'User Deleted!'});



   };

}

export default UserController;