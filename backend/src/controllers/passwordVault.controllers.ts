import { EncryptedPassword } from '../models/passwordVault.model.js';
import { ApiError, AsyncHandler, ApiResponse } from "../utils/index.js";
import { type Request, type Response } from 'express';
import mongoose from 'mongoose';



const updatePasswordVault = AsyncHandler(async (req: Request, res: Response) => {

    const userId = req.user._id;

    const { encryptedData, iv, salt } = req.body;



    if (!encryptedData || !iv || !salt) {
        throw new ApiError(400, "Encyrpted data is required")
    }

    const updatedPasswordVault =
        await EncryptedPassword.findOneAndUpdate(
            {
                userId: new mongoose.Types.ObjectId(userId)
            },
            {
                $set: {
                    encryptedData,
                    iv,
                    salt
                }
            },
            {
                new: true,
                runValidators: true
            }

        )
    if (!updatedPasswordVault) {
        throw new ApiError(500, "Password vault updation failed")
    }

    return res.status(200).json(new ApiResponse(200, "Password vault updated successfully", updatedPasswordVault))

})

const getPasswordVault = AsyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id;

    const passwordVault = await EncryptedPassword.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!passwordVault) {
        throw new ApiError(404, "Password vault not found")
    }
    return res.status(200).json(new ApiResponse(200, "Password fetched successfully", passwordVault))
});

const deletePasswordVault = AsyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id

    //otp logic
    const deletedPasswordVault = await EncryptedPassword.deleteOne({ userId: new mongoose.Types.ObjectId(userId) })
    if (!deletedPasswordVault) {
        throw new ApiError(500, "Server error: Vault deletion failed")
    }
    return res.status(200).json(new ApiResponse(200, "Password vault deleted successfully"))

})

export {
    updatePasswordVault,
    getPasswordVault,
    deletePasswordVault
};