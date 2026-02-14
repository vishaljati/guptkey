import { EncryptedPassword } from '../models/passwordVault.model.js';
import { ApiError, AsyncHandler, ApiResponse } from "../utils/index.js";
import { type Request, type Response } from 'express';
import mongoose from 'mongoose';

const createPasswordVault = AsyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id;

    const { encryptedData, iv, salt } = req.body;

    try {

        if (!encryptedData || !iv || !salt) {
            throw new ApiError(400, "Encyrpted data is required")
        }

        const isPasswordVaultExisted = await EncryptedPassword.findOne({ userId })
        if (isPasswordVaultExisted) {
            throw new ApiError(409, "Password vault is already existed for this user")
        }

        const newPasswordVault = await EncryptedPassword.create({
            userId: new mongoose.Types.ObjectId(userId),
            encryptedData,
            iv,
            salt
        })

        if (!newPasswordVault) {
            throw new ApiError(500, "Password vault creation failed")
        }

        const createdPasswordVaultforUser = await EncryptedPassword.findById(newPasswordVault._id).select("-__v")

        if (!createdPasswordVaultforUser) {
            throw new ApiError(500, "Password vault fetching failed")
        }

        return res.status(201).json(new ApiResponse(201, "Password vault created and saved successfully", createdPasswordVaultforUser))
    } catch (error) {
        console.log("Error :", error);
        return null
    }

});

const updatePasswordVault = AsyncHandler(async (req: Request, res: Response) => {

    const userId = req.user._id;

    const { encryptedData, iv, salt } = req.body;

    try {

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
    } catch (error) {
        console.log("Error :", error);
        throw new ApiError(500, "Something went wrong while updation vault")
    }

})

const getPasswordVault = AsyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id;
    try {
        const passwordVault = await EncryptedPassword.findOne({ userId: new mongoose.Types.ObjectId(userId) });
        if (!passwordVault) {
            throw new ApiError(404, "Password vault not found")
        }
        return res.status(200).json(new ApiResponse(200, "Password fetched successfully", passwordVault))
    } catch (error) {
        console.log("Error :", error);
        throw new ApiError(500, "Something went wrong while fetching password vault")

    }
});

const deletePasswordVault = AsyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id
    try {
        //otp logic
        const deletedPasswordVault = await EncryptedPassword.deleteOne({ userId: new mongoose.Types.ObjectId(userId) })
        if (!deletedPasswordVault) {
            throw new ApiError(500, "Server error: Vault deletion failed")
        }
        return res.status(200).json(new ApiResponse(200, "Password vault deleted successfully"))
    } catch (error) {
        console.log("Error :", error);
        throw new ApiError(500, "Something went wrong while deleting password vault")
    }
})

export {
    createPasswordVault,
    updatePasswordVault,
    getPasswordVault,
    deletePasswordVault
};