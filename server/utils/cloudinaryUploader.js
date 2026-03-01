import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

const uploadImageToCloudinary = async (filePath) => {
  try {

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "cars"
    })

    fs.unlinkSync(filePath)

    return result

  } catch (error) {
    throw new Error(error.message)
  }
}

export default uploadImageToCloudinary